const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/Booking');

/**
 * Generate HMAC-SHA256 signature for eSewa Epay V2
 * @param {string} message - Data string to sign
 * @param {string} secret - Secret key provided by eSewa
 * @returns {string} - Base64 encoded signature
 */
const generateSignature = (message, secret) => {
    return crypto.createHmac('sha256', secret).update(message).digest('base64');
};

/**
 * Initiate payment by generating signature and required parameters
 */
exports.initiatePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        let clientUrl = process.env.CLIENT_URL || process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';

        // Ensure protocol exists
        if (!clientUrl || !clientUrl.includes('://')) {
            console.log('[eSewa] Warning: CLIENT_URL malformed, falling back to localhost:', clientUrl);
            clientUrl = 'http://localhost:3000';
        }

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const amount = booking.deposit || booking.totalAmount;
        const transaction_uuid = `${bookingId}-${Date.now()}`;
        const product_code = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
        const secret = process.env.ESEWA_SECRET_KEY;

        if (!secret) {
            console.error('[eSewa] Critical Error: ESEWA_SECRET_KEY is not defined in environment variables.');
            return res.status(500).json({ success: false, message: 'Internal Server Error: Payment configuration missing.' });
        }

        // Update booking with transaction UUID for later verification
        booking.paymentToken = transaction_uuid;
        await booking.save();

        const formattedAmount = Number(amount).toFixed(1);
        const signatureData = `total_amount=${formattedAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = generateSignature(signatureData, secret);

        const paymentData = {
            amount: amount,
            failure_url: `${clientUrl}/payment-failure`,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: product_code,
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${clientUrl}/payment-success`,
            tax_amount: "0",
            total_amount: formattedAmount,
            transaction_uuid: transaction_uuid,
            // Endpoint for form submission
            esewa_url: process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
        };

        res.status(200).json({
            success: true,
            data: paymentData
        });

    } catch (error) {
        console.error('eSewa Initiation Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * Verify payment after redirection from eSewa
 */
exports.verifyPayment = async (req, res) => {
    console.log('[eSewa] Received verification request:', req.body);
    try {
        const { data } = req.body; // Base64 encoded data from eSewa callback

        if (!data) {
            return res.status(400).json({ success: false, message: 'No data received from eSewa' });
        }

        // Decode the data
        const decodedString = Buffer.from(data, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);
        console.log('[eSewa] Decoded callback data:', decodedData);

        // Required fields: status, signature, transaction_uuid, total_amount, product_code, signed_field_names
        const { status, signature, transaction_uuid, total_amount, product_code, signed_field_names } = decodedData;

        if (status !== 'COMPLETE') {
            console.log('[eSewa] Payment status not COMPLETE:', status);
            return res.status(400).json({ success: false, message: `Payment failed or incomplete. Status: ${status}` });
        }

        // Re-verify signature locally
        // eSewa V2 Success Redirect signature is built from ALL fields listed in signed_field_names
        // We must reconstruct the string in the exact order specified in signed_field_names
        const fieldNames = signed_field_names ? signed_field_names.split(',') : [];
        if (fieldNames.length === 0) {
            console.log('[eSewa] Error: signed_field_names is missing in callback');
            return res.status(400).json({ success: false, message: 'Invalid callback data: missing signed_field_names' });
        }

        const signatureParts = fieldNames.map(fieldName => {
            const value = decodedData[fieldName];
            return `${fieldName}=${value}`;
        });
        const signatureData = signatureParts.join(',');

        console.log('[eSewa] Reconstructed signature data message:', signatureData);
        const secret = process.env.ESEWA_SECRET_KEY;
        if (!secret) {
            console.error('[eSewa] Critical Error: ESEWA_SECRET_KEY is not defined in environment variables.');
            return res.status(500).json({ success: false, message: 'Internal Server Error: Payment configuration missing.' });
        }
        const localSignature = generateSignature(signatureData, secret);

        if (localSignature !== signature) {
            const debugLog = `
--- Verification Mismatch Debug ---
Time: ${new Date().toISOString()}
Decoded Data: ${JSON.stringify(decodedData, null, 2)}
Signature Data String: "${signatureData}"
Secret Used: "${secret}"
Local Signature (base64): "${localSignature}"
Remote Signature (base64): "${signature}"
----------------------------------
`;
            fs.appendFileSync(path.join(__dirname, '../verification_debug.log'), debugLog);
            console.log('[eSewa] Signature mismatch! Local:', localSignature, 'Remote:', signature);
            return res.status(400).json({ success: false, message: 'Verification signature mismatch. Potential security issue.' });
        }

        // Verify with eSewa API (Server-to-Server)
        console.log('[eSewa] Verifying transaction:', { transaction_uuid, total_amount, product_code });

        const baseUrl = process.env.ESEWA_VERIFY_URL || 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';
        const glue = baseUrl.includes('?') ? '&' : '?';
        const verificationUrl = `${baseUrl}${glue}product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

        console.log('[eSewa] Calling verification API:', verificationUrl);
        let response;
        try {
            response = await axios.get(verificationUrl);
            console.log('[eSewa] Verification API response:', response.data);
        } catch (axiosError) {
            console.error('[eSewa] eSewa Verification API request failed:', axiosError.message);
            if (axiosError.response) {
                console.error('[eSewa] eSewa Response Status:', axiosError.response.status);
                console.error('[eSewa] eSewa Response Data:', axiosError.response.data);
            }
            return res.status(500).json({
                success: false,
                message: 'eSewa server-to-server verification failed. Please try again later.',
                error: axiosError.message
            });
        }

        if (response.data.status === 'COMPLETE') {
            // Update booking status
            const bookingId = transaction_uuid.split('-')[0];
            const booking = await Booking.findById(bookingId);

            if (booking) {
                booking.paymentStatus = 'paid';
                booking.status = 'confirmed';
                await booking.save();

                return res.status(200).json({
                    success: true,
                    message: 'Payment verified and booking confirmed',
                    bookingId: booking._id
                });
            } else {
                return res.status(404).json({ success: false, message: 'Booking record not found' });
            }
        } else {
            console.log('[eSewa] Verification API fail response:', response.data);
            return res.status(400).json({ success: false, message: `eSewa remote verification failed: ${response.data.status || 'Unknown status'}` });
        }

    } catch (error) {
        console.error('[eSewa] Verification Critical Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error during verification',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

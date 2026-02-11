import React from 'react';

const EsewaPayment = ({ paymentData }) => {
    const {
        amount,
        failure_url,
        product_delivery_charge,
        product_service_charge,
        product_code,
        signature,
        signed_field_names,
        success_url,
        tax_amount,
        total_amount,
        transaction_uuid,
        esewa_url
    } = paymentData;

    // Automatically submit the form on mount
    React.useEffect(() => {
        console.log('EsewaPayment mounted, attempting to submit form...', paymentData);
        const form = document.getElementById('esewa-form');
        if (form) {
            console.log('Form found, submitting to:', form.action);
            form.submit();
        } else {
            console.error('eSewa form not found in DOM!');
        }
    }, [paymentData]);

    return (
        <div className="esewa-redirect-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Redirecting to eSewa...</h2>
            <p>Please do not close this window or refresh the page.</p>

            <form id="esewa-form" action={esewa_url} method="POST">
                <input type="hidden" id="amount" name="amount" value={amount} required />
                <input type="hidden" id="tax_amount" name="tax_amount" value={tax_amount} required />
                <input type="hidden" id="total_amount" name="total_amount" value={total_amount} required />
                <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={transaction_uuid} required />
                <input type="hidden" id="product_code" name="product_code" value={product_code} required />
                <input type="hidden" id="product_service_charge" name="product_service_charge" value={product_service_charge} required />
                <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value={product_delivery_charge} required />
                <input type="hidden" id="success_url" name="success_url" value={success_url} required />
                <input type="hidden" id="failure_url" name="failure_url" value={failure_url} required />
                <input type="hidden" id="signed_field_names" name="signed_field_names" value={signed_field_names} required />
                <input type="hidden" id="signature" name="signature" value={signature} required />
            </form>
        </div>
    );
};

export default EsewaPayment;

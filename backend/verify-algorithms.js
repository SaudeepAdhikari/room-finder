const http = require('http');

// Simple client to handle requests and cookies
const makeRequest = (method, path, body = null, cookie = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (cookie) {
            options.headers['Cookie'] = cookie;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const fs = require('fs');
const logFile = 'verification_output.txt';
function log(...args) {
    const msg = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function runVerification() {
    fs.writeFileSync(logFile, 'Starting Verification...\n');
    log('Starting Verification of Custom Algorithms...');
    let cookie = null;
    let userId = null;
    let roomId = null;
    let bookingId = null;
    let paymentToken = null;

    try {
        // ... (rest of the code using log() instead of log)
        // 1. Authentication (Create a temp user)
        const uniqueUser = `verifier_${Date.now()}`;
        log(`\n1. Registering user: ${uniqueUser}`);
        const signupRes = await makeRequest('POST', '/auth/register', {
            username: uniqueUser,
            email: `${uniqueUser}@test.com`,
            password: 'password123',
            phone: '1234567890', // Phone is required
            firstName: 'Verifier',
            lastName: 'Test',
            role: 'landlord'
        });

        if (signupRes.status === 201 || signupRes.status === 200) {
            log('✅ User registered successfully');
            if (signupRes.headers['set-cookie']) {
                cookie = signupRes.headers['set-cookie'][0].split(';')[0];
            }
            userId = signupRes.data.user ? signupRes.data.user.id : signupRes.data._id; // Adjust based on actual response
        } else {
            log('❌ User registration failed:', signupRes.data);
            // Try login if user exists
            const loginRes = await makeRequest('POST', '/auth/login', {
                email: `${uniqueUser}@test.com`,
                password: 'password123'
            });
            if (loginRes.status === 200) {
                cookie = loginRes.headers['set-cookie'][0].split(';')[0];
                log('✅ User logged in');
            } else {
                throw new Error('Auth failed');
            }
        }

        // 2. Create a Room with Algorithm Data
        log('\n2. Creating a Room with Equipment and Location...');
        const roomData = {
            title: `Algorithm Test Room ${Date.now()}`,
            description: 'A room for testing MCRSFA and LWPR',
            price: 5000,
            location: 'Thamel, Kathmandu',
            city: 'Kathmandu',
            address: 'Thamel',
            roomType: 'single',
            amenities: ['wifi'],
            // Custom Fields
            latitude: 27.7172, // Kathmandu
            longitude: 85.3240,
            equipment: ['Projector', 'Whiteboard', 'Printer'],
            capacity: 2,
            available: true,
            maxOccupants: 2
        };

        const createRoomRes = await makeRequest('POST', '/rooms', roomData, cookie);
        if (createRoomRes.status === 201) {
            roomId = createRoomRes.data._id;
            log(`✅ Room created: ${roomId}`);
        } else {
            log('Room creation failed: ' + JSON.stringify(createRoomRes.data));
            throw new Error(`Room creation failed: ${JSON.stringify(createRoomRes.data)}`);
        }

        // 2.5 Approve the room (Required for Search and Booking)
        log('\n2.5 Approving Room (Admin Action)...');
        // Create/Get Admin
        await makeRequest('POST', '/auth/dev-create-admin');
        // Login as Admin
        const adminLoginRes = await makeRequest('POST', '/auth/login', {
            email: 'saudeep@gmail.com',
            password: 'saudeep123'
        });
        const adminCookie = adminLoginRes.headers['set-cookie'][0].split(';')[0];

        // Approve Room
        const approveRes = await makeRequest('PUT', `/rooms/admin/${roomId}/approve`, {}, adminCookie);
        if (approveRes.status === 200) {
            log('✅ Room Approved');
        } else {
            throw new Error('Failed to approve room: ' + JSON.stringify(approveRes.data));
        }

        // 3. Test MCRSFA (Advanced Search)
        log('\n3. Testing MCRSFA (Advanced Search)...');
        // Scenario: Search for 'Projector' and capacity 2
        const searchCriteria = {
            keyword: 'Algorithm',
            capacity: 2,
            equipment: 'Projector', // Should match
            minScore: 50
        };
        const searchParams = new URLSearchParams(searchCriteria).toString();
        const searchRes = await makeRequest('GET', `/rooms/advanced-search?${searchParams}`, null, cookie);

        if (searchRes.status === 200 && Array.isArray(searchRes.data)) {
            const found = searchRes.data.find(r => r._id === roomId);
            if (found) {
                log(`✅ MCRSFA: Room found with score ${found.matchScore}`);
                log(`   Criteria matched: Keyword, Capacity, Equipment`);
            } else {
                log('❌ MCRSFA: Room NOT found in search results');
                log('Results:', searchRes.data.map(r => ({ id: r._id, score: r.matchScore })));
            }
        } else {
            log('❌ MCRSFA Search failed:', searchRes.data);
        }

        // 4. Test LWPR (Location Ranking)
        log('\n4. Testing LWPR (Proximity Search)...');
        // User location: Near Thamel (27.7172, 85.3240)
        // Let's say user is at 27.7100, 85.3200 (Close enough)
        const lwprParams = new URLSearchParams({
            lat: 27.7100,
            lon: 85.3200,
            maxDistance: 5000 // 5km
        }).toString();

        const nearbyRes = await makeRequest('GET', `/rooms/nearby?${lwprParams}`, null, cookie);
        if (nearbyRes.status === 200 && Array.isArray(nearbyRes.data)) {
            const found = nearbyRes.data.find(r => r._id === roomId);
            if (found) {
                log(`✅ LWPR: Room found. Distance: ${found.distance} meters. Score: ${found.proximityScore}`);
            } else {
                log('❌ LWPR: Room NOT found in nearby results');
            }
        } else {
            log('❌ LWPR Search failed:', nearbyRes.data);
        }

        // 5. Test SDPVA (Booking & Payment Verification)
        log('\n5. Testing SDPVA (Secure Deposit)...');
        const bookingData = {
            roomId: roomId,
            checkIn: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            checkOut: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            message: 'Testing SDPVA'
        };

        const bookingRes = await makeRequest('POST', '/bookings', bookingData, cookie);
        if (bookingRes.status === 201) {
            const booking = bookingRes.data.booking;
            bookingId = booking._id;
            const instructions = bookingRes.data.paymentInstruction;
            paymentToken = instructions.paymentToken;

            log(`✅ Booking created. ID: ${bookingId}`);
            log(`   Status: ${booking.status} (Should be pending)`);
            log(`   Deposit: ${booking.deposit}`);
            log(`   Payment Token: ${paymentToken}`);
            log(`   Expires At: ${instructions.expiresAt}`);

            if (booking.status !== 'pending') {
                log('❌ Error: Initial status is not PENDING');
            }
            if (!paymentToken) {
                log('❌ Error: Payment Token not generated');
            }

            // 6. Verify Payment
            log('\n6. Verifying Payment...');
            const verifyData = {
                paymentToken: paymentToken,
                amount: booking.deposit // Correct amount
            };

            const verifyRes = await makeRequest('POST', '/bookings/verify-payment', verifyData, cookie);
            if (verifyRes.status === 200) {
                log('✅ Payment Verification Successful');
                log(`   New Status: ${verifyRes.data.booking.status} (Should be confirmed)`);
                if (verifyRes.data.booking.status !== 'confirmed') {
                    log('❌ Error: Status did not update to CONFIRMED');
                }
            } else {
                log('❌ Payment Verification Failed:', verifyRes.data);
            }

        } else {
            log('❌ Booking creation failed:', bookingRes.data);
        }

    } catch (error) {
        log('❌ Verification Script Error: ' + (error.message || error));
        if (error.stack) log(error.stack);
    }
}

runVerification();

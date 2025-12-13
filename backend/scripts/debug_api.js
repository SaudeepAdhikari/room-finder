const fetch = require('node-fetch');

async function run() {
    try {
        // Try ports 5000, 5001, 8000 just in case
        const ports = [5000, 4000, 8000, 3001];
        let data = null;

        for (const port of ports) {
            try {
                console.log(`Trying port ${port}...`);
                const res = await fetch(`http://localhost:${port}/api/rooms?search=pepsicola`);
                if (res.ok) {
                    data = await res.json();
                    console.log(`Success on port ${port}`);
                    break;
                }
            } catch (e) {
                // ignore
            }
        }

        if (!data) {
            console.log('Could not connect to API');
            return;
        }

        console.log('Total rooms found:', data.length);
        data.forEach(r => {
            console.log('------------------------------------------------');
            console.log('Title:', r.title);
            console.log('Location:', r.location);
            console.log('City:', r.city);
            console.log('Address:', r.address);
            console.log('Contact Name:', r.contactInfo ? r.contactInfo.name : 'N/A');
            // Check for "pepsicola" in raw object
            const str = JSON.stringify(r).toLowerCase();
            console.log('Contains "pepsicola"?', str.includes('pepsicola'));
            if (str.includes('pepsicola')) {
                // Find where
                const keys = [];
                function findKeys(obj, prefix = '') {
                    for (const k in obj) {
                        if (typeof obj[k] === 'string' && obj[k].toLowerCase().includes('pepsicola')) {
                            keys.push(prefix + k);
                        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
                            findKeys(obj[k], prefix + k + '.');
                        }
                    }
                }
                findKeys(r);
                console.log('Matched Keys:', keys.join(', '));
            }
        });

    } catch (e) {
        console.error(e);
    }
}

run();

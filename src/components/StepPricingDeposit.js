import React, { useState, useEffect } from 'react';

const StepPricingDeposit = ({ data, updateData }) => {
    // Pre-fill from data if available
    const initial = data.pricingDeposit || {};
    const [deposit, setDeposit] = useState(initial.deposit || '');
    const [frequency, setFrequency] = useState(initial.frequency || 'Monthly');
    const [fees, setFees] = useState(initial.fees || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        updateData('pricingDeposit', { deposit, frequency, fees });
        // eslint-disable-next-line
    }, [deposit, frequency, fees]);

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ marginBottom: 8 }}>Pricing & Deposit</h2>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: 15 }}>Security Deposit (NPR)</label>
                <input
                    type="number"
                    min="0"
                    placeholder="e.g., 10000"
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginTop: 4 }}
                />
                {errors.deposit && <div style={{ color: 'red', fontSize: 13 }}>{errors.deposit}</div>}
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: 15 }}>Payment Frequency</label>
                <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginTop: 4 }}
                >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: 15 }}>Additional Fees (if any)</label>
                <input
                    type="text"
                    placeholder="e.g., Maintenance fee, parking, etc."
                    value={fees}
                    onChange={e => setFees(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginTop: 4 }}
                />
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>
                Please specify the security deposit, how often rent is paid, and any extra fees tenants should know about.
            </div>
        </div>
    );
};

export default StepPricingDeposit; 
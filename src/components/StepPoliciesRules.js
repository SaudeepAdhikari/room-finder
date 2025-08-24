import React, { useState, useEffect } from 'react';


const defaultPolicies = [
    { label: 'No smoking', value: 'noSmoking' },
    { label: 'No pets allowed', value: 'noPets' },
    { label: 'No parties/events', value: 'noParties' },
    { label: 'Quiet hours after 10pm', value: 'quietHours' },
    { label: 'Visitors allowed with permission', value: 'visitorsPermission' },
];

const StepPoliciesRules = ({ data, updateData }) => {
    const initial = data.policiesRules || {};
    const [selected, setSelected] = useState(initial.selected || []);
    const [custom, setCustom] = useState(initial.custom || '');

    useEffect(() => {
        updateData('policiesRules', { selected, custom });
        // eslint-disable-next-line
    }, [selected, custom]);

    const togglePolicy = (value) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ marginBottom: 8 }}>Policies / Rules</h2>
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Common Policies</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {defaultPolicies.map((policy) => (
                        <label key={policy.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                            <input
                                type="checkbox"
                                checked={selected.includes(policy.value)}
                                onChange={() => togglePolicy(policy.value)}
                            />
                            {policy.label}
                        </label>
                    ))}
                </div>
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: 15 }}>Additional Rules (optional)</label>
                <textarea
                    placeholder="e.g., Please water the plants weekly."
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginTop: 4, resize: 'vertical' }}
                />
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>
                Select the policies that apply to your room and add any custom rules for tenants.
            </div>
        </div>
    );
};

export default StepPoliciesRules; 
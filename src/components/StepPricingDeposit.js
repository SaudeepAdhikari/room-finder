import React from 'react';

const StepPricingDeposit = ({ data, updateData, next, back, isLast, isFirst }) => {
    return (
        <div>
            <h2>Pricing & Deposit (Placeholder)</h2>
            <p>This step will collect pricing and deposit information.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button onClick={back} disabled={isFirst}>Back</button>
                <button onClick={next} disabled={isLast}>Next</button>
            </div>
        </div>
    );
};

export default StepPricingDeposit; 
import React from 'react';

const StepPoliciesRules = ({ data, updateData, next, back, isLast, isFirst }) => {
    return (
        <div>
            <h2>Policies/Rules (Placeholder)</h2>
            <p>This step will collect policies and rules for the room.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button onClick={back} disabled={isFirst}>Back</button>
                <button onClick={next} disabled={isLast}>Next</button>
            </div>
        </div>
    );
};

export default StepPoliciesRules; 
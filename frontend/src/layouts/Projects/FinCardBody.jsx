import React from 'react';

const FinCardBody = ({ title, amount, color }) => {
    return (
        <div className="col-md-6 card">
            <div className="d-flex align-items-center pb-2">
                <div className={`dot-indicator bg-${color} mr-2`}></div>
                <p className="mb-0">{title}</p>
            </div>
            <h4 className="font-weight-semibold">{amount.toFixed(2)}</h4>
        </div>
    );
};

export default FinCardBody;

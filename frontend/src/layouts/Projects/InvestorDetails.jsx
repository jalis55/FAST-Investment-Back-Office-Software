import React from 'react';

const InvestorDetails = ({ data = [] ,grandProfit}) => {
    return (
        <div className="row">
            <div className="col-md-12 grid-margin">
                {data.length > 0 ? (
                    data.map((d, index) => (
                        <div key={index} className="d-flex mt-3 py-2 border-bottom">
                            <div className="wrapper ml-2">
                                <p className="mb-n1 font-weight-semibold">
                                    {d.investor_email} ({d.investor_name})
                                </p>
                                <small>Contribution:{d.percentage}%</small>
                                {grandProfit !=0 &&
                                <h6>Receivable Profit:{(parseFloat(grandProfit)*parseFloat(d.percentage)/100).toFixed(2)}</h6>
                                }
                                
                            </div>
                            <b className="text-muted ml-auto">{d.total_investment_amount}</b>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No investor details available.</p>
                )}
            </div>
        </div>
    );
};

export default InvestorDetails;

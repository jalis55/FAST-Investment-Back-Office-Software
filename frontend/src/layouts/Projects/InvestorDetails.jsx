import React from 'react';

const InvestorDetails = ({ data }) => {
    console.log(data);
    return (
        <div className='row'>
            <div class="col-md-12 grid-margin">
                {data.map((d) =>
                (

                    <div class="d-flex mt-3 py-2 border-bottom">
                        <div class="wrapper ml-2">
                            <p class="mb-n1 font-weight-semibold">{d.investor_email} ({d.investor_name})</p>
                            <small>{d.percentage}%</small>
                        </div>
                        <b class="text-muted ml-auto">BDT:{d.total_investment_amount}/=</b>
                    </div>
                )
                )}


            </div>
        </div>
    );
};

export default InvestorDetails;
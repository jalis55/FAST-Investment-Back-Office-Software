import React, { useState } from 'react';
import Swal from "sweetalert2";
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import InvestmentPieChart from './InvestmentPieChart';
import TradeBarChart from './TradeBarChart';
import TradeDetails from './TradeDetails';
import InvestorDetails from './InvestorDetails';

const ProjectDetails = () => {
    const [searchId, setSearchId] = useState('');
    const [investorInvestments, setInvestorInvestments] = useState([]);
    const [tradeDetails, setTradeDetails] = useState([]);
    const [projectId, setProjectId] = useState('');

    const searchProject = async (e) => {
        e.preventDefault();

        if (!searchId.trim()) {
            Swal.fire({ icon: 'warning', title: 'Invalid Input', text: 'Please enter a valid Project ID.' });
            return;
        }

        try {
            const response = await api.get(`/api/stock/projects/${searchId}/`);
            setProjectId(searchId);
            processInvestmentData(response.data);
            processTradeData(response.data);
        } catch (error) {
            console.error("Error fetching project data:", error);
            Swal.fire({
                icon: 'error',
                title: 'API Error',
                text: error.response?.data?.message || 'Something went wrong.'
            });
        }
    };

    const processInvestmentData = (data) => {
        const investments = data?.investments || [];

        if (investments.length === 0) {
            Swal.fire({ icon: 'info', title: 'No Data', text: 'No investment records found for this project.' });
            return;
        }

        const totalInvestmentAmount = investments.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            return acc + (isNaN(amount) ? 0 : amount);
        }, 0);

        const investorsInvestment = investments.reduce((acc, curr) => {
            const { investor, investor_name, investor_email, amount } = curr;
            const parsedAmount = parseFloat(amount) || 0;

            if (!investor_email) return acc;

            if (!acc[investor_email]) {
                acc[investor_email] = { investor, investor_name, investor_email, total_investment_amount: 0 };
            }

            acc[investor_email].total_investment_amount += parsedAmount;
            return acc;
        }, {});

        const groupedInvestments = Object.values(investorsInvestment).map(investor => ({
            ...investor,
            percentage: totalInvestmentAmount ? (investor.total_investment_amount / totalInvestmentAmount) * 100 : 0
        }));

        setInvestorInvestments(groupedInvestments);
    };

    const processTradeData = (data) => {

        const trades = data?.trades || [];
        if (trades.length === 0) {
            setTradeDetails([]);
            return;
        }

        const summary = {};

        trades.forEach(trade => {
            const { instrument_id, instrument_name, qty, actual_unit_price, trns_type } = trade;
            const totalValue = parseFloat(qty) * parseFloat(actual_unit_price);

            if (!summary[instrument_id]) {
                summary[instrument_id] = {
                    instrument_id,
                    instrument_name,
                    total_buy: 0,
                    total_sell: 0,
                    total_qty_buy:0,
                    total_qty_sell:0

                };
            }

            if (trns_type === "buy") {
                summary[instrument_id].total_buy += totalValue;
                summary[instrument_id].total_qty_buy +=qty
            } else if (trns_type === "sell") {
                summary[instrument_id].total_sell += totalValue;
                summary[instrument_id].total_qty_sell +=qty
            }
        });

        setTradeDetails(Object.values(summary));
     
    };

    return (
        <div>
            <Wrapper>
                <form className="ml-auto search-form d-md-block" onSubmit={searchProject}>
                    <div className="form-group">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search Project"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Search</button>
                </form>

                {projectId && (
                    <>
                        <div className='row mt-2'>
                            {investorInvestments.length > 0 && (
                                <div className="col-lg-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Investor Investments</h5>
                                            <InvestmentPieChart data={investorInvestments} />
                                            <InvestorDetails data={investorInvestments}/>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                            )}

                            {tradeDetails.length > 0 && (
                                <div className="col-lg-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Trade Details</h5>
                                            <TradeBarChart tradeDetails={tradeDetails} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='row mt-2'>
                            {investorInvestments.length > 0 && (
                                <div className="col-lg-12 grid-margin stretch-card">
                                    <div className="card">
                                        
                                            <h5 className="card-title">Trade Details</h5>
                                            <TradeDetails data={tradeDetails}/>
                                        
                                    </div>
                                </div>
                            )}


                        </div>
                    </>




                )}
            </Wrapper>
        </div>
    );
};

export default ProjectDetails;

import React, { useState } from 'react';
import Swal from "sweetalert2";
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import InvestmentPieChart from './InvestmentPieChart';
import TradeBarChart from './TradeBarChart';
import TradeDetails from './TradeDetails';
import InvestorDetails from './InvestorDetails';
import ProjectFinDetails from './ProjectFinDetails';
import FinCardBody from './FinCardBody';

const ProjectDetails = () => {
    const [searchId, setSearchId] = useState('');
    const [investorInvestments, setInvestorInvestments] = useState([]);
    const [tradeDetails, setTradeDetails] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [gainLoss, setGainLoss] = useState({ profit: 0, loss: 0 });
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalBuyAmount, setTotalBuyAmount] = useState(0);
    const [totalSellAmount, setTotalSellAmount] = useState(0);

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
            processFinDetails(response.data);
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
                    total_qty_buy: 0,
                    total_qty_sell: 0

                };
            }

            if (trns_type === "buy") {
                summary[instrument_id].total_buy += totalValue;
                summary[instrument_id].total_qty_buy += qty
            } else if (trns_type === "sell") {
                summary[instrument_id].total_sell += totalValue;
                summary[instrument_id].total_qty_sell += qty
            }
        });

        setTradeDetails(Object.values(summary));

    };

    const processFinDetails = (data) => {
        console.log(data.investments)
        const totalInvestmentAmt = data.investments.reduce((acc, inv) => acc + parseFloat(inv.amount), 0);
        setTotalInvestment(totalInvestmentAmt);

        const totalBuyAmt = data.trades
            .filter(trade => trade.trns_type === 'buy')
            .reduce((sum, trade) => sum + trade.qty * parseFloat(trade.unit_price || 0) + parseFloat(trade.total_commission || 0), 0) || 0;

        const totalSellAmt = data.trades
            .filter(trade => trade.trns_type === 'sell')
            .reduce((sum, trade) => sum + trade.qty * parseFloat(trade.unit_price || 0) - parseFloat(trade.total_commission || 0), 0) || 0;

        setTotalBuyAmount(totalBuyAmt);
        setTotalSellAmount(totalSellAmt);
    }

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
                                <div className="col-lg-12 grid-margin stretch-card">
                                    <div className="card">

                                        <h5 className="card-title">Trade Details</h5>
                                        <TradeDetails data={tradeDetails} setGainLoss={setGainLoss} />

                                    </div>
                                </div>
                            )}


                        </div>

                        <div className='row mt-2'>
                            {investorInvestments.length > 0 && (
                                <div className="col-lg-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Investor Investments</h5>
                                            <InvestorDetails data={investorInvestments} 
                                            grandProfit={(parseFloat(gainLoss?.profit) || 0) - (parseFloat(gainLoss)?.loss || 0)}
                                            />

                                        </div>

                                    </div>

                                </div>
                            )}

                            {tradeDetails.length > 0 && (
                                <div className="col-lg-6 grid-margin stretch-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Financial Details</h5>
                                            <div className="row">

                                                <FinCardBody title={'Total Investment'} amount={totalInvestment} color='primary' />
                                                <FinCardBody title={'Total Buy'} amount={totalBuyAmount} color='info' />
                                                <FinCardBody title={'Total Sell'} amount={totalSellAmount} color='info' />
                                                <FinCardBody title={'Available Balance'} 
                                                amount={(totalInvestment-totalBuyAmount)+totalSellAmount} color='secondary'
                                                />

                                                <FinCardBody title={'Profit'} amount={gainLoss.profit} color='primary' />
                                                <FinCardBody title={'Loss'} amount={gainLoss.loss} color='danger' />
                                                <FinCardBody title={'Grand Profit'} amount={(parseFloat(gainLoss?.profit) || 0) - (parseFloat(gainLoss)?.loss || 0)} color='info' />



                                            </div>
                                        </div>
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

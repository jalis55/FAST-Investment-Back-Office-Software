import React, { useState, useEffect } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import BalanceCard from '../../components/BalanceCard';
import BuyInstrument from './BuyInstrument';
import SellInstrument from './SellInstrument';

const Trade = () => {
    const [searchId, setSearchId] = useState('');
    const [projectData, setProjectData] = useState({});
    const [buyAbleInstruments, setBuyAbleInstruments] = useState([]);
    const [sellAbleInstruments, setSellAbleInstruments] = useState([]);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalBuyAmount, setTotalBuyAmount] = useState(0);
    const [totalSellAmount, setTotalSellAmount] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);
    const [tradeType, setTradeType] = useState('');

    useEffect(() => {
        if (projectData.project_id) {
            calculateTotals();
        }
    }, [projectData]);

    useEffect(() => {
        if (tradeType === 'buy') {
            fetchBuyInstruments();
        } else if (tradeType === 'sell') {
            processSellInstruments();
        }
    }, [tradeType]);

    useEffect(() => {
        setAvailableBalance((totalInvestment + totalSellAmount) - totalBuyAmount);
    }, [totalInvestment, totalSellAmount, totalBuyAmount]);

    const calculateTotals = () => {
        const { investments = [], trades = [] } = projectData;

        const totalInvestmentAmt = investments.reduce(
            (sum, investment) => sum + parseFloat(investment.amount || 0), 0
        );

        const totalBuyAmt = trades
            .filter(trade => trade.trns_type === 'buy')
            .reduce((sum, trade) => sum + trade.qty * parseFloat(trade.unit_price || 0) + parseFloat(trade.total_commission || 0), 0) || 0;

        const totalSellAmt = trades
            .filter(trade => trade.trns_type === 'sell')
            .reduce((sum, trade) => sum + trade.qty * parseFloat(trade.unit_price || 0) - parseFloat(trade.total_commission || 0), 0) || 0;

        setTotalInvestment(totalInvestmentAmt);
        setTotalBuyAmount(totalBuyAmt);
        setTotalSellAmount(totalSellAmt);
    };

    const searchProject = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            alert('Please enter a project ID');
            return;
        }
        try {
            const res = await api.get(`/api/stock/projects/${searchId}/`);
            setProjectData(res.data);
        } catch (err) {
            console.error(err);
            alert('Error fetching project data');
        }
        setSearchId('');
    };

    const handleTradeTypeChange = (e) => setTradeType(e.target.value);

    const fetchBuyInstruments = async () => {
        try {
            const response = await api.get("/api/stock/instruments/");
            setBuyAbleInstruments(response.data);
        } catch (err) {
            console.error('Error fetching buy options:', err);
        }
    };

    const processSellInstruments = () => {
        if (!projectData?.trades) return;

        const buyTrades = projectData.trades.filter(trade => trade.trns_type === "buy");

        const groupedTrades = buyTrades.reduce((acc, trade) => {
            const { instrument_id, instrument_name, qty, actual_unit_price } = trade;

            if (!acc[instrument_id]) {
                acc[instrument_id] = { instrument_id, instrument_name, qty: 0, total_price: 0 };
            }

            acc[instrument_id].qty += qty;
            acc[instrument_id].total_price += qty * parseFloat(actual_unit_price);

            return acc;
        }, {});

        const result = Object.values(groupedTrades).map(trade => ({
            instrument_id: trade.instrument_id,
            instrument_name: trade.instrument_name,
            qty: trade.qty,
            unit_price: (trade.total_price / trade.qty).toFixed(2)
        }));

        setSellAbleInstruments(result);
    };

    const handleBuySuccess = (buyAmt) => {
        setTotalBuyAmount(prev => {
            const newTotalBuy = prev + buyAmt;
            setAvailableBalance((totalInvestment + totalSellAmount) - newTotalBuy);
            return newTotalBuy;
        });
    };

    return (
        <Wrapper>
            <form className="ml-auto search-form d-md-block" onSubmit={searchProject}>
                <div className="form-group">
                    <input type="search" className="form-control" placeholder="Search Project"
                        value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit">Search</button>
            </form>

            {projectData.project_id && (
                <>
                    <h2 className="card-title mt-2">Project ID: {projectData.project_id}</h2>
                    <div className="row">
                        <BalanceCard title="Total Investment" amount={totalInvestment} />
                        <BalanceCard title="Total Buy Amount" amount={totalBuyAmount} />
                        <BalanceCard title="Total Sell Amount" amount={totalSellAmount} />
                        <BalanceCard title="Available Balance" amount={availableBalance} />
                    </div>

                    <h1 className='card-title mt-4 mb-0'>Trade</h1>
                    <div className="row">
                        <div className="col-sm-4">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="membershipRadios"
                                    value="buy" checked={tradeType === 'buy'} onChange={handleTradeTypeChange} /> Buy Instruments
                            </label>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="membershipRadios"
                                    value="sell" checked={tradeType === 'sell'} onChange={handleTradeTypeChange} /> Sell Instruments
                            </label>
                        </div>
                    </div>

                    {tradeType === 'buy' && <BuyInstrument 
                        instruments={buyAbleInstruments} 
                        project={projectData.project_id} 
                        availableBalance={availableBalance}
                        handleBuySuccess={handleBuySuccess} 
                    />}

                    {tradeType === 'sell' && <SellInstrument 
                        instruments={sellAbleInstruments} 
                        project={projectData.project_id} 
                    />}
                </>
            )}
        </Wrapper>
    );
};

export default Trade;

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

    const [totals, setTotals] = useState({
        totalInvestment: 0,
        totalBuyAmount: 0,
        totalSellAmount: 0,
    });
    const [tradeType, setTradeType] = useState('');

    useEffect(() => {
        if (projectData.project_id) {
            calculateTotals();
        }
    }, [projectData]);

    useEffect(() => {
        if (tradeType === 'buy') {
            handleBuyAction();
        } else if (tradeType === 'sell') {
            handleSellAction();
        }
    }, [tradeType]);

    const calculateTotals = () => {
        const { investments = [], trades = [] } = projectData;

        const totalInvestment = investments.reduce(
            (sum, investment) => sum + parseFloat(investment.amount || 0),
            0
        );

        const totalBuyAmount = trades
            .filter(trade => trade.trns_type === 'buy')
            .reduce(
                (sum, trade) =>
                    sum +
                    trade.qty * parseFloat(trade.unit_price || 0) +
                    parseFloat(trade.total_commission || 0),
                0
            );

        const totalSellAmount = trades
            .filter(trade => trade.trns_type === 'sell')
            .reduce(
                (sum, trade) =>
                    sum +
                    trade.qty * parseFloat(trade.unit_price || 0) -
                    parseFloat(trade.total_commission || 0),
                0
            );

        setTotals({ totalInvestment, totalBuyAmount, totalSellAmount });
    };

    const searchProject = async (e) => {
        e.preventDefault();

        if (!searchId.trim()) {
            alert('Please enter a project ID');
            return;
        }

        try {
            const res = await api.get(`/api/stock/projects/${searchId}/`);
            console.log(res.data);
            setProjectData(res.data);
        } catch (err) {
            console.error(err);
            alert('Error fetching project data');
        }

        setSearchId('');
    };

    const handleTradeTypeChange = (e) => {
        setTradeType(e.target.value);
    };

    const handleBuyAction = async () => {
        console.log('Fetching buy instrument data...');
        try {
            api
            .get("/api/stock/instruments/")
            .then((response) => setBuyAbleInstruments(response.data))
            .catch((error) => console.error("Error fetching users:", error));
        } catch (err) {
            console.error('Error fetching buy options:', err);
        }
       
    };


    const handleSellAction = () => {
        console.log('Executing sell action...');
        console.log(projectData);
    
        // Ensure projectData exists and has trades
        if (!projectData || !projectData.trades) {
            console.error("No trades data available");
            return;
        }
    
        // Filter only "buy" trades
        const buyTrades = projectData.trades.filter(trade => trade.trns_type === "buy");
    
        // Process buy trades
        const groupedTrades = buyTrades.reduce((acc, trade) => {
            const { instrument_name, qty, unit_price } = trade;
    
            if (!acc[instrument_name]) {
                acc[instrument_name] = { instrument_name, qty: 0, total_price: 0 };
            }
    
            acc[instrument_name].qty += qty;
            acc[instrument_name].total_price += qty * parseFloat(unit_price);
    
            return acc;
        }, {});
    
        // Convert to desired format
        const result = Object.values(groupedTrades).map(trade => ({
            instrument_name: trade.instrument_name,
            qty: trade.qty,
            unit_price: (trade.total_price / trade.qty).toFixed(2) // Weighted Average
        }));
    
        console.log("Processed Buy Trades:", result);

        setSellAbleInstruments(result);
    
        // You can now use `result` for further operations (e.g., updating state, sending to API, etc.)
    };
    

    return (
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
                <button className="btn btn-primary" type="submit">
                    Search
                </button>
            </form>
            {projectData.project_id && (
                <>
                    <h2 className="card-title mt-2">Project ID: {projectData.project_id}</h2>
                    <div className="row">
                        <BalanceCard title="Total Investment" amount={totals.totalInvestment} />
                        <BalanceCard title="Total Buy Amount" amount={totals.totalBuyAmount} />
                        <BalanceCard title="Total Sell Amount" amount={totals.totalSellAmount} />
                        <BalanceCard
                            title="Available Balance"
                            amount={totals.totalInvestment - totals.totalBuyAmount + totals.totalSellAmount}
                        />
                    </div>
                    <h1 className='card-title mt-4 mb-0'>Trade</h1>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="membershipRadios"
                                        value="buy"
                                        checked={tradeType === 'buy'}
                                        onClick={handleTradeTypeChange}
                                    /> Buy Instruments <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="membershipRadios"
                                        value="sell"
                                        checked={tradeType === 'sell'}
                                        onClick={handleTradeTypeChange}
                                    /> Sell Instruments <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                    </div>

                    {tradeType === 'buy' && <BuyInstrument instruments={buyAbleInstruments} />}
                    {tradeType === 'sell' && <SellInstrument instruments={sellAbleInstruments} />}
                </>
            )}
        </Wrapper>
    );
};

export default Trade;

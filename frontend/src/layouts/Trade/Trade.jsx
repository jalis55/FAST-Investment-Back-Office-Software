import React, { useState, useEffect } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import BalanceCard from '../../components/BalanceCard';

const Trade = () => {
    const [searchId, setSearchId] = useState('');
    const [projectData, setProjectData] = useState({});
    const [totals, setTotals] = useState({
        totalInvestment: 0,
        totalBuyAmount: 0,
        totalSellAmount: 0,
    });

    useEffect(() => {
        if (projectData.project_id) {
            calculateTotals();
        }
    }, [projectData]);

    const calculateTotals = () => {
        const { investments = [], trades = [] } = projectData;
    
        // Calculate total investment
        const totalInvestment = investments.reduce(
            (sum, investment) => sum + parseFloat(investment.amount || 0),
            0
        );
    
        // Calculate total buy amount
        const totalBuyAmount = trades
            .filter(trade => trade.trns_type === 'buy')
            .reduce(
                (sum, trade) =>
                    sum +
                    trade.qty * parseFloat(trade.unit_price || 0) +
                    parseFloat(trade.total_commission || 0),
                0
            );
    
        // Calculate total sell amount
        const totalSellAmount = trades
            .filter(trade => trade.trns_type === 'sell')
            .reduce(
                (sum, trade) =>
                    sum +
                    trade.qty * parseFloat(trade.unit_price || 0) -
                    parseFloat(trade.total_commission || 0),
                0
            );
    
        // Update totals state
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
                </>
            )}
        </Wrapper>
    );
};

export default Trade;

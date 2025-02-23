import React, { useState } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import Swal from 'sweetalert2';
import api from '../../api';

const DisburseProfit = () => {
    const [searchId, setSearchId] = useState('');
    const [fromDt, setFromDt] = useState('');
    const [toDate, setToDate] = useState('');
    const [recvableData, setRecvableData] = useState([]);
    const [profitData, setProfitData] = useState([]);

    // 🔹 Search Project Data
    const searchProject = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/stock/acc-recvable-details-ason/${searchId}/`, {
                from_dt: fromDt,
                to_dt: toDate,
                disburse_st: 0,
            });

            if (response.data.length === 0) {
                Swal.fire("No Data", "No data found for the given criteria", "warning");
                return;
            }

            setRecvableData(response.data);
            calculateProfit(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            Swal.fire("Error", "Failed to fetch project details", "error");
        }
    };

    // 🔹 Calculate Profit/Loss for Investors
    const calculateProfit = (data) => {
        const investorSummary = {};

        data.forEach(investor => {
            const { id, email } = investor.investor;
            const gainLose = parseFloat(investor.gain_lose); // Ensure numeric conversion

            if (!investorSummary[id]) {
                investorSummary[id] = {
                    id,
                    email,
                    profit: 0,
                    loss: 0,
                    total_profit: 0
                };
            }

            if (gainLose >= 0) {
                investorSummary[id].profit += gainLose;
            } else {
                investorSummary[id].loss += Math.abs(gainLose);
            }

            // 🔹 Ensure proper decimal formatting
            investorSummary[id].total_profit = parseFloat(
                (investorSummary[id].profit - investorSummary[id].loss).toFixed(2)
            );
        });

        // Convert object to array
        setProfitData(Object.values(investorSummary));
    };

    const disburseProfit = async () => {
        const transactionData = profitData.map(user => ({
            user: user.id,
            amount: Number(user.total_profit).toFixed(2),
            transaction_type: "deposit",
            trans_mode: "cash",
            narration: `Deposit ${Number(user.total_profit).toFixed(2)} as profit`
        }));
    
        const updateData = {
            project: searchId,
            from_dt: fromDt,
            to_dt: toDate
        };
    
        const [transactionResult, updateResult] = await Promise.allSettled([
            api.post(`/api/acc/user/create-transaction/`, transactionData),
            api.put(`/api/stock/update-acc-recvable/`, updateData)
        ]);
    
        if (transactionResult.status === "fulfilled" && updateResult.status === "fulfilled") {
            Swal.fire("Success", "All transactions processed!", "success");
            setProfitData([]);
        } else {
            Swal.fire("Error", "One or more requests failed!", "error");
        }
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
                <div className="form-row d-flex align-items-center">
                    <div className="form-group col-md-4">
                        <label>From Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDt}
                            onChange={(e) => setFromDt(e.target.value)}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label>To Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-primary" type="submit">Search</button>
            </form>

            {profitData.length > 0 && (
                <div className='table-responsive'>
                    <h4 className="card-title">Disburse Payments</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Investor</th>
                                <th>Email</th>
                                <th>Profit</th>
                                <th>Loss</th>
                                <th>Total Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profitData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.profit.toFixed(2)}</td>
                                    <td>{item.loss.toFixed(2)}</td>
                                    <td>{item.total_profit.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-2">
                        <button className="btn btn-primary mr-2" onClick={disburseProfit}>Disburse</button>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

export default DisburseProfit;

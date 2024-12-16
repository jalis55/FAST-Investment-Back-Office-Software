import React, { useState } from 'react';
import api from '../api'; // Assumes a custom API service for handling requests

const SearchProject = () => {
    const [projectId, setProjectId] = useState('');
    const [projectDetails, setProjectDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [investors, setInvestors] = useState([]);
    const [selectedInvestor, setSelectedInvestor] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [investorAvailableBalanace,setInvestorAvailableBalanace]=useState('');

    // Function to fetch project details
    const searchProject = () => {
        if (!projectId.trim()) {
            alert('Please enter a valid Project ID.');
            return;
        }

        api
            .get(`/api/stock/projects/${projectId}/`)
            .then((response) => {
                setProjectDetails(response.data);
                setProjectId(''); // Clear input after successful fetch
            })
            .catch((error) => console.error('Error fetching project details:', error));
    };
// modal
    const handleModal = () => {
        
        api
            .get('/api/admin/customers/') 
            .then((response) => {
                setInvestors(response.data);

            })
            .catch((error) => console.error('Error fetching users:', error));
        setModalVisible(true);

    }

    const handleSelectInvestor=(invId)=>{

        setSelectedInvestor(invId);
        api
        .get(`/api/acc/user/${invId}/balance/`) 
        .then((response) => {
            setInvestorAvailableBalanace(response.data.balance);
        })
        .catch((error) => console.error('Error fetching users:', error));

        
    }
    console.log(investorAvailableBalanace);

    // Function to calculate total values for investments and trades
    const calculateValues = () => {
        if (!projectDetails) return { totalInvestment: 0, totalBuy: 0, totalSell: 0, currentBalance: 0 };

        let totalInvestment = 0;
        let totalBuy = 0;
        let totalSell = 0;

        // Calculate total investment
        projectDetails.investments.forEach((investment) => {
            totalInvestment += parseFloat(investment.amount) || 0;
        });

        // Calculate total buy and total sell
        projectDetails.trades.forEach((trade) => {
            const amount = parseFloat(trade.unit_price) * parseInt(trade.qty) || 0;
            if (trade.trns_type === 'buy') {
                totalBuy += amount;
            } else if (trade.trns_type === 'sell') {
                totalSell += amount;
            }
        });

        // Calculate current balance
        const currentBalance = totalInvestment - totalBuy + totalSell;

        return { totalInvestment, totalBuy, totalSell, currentBalance };
    };

    const { totalInvestment, totalBuy, totalSell, currentBalance } = calculateValues();

    return (
        <div className="container mt-5">
            <div className="input-group rounded mb-4">
                <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search Project ID"
                    aria-label="Search"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                />
                <button className="btn btn-primary" onClick={searchProject}>
                    Search
                </button>

            </div>

            {projectDetails && (
                <div>
                    {/* Display Total Values */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Total Investment</h5>
                                    <p className="card-text">${totalInvestment.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Total Buy</h5>
                                    <p className="card-text">${totalBuy.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Total Sell</h5>
                                    <p className="card-text">${totalSell.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Current Balance</h5>
                                    <p className="card-text">${currentBalance.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Project Details</h3>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Project ID: {projectDetails.project_id}</h5>
                            <p><strong>Title:</strong> {projectDetails.project_title}</p>
                            <p><strong>Description:</strong> {projectDetails.project_description}</p>
                        </div>
                    </div>

                    {/* Financial Advisors Section */}
                    {projectDetails.financial_advisors && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Financial Advisors</h4>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Commission Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectDetails.financial_advisors.map((advisor, index) => (
                                            <tr key={index}>
                                                <td>{advisor.advisor_name}</td>
                                                <td>{advisor.advisor_email}</td>
                                                <td>{advisor.com_percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Investments Section */}
                    {projectDetails.investments && (
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4>Investments</h4>
                                <button className="btn btn-info" onClick={handleModal}>
                                    Add Investment
                                </button>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Investor</th>
                                            <th>Email</th>
                                            <th>Amount Invested</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectDetails.investments.map((investment, index) => (
                                            <tr key={index}>
                                                <td>{investment.investor_name}</td>
                                                <td>{investment.investor_email}</td>
                                                <td>${parseFloat(investment.amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Trades Section */}
                    {projectDetails.trades && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Trades</h4>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Instrument</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Transaction Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectDetails.trades.map((trade, index) => (
                                            <tr key={index}>
                                                <td>{trade.instrument_name}</td>
                                                <td>{trade.qty}</td>
                                                <td>${parseFloat(trade.unit_price).toFixed(2)}</td>
                                                <td>{trade.trns_type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {modalVisible && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Investment</h5>
                                <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <select
                                        className="form-select"
                                        value={selectedInvestor}
                                        onChange={(e) => handleSelectInvestor(e.target.value)}
                                    >
                                        <option value="">Select Investor</option>
                                        {investors.map((investor) => (
                                            <option key={investor.id} value={investor.id}>
                                                {investor.name} ({investor.email})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="form-control mt-2"
                                        placeholder="Investment Amount"
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(e.target.value)}
                                    />
                                    { investorAvailableBalanace && (<p>Available Balace:{investorAvailableBalanace}</p>)}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
      
export default SearchProject;
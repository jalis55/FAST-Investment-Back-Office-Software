import React, { useState } from 'react';
import api from '../api';

const SearchProject = () => {
    const [projectId, setProjectId] = useState('');
    const [projectDetails, setProjectDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);  // Modal state
    const [selectedAdvisor, setSelectedAdvisor] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');

    // Function to toggle the modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Search project details using Project ID
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

    // Handle Save button in modal (Add Investment)
    const handleSave = () => {
        if (!selectedAdvisor || !investmentAmount) {
            alert('Please fill in both fields!');
            return;
        }

        // Save investment logic here (e.g., send data to API)
        console.log('Investment Saved:', { selectedAdvisor, investmentAmount });

        // Reset fields and close the modal
        setSelectedAdvisor('');
        setInvestmentAmount('');
        toggleModal();
    };

    return (
        <div className="container mt-5">
            <div className="input-group rounded mb-4">
                <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search Project ID"
                    aria-label="Search"
                    aria-describedby="search-addon"
                    value={projectId} // Controlled input
                    onChange={(e) => setProjectId(e.target.value)}
                />
                <button className="btn btn-primary" onClick={searchProject}>
                    Search
                </button>
            </div>

            {projectDetails && (
                <div>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Project Details</h3>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Project ID: {projectDetails.project_id}</h5>
                            <p className="card-text"><strong>Title:</strong> {projectDetails.project_title}</p>
                            <p className="card-text"><strong>Description:</strong> {projectDetails.project_description}</p>
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

                    {/* Button to trigger Modal */}
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between">
                            <h4>Investments</h4>
                            <button className="btn btn-success" onClick={toggleModal}>
                                Add Investment
                            </button>
                        </div>
                    </div>

                    {/* Investments Section */}
                    {projectDetails.investments && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Investments</h4>
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
                                                <td>{investment.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Modal for Adding Investment */}
                    {showModal && (
                        <div
                            className="modal show"
                            style={{ display: 'block' }}
                            onClick={toggleModal}  // Close modal when clicking outside
                        >
                            <div
                                className="modal-dialog"
                                onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside modal content
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add Investment</h5>
                                        <button type="button" className="btn-close" onClick={toggleModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Select field */}
                                        <div className="mb-3">
                                            <label htmlFor="advisorSelect" className="form-label">Select Advisor</label>
                                            <select
                                                id="advisorSelect"
                                                className="form-select"
                                                value={selectedAdvisor}
                                                onChange={(e) => setSelectedAdvisor(e.target.value)}
                                            >
                                                <option value="">Select Advisor</option>
                                                {projectDetails.financial_advisors?.map((advisor, index) => (
                                                    <option key={index} value={advisor.advisor_email}>
                                                        {advisor.advisor_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Input field */}
                                        <div className="mb-3">
                                            <label htmlFor="investmentAmount" className="form-label">Investment Amount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="investmentAmount"
                                                value={investmentAmount}
                                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchProject;

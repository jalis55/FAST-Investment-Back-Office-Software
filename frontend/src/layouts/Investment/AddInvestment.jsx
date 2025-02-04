import React, { useState } from 'react';
import Swal from "sweetalert2";
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';

const AddInvestment = () => {
    const [searchId, setSearchId] = useState('');
    const [customers, setCustomers] = useState([]);
    const [projectId, setProjectId] = useState(0);
    const [projectBalance, setProjectBalance] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerBal, setSelectedCustomerBal] = useState(0);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const searchProject = async (e) => {
        e.preventDefault();

        if (!searchId.trim()) {
            Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter a project ID!' });
            return;
        }

        try {
            const response = await api.get(`/api/stock/project-balance/${searchId}/`);
            setProjectId(response.data.project_id);
            setProjectBalance(response.data.balance);
            getCustomers();
        } catch (error) {
            console.error("Error fetching project data:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    const getCustomers = async () => {
        try {
            const response = await api.get(`/api/admin/customers/`);
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    const handleInvestorChange = (e) => {
        const custId = parseInt(e.target.value, 10);
        const customer = customers.find(cust => cust.id === custId);
        setSelectedCustomer(customer || null);
        if (custId) {
            getCustomerBalance(custId);
        }
    };

    const getCustomerBalance = async (id) => {
        try {
            const response = await api.get(`/api/acc/user/${id}/balance/`);
            setSelectedCustomerBal(response.data.balance);
        } catch (error) {
            console.error("Error fetching customer balance:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || amount <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid amount greater than 0.' });
            return;
        }

        if (parseFloat(amount) > parseFloat(selectedCustomerBal)) {
            console.log(selectedCustomerBal-amount);
            Swal.fire({ icon: 'warning', title: 'Insufficient Balance', text: 'Amount exceeds available balance.' });
            return;
        }

        setLoading(true);

        const data = {
            project: projectId,
            investor: selectedCustomer.id,
            amount: parseFloat(amount),
        };

        try {
            const response = await api.post(`/api/stock/add-investment/`, data);
            Swal.fire({ icon: 'success', title: 'Investment Added', text: 'Investment has been successfully added!' });
            // Reset form after successful submission
            setAmount(0);
            setSelectedCustomer(null);
            setSelectedCustomerBal(0);
            setSearchId('');
            document.getElementById('investorDropdown').value = '';
        } catch (error) {
            console.error("Error adding investment:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
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
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {customers.length > 0 && (
                <>
                    <p className="card-description">Add Investment</p>
                    {projectBalance && <h3 className='card-description'>Project Balance: {projectBalance}</h3>}
                    <div className="form-group">
                        <label>Select Investor</label>
                        <select  id="investorDropdown"
                         className="form-control" onChange={handleInvestorChange}>
                            <option value="">Select Investor</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedCustomer && (
                        <>
                            <form className="forms-sample" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Available Balance</label>
                                    <input type="number" className="form-control" value={selectedCustomerBal} disabled />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="qty">Amount to Invest</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="qty"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="1"
                                        max={selectedCustomerBal || ''}
                                    />
                                </div>

                                <button type="submit" className="btn btn-success mr-2" disabled={loading || !selectedCustomer}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                                <button type="button" className="btn btn-light" onClick={() => {
                                    setSelectedCustomer(null);
                                    setAmount(0);
                                }}>
                                    Cancel
                                </button>
                            </form>
                        </>
                    )}
                </>
            )}
        </Wrapper>
    );
};

export default AddInvestment;

import React, { useState } from 'react';
import Swal from "sweetalert2";
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';

const BuyInstrument = () => {
    const [searchId, setSearchId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [availableBalance, setAvailableBalance] = useState(0);
    const [instruments, setInstruments] = useState([]);
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [qty, setQty] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [totalComm, setTotalComm] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch Project Balance
    const searchProject = async (e) => {
        e.preventDefault();

        if (!searchId.trim()) {
            Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter a project ID!' });
            return;
        }

        try {
            const response = await api.get(`/api/stock/project-balance/${searchId}/`);
            setProjectId(response.data.project_id);
            const availableBal = parseFloat(response.data.available_balance);
            setAvailableBalance(availableBal);

            if (availableBal > 0 && instruments.length === 0) {
                fetchInstruments();
            } else if (availableBal <= 0) {
                Swal.fire({ icon: 'error', title: 'Insufficient Balance', text: "You don't have enough balance to buy." });
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    // Fetch Available Instruments
    const fetchInstruments = async () => {
        try {
            const response = await api.get(`/api/stock/instruments/`);
            setInstruments(response.data);
        } catch (error) {
            console.error("Error fetching instruments:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load instruments.' });
        }
    };

    // Validate inputs
    const validateInputs = () => {
        const parsedQty = parseInt(qty);
        const parsedUnitPrice = parseFloat(unitPrice);
        const parsedTotalComm = parseFloat(totalComm);

        if (!selectedInstrument) {
            Swal.fire({ icon: 'warning', title: 'Selection Required', text: 'Please select an instrument.' });
            return false;
        }

        if (isNaN(parsedQty) || parsedQty <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity must be a positive number.' });
            return false;
        }

        if (isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Unit Price', text: 'Unit Price must be a positive number.' });
            return false;
        }

        if (isNaN(parsedTotalComm) || parsedTotalComm < 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Commission', text: 'Total Commission cannot be negative.' });
            return false;
        }

        const totalCost = parsedQty * parsedUnitPrice + parsedTotalComm;
        if (totalCost > availableBalance) {
            Swal.fire({ icon: 'error', title: 'Insufficient Funds', text: 'Your balance is not enough to complete this purchase.' });
            return false;
        }

        return true;
    };

    // Handle Instrument Purchase Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        setLoading(true);

        const tradeData = {
            project: projectId,
            instrument: selectedInstrument,
            qty: parseInt(qty),
            unit_price: parseFloat(unitPrice),
            trns_type: 'buy',
            total_commission: parseFloat(totalComm),
        };

        try {
            await api.post('/api/stock/create-trade/', tradeData);

            setAvailableBalance((prevBalance) => {
                const buyAmt = (parseInt(qty) * parseFloat(unitPrice)) + parseFloat(totalComm);
                return prevBalance - buyAmt;
            });

            Swal.fire({ icon: 'success', title: 'Success', text: 'Instrument purchase successful!' });

            // Reset Form
            setSelectedInstrument('');
            setQty('');
            setUnitPrice('');
            setTotalComm('');
            document.getElementById('instDropdown').value = '';
        } catch (error) {
            console.error("Error purchasing instrument:", error);
            Swal.fire({ icon: 'error', title: 'Purchase Failed', text: error.response?.data?.message || 'Transaction failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            {/* Project Search Form */}
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

            {/* Instrument Purchase Form */}
            {projectId && availableBalance > 0 && (
                <>
                    <h3 className="card-description">Balance: {availableBalance.toFixed(2)}</h3>
                    <p className="card-description">Buy Instrument</p>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Instrument</label>
                            <select
                                className="form-control"
                                id="instDropdown"
                                value={selectedInstrument}
                                onChange={(e) => setSelectedInstrument(e.target.value)}
                            >
                                <option value="">Select Instrument</option>
                                {instruments.map((instrument) => (
                                    <option key={instrument.id} value={instrument.id}>
                                        {instrument.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter total qty"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit Price</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter unit price"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Total Commission</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter total commission"
                                value={totalComm}
                                onChange={(e) => setTotalComm(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <button type="submit" className="btn btn-success mr-2" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" className="btn btn-light" onClick={() => {
                            setSelectedInstrument('');
                            setQty('');
                            setUnitPrice('');
                            setTotalComm('');
                        }}>
                            Cancel
                        </button>
                    </form>
                </>
            )}
        </Wrapper>
    );
};

export default BuyInstrument;

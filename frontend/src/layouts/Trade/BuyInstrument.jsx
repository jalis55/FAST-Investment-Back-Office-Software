import React, { useState } from 'react';
import Swal from "sweetalert2"; // Import SweetAlert2
import api from '../../api'; // Assuming your axios API setup is here

const BuyInstrument = ({ instruments, project }) => {
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [qty, setQty] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [totalComm, setTotalComm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform field validation
        if (!selectedInstrument || !qty || !unitPrice || !totalComm) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'All fields must be filled out correctly!',
            });
            return;
        }

        // Make sure quantity is valid
        if (qty <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: 'Please enter a positive quantity.',
            });
            return;
        }

        // Ensure unit price and total commission are valid numbers
        if (isNaN(unitPrice) || isNaN(totalComm) || unitPrice <= 0 || totalComm < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Values',
                text: 'Please enter valid positive numbers for unit price and commission.',
            });
            return;
        }

        setLoading(true);

        // Prepare the data for the API request
        const tradeData = {
            project: project, // Assuming project is passed as prop
            instrument: selectedInstrument,
            qty: qty,
            unit_price: parseFloat(unitPrice),
            trns_type: 'buy', // Set transaction type as 'buy'
            total_commission: parseFloat(totalComm),
        };

        try {
            const response = await api.post('/api/stock/create-trade/', tradeData);
            console.log('Trade created successfully:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Trade created successfully!',
            });
            // Optionally reset form or redirect
            setSelectedInstrument('');
            setQty('');
            setUnitPrice('');
            setTotalComm('');
        } catch (err) {
            console.error('Error creating trade:', err);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: 'There was an error processing your trade. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <p className="card-description">Buy Instrument</p>
            <div className="form-group">
                <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Instrument</label>
                        <select
                            className="form-control"
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
                        <label htmlFor="qty">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="qty"
                            placeholder="Enter total qty"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="unitPrice">Unit Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="unitPrice"
                            placeholder="Enter unit price"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="totalComm">Total Commission</label>
                        <input
                            type="number"
                            className="form-control"
                            id="totalComm"
                            placeholder="Enter total commission"
                            value={totalComm}
                            onChange={(e) => setTotalComm(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-success mr-2" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" className="btn btn-light" onClick={() => setSelectedInstrument('')}>
                        Cancel
                    </button>
                </form>
            </div>
        </>
    );
};

export default BuyInstrument;

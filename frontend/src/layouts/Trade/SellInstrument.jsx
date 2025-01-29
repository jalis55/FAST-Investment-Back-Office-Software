import React, { useState } from 'react';
import api from '../../api'; // Assuming 'api' is your axios setup
import Swal from "sweetalert2"; // SweetAlert2 for alerting

const SellInstrument = ({ instruments, project }) => {
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [qty, setQty] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [totalCommission, setTotalCommission] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInstrumentChange = (e) => {
        const instrumentId = parseInt(e.target.value, 10); // Ensure it's a number
        const instrument = instruments.find(inst => inst.instrument_id === instrumentId);
        setSelectedInstrument(instrument || null);
        setQty(''); // Reset qty input when instrument changes
    };

    const handleQtyChange = (e) => {
        let value = e.target.value ? parseInt(e.target.value, 10) : '';
        if (selectedInstrument && value > selectedInstrument.qty) {
            value = selectedInstrument.qty; // Restrict input to available qty
        }
        setQty(value || ''); // Prevent NaN values
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform field validation
        if (!selectedInstrument || !qty || !unitPrice || !totalCommission) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'All fields must be filled out correctly!',
            });
            return;
        }

        // Make sure quantity is valid
        if (qty <= 0 || qty > selectedInstrument.qty) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: `Please enter a quantity between 1 and ${selectedInstrument.qty}.`,
            });
            return;
        }

        // Make sure unit price and total commission are valid numbers
        if (isNaN(unitPrice) || isNaN(totalCommission) || unitPrice <= 0 || totalCommission < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Values',
                text: 'Please enter valid positive numbers for unit price and commission.',
            });
            return;
        }

        setLoading(true);

        const tradeData = {
            project: project, // Assuming project is passed as prop
            instrument: selectedInstrument.instrument_id,
            qty: qty,
            unit_price: parseFloat(unitPrice),
            trns_type: 'sell', // Sell transaction type
            total_commission: parseFloat(totalCommission),
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
            setSelectedInstrument(null);
            setQty('');
            setUnitPrice('');
            setTotalCommission('');
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
            <p className="card-description">Sell Instrument</p>
            <div className="form-group">
                <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Instrument</label>
                        <select className="form-control" onChange={handleInstrumentChange}>
                            <option value="">Select Instrument</option>
                            {instruments.map((instrument) => (
                                <option key={instrument.instrument_id} value={instrument.instrument_id}>
                                    {instrument.instrument_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Show these fields only when an instrument is selected */}
                    {selectedInstrument && (
                        <>
                            <div className="form-group">
                                <label>Available Qty</label>
                                <input type="number" className="form-control" value={selectedInstrument.qty} disabled />
                            </div>

                            <div className="form-group">
                                <label>Previous Unit Price</label>
                                <input type="number" className="form-control" value={selectedInstrument.unit_price} disabled />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="qty">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="qty"
                            placeholder="Enter total qty"
                            value={qty}
                            onChange={handleQtyChange}
                            min="1"
                            max={selectedInstrument?.qty || ''}
                            disabled={!selectedInstrument}
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
                            value={totalCommission}
                            onChange={(e) => setTotalCommission(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-success mr-2" disabled={loading || !selectedInstrument}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" className="btn btn-light" onClick={() => setSelectedInstrument(null)}>
                        Cancel
                    </button>
                </form>
            </div>
        </>
    );
};

export default SellInstrument;

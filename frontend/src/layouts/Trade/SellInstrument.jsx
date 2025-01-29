import React, { useState } from 'react';

const SellInstrument = ({ instruments }) => {
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [qty, setQty] = useState('');

    const handleInstrumentChange = (e) => {
        const instrumentId = parseInt(e.target.value, 10); // Ensure it's a number
        const instrument = instruments.find(inst => inst.id === instrumentId);
        setSelectedInstrument(instrument || null);
        setQty(''); // Reset qty input when instrument changes
    };

    const handleQtyChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (selectedInstrument && value > selectedInstrument.qty) {
            value = selectedInstrument.qty; // Restrict input to available qty
        }
        setQty(value || ''); // Prevent NaN
    };

    return (
        <>
            <p className="card-description">Sell Instrument</p>
            <div className="form-group">
                <form className="forms-sample">
                    <div className="form-group">
                        <label>Select Instrument</label>
                        <select className="form-control" onChange={handleInstrumentChange}>
                            <option value="">Select Instrument</option>
                            {instruments.map((instrument) => (
                                <option key={instrument.id} value={instrument.id}>
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
                            max={selectedInstrument?.qty || ''}
                            disabled={!selectedInstrument}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="unitPrice">Unit Price</label>
                        <input type="number" className="form-control" id="unitPrice" placeholder="Enter unit price" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="totalComm">Total Commission</label>
                        <input type="number" className="form-control" id="totalComm" placeholder="Enter total commission" />
                    </div>

                    <button type="submit" className="btn btn-success mr-2" disabled={!selectedInstrument}>
                        Submit
                    </button>
                    <button className="btn btn-light">Cancel</button>
                </form>
            </div>
        </>
    );
};

export default SellInstrument;

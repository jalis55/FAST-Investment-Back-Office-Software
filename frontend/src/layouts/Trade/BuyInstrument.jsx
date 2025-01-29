import React, { useState } from 'react';

const BuyInstrument = ({ instruments }) => {
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [qty, setQty] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [totalComm, setTotalComm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            selectedInstrument,
            qty,
            unitPrice,
            totalComm
        });
        // Perform API call to submit form data
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

                    <button type="submit" className="btn btn-success mr-2">
                        Submit
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

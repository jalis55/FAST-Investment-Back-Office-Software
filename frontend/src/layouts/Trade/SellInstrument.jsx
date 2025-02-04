import React, { useState } from 'react';
import Swal from "sweetalert2";
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';

const SellInstrument = () => {
    const [searchId, setSearchId] = useState('');
    const [instruments, setInstruments] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [qty, setQty] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [totalCommission, setTotalCommission] = useState('');
    const [loading, setLoading] = useState(false);

    const searchProject = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter a project ID!' });
            return;
        }
        try {
            const response = await api.get(`/api/stock/buyable-instruments/${searchId}/`);

            if (response.data.length === 0) {
                Swal.fire({ icon: 'info', title: 'No Saleable Instrument', text: 'No available instruments for this project.' });
                return;
            }
            setInstruments(response.data);

            setProjectId(searchId);
            setSearchId('');
            setSelectedInstrument(null); 
        } catch (error) {
            console.error("Error fetching project data:", error);
            Swal.fire({ icon: 'error', title: 'API Error', text: error.response?.data?.message || 'Something went wrong.' });
        }
    };

    const handleInstrumentChange = (e) => {
        const instrumentId = parseInt(e.target.value, 10);
        const instrument = instruments.find(inst => inst.instrument_id === instrumentId);
        setSelectedInstrument(instrument || null);
        setQty('');
        setUnitPrice('');
        setTotalCommission('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(instruments);
        // Input Validations
        if (!selectedInstrument) {
            Swal.fire({ icon: 'warning', title: 'Selection Required', text: 'Please select an instrument.' });
            return;
        }
        if (qty > selectedInstrument.available_quantity) {
            Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity exceeds available stock!' });
            return;
        }
        if (!qty || isNaN(qty) || qty <= 0 || qty > selectedInstrument.available_quantity) {
            Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Enter a valid quantity within the available range.' });
            return;
        }
        if (!unitPrice || isNaN(unitPrice) || unitPrice <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Price', text: 'Enter a valid unit price.' });
            return;
        }
        if (!totalCommission || isNaN(totalCommission) || totalCommission < 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Commission', text: 'Enter a valid commission amount.' });
            return;
        }


        setLoading(true);

        const tradeData = {
            project: projectId,
            instrument: selectedInstrument.instrument_id,
            qty: parseInt(qty, 10),
            unit_price: parseFloat(unitPrice),
            trns_type: 'sell',
            total_commission: parseFloat(totalCommission),
        };

        try {
            await api.post('/api/stock/create-trade/', tradeData);

            Swal.fire({ icon: 'success', title: 'Success', text: 'Instrument sold successfully!' });
            
            //updating instrument
            setInstruments((prevInstruments) =>
                prevInstruments
                    .map((inst) => {
                        if (inst.instrument_id === selectedInstrument.instrument_id) {
                            const newQty = inst.available_quantity - qty;
                            return newQty > 0 ? { ...inst, available_quantity: newQty } : null;
                        }
                        return inst; 
                    })
                    .filter((inst) => inst !== null) 
            );

            // Reset Form
            setSelectedInstrument(null);
            setQty('');
            setUnitPrice('');
            setTotalCommission('');
        } catch (error) {
            console.error("Error selling instrument:", error);
            Swal.fire({ icon: 'error', title: 'Sell Failed', text: error.response?.data?.message || 'Transaction failed.' });
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

            {instruments.length > 0 && (
                <div>
                    <p className="card-description">Sell Instrument</p>
                    <div className="form-group">
                        <label>Select Instrument</label>
                        <select className="form-control" onChange={handleInstrumentChange}>
                            <option value="">Select Instrument</option>
                            {instruments.map((instrument) => (
                                <option key={instrument.instrument_id} value={instrument.instrument_id}>
                                    {instrument.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedInstrument && (
                        <form className="forms-sample" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Available Qty</label>
                                <input type="number" className="form-control" value={selectedInstrument.available_quantity} disabled />
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
                                    max={selectedInstrument?.available_quantity || ''}
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
                    )}
                </div>
            )}
        </Wrapper>
    );
};

export default SellInstrument;

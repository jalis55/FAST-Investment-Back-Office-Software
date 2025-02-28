import React, { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
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

    // Search for project and fetch instruments
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

    // Handle instrument selection
    const handleInstrumentChange = useCallback((e) => {
        const instrumentId = parseInt(e.target.value, 10);
        const instrument = instruments.find(inst => inst.instrument_id === instrumentId);
        setSelectedInstrument(instrument || null);
        setQty('');
        setUnitPrice('');
        setTotalCommission('');
    }, [instruments]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!selectedInstrument) {
            Swal.fire({ icon: 'warning', title: 'Selection Required', text: 'Please select an instrument.' });
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
            // Step 1: Create the trade
            const response = await api.post('/api/stock/create-trade/', tradeData);

            // Step 2: Handle account receivable
            await handleAccountReceivable(response.data);

            // If both steps succeed, show success message and update UI
            Swal.fire({ icon: 'success', title: 'Success', text: 'Instrument sold successfully!' });

            // Update instruments list
            setInstruments(prevInstruments =>
                prevInstruments
                    .map(inst => inst.instrument_id === selectedInstrument.instrument_id
                        ? { ...inst, available_quantity: inst.available_quantity - qty }
                        : inst
                    )
                    .filter(inst => inst.available_quantity > 0)
            );

            // Reset form fields
            setSelectedInstrument(null);
            setQty('');
            setUnitPrice('');
            setTotalCommission('');
            document.getElementById('instDropdown').value = '';
        } catch (error) {
            console.error("Error in transaction:", error);
            Swal.fire({ icon: 'error', title: 'Transaction Failed', text: error.response?.data?.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    // Handle account receivable logic
    const handleAccountReceivable = async (data) => {
        try {
            const { id: trdId, project: proId, qty, unit_price, instrument: instrumentId } = data;
            const sellAmt = qty * unit_price - data.total_commission;
            const instrument = instruments.find(inst => inst.instrument_id === instrumentId);

         

            if (!instrument) {
                throw new Error("Instrument not found in list.");
            }

            const buyAmt = qty * instrument.average_buy_unit_price;
            const investorContributions = await getInvestorContrib();
            const disbursement = [];

            if (buyAmt < sellAmt) {
                const advisors = await getFinAdvisor();
                const gain = sellAmt - buyAmt;
                let totalAdvisorCommission = 0;

                advisors.forEach(advisor => {
                    const commission = (gain * advisor.com_percentage) / 100;
                    totalAdvisorCommission += commission;
                    disbursement.push({
                        project: proId,
                        trade: trdId,
                        investor: advisor.advisor.id,
                        contribute_amount: 0,
                        percentage: advisor.com_percentage,
                        gain_lose: commission.toFixed(2),
                        is_advisor: 1
                    });
                });

                let remainingGain = gain - totalAdvisorCommission;
                investorContributions.forEach(investor => {
                    const investorShare = (remainingGain * investor.contribution_percentage) / 100;
                    
                    disbursement.push({
                        project: proId,
                        investor: investor.investor,
                        trade: trdId,
                        contribute_amount: investor.contribute_amount,
                        percentage: investor.contribution_percentage,
                        gain_lose: investorShare.toFixed(2),
                        is_advisor: 0
                    });
                });
            } else {
                const loss = sellAmt - buyAmt;
                investorContributions.forEach(investor => {
                    const investorShare = (loss * investor.contribution_percentage) / 100;
                    console.log(investor);
                    disbursement.push({
                        project: proId,
                        investor: investor.investor,
                        trade: trdId,
                        contribute_amount: investor.contribute_amount,
                        percentage: investor.contribution_percentage,
                        gain_lose: investorShare.toFixed(2),
                        is_advisor: 0
                    });
                });
            }

            // Process gain/loss
            // console.log(disbursement);
            await processGainLose(disbursement);
            console.log("Gain/Loss Processed Successfully for all Advisors and Investors");
        } catch (error) {
            console.error("Error in handleAccountReceivable:", error);
            throw error; // Propagate the error to handleSubmit
        }
    };

    // Fetch financial advisors
    const getFinAdvisor = async () => {
        
        const response = await api.get(`/api/stock/fin-advisor-commission/${projectId}/`);

        response.data.forEach(d=>console.log(d.advisor.id));
        return response.data;
    };

    const getInvestorContrib = async () => {
        try {
            const response = await api.get(`/api/stock/investor-contrib-percent/${projectId}/`);
            // console.log("API Response:", response.data);
            // response.data.forEach(d => console.log(d.investor.id));
            return response.data;
        } catch (error) {
            console.error("Error fetching investor contributions:", error);
        }
    };

    // Process gain/loss
    const processGainLose = async (obj) => {
        await api.post('/api/stock/create-acc-recvable/', obj);
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
                <button className="btn btn-primary" type="submit">Search</button>
            </form>

            {instruments.length > 0 && (
                <div>
                    <p className="card-description">Sell Instrument</p>
                    <div className="form-group">
                        <label>Select Instrument</label>
                        <select className="form-control" id="instDropdown" onChange={handleInstrumentChange}>
                            <option value="">Select Instrument</option>
                            {instruments.map(instrument => (
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
                                    max={selectedInstrument.available_quantity}
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
import React from 'react';

const TradeDetails = ({ data = [] }) => {

    const calcGainLose = (total_qty_buy, total_buy, total_qty_sell, total_sell) => {
        const gainLose=total_sell-((total_buy/total_qty_buy)*total_qty_sell)

        return gainLose

    }

    return (
        <div className='table-responsive'>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Instrument Name</th>
                        <th>Buy qty</th>
                        <th>Buy amount</th>
                        <th>Sell qty</th>
                        <th>Sell amount</th>
                        <th>Remaining qty</th>
                        <th>Gain/Loss</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((d) => (
                            <tr key={d.instrument_id || d.instrument_name}>
                                <td>{d.instrument_name}</td>
                                <td>{d.total_qty_buy}</td>
                                <td>{d.total_buy}</td>
                                <td>{d.total_qty_sell}</td>
                                <td>{d.total_sell}</td>
                                <td>{d.total_qty_buy - d.total_qty_sell}</td>
                                <td>
                                    
                                    {d.total_qty_sell && d.total_sell
                                        ? calcGainLose(d.total_qty_buy, d.total_buy, d.total_qty_sell, d.total_sell)
                                        : 'N/A'}
                                </td>
                                <td>
                                    <button className="btn btn-primary">Disverse</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TradeDetails;

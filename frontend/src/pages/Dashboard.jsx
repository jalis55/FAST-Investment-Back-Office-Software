import React from 'react';
import InvesmentChartMonthWide from '../components/InvesmentChartMonthWide';
import WithdraePercentage from '../components/WithdraePercentage';

const transactions = [
    { id: 1, type: 'Deposit', amount: 500 },
    { id: 2, type: 'Withdraw', amount: 200 },
    { id: 3, type: 'Profit', amount: 1000 },
];

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="text-center">


                {/* Transaction items */}

                <div className='d-flex flex-row justify-content-evenly w-100 mb-5'>
                    {transactions.map((item, index) => (
                        <div key={index} className='border rounded-3 p-3 text-center'>
                            <div>
                                <h1>{item.type}</h1>
                                <h6>BDT: {item.amount}</h6>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Centered Table */}
                <div className="d-flex justify-content-center">
                    <table border="1" cellPadding="10" cellSpacing="0" className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Invested Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Stock A</td>
                                <td>100</td>
                                <td>$50</td>
                                <td>$5000</td>
                            </tr>
                            <tr>
                                <td>Stock B</td>
                                <td>150</td>
                                <td>$30</td>
                                <td>$4500</td>
                            </tr>
                            <tr>
                                <td>Stock C</td>
                                <td>200</td>
                                <td>$20</td>
                                <td>$4000</td>
                            </tr>
                            <tr>
                                <td>Stock D</td>
                                <td>50</td>
                                <td>$100</td>
                                <td>$5000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div>
                <InvesmentChartMonthWide />
            </div>
            <div className='row'>
                <div className='col'><WithdraePercentage /></div>
                <div className='col'><WithdraePercentage /></div>
                
            </div>
        </div>

    );
};

export default Dashboard;

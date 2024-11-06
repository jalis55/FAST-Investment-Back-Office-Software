import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Jan',
        withdraw: 4000,
        deposit: 1000,
        amt: 2400,
    },
    {
        name: 'Feb',
        withdraw: 3000,
        deposit: 1398,
        amt: 2210,
    },
    {
        name: 'Mar',
        withdraw: 2000,
        deposit: 9800,
        amt: 2290,
    },
    {
        name: 'Apr',
        withdraw: 2780,
        deposit: 3908,
        amt: 2000,
    },
    {
        name: 'May',
        withdraw: 1890,
        deposit: 4800,
        amt: 2181,
    },
    {
        name: 'June',
        withdraw: 2390,
        deposit: 3800,
        amt: 2500,
    },
    {
        name: 'July',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
    {
        name: 'Aug',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
    {
        name: 'Sep',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
    {
        name: 'Oct',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
    {
        name: 'Nov',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
    {
        name: 'Dec',
        withdraw: 3490,
        deposit: 4300,
        amt: 2100,
    },
];

const InvesmentChartMonthWide = () => {
    return (

        <div style={{ height: '400px' }}> {/* Set a fixed height */}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    {/* <YAxis domain={[0, 'dataMax + 1000']} tickCount={10} /> */}

                    
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deposit" fill="#8884d8" />
                    <Bar dataKey="withdraw" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InvesmentChartMonthWide;
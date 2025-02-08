import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TradeBarChart = ({tradeDetails}) => {

    // Generate unique colors dynamically
    const generateRandomColor = () => {
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    };
    if (!tradeDetails || tradeDetails.length === 0) return <p>No trade data available</p>;

    const instrumentNames = tradeDetails.map(trade => trade.instrument_name);
    const totalBuys = tradeDetails.map(trade => trade.total_buy);
    const totalSells = tradeDetails.map(trade => trade.total_sell);

    const backgroundColorsBuy = tradeDetails.map(() => generateRandomColor());
    const backgroundColorsSell = tradeDetails.map(() => generateRandomColor());

    const data = {
        labels: instrumentNames,
        datasets: [
            {
                label: 'Total Buy',
                data: totalBuys,
                backgroundColor: backgroundColorsBuy,
            },
            {
                label: 'Total Sell',
                data: totalSells,
                backgroundColor: backgroundColorsSell,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { enabled: true },
        },
        scales: {
            x: { stacked: false },
            y: { beginAtZero: true }
        }
    };
    return (
        <Bar data={data} options={options} />
    )
}

export default TradeBarChart;
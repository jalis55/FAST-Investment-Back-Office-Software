import React from 'react';
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; 

const InvestmentPieChart = ({data}) => {

    const labels = data.map((investor) => investor.investor_name);
    const investmentAmounts = data.map((investor) => investor.total_investment_amount);
  
    // Generate unique colors dynamically
    const generateColors = (numColors) => {
      return Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 50%)`);
    };
  
    const backgroundColors = generateColors(data.length);
  
    const chartData = {
      labels,
      datasets: [
        {
          data: investmentAmounts,
          backgroundColor: backgroundColors,
          hoverOffset: 20, // Increased hover effect for visibility
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              let value = tooltipItem.raw.toLocaleString();
              return `${tooltipItem.label}: $${value}`;
            },
          },
        },
        datalabels: {
          color: "#fff",
          formatter: (value, ctx) => {
            let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
            let percentage = ((value / sum) * 100).toFixed(2) + "%";
            return percentage;
          },
          font: { weight: "bold", size: 14 },
        },
      },
    };
  return (
    <div >
    <Pie data={chartData} options={options} />
  </div>
  )
}

export default InvestmentPieChart
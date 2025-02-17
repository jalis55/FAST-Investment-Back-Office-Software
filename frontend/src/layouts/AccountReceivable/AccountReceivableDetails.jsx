import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Wrapper from '../Wrapper/Wrapper';
import api from '../../api';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AccountReceivableDetails = () => {
    const [searchId, setSearchId] = useState('');
    const [recvableData, setRecvableData] = useState([]);

    const searchProject = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/api/stock/acc-recvable-details/${searchId}/`);
            setRecvableData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            Swal.fire("Error", "Failed to fetch project details", "error");
        }
    };

    // Function to download CSV
    const downloadCSV = () => {
        if (recvableData.length === 0) {
            Swal.fire("No Data", "No data available to download", "warning");
            return;
        }

        const csvData = recvableData.map(item => ({
            Investor_Email: item.investor.email,
            Investor_Name: item.investor.name,
            Instrument: item.trade.instrument.name,
            Sell_Qty: item.trade.qty,
            Unit_Price: item.trade.actual_unit_price,
            Trade_Date: item.trade.trade_date,
            Contribute_Amount: parseFloat(item.contribute_amount) !== 0 ? item.contribute_amount : 'Advisor',
            Percentage: `${item.percentage}%`,
            Gain_Loss: item.gain_lose
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "account_receivable_report.csv");
    };

    // Function to download PDF
    const downloadPDF = () => {
        if (recvableData.length === 0) {
            Swal.fire("No Data", "No data available to download", "warning");
            return;
        }

        const doc = new jsPDF();
        // FAST LOGO Text (Left Side)
        doc.setFontSize(12);
        doc.text("FAST LOGO", 20, 8); // Placed right next to the logo

        // Centered Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor('#99a32f'); // Dark Blue
        doc.text("FAST INVESTMENT LIMITED", 105, 10, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0,);
        doc.text('Report Title:Account receivable report', 20, 18);
        doc.text(`Project Id:${searchId}`, 20, 22.5);
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 200, 22.5, { align: "right" });





        const tableData = recvableData.map(item => ([
            item.investor.email,
            item.investor.name,
            item.trade.instrument.name,
            item.trade.qty,
            item.trade.actual_unit_price,
            item.trade.trade_date,
            parseFloat(item.contribute_amount) !== 0 ? item.contribute_amount : 'Advisor',
            `${item.percentage}%`,
            item.gain_lose
        ]));

      
        doc.autoTable({
            head: [["Investor Email", "Investor Name", "Instrument", "Sell Qty", "Unit Price", "Trade Date", "Contribute Amount", "Percentage", "Gain/Loss"]],
            body: tableData,
            startY: 25,
            theme: "grid",
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            headStyles: {
                fontSize:8,
                fillColor: false, // No background color
                textColor: [0, 0, 0] // Black text for contrast
            },
            styles: {
                lineColor: [0, 0, 0], // Border color for the table
                fontSize: 8,  // Set font size for the body cells
            }
        },
        );

        // window.open(doc.output("bloburl"), "_blank"); // Open in a new tab
        doc.save("account_receivable_report.pdf");
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

            {recvableData.length > 0 && (
                <div className='table-responsive'>
                    <h4 className="card-title">Pending Payments</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Investor</th>
                                <th>Instrument</th>
                                <th>Sell Qty</th>
                                <th>Unit Price</th>
                                <th>Trade Date</th>
                                <th>Contribute Amount</th>
                                <th>Percentage</th>
                                <th>Gain/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recvableData.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <li style={{ textDecoration: 'none', listStyleType: 'none' }}>
                                            Email: {item.investor.email}
                                        </li>
                                        <li style={{ textDecoration: 'none', listStyleType: 'none' }}>
                                            Name: {item.investor.name}
                                        </li>
                                    </td>
                                    <td>{item.trade.instrument.name}</td>
                                    <td>{item.trade.qty}</td>
                                    <td>{item.trade.actual_unit_price}</td>
                                    <td>{item.trade.trade_date}</td>
                                    <td>{parseFloat(item.contribute_amount) !== 0 ? item.contribute_amount : 'Advisor'}</td>
                                    <td>{item.percentage}%</td>
                                    <td>{item.gain_lose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-2">
                        <button className="btn btn-primary mr-2" onClick={downloadCSV}>Download CSV</button>
                        <button className="btn btn-secondary" onClick={downloadPDF}>Download PDF</button>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

export default AccountReceivableDetails;

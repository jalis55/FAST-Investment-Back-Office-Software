import React, { useState } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import Swal from 'sweetalert2';
import api from '../../api';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AccountReceivableDetailsAson = () => {
    const [searchId, setSearchId] = useState('');
    const [fromDt, setFromDt] = useState('');
    const [toDate, setToDate] = useState('');
    const [isDisbursed, setIsDisbursed] = useState(false);
    const [recvableData, setRecvableData] = useState([]);

    const searchProject = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/stock/acc-recvable-details-ason/${searchId}/`, {
                from_dt: fromDt,
                to_dt: toDate,
                disburse_st: isDisbursed ? 1 : 0,
            });

            if (response.data.length === 0) {
                Swal.fire("No Data", "No data found for the given criteria", "warning");
            }

            setRecvableData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            Swal.fire("Error", "Failed to fetch project details", "error");
        }
    };

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

    const handlePDF = (isDownload = true) => {
        if (recvableData.length === 0) {
            Swal.fire("No Data", "No data available to download", "warning");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("FAST LOGO", 20, 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor('#99a32f');
        doc.text("FAST INVESTMENT LIMITED", 105, 10, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Report Title: Account receivable report', 20, 18);
        doc.text(`Project Id: ${searchId}`, 20, 22.5);
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
                fontSize: 8,
                fillColor: false,
                textColor: [0, 0, 0]
            },
            styles: {
                lineColor: [0, 0, 0],
                fontSize: 8,
            }
        });

        if (isDownload) {
            doc.save("account_receivable_report.pdf");
        } else {
            window.open(doc.output("bloburl"), "_blank");
        }
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
                <div className="form-row d-flex align-items-center">
                    <div className="form-group col-md-4">
                        <label>From Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDt}
                            onChange={(e) => setFromDt(e.target.value)}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label>To Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group form-check mt-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isDisbursed"
                        checked={isDisbursed}
                        onChange={(e) => setIsDisbursed(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isDisbursed">Is Disbursed</label>
                </div>
                <button className="btn btn-primary" type="submit">Search</button>
            </form>
            {recvableData.length > 0 && (
                <div className="mt-3">
                    <button className="btn btn-success mr-2" onClick={downloadCSV}>Download CSV</button>
                    <button className="btn btn-danger mr-2" onClick={() => handlePDF(true)}>Download PDF</button>
                    <button className="btn btn-info" onClick={() => handlePDF(false)}>Preview</button>
                </div>
            )}
        </Wrapper>
    );
};

export default AccountReceivableDetailsAson;

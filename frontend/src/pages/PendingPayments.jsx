import React, { useEffect, useState } from 'react';
import api from '../api';
import { parseISO, format } from 'date-fns';

const PendingPayments = () => {
    const [pendingPaymentList, setPendingPaymentList] = useState([]);

    useEffect(() => {
        getPendingPaymentList();
    }, []);


    const getPendingPaymentList = () => {
        api.get('/api/acc/user/pending-payments/')
            .then((res) => res.data)
            .then((data) => setPendingPaymentList(data))
    }

    const handleApproval = (paymentId, status) => {
        const params = { "status": status };
    
        api.patch(`/api/acc/user/approve-transaction/${paymentId}/`, params)
            .then((res) => {
                if (res.status === 200) {
                    
                    // Remove the approved or declined transaction from the pendingPaymentList
                    setPendingPaymentList((prevPendingList) =>
                        prevPendingList.filter((payment) => payment.id !== paymentId)
                    );
    
                    alert(`Transaction ${status} successfully.`);
                } else {
                    console.log('Unexpected response:', res.data.detail);
                }
            })
            .catch((error) => {
                // Check if there's an error message in the response and display it
                const errorMessage = error.response?.data?.detail || 'Failed to update transaction. Please try again.';
                console.error('Error updating transaction:', errorMessage);
                alert(errorMessage);  // Display the error message to the user
            });
    };

    return (
<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
    {pendingPaymentList && pendingPaymentList.length > 0 ? (
        <>
            <h1>Pending Withdraw Request</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Issued by</th>
                        <th scope="col">Issued date</th>
                        <th scope="col">Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {pendingPaymentList.map((payments) => (
                        <tr key={payments.id}>
                            <th scope="row">{payments.id}</th>
                            <td>{payments.user.email}</td>
                            <td>{payments.amount}</td>
                            <td>{payments.issued_by.email}</td>
                            <td>{format(parseISO(payments.issued_date), 'yyyy-MM-dd')}</td>
                            <td>
                                <button className='btn btn-primary' onClick={() => handleApproval(payments.id, 'approved')}>Approve</button>
                                <button className='btn btn-danger' onClick={() => handleApproval(payments.id, 'declined')}>Decline</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    ) : (
        <h1>No Pending Withdrawal Requests</h1> // Fixed typo here: 'Withdrwal' -> 'Withdrawal'
    )}
</main>
    )
}

export default PendingPayments;
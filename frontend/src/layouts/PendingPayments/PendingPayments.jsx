import React, { useState, useEffect } from 'react';
import api from '../../api';
import { parseISO, format } from 'date-fns';
import Swal from 'sweetalert2';
import Wrapper from '../Wrapper/Wrapper';

const PendingPayments = () => {
    const [pendingPaymentList, setPendingPaymentList] = useState([]);

    useEffect(() => {
        getPendingPaymentList();
    }, []);

    const getPendingPaymentList = () => {
        api.get('/api/acc/user/pending-payments/')
            .then((res) => res.data)
            .then((data) => setPendingPaymentList(data));
    };

    const handleApproval = (paymentId, status) => {
        const params = { status };

        api.patch(`/api/acc/user/approve-transaction/${paymentId}/`, params)
            .then((res) => {
                if (res.status === 200) {
                    setPendingPaymentList((prevPendingList) =>
                        prevPendingList.filter((payment) => payment.id !== paymentId)
                    );

                    Swal.fire(
                        'Success!',
                        `Transaction ${status} successfully.`,
                        'success'
                    );
                } else {
                    console.log('Unexpected response:', res.data.detail);
                }
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.detail ||
                    'Failed to update transaction. Please try again.';
                console.error('Error updating transaction:', errorMessage);
                Swal.fire('Error', errorMessage, 'error');
            });
    };

    const confirmAction = (paymentId, status) => {
        Swal.fire({
            title: `Are you sure you want to ${status} this transaction?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'approved' ? '#28a745' : '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${status}!`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleApproval(paymentId, status);
            }
        });
    };

    return (
        <Wrapper>
            <h4 className="card-title">Pending Payments</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th> # </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th> Amount </th>
                        <th>Issued By</th>
                        <th>Issued Date</th>
                        <th> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingPaymentList.map((payments) => (
                        <tr key={payments.id}>
                            <td>{payments.id}</td>
                            <td>{payments.user.email}</td>
                            <td>{payments.user.name}</td>
                            <td>{payments.amount}</td>
                            <td>{payments.issued_by.email}</td>
                            <td>
                                {format(
                                    parseISO(payments.issued_date),
                                    'MMMM dd, yyyy'
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-success"
                                    onClick={() => confirmAction(payments.id, 'approved')}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => confirmAction(payments.id, 'declined')}
                                >
                                    Decline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Wrapper>
    );
};

export default PendingPayments;

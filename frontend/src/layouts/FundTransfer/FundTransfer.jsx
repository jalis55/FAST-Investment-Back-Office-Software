import React, { useState, useEffect } from 'react';
import api from '../../api';
import Swal from 'sweetalert2';

const FundTransfer = () => {
    const [users, setUsers] = useState([]);
    const [fromUser, setFromUser] = useState("");
    const [toUser, setToUser] = useState("");
    const [amount, setAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        api
            .get("/api/admin/customers/")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const getUserName = (userId) => {
        const user = users.find((user) => user.id === Number(userId));
        return user ? user.name : 'Unknown User';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if both users are selected
        if (!fromUser) {
            setStatusMessage('Please select a "From" user.');
            return;
        }
        if (!toUser) {
            setStatusMessage('Please select a "To" user.');
            return;
        }

        // Check if the amount is less than 100
        if (parseFloat(amount) < 100) {
            await Swal.fire({
                title: 'Invalid Amount',
                text: 'The amount must be at least 100.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return; // Prevent further execution
        }

        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to transfer BDT:${amount} from: ${getUserName(fromUser)} To: ${getUserName(toUser)}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        });

        // If confirmed, proceed with the API call
        if (confirmResult.isConfirmed) {
            const fundTransferData = {
                transfer_from: fromUser,
                transfer_to: toUser,
                amount: parseFloat(amount),
            };

            api.post('/api/acc/user/fund-transfer/', fundTransferData)
                .then((res) => {
                    setFromUser('');
                    setToUser('');
                    setAmount('');
                    setStatusMessage("Fund Transfer Successful");

                    Swal.fire({
                        title: 'Success!',
                        text: 'Transaction has been created successfully.',
                        icon: 'success'
                    });
                })
                .catch((error) => {
                    setStatusMessage('Failed to create transaction');
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to create transaction. Please try again.',
                        icon: 'error'
                    });
                });
        }
    };

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Fund Transfer</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>From User</label>
                                    <select
                                        className="form-control"
                                        value={fromUser}
                                        onChange={(e) => setFromUser(e.target.value)}
                                    >
                                        <option value="">Select a user</option>
                                        {users
                                            .filter((user) => user.id !== Number(toUser))
                                            .map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>To User</label>
                                    <select
                                        className="form-control"
                                        value={toUser}
                                        onChange={(e) => setToUser(e.target.value)}
                                    >
                                        <option value="">Select a user</option>
                                        {users
                                            .filter((user) => user.id !== Number(fromUser))
                                            .map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-info btn-block">
                                    Proceed
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundTransfer;

import React, { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

const FundTransfer = () => {
    const [users, setUsers] = useState([]);
    const [fromUser, setFromUser] = useState("");
    const [toUser, setToUser] = useState("");
    const [amount, setAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    //   console.log(users)

    useEffect(() => {
        api
            .get("/api/admin/customers/")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Check is the users are given perfectlly
        if (!fromUser) {
            setStatusMessage('Please select a user.');
            return;
        }
        if (!toUser) {
            setStatusMessage('Please select a user.');
            return;
        }

        // Check if the amount is less than 1000
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
            text: `You are about to transfer BDT${amount} from Inv ID: ${fromUser} to Inv ID: ${toUser} .`,
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

        

    }
    return (
        <div>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content mt-2">
                <div>
                    <form
                        onSubmit={handleSubmit}
                        className="border mt-4 p-4"
                    >
                        <h2>Fund Transfer</h2>
                        <div className="form-group">
                            <label>From User:</label>
                            <select
                                className="form-select"
                                value={fromUser}
                                onChange={(e) => setFromUser(e.target.value)}
                                required
                            >
                                <option value="">Select User</option>
                                {users.filter((user) => user.id !== Number(toUser)).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>To User:</label>
                            <select
                                className="form-select"
                                value={toUser}
                                onChange={(e) => setToUser(e.target.value)}
                                required
                            >
                                <option value="">Select User</option>
                                {users.filter((user) => user.id !== Number(fromUser)).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input
                                className="form-control"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            Create Transaction
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FundTransfer;



/*
import React, { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

const FundTransfer = () => {
    const [users, setUsers] = useState([]);
    const [fromUser, setFromUser] = useState(null); // Store full user object
    const [toUser, setToUser] = useState(null); // Store full user object
    const [amount, setAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        api
            .get("/api/admin/customers/")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fromUser || !toUser) {
            setStatusMessage('Please select both users.');
            return;
        }

        if (parseFloat(amount) < 100) {
            await Swal.fire({
                title: 'Invalid Amount',
                text: 'The amount must be at least 100.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to transfer BDT ${amount} from ${fromUser.name} to ${toUser.name}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        });

        if (confirmResult.isConfirmed) {
            const fundTransferData = {
                transfer_from: fromUser.id,
                transfer_to: toUser.id,
                amount: parseFloat(amount),
            };

            api.post('/acc/user/fund-transfer/', fundTransferData)
                .then((res) => {
                    setFromUser(null);
                    setToUser(null);
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
        <div>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content mt-2">
                <div>
                    <form onSubmit={handleSubmit} className="border mt-4 p-4">
                        <h2>Fund Transfer</h2>
                        <div className="form-group">
                            <label>From User:</label>
                            <select
                                className="form-select"
                                value={fromUser ? fromUser.id : ''}
                                onChange={(e) => {
                                    const selectedUser = users.find(user => user.id === Number(e.target.value));
                                    setFromUser(selectedUser);
                                }}
                                required
                            >
                                <option value="">Select User</option>
                                {users.filter((user) => user.id !== (toUser ? toUser.id : null)).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>To User:</label>
                            <select
                                className="form-select"
                                value={toUser ? toUser.id : ''}
                                onChange={(e) => {
                                    const selectedUser = users.find(user => user.id === Number(e.target.value));
                                    setToUser(selectedUser);
                                }}
                                required
                            >
                                <option value="">Select User</option>
                                {users.filter((user) => user.id !== (fromUser ? fromUser.id : null)).map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input
                                className="form-control"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            Create Transaction
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FundTransfer;

*/
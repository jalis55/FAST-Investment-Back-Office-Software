import { React, useState, useEffect } from 'react';
import api from '../../api';
import Swal from 'sweetalert2';
import Wrapper from '../Wrapper/Wrapper';

const Transactions = () => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [transMode, setTransMode] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        api.get('/api/admin/customers/')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure a user is selected
        if (!selectedUser) {
            setStatusMessage('Please select a user.');
            return;
        }

        // Check if the amount is less than 1000
        if (parseFloat(amount) < 1000) {
            await Swal.fire({
                title: 'Invalid Amount',
                text: 'The amount must be at least 1000.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return; // Prevent further execution
        }

        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to ${transactionType === "deposit" ? "deposit" : "withdraw"} BDT${amount} .`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        });

        // If confirmed, proceed with the API call
        if (confirmResult.isConfirmed) {
            const transactionData = {
                user: selectedUser,
                amount: parseFloat(amount),
                transaction_type: transactionType,
                trans_mode: transMode,
            };

            api.post('/api/acc/user/create-transaction/', transactionData)
                .then((res) => {
                    setAmount('');
                    setSelectedUser('');
                    setTransMode('');
                    setTransactionType('');
                    setStatusMessage("Transaction Successful");
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
        <Wrapper>
            <h4 className="card-title">Transactions</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userSelect">User</label>
                    <select className="form-control"
                        id="userSelect"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>({user.email})--{user.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amountInput">Amount</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">$</span>
                        </div>
                        <input type="number" class="form-control"
                            aria-label="Amount (to the nearest dollar)"
                            id='amountInput'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        <div class="input-group-append">
                            <span class="input-group-text">.00</span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="transactionTypeSelect">Transaction Type</label>
                    <select className="form-control"
                        id="transactionTypeSelect"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="">Select a transaction type</option>
                        <option value="deposit">Deposit</option>
                        <option value="payment">Withdraw</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="transModeSelect">Transaction Mode</label>
                    <select className="form-control"
                        id="transModeSelect"
                        value={transMode}
                        onChange={(e) => setTransMode(e.target.value)}>
                        <option value="">Select a transaction mode</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-info btn-block">Proceed</button>
            </form>
        </Wrapper>
    )
}

export default Transactions;
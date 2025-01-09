import React, { useState } from "react";

const InvestmentDetails = ({ userInfo, editUserData, deleteUser }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editedValue, setEditedValue] = useState("");

    const toggleEditMode = (index, initialValue) => {
        if (editIndex === index) {
            // Save changes and exit edit mode
            if (editedValue) {
                editUserData(index, parseFloat(editedValue)); // Ensure value is passed as a number
            }
            setEditIndex(null);
            setEditedValue("");
        } else {
            // Enter edit mode
            setEditIndex(index);
            setEditedValue(initialValue.toString());
        }
    };

    const handleDelete = (index) => {
        deleteUser(index);
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userInfo.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {editIndex === index ? (
                                    <input
                                        type="number"
                                        value={editedValue}
                                        onChange={(e) => setEditedValue(e.target.value)}
                                        style={{
                                            width: '100px',
                                            padding: '5px',
                                            fontSize: '14px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ) : (
                                    user.com_percentage || user.amount
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        toggleEditMode(index, user.com_percentage || user.amount)
                                    }
                                >
                                    {editIndex === index ?
                                        (<i class="fa-regular fa-file"></i>)
                                        :
                                        (<i class="fa-regular fa-edit"></i>)}
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => handleDelete(index)}
                                >
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvestmentDetails;

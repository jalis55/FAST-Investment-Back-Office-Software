import React, { useState, useEffect } from 'react';
import api from '../../api';

const UserList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        getUserList();
    }, []);

    const getUserList = () => {
        api.get('/api/admin/users/')
            .then((res) => res.data)
            .then((data) => {
                setUserList(data);
            })
            .catch((err) => alert(err));
    };

    const toggleAdminStatus = (userId, isStaff) => {
        api.patch(`api/admin/users/${userId}/`, { is_staff: !isStaff })
            .then(() => {
                setUserList((prevUserList) =>
                    prevUserList.map((user) =>
                        user.id === userId ? { ...user, is_staff: !isStaff } : user
                    )
                );
            })
            .catch((err) => alert('Error updating admin status: ' + err));
    };

    const toggleActiveStatus = (userId, isActive) => {
        api.patch(`api/admin/users/${userId}/`, { is_active: !isActive })
            .then(() => {
                setUserList((prevUserList) =>
                    prevUserList.map((user) =>
                        user.id === userId ? { ...user, is_active: !isActive } : user
                    )
                );
            })
            .catch((err) => alert('Error updating active status: ' + err));
    };

    return (

        <div className="content-wrapper">
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">User List</h4>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th> # </th>
                                            <th> Name </th>
                                            <th> Email </th>
                                            <th> Is Admin </th>
                                            <th> Is Active </th>
                                            <th> Actions </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.is_staff ? 'Yes' : 'No'}</td>
                                                <td>{user.is_active ? 'Active' : 'Banned'}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {user.is_staff ? (
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => toggleAdminStatus(user.id, user.is_staff)}
                                                            >
                                                                Remove Admin
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => toggleAdminStatus(user.id, user.is_staff)}
                                                            >
                                                                Make Admin
                                                            </button>
                                                        )}
                                                        {user.is_active ? (
                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => toggleActiveStatus(user.id, user.is_active)}
                                                            >
                                                                Ban
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => toggleActiveStatus(user.id, user.is_active)}
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                        <button className="btn btn-secondary btn-sm">Details</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UserList;

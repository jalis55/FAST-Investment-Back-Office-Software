import React, { useEffect, useState } from 'react';
import api from '../api';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        getUserList();
    }, []);

    const getUserList = () => {
        api.get('/api/admin/users/')
            .then((res) => res.data)
            .then((data) => {
                console.log("test")
                setUserList(data);
            })
            .catch((err) => alert(err));
    }

    const toggleAdminStatus = (userId, isStaff) => {
        api.patch(`api/admin/users/${userId}/`, { "is_staff": !isStaff })
            .then((res) => {
                setUserList((prevUserList) =>
                    prevUserList.map((user) =>
                        user.id === userId ? { ...user, is_staff: !isStaff } : user
                    )
                );
            })
            .catch((err) => alert('Error updating active status: ' + err));
    }

    const toggleActiveStatus = (userId, isActive) => {
        api.patch(`api/admin/users/${userId}/`, { "is_active": !isActive })
            .then((res) => {
                setUserList((prevUserList) =>
                    prevUserList.map((user) =>
                        user.id === userId ? { ...user, is_active: !isActive } : user
                    )
                );
            })
            .catch((err) => alert('Error updating active status: ' + err));
    }


    return (
        <div className="container">
            <div className="row">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map(user => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        {user.is_active ? (
                                            <span className="text-success">Active</span>
                                        ) : (
                                            <span className="text-danger">Banned</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {user.is_staff ? (
                                                <button className="btn btn-danger" onClick={() => toggleAdminStatus(user.id, user.is_staff)}>Remove Admin</button>
                                            ) : (
                                                <button className="btn btn-primary" onClick={() => toggleAdminStatus(user.id, user.is_staff)}>Make Admin</button>
                                            )}
                                            {user.is_active ? (
                                                <button className="btn btn-warning" onClick={()=>toggleActiveStatus(user.id,user.is_active)}>Ban</button>
                                            ) : (
                                                <button className="btn btn-success" onClick={()=>toggleActiveStatus(user.id,user.is_active)}>Active</button>
                                            )}
                                            <button className="btn btn-secondary">Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




            </div>
        </div>
    )
}

export default UserList
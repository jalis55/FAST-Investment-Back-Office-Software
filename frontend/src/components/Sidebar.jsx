import React from 'react';
import { useState, useEffect } from "react";
import api from "../api";
import { Outlet, Link } from "react-router-dom";

const Sidebar = () => {
    const [userStatus, setUserStatus] = useState('')

    useEffect(() => {
        if (!userStatus) {
            getUserStatus();
        }
    }, [])

    const getUserStatus = () => {
        api.get('api/user-status/')
            .then((res) => res.data)
            .then((data) => setUserStatus(data))
    }
    return (
        <div>
            <div className="">
                <div className="position-sticky pt-3">
                    <h2 className="h4 px-3 pb-3 border-bottom">MyDashboard</h2>
                    <ul className="nav flex-column" style={{ paddingLeft: "0px" }}>
                        {/* <li className="nav-item border border-1 rounded rounded-9 hover-bg-green" style={{ backgroundColor: 'red', padding: "10px 5px 10px 20px", }}>

                            <i className="bi bi-bar-chart-line me-2"></i>
                            <Link to={`overview`}>Overview</Link>

                        </li> */}
                        <li className="nav-item border border-1 rounded rounded-9 bg-primary px-3 py-2 text-white hoverbg-success">
                            <i className="bi bi-bar-chart-line me-2"></i>
                            <Link to="overview" className="text-white text-decoration-none">Overview</Link>
                        </li>

                        {userStatus.status === 'superadmin' &&
                            <>
                                <div className="nav-link">
                                    <li className="nav-item">

                                        <i className="bi bi-people me-2"></i>
                                        <Link to={`users`}>Users</Link>

                                    </li>
                                </div>
                                <div className="nav-link">
                                    <li className="nav-item">

                                        <i className="bi bi-collection"></i>
                                        <Link to={`pending-payments`}>Withdraw Request</Link>

                                    </li>
                                </div>

                            </>

                        }
                        {(userStatus.status === 'superadmin' || userStatus.status === 'admin') &&
                            <>
                                <div className='nav-link'>

                                    <li className="nav-item">

                                        <i className="bi bi-wallet-fill"></i>
                                        <Link to={`fund-transfer`}>Fund Transfer</Link>

                                    </li>
                                </div>
                                <div className="nav-link">
                                    <li className="nav-item">

                                        <i className="bi bi-cash-coin"></i>
                                        <Link to={`transactions`}>Transaction</Link>

                                    </li>
                                </div>

                            </>


                        }


                        <li className="nav-item">

                            <i className="bi bi-gear me-2"></i>
                            Settings

                        </li>
                    </ul>
                    <hr />
                    <div className="px-3">

                        <i className="bi bi-box-arrow-right me-2"></i>
                        <Link to={`logout`}>Logout</Link>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
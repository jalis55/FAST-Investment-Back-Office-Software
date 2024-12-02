import { useState, useEffect } from "react";
import api from "../api";
import { Outlet, Link } from "react-router-dom";




import React from 'react'

const Home = () => {
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
        <div className="container-fluid">
            <div className="row">

                <nav className="col-md-3 col-lg-2 d-md-block sidebar collapse">
                    <div className="position-sticky pt-3">
                        <h2 className="h4 px-3 pb-3 border-bottom">MyDashboard</h2>
                        <ul className="nav flex-column">
                            <li className="nav-item">

                                <i className="bi bi-bar-chart-line me-2"></i>
                                <Link to={`overview`}>Overview</Link>

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
                                    <div className="nav-link">
                                        <li className="nav-item">

                                            <i className="bi bi-cash-coin"></i>
                                            <Link to={`create-project`}>Create Project</Link>

                                        </li>
                                    </div>
                                    <div className="nav-link">
                                        <li className="nav-item">

                                            <i className="bi bi-cash-coin"></i>
                                            <Link to={`project-list`}>Project List</Link>

                                        </li>
                                    </div>
                                    <div className="nav-link">
                                        <li className="nav-item">

                                            <i className="bi bi-cash-coin"></i>
                                            <Link to={`project-search`}>Search Project</Link>

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
                </nav>


                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Home
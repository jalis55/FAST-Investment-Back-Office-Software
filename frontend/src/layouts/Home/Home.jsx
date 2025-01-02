import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Spinner } from 'react-bootstrap'; // Importing Spinner from React Bootstrap
import api from '../../api';
import NavBar from '../../components/Navbar/NavBar.jsx';
import SideBar from '../../components/Sidebar/SideBar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const Home = () => {
    const [userStatus, setUserStatus] = useState(null); // Initialize as null
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const res = await api.get('api/user-status/');
                setUserStatus(res.data);
            } catch (error) {
                console.error("Failed to fetch user status:", error);
            } finally {
                setLoading(false); // Ensure loading ends
            }
        };

        fetchUserStatus();
    }, []); 

    if (loading) {
        // Show a spinner while waiting for the user status
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container-scroller">
            <NavBar userStatus={userStatus} />
            <div className="container-fluid page-body-wrapper">
                <SideBar userStatus={userStatus} />
                <div className="main-panel">
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;

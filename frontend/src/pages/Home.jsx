import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import api from '../api';
// import Sidebar from './Sidebar';
// import Header from './Header';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


const Home = () => {
  const [userStatus, setUserStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!userStatus) {
      getUserStatus();
    }
  }, [userStatus]);

  const getUserStatus = async () => {
    try {
      const response = await api.get('api/user-status/');
      setUserStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar userStatus={userStatus} isOpen={sidebarOpen} />
      
      
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-grow-1 bg-light p-4">
          <div className="container-fluid">
            <h1 className="mb-4 text-capitalize">
              {location.pathname.split('/').pop().replace('-', ' ')}
            </h1>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ to, icon, children }) => (
  <li className="nav-item">
    <Link to={to} className="nav-link text-white">
      <i className={`bi ${icon} me-2`}></i>
      {children}
    </Link>
  </li>
);

const Sidebar = ({ userStatus, isOpen }) => {
  return (
    <nav className={`sidebar bg-dark text-white ${isOpen ? 'show' : ''}`} style={{width: '250px'}}>
      <div className="position-sticky">
        <div className="p-3 border-bottom">
          <h2 className="h4">MyDashboard</h2>
        </div>
        <ul className="nav flex-column p-3">
          <NavItem to="/overview" icon="bi-house-door">Overview</NavItem>
          {userStatus === 'superadmin' && (
            <>
              <NavItem to="/users" icon="bi-people">Users</NavItem>
              <NavItem to="/pending-payments" icon="bi-credit-card">Withdraw Request</NavItem>
            </>
          )}
          {(userStatus === 'superadmin' || userStatus === 'admin') && (
            <>
              <NavItem to="/fund-transfer" icon="bi-cash-coin">Fund Transfer</NavItem>
              <NavItem to="/transactions" icon="bi-currency-exchange">Transaction</NavItem>
              <NavItem to="/create-project" icon="bi-plus-circle">Create Project</NavItem>
              <NavItem to="/project-list" icon="bi-list-ul">Project List</NavItem>
              <NavItem to="/project-search" icon="bi-search">Search Project</NavItem>
            </>
          )}
          <NavItem to="/settings" icon="bi-gear">Settings</NavItem>
        </ul>
        <div className="p-3 mt-auto border-top">
          <Link to="/logout" className="nav-link text-danger">
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;


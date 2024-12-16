import React from 'react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-bottom">
      <div className="container-fluid">
        <div className="row align-items-center py-3">
          <div className="col">
            <button className="btn btn-link d-md-none" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
          </div>
          <div className="col-auto d-flex align-items-center">
            <div className="dropdown me-3">
              <button className="btn btn-link position-relative" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-bell"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" href="#">Notification 1</a></li>
                <li><a className="dropdown-item" href="#">Notification 2</a></li>
                <li><a className="dropdown-item" href="#">Notification 3</a></li>
              </ul>
            </div>
            <div className="dropdown">
              <button className="btn btn-link d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://via.placeholder.com/32" alt="User" className="rounded-circle me-2" width="32" height="32" />
                <span>John Doe</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


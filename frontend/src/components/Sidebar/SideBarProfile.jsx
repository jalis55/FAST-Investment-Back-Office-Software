import React from 'react';
import {Link} from 'react-router-dom';

const SideBarProfile = ({profileImage}) => {
  return (
    <li className="nav-item nav-profile">
      <Link to="#" className="nav-link">
        <div className="profile-image">
          <img className="img-xs rounded-circle" src={profileImage} alt="profile image" />
          <div className="dot-indicator bg-success"></div>
        </div>
        <div className="text-wrapper">
          <p className="profile-name">Test User</p>
        </div>
      </Link>
    </li>
  )
}

export default SideBarProfile
import React from 'react';
import { Link } from 'react-router-dom';

const SideBarItem = ({menuName,url}) => {
    return (
        <li className="nav-item">
            <Link  to={url} className="nav-link" >
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">{menuName}</span>
            </Link>
        </li>
    )
}

export default SideBarItem;
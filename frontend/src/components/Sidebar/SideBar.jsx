import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideBarProfile from './SideBarProfile';
import profileImg from '../../assets/images/faces/face8.jpg';
// import sideBarItems from '../../data/sidebarItems.json'; // Import JSON file
import sideBarItems from '../../data/sideBarItems.json';

const SideBar = ({ userStatus }) => {
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        if (userStatus) {
            // Filter items: include items with matching roles or no roles specified
            const visibleItems = sideBarItems.filter(
                item => !item.roles || item.roles.includes(userStatus)
            );
            setFilteredItems(visibleItems);
        }
    }, [userStatus]);

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <SideBarProfile profileImage={profileImg} />
                <li className="nav-item nav-category">Main Menu</li>

                {filteredItems.map((item, index) => (
                    <li key={index} className="nav-item">
                        <Link className="nav-link" to={item.url}>
                            <span className="menu-title">{item.menuName}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideBar;

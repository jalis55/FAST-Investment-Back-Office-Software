import React from 'react';
import profile_pic from '../../assets/images/faces/face1.jpg';
import profile_img from '../../assets/images/faces/face8.jpg';
import logo from  '../../assets/images/logo.svg';
import logo_mini from '../../assets/images/logo-mini.svg';
import { Dropdown } from 'react-bootstrap';

const NavBar = () => {
  return (
    <>
                    <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                    <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
                        <a className="navbar-brand brand-logo" href="index.html">
                            <img src={logo} alt="logo" /> </a>
                        <a className="navbar-brand brand-logo-mini" href="index.html">
                            <img src={logo_mini} alt="logo" /> </a>
                    </div>
                    <div className="navbar-menu-wrapper d-flex align-items-center">
                        
                        <ul className="navbar-nav">
                            <li className="nav-item font-weight-semibold d-none d-lg-block">Help : +050 2992 709</li>
                            <li className="nav-item dropdown language-dropdown">
                                <a className="nav-link dropdown-toggle px-2 d-flex align-items-center" id="LanguageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                                    <div className="d-inline-flex mr-0 mr-md-3">
                                        <div className="flag-icon-holder">
                                            <i className="flag-icon flag-icon-us"></i>
                                        </div>
                                    </div>
                                    <span className="profile-text font-weight-medium d-none d-md-block">English</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-left navbar-dropdown py-2" aria-labelledby="LanguageDropdown">
                                    <a className="dropdown-item">
                                        <div className="flag-icon-holder">
                                            <i className="flag-icon flag-icon-us"></i>
                                        </div>English
                                    </a>
                                    <a className="dropdown-item">
                                        <div className="flag-icon-holder">
                                            <i className="flag-icon flag-icon-fr"></i>
                                        </div>French
                                    </a>
                                    <a className="dropdown-item">
                                        <div className="flag-icon-holder">
                                            <i className="flag-icon flag-icon-ae"></i>
                                        </div>Arabic
                                    </a>
                                    <a className="dropdown-item">
                                        <div className="flag-icon-holder">
                                            <i className="flag-icon flag-icon-ru"></i>
                                        </div>Russian
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link count-indicator" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                                    <i className="mdi mdi-bell-outline"></i>
                                    <span className="count">7</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="messageDropdown">
                                    <a className="dropdown-item py-3">
                                        <p className="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
                                        <span className="badge badge-pill badge-primary float-right">View all</span>
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <img src="{profile_img}" alt="image" className="img-sm profile-pic" />
                                        </div>
                                        <div className="preview-item-content flex-grow py-2">
                                            <p className="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
                                            <p className="font-weight-light small-text"> The meeting is cancelled </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <img src={profile_pic} alt="image" className="img-sm profile-pic" />
                                        </div>
                                        <div className="preview-item-content flex-grow py-2">
                                            <p className="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
                                            <p className="font-weight-light small-text"> The meeting is cancelled </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item">
                                        <div className="preview-thumbnail">
                                            <img src="{profile_pic}" alt="image" className="img-sm profile-pic" />
                                        </div>
                                        <div className="preview-item-content flex-grow py-2">
                                            <p className="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
                                            <p className="font-weight-light small-text"> The meeting is cancelled </p>
                                        </div>
                                    </a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link count-indicator" id="notificationDropdown" href="#" data-toggle="dropdown">
                                    <i className="mdi mdi-email-outline"></i>
                                    <span className="count bg-success">3</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="notificationDropdown">
                                    <a className="dropdown-item py-3 border-bottom">
                                        <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                                        <span className="badge badge-pill badge-primary float-right">View all</span>
                                    </a>
                                    <a className="dropdown-item preview-item py-3">
                                        <div className="preview-thumbnail">
                                            <i className="mdi mdi-alert m-auto text-primary"></i>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                                            <p className="font-weight-light small-text mb-0"> Just now </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item py-3">
                                        <div className="preview-thumbnail">
                                            <i className="mdi mdi-settings m-auto text-primary"></i>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                                            <p className="font-weight-light small-text mb-0"> Private message </p>
                                        </div>
                                    </a>
                                    <a className="dropdown-item preview-item py-3">
                                        <div className="preview-thumbnail">
                                            <i className="mdi mdi-airballoon m-auto text-primary"></i>
                                        </div>
                                        <div className="preview-item-content">
                                            <h6 className="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                                            <p className="font-weight-light small-text mb-0"> 2 days ago </p>
                                        </div>
                                    </a>
                                </div>
                            </li>
                            <li className="nav-item dropdown d-none d-xl-inline-block user-dropdown">
                                <a className="nav-link dropdown-toggle" id="UserDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                                    <img className="img-xs rounded-circle" src={profile_img} alt="Profile image" /> </a>
                                <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                                    <div className="dropdown-header text-center">
                                        <img className="img-md rounded-circle" src={profile_img} alt="Profile image" />
                                        <p className="mb-1 mt-3 font-weight-semibold">Allen Moreno</p>
                                        <p className="font-weight-light text-muted mb-0">allenmoreno@gmail.com</p>
                                    </div>
                                    <a className="dropdown-item">My Profile <span className="badge badge-pill badge-danger">1</span><i className="dropdown-item-icon ti-dashboard"></i></a>
                                    <a className="dropdown-item">Messages<i className="dropdown-item-icon ti-comment-alt"></i></a>
                                    <a className="dropdown-item">Activity<i className="dropdown-item-icon ti-location-arrow"></i></a>
                                    <a className="dropdown-item">FAQ<i className="dropdown-item-icon ti-help-alt"></i></a>
                                    <a className="dropdown-item">Sign Out<i className="dropdown-item-icon ti-power-off"></i></a>
                                </div>
                            </li>
                        </ul>
                        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                            <span className="mdi mdi-menu"></span>
                        </button>
                    </div>
                </nav>
    </>
  )
}

export default NavBar;
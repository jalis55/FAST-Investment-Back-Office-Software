import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserList from './pages/UserList';
import Default from './pages/Default';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './assets/css/portal.css';
// import '../public/assets/css/portal.css';
import Transactions from './pages/Transactions';
import PendingPayments from './pages/PendingPayments';
import Dashboard from './pages/Dashboard';
import InvesmentChartMonthWide from './components/InvesmentChartMonthWide';
import FundTransfer from './pages/FundTransfer';
import PackageForm from './pages/PackageForm';
import CreateProjectForm from './pages/CreateProjectForm';
import ProjectList from './pages/ProjectList';
import SearchProject from './pages/SearchProject';



const Logout = () => {
  localStorage.clear();
  // alert('Logged out successfully!');
  return <Navigate to="/login" />;
};

// Define the router with routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      // {
      //   index: true,  // This makes Default the default child for the '/' route
      //   path:"/overview",
      //   element: <Default />,
        
      // },
      {
        index: true,  // This makes Default the default child for the '/' route
        path:"/overview",
        element: <Dashboard />,
        
      },
      {
        path: "/users",
        element: <UserList />,
      },
      {
        path: "/create-project",
        element: <CreateProjectForm/>,
      },
      {
        path: "/project-list",
        element: <ProjectList/>,
      },
     
      {
        path: "/project-search",
        element: <SearchProject/>,
      },
      {
        path:"transactions",
        element:<Transactions/>,
      },
      {
        path:"/pending-payments",
        element:<PendingPayments/>
      },
      {
        path:"/fund-transfer",
        element:<FundTransfer/>
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  
  {
    path: '*',
    element: <NotFound />,
  },
]);



function App() {
  return (
    // Provide the router to the application
    <RouterProvider router={router} />
  );
}

export default App;

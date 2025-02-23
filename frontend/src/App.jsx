import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './layouts/Home/Home.jsx';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Transactions from './layouts/Transaction/Transactions.jsx';
import PendingPayments from './layouts/PendingPayments/PendingPayments.jsx';
import Dashboard from './layouts/Dashboard/Dashboard.jsx';
import UserList from './layouts/UserList/UserList.jsx';
import FundTransfer from './layouts/FundTransfer/FundTransfer.jsx';
import Projects from './layouts/Projects/Projects.jsx';
import Trade from './layouts/Trade/Trade.jsx';
import BuyInstrument from './layouts/Trade/BuyInstrument.jsx';
import SellInstrument from './layouts/Trade/SellInstrument.jsx';
import AddInvestment from './layouts/Investment/AddInvestment.jsx';
import ProjectDetails from './layouts/Projects/ProjectDetails.jsx';
import AccountReceivableDetails from './layouts/AccountReceivable/AccountReceivableDetails.jsx';
import AccountReceivableDetailsAson from './layouts/AccountReceivable/AccountReceivableDetailsAson.jsx';
import DisburseProfit from './layouts/AccountReceivable/DisburseProfit.jsx';



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
        index: true,  
        path:"/overview",
        element: <Dashboard />,
        
      },
      {
        path: "/users",
        element: <UserList />,
      },
      {
        path: "/new-project",
        element: <Projects />,
      },
      {
        path: "/project-details",
        element: <ProjectDetails/>,
      },
      {
        path:"/buy-instrument",
        element:<BuyInstrument/>,
      },
      {
        path:"/sell-instrument",
        element:<SellInstrument/>,
      },
      {
        path:"/acc-rcevable-details",
        element:<AccountReceivableDetails/>
      },
      {
        path:"/acc-rcevable-details-ason",
        element:<AccountReceivableDetailsAson/>
      },
      {
        path:"/acc-disburse-profit",
        element:<DisburseProfit/>
      },
      {
        path:"/transactions",
        element:<Transactions/>,
      },
      {
        path:"/add-investment",
        element:<AddInvestment/>
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

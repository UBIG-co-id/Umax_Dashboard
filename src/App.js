import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Accounts from './pages/Accounts';
import Clients from './pages/Clients';
import Login from './login/SignIn';
import Register from './login/SignUp';
import DataTable from './components/DataTable';
import UpdateClient from './update/UpdateClient';
import UpdateAccount from './update/UpdateAccount';
import UpdateCampaign from './update/UpdateCampaign';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/updatecampaigns/:_id" element={isAuthenticated ? <UpdateCampaign /> : <Navigate to="/login" />} />
        <Route path="/updateaccount/:_id" element={isAuthenticated ? <UpdateAccount /> : <Navigate to="/login" />} />
        <Route path="/updateclient/:_id" element={isAuthenticated ? <UpdateClient /> : <Navigate to="/login" />} />
        <Route path="/data" element={isAuthenticated ? <DataTable /> : <Navigate to="/login" />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/campaigns" element={isAuthenticated ? <Campaigns /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={isAuthenticated ? <Accounts /> : <Navigate to="/login" />} />
        <Route path="/clients" element={isAuthenticated ? <Clients /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

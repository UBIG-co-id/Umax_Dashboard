import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Accounts from './pages/Accounts';
import Clients from './pages/Clients';
import Login from './login/SignIn'
import Register from './login/SignUp'

import UpdateClient from './update/UpdateClient';
import UpdateAccount from './update/UpdateAccount';
import UpdateCampaign from './update/UpdateCampaign';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import AddClients from './add/AddClients'
import AddAccounts from './add/AddAccounts'
import AddCampaigns from './add/AddCampaigns';


const App = () => {
  return (

    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* END LOGIN */}

        {/* DASHBOARD */}
        <Route path='/Dashboard' element={<Dashboard />} />
        {/* END DASHBOARD */}

        {/*  CLIENT */}
        <Route path='/AddClient/' element={<AddClients />} />
        <Route path='/updateclient/:_id' element={<UpdateClient />} />
        <Route path='/Clients' element={<Clients />} />
        {/* END CLIENT */}

        {/* ACCOUNTS */}
        <Route path='/AddAccounts/' element={<AddAccounts />} />
        <Route path='/updateaccount/:_id' element={<UpdateAccount />} />
        <Route path='/Accounts' element={<Accounts />} />
        {/* END ACCOUNTS */}

        {/* CAMPAIGNS */}
        <Route path='/AddCampaigns/' element={<AddCampaigns />} />
        <Route path='/updatecampaigns/:_id' element={<UpdateCampaign />} />
        <Route path='/Campaigns' element={<Campaigns />} />
        {/* END CAMPAIGNS */}

        <Route path='/Profile' element={<Profile />} />
        <Route path='/EditProfile' element={<EditProfile />} />
      </Routes>
    </Router>

  )
};


export default App;

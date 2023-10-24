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
import AddCampaigns from './add/AddCampaigns'

import useTheme from "./hooks/useTheme";



const App = () => {
const theme = useTheme()
  return (

    <Router>
      <Routes>

        <Route path='/updatecampaigns/:_id' element={<UpdateCampaign/>}/>
        <Route path='/updateaccount/:_id' element={<UpdateAccount/>}/>
        <Route path='/updateclient/:_id' element={<UpdateClient/>}/>
        <Route path='/AddClients' element={<AddClients/>}/>
        <Route path='/AddAccounts' element={<AddAccounts/>}/>
        <Route path='/AddCampaigns' element={<AddCampaigns/>}/>
        {/* <Route path='/data' element={<DataTable/>}/> */}
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/> }  />
        <Route path='/Campaigns' element={<Campaigns/> }  />
        <Route path='/Accounts' element={<Accounts/> }  />
        <Route path='/Clients' element={<Clients/> }  />
        <Route path='/Profile' element={<Profile/> }  />
        <Route path='/EditProfile' element={<EditProfile/> }  />

      </Routes>
    </Router>

  )
};


export default App;

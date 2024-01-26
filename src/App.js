import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Accounts from './pages/Accounts';
import Clients from './pages/Clients';
import Staff from './pages/Staff';
import Login from './login/SignIn'
import Register from './login/SignUp'
import UpdateClient from './update/UpdateClient';
import UpdateAccount from './update/UpdateAccount';
import UpdateCampaign from './update/UpdateCampaign';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import AddClients from './add/AddClients'
import AddAccounts from './add/AddAccounts';
import AddCampaigns from './add/AddCampaigns'
import useTheme from './hooks/useTheme';
import Tenant from './tenant/tenant';
import UsersTable from './components/UserTable';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


const App = () => {
const theme = useTheme()
  return (

    <Router>
      <Routes>

        <Route path='/Staff' element={<Staff/>} />
        {/* <Route path='/Client' element={<Client/>} />8 */}
        <Route path='/updatecampaigns/:_id' element={<UpdateCampaign/>}/>
        <Route path='/updateaccount/:_id' element={<UpdateAccount/>}/>
        <Route path='/updateclient/:_id' element={<UpdateClient/>}/>
        <Route path='/AddClients' element={<AddClients/>}/>
        <Route path='/AddAccounts' element={<AddAccounts/>}/>
        <Route path='/AddCampaigns' element={<AddCampaigns/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/> }  />
        <Route path='/Campaigns' element={<Campaigns/> }  />
        <Route path='/Accounts' element={<Accounts/> }  />
        <Route path='/Clients' element={<Clients/> }  />
        <Route path='/Profile' element={<Profile/> }  />
        <Route path='/EditProfile' element={<EditProfile />} />
        <Route path='/Tenant' element={<Tenant />} />
        <Route path='/UsersTable' element={<UsersTable />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/ResetPassword' element={<ResetPassword/>} />
        

      </Routes>
    </Router>

  )
};


export default App;

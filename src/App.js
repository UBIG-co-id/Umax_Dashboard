import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import Dashboard  from './pages/Dashboard';
import Campaigns  from './pages/Campaigns';
import Accounts  from './pages/Accounts';
import Clients  from './pages/Clients';
import Login from './login/SignIn'
import Register from './login/SignUp'
import DataTable from './components/DataTable';
import UpdateClient from './update/UpdateClient'; 
import UpdateAccount from './update/UpdateAccount';
import UpdateCampaign from './update/UpdateCampaign';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import History from './components/History';


const App = () => {
  return ( 
    
    <Router>
      <Routes>
        <Route path='/updatecampaigns/:_id' element={<UpdateCampaign/>}/>
        <Route path='/updateaccount/:_id' element={<UpdateAccount/>}/>
        <Route path='/updateclient/:_id' element={<UpdateClient/>}/>
        <Route path='/data' element={<DataTable/>}/>
        <Route path='/History' element={<History/>}/>
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

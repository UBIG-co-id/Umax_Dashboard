import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import Dashboard  from './pages/Dashboard';
import Campaigns  from './pages/Campaigns';
import Accounts  from './pages/Accounts';
import Clients  from './pages/Clients';
import Login from './login/SignIn'
import Register from './login/SignUp'



const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/> }  />
        <Route path='/Campaigns' element={<Campaigns/> }  />
        <Route path='/Accounts' element={<Accounts/> }  />
        <Route path='/Clients' element={<Clients/> }  />
      </Routes>
    </Router>
    
    )
};


export default App;

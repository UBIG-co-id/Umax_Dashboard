import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import Dashboard  from './pages/Dashboard';
import Campaigns  from './pages/Campaigns';
import Accounts  from './pages/Accounts';
import Clients  from './pages/Clients';



const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path='/Dashboard' element={<Dashboard/> }  />
        <Route path='/Campaigns' element={<Campaigns/> }  />
        <Route path='/Accounts' element={<Accounts/> }  />
        <Route path='/Clients' element={<Clients/> }  />
      </Routes>
    </Router>
    
    )
};


export default App;

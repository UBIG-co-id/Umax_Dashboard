import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import Dashboard  from './pages/Dashboard';
import Campaigns  from './pages/Campaigns';



const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path='/Dashboard' element={<Dashboard/> }  />
        <Route path='/Campaigns' element={<Campaigns/> }  />
      </Routes>
    </Router>
    
    )
};


export default App;

import React from 'react';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';

  

const Campaigns = () => {
    return (
        <main className='bg-slate-100 min-h-screen'>
        <div>
        <Navbar />
        <DataTable />
        </div>
        </main>
      );
 
}

export default Campaigns
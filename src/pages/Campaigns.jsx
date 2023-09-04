import React from 'react';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';

  

const Campaigns = () => {
    return (
        <main className='bg-slate-100 min-h-screen'>
        <div>
        <Navbar />
        <div className='bg-white h-screen w-auto m-2 border rounded-lg'>
          <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Campaigns</span>
        <DataTable />

        </div>

        </div>
        </main>
      );
 
}

export default Campaigns
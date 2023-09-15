import React from "react";
import Navbar from "../components/Navbar";
import CampaignTable from "../components/CampaignTable";

const Campaigns = () => {
  return (
    <main className="bg-slate-100 min-h-screen">
      <div>
        <Navbar />
        <div className="bg-white min-h-[100vh] w-auto m-2 border rounded-lg">
          <span className="p-10 relative top-4 text-gray-600 font-medium text-2xl">
            Campaigns
          </span>
          <CampaignTable />
        </div>
        
      </div>
      
    </main>
  );
};

export default Campaigns;

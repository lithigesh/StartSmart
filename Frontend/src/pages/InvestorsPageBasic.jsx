import React from "react";
import { FaUser } from "react-icons/fa";

const InvestorsPageBasic = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Investors Page - Basic Test</h1>
      <p className="mt-4">Testing without useNotifications hook.</p>
      <FaUser className="text-2xl mt-4" />
    </div>
  );
};

export default InvestorsPageBasic;
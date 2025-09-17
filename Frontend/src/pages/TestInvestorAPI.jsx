// Test file to check if investorAPI import works
import { investorAPI } from "../services/api";

console.log("investorAPI imported successfully:", investorAPI);

const TestInvestorAPI = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Testing investorAPI Import</h1>
      <p className="mt-4">If you see this, investorAPI import works.</p>
    </div>
  );
};

export default TestInvestorAPI;
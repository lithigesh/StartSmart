// pages/entrepreneur/MyIdeasPage.jsx
import React from "react";
import MyIdeasSection from "../../components/entrepreneur/MyIdeasSection";

const MyIdeasPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            My Ideas
          </h2>
          <p className="text-white/60">
            Manage and track your startup ideas
          </p>
        </div>
        <MyIdeasSection showTitle={false} />
      </div>
    </div>
  );
};

export default MyIdeasPage;
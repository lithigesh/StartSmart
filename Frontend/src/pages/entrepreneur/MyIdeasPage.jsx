// pages/entrepreneur/MyIdeasPage.jsx
import React from "react";
import MyIdeasSection from "../../components/entrepreneur/MyIdeasSection";

const MyIdeasPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-white mb-1 sm:mb-2">
            My Ideas
          </h2>
          <p className="text-sm sm:text-base text-white/60 font-manrope">
            Manage and track your startup ideas
          </p>
        </div>
        <MyIdeasSection showTitle={false} />
      </div>
    </div>
  );
};

export default MyIdeasPage;
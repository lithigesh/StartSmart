import React from "react";
import LoadingSpinner from "../LoadingSpinner";

const InvestorLoadingSpinner = ({ message = "Loading dashboard..." }) => {
  return <LoadingSpinner fullScreen message={message} />;
};

export default InvestorLoadingSpinner;

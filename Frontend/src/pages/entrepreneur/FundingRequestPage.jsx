import React from "react";
import { useNavigate } from "react-router-dom";
import FundingRequestForm from "../../components/entrepreneur/FundingRequestForm";
import toast from "react-hot-toast";

const FundingRequestPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("Funding request submitted successfully!", {
      duration: 3000,
      position: "bottom-right",
      style: {
        background: "rgba(16, 185, 129, 0.9)",
        color: "#fff",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      icon: "✓",
    });

    setTimeout(() => {
      navigate("/entrepreneur/funding");
    }, 1500);
  };

  const handleClose = () => {
    navigate("/entrepreneur/funding");
  };

  return (
    <FundingRequestForm
      isOpen={true}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default FundingRequestPage;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FundingRequestForm from "../../components/entrepreneur/FundingRequestForm";
import toast from "react-hot-toast";
import { fundingAPI } from "../../services/api";

const FundingRequestPage = ({ isEditMode = false, isViewMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fundingData, setFundingData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode || isViewMode);

  // Load funding request data if in edit or view mode
  useEffect(() => {
    if ((isEditMode || isViewMode) && id) {
      const loadFundingData = async () => {
        try {
          setIsLoading(true);
          const response = await fundingAPI.getFundingRequestById(id);
          if (response?.success && response.data) {
            setFundingData(response.data);
          } else {
            toast.error("Failed to load funding request");
            navigate("/entrepreneur/funding");
          }
        } catch (error) {
          console.error("Error loading funding request:", error);
          toast.error("Error loading funding request");
          navigate("/entrepreneur/funding");
        } finally {
          setIsLoading(false);
        }
      };
      loadFundingData();
    }
  }, [id, isEditMode, isViewMode, navigate]);

  const handleSuccess = () => {
    const message = isEditMode
      ? "Funding request updated successfully!"
      : "Funding request submitted successfully!";

    toast.success(message, {
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
    });

    setTimeout(() => {
      navigate("/entrepreneur/funding");
    }, 1500);
  };

  const handleClose = () => {
    navigate("/entrepreneur/funding");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-white/20 border-t-white rounded-full mb-4"></div>
          <p className="text-white/70">Loading funding request...</p>
        </div>
      </div>
    );
  }

  return (
    <FundingRequestForm
      isOpen={true}
      onClose={handleClose}
      onSuccess={handleSuccess}
      isEditMode={isEditMode}
      isViewMode={isViewMode}
      initialData={fundingData}
      fundingRequestId={id}
    />
  );
};

export default FundingRequestPage;

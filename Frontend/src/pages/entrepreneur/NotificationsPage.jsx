// pages/entrepreneur/NotificationsPage.jsx
import React from "react";
import NotificationsPopup from "../../components/entrepreneur/NotificationsPopup";

const NotificationsPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Notifications
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Stay updated with the latest activities
          </p>
        </div>
        <NotificationsPopup
          showNotifications={true}
          setShowNotifications={() => {}}
          isFullPage={true}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
import React from "react";
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const ContactModal = ({ isOpen, onClose, fundingRequest, user }) => {
  if (!isOpen || !fundingRequest) return null;

  const getInvestorEmail = (investor) =>
    investor?.email || investor?.contactEmail || "";
  const getInvestorPhone = (investor) =>
    investor?.phone || investor?.contactPhone || "";

  const isSameUser = (a, b) => {
    if (!a || !b) return false;
    const aId = a._id || a.id;
    const bId = b._id || b.id;
    if (aId && bId && String(aId) === String(bId)) return true;
    const aEmail = (a.email || a.contactEmail || "").toLowerCase();
    const bEmail = (b.email || b.contactEmail || "").toLowerCase();
    return Boolean(aEmail && bEmail && aEmail === bEmail);
  };

  const shouldTreatAsInvestor = (person) => {
    if (!person) return false;
    // If role is available, enforce it
    if (person.role) return person.role === "investor";
    // Otherwise, just make sure it's not the entrepreneur/current user
    if (isSameUser(person, user)) return false;
    if (isSameUser(person, fundingRequest.entrepreneur)) return false;
    return true;
  };

  const acceptedInvestorFromResponses =
    fundingRequest.investorResponses?.find((r) => r.status === "accepted")
      ?.investor || null;

  const acceptedInvestorFromNegotiation =
    fundingRequest.status === "accepted"
      ? (fundingRequest.negotiationHistory || [])
          .slice()
          .reverse()
          .find(
            (h) =>
              h?.investor &&
              typeof h?.message === "string" &&
              h.message.toLowerCase().includes("accepted")
          )?.investor || null
      : null;

  const acceptedByValue = fundingRequest.acceptedBy;
  const acceptedInvestorFromAcceptedById =
    typeof acceptedByValue === "string"
      ? fundingRequest.investorResponses?.find(
          (r) =>
            r?.investor &&
            (r.investor?._id === acceptedByValue ||
              r.investor?.id === acceptedByValue)
        )?.investor || null
      : null;

  const acceptedInvestor =
    (acceptedByValue && typeof acceptedByValue === "object"
      ? acceptedByValue
      : null) ||
    acceptedInvestorFromAcceptedById ||
    acceptedInvestorFromResponses ||
    acceptedInvestorFromNegotiation;

  const investorContacts = (() => {
    const contacts = [];

    const addContact = (investor, status) => {
      if (!investor) return;
      if (!shouldTreatAsInvestor(investor)) return;

      const email = getInvestorEmail(investor);
      const key = investor?._id || investor?.id || email;
      const alreadyAdded = contacts.some((c) => {
        const cEmail = getInvestorEmail(c.investor);
        const cKey = c.investor?._id || c.investor?.id || cEmail;
        return cKey && key && cKey === key;
      });

      if (!alreadyAdded) {
        contacts.push({ investor, status });
      }
    };

    if (acceptedInvestor) addContact(acceptedInvestor, "accepted");

    (fundingRequest.investorResponses || [])
      .filter(
        (r) =>
          r?.investor &&
          (r.status === "interested" ||
            r.status === "accepted" ||
            r.status === "negotiated")
      )
      .forEach((r) => {
        addContact(r.investor, r.status);
      });

    // Fallback: include investors from negotiation history (details endpoint populates these)
    (fundingRequest.negotiationHistory || [])
      .filter((h) => h?.investor)
      .forEach((h) => {
        addContact(h.investor, "negotiated");
      });

    return contacts;
  })();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/20 rounded-2xl overflow-hidden shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/600/10 to-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            <p className="text-white/60 mt-1 text-sm">
              {fundingRequest.idea?.title || "Funding Request"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Investor Contact(s) */}
          {investorContacts.length > 0 ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-white/90" />
                Investor Contact Information
              </h3>
              <div className="space-y-4">
                {investorContacts.map((contact, index) => {
                  const investor = contact.investor;
                  const email = getInvestorEmail(investor);
                  const phone = getInvestorPhone(investor);

                  return (
                    <div
                      key={investor?._id || investor?.id || email || index}
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-white/500 to-white rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {(investor?.name || "I").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">
                          {investor?.name || "Investor"}
                        </p>
                        {email && (
                          <div className="flex items-center gap-2 mt-1">
                            <FaEnvelope className="w-4 h-4 text-white/40" />
                            <p className="text-white/60 text-sm truncate">
                              {email}
                            </p>
                          </div>
                        )}
                        {phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <FaPhone className="w-4 h-4 text-white/40" />
                            <p className="text-white/60 text-sm truncate">
                              {phone}
                            </p>
                          </div>
                        )}
                        {contact.status === "accepted" && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white/10/20 text-white/90 px-2 py-1 rounded">
                            <FaCheckCircle className="w-3 h-3" />
                            Accepted
                          </span>
                        )}
                      </div>
                      {email && (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Regarding ${
                            fundingRequest.idea?.title || "Funding Request"
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FaEnvelope className="w-4 h-4" />
                          Email
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
              <FaUsers className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 font-medium mb-1">
                Investor contact not available yet
              </p>
              <p className="text-white/40 text-sm">
                Contact details will appear once an investor accepts or shares contact information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;


import { useEffect, useState } from "react";
import {
  getContactMessages,
  deleteContactMessage,
} from "../../services/cafeService";

const ContactManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.Message ||
        err.message ||
        "Failed to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    const datePart = date.split("T")[0];
    const [year, month, day] = datePart.split("-");

    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteContactMessage(id);

      setSuccess("Contact message deleted successfully!");

      await fetchMessages();
    } catch (err) {
      setError(
        err.response?.data?.Message ||
        err.message ||
        "Failed to delete contact message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const viewedCount = messages.filter(
    (item) => item.IsViewed === 1 || item.IsViewed === true
  ).length;

  const notViewedCount = messages.length - viewedCount;

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #eee7e1",
    flex: "1",
    minWidth: "180px",
  };

  const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    backgroundColor: "#79543b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px 16px",
    borderBottom: "1px solid #eee7e1",
    color: "#51443c",
    fontSize: "13px",
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        padding: "25px",
        marginTop: "30px",
        backgroundColor: "#f8f5f1",
        minHeight: "100vh",
      }}
    >
      {/* Page Heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#34251e",
              fontSize: "25px",
              margin: "0 0 8px",
            }}
          >
            Contact Message Management
          </h2>

          <p style={{ color: "#8a786c", margin: 0, fontSize: "14px" }}>
            View and manage messages submitted by customers.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          style={{
            backgroundColor: "#79543b",
            color: "#ffffff",
            border: "none",
            borderRadius: "7px",
            padding: "11px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontWeight: "600",
          }}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div
          style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "12px 16px",
            borderRadius: "7px",
            marginBottom: "18px",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fdecea",
            color: "#c62828",
            padding: "12px 16px",
            borderRadius: "7px",
            marginBottom: "18px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <p style={{ color: "#8a786c", fontSize: "14px", margin: "0 0 10px" }}>
            Total Messages
          </p>
          <h2 style={{ color: "#79543b", fontSize: "28px", margin: 0 }}>
            {messages.length}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#8a786c", fontSize: "14px", margin: "0 0 10px" }}>
            Viewed Messages
          </p>
          <h2 style={{ color: "#2e7d32", fontSize: "28px", margin: 0 }}>
            {viewedCount}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#8a786c", fontSize: "14px", margin: "0 0 10px" }}>
            Not Viewed
          </p>
          <h2 style={{ color: "#c17b24", fontSize: "28px", margin: 0 }}>
            {notViewedCount}
          </h2>
        </div>
      </div>

      {/* Contact Messages Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "22px",
          border: "1px solid #eee7e1",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <h3 style={{ color: "#34251e", margin: 0, fontSize: "18px" }}>
            Customer Messages
          </h3>

          <span style={{ color: "#8a786c", fontSize: "13px" }}>
            {messages.length} records
          </span>
        </div>

        {loading ? (
          <p style={{ color: "#79543b", padding: "20px 0" }}>
            Loading contact messages...
          </p>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "45px 15px",
              color: "#8a786c",
              backgroundColor: "#faf8f6",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#79543b" }}>No Messages Found</h3>
            <p style={{ fontSize: "14px" }}>
              Customer contact messages will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: "950px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Customer Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Message</th>
                  <th style={thStyle}>Viewed Status</th>
                  <th style={thStyle}>Created On</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((item) => {
                  const isViewed =
                    item.IsViewed === 1 || item.IsViewed === true;

                  return (
                    <tr key={item.Id}>
                      <td style={tdStyle}>{item.Id}</td>

                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: "600",
                          color: "#34251e",
                        }}
                      >
                        {item.Name || "-"}
                      </td>

                      <td style={tdStyle}>{item.Email || "-"}</td>

                      <td
                        style={{
                          ...tdStyle,
                          maxWidth: "280px",
                          whiteSpace: "normal",
                          lineHeight: "1.6",
                        }}
                      >
                        {item.Message || "-"}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 11px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: isViewed ? "#e8f5e9" : "#fff3e0",
                            color: isViewed ? "#2e7d32" : "#c17b24",
                          }}
                        >
                          {isViewed ? "Viewed" : "Not Viewed"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {formatDate(item.CreatedOn)}
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(item.Id)}
                          disabled={deletingId === item.Id}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 13px",
                            cursor:
                              deletingId === item.Id
                                ? "not-allowed"
                                : "pointer",
                            opacity: deletingId === item.Id ? 0.6 : 1,
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {deletingId === item.Id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;

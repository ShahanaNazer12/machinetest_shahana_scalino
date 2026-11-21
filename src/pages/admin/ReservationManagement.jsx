
import { useEffect, useState } from "react";
import {
  getReservations,
  deleteReservation,
} from "../../services/cafeService";

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.Message ||
        err.message ||
        "Failed to load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    const datePart = date.split("T")[0];
    const [year, month, day] = datePart.split("-");

    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteReservation(id);

      setMessage("Reservation deleted successfully!");
      await fetchReservations();
    } catch (err) {
      setError(
        err.response?.data?.Message ||
        err.message ||
        "Failed to delete reservation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #eee7e1",
    flex: "1",
    minWidth: "180px",
  };

  const headingStyle = {
    color: "#34251e",
    fontSize: "14px",
    marginBottom: "10px",
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
            Reservation Management
          </h2>

          <p style={{ color: "#8a786c", margin: 0, fontSize: "14px" }}>
            View and manage customer table reservations.
          </p>
        </div>

        <button
          onClick={fetchReservations}
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
      {message && (
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
          {message}
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

      {/* Summary Card */}
      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <p style={headingStyle}>Total Reservations</p>
          <h2 style={{ color: "#79543b", margin: 0, fontSize: "28px" }}>
            {reservations.length}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={headingStyle}>Total Guests</p>
          <h2 style={{ color: "#79543b", margin: 0, fontSize: "28px" }}>
            {reservations.reduce(
              (total, item) => total + (Number(item.BookingCount) || 0),
              0
            )}
          </h2>
        </div>
      </div>

      {/* Reservations Table */}
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
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h3 style={{ color: "#34251e", margin: 0, fontSize: "18px" }}>
            Customer Reservations
          </h3>

          <span style={{ color: "#8a786c", fontSize: "13px" }}>
            {reservations.length} records
          </span>
        </div>

        {loading ? (
          <p style={{ color: "#79543b", padding: "20px 0" }}>
            Loading reservations...
          </p>
        ) : reservations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "45px 15px",
              color: "#8a786c",
              backgroundColor: "#faf8f6",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#79543b" }}>No Reservations Found</h3>
            <p style={{ fontSize: "14px" }}>
              Customer reservations will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: "1050px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Customer Name</th>
                  <th style={thStyle}>Phone Number</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Guests</th>
                  <th style={thStyle}>Comment</th>
                  <th style={thStyle}>Created On</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.Id}>
                    <td style={tdStyle}>{reservation.Id}</td>

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "600",
                        color: "#34251e",
                      }}
                    >
                      {reservation.FullName || "-"}
                    </td>

                    <td style={tdStyle}>{reservation.PhoneNo || "-"}</td>

                    <td style={tdStyle}>
                      {formatDate(reservation.Date)}
                    </td>

                    <td style={tdStyle}>{reservation.Time || "-"}</td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          backgroundColor: "#f3ebe4",
                          color: "#79543b",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontWeight: "600",
                        }}
                      >
                        {reservation.BookingCount ?? "-"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: "180px",
                        whiteSpace: "normal",
                      }}
                    >
                      {reservation.Comment || "-"}
                    </td>

                    <td style={tdStyle}>
                      {formatDate(reservation.CreatedOn)}
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(reservation.Id)}
                        disabled={deletingId === reservation.Id}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 13px",
                          cursor:
                            deletingId === reservation.Id
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            deletingId === reservation.Id ? 0.6 : 1,
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {deletingId === reservation.Id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;

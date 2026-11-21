
import { useEffect, useState } from "react";
import {
  getOpeningHours,
  insertOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
} from "../../services/cafeService";

const initialForm = {
  Id: 0,
  DayRange: "",
  TimeRange: "",
  IsClosed: false,
};

const styles = {
  page: {
    padding: "28px",
    color: "#34251e",
  },
  eyebrow: {
    color: "#98765c",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "27px",
    fontWeight: "700",
    margin: "5px 0",
  },
  subtitle: {
    color: "#8a7b72",
    fontSize: "14px",
    marginBottom: "25px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "16px",
    marginBottom: "25px",
  },
  summaryCard: {
    background: "#fff",
    border: "1px solid #eee7e1",
    borderRadius: "12px",
    padding: "20px",
  },
  cardLabel: {
    color: "#8a7b72",
    fontSize: "13px",
    marginBottom: "8px",
  },
  cardNumber: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#79543b",
  },
  section: {
    background: "#fff",
    border: "1px solid #eee7e1",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "25px",
  },
  sectionTitle: {
    fontSize: "19px",
    fontWeight: "700",
    margin: "0 0 5px",
  },
  sectionSubtitle: {
    color: "#8a7b72",
    fontSize: "13px",
    marginBottom: "22px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#59463a",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #e5ddd6",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
    color: "#34251e",
  },
  primaryButton: {
    background: "#79543b",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryButton: {
    background: "#f3eee9",
    color: "#59463a",
    border: "1px solid #e5ddd6",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "650px",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    background: "#f8f5f1",
    color: "#6b5546",
    textAlign: "left",
    padding: "14px 12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #eee7e1",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #f0ebe6",
    color: "#59463a",
    verticalAlign: "middle",
  },
};

function OpeningHoursManagement() {
  const [openingHours, setOpeningHours] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOpeningHours = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOpeningHours();
      setOpeningHours(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load opening hours.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.DayRange.trim()) {
      setError("Please enter a day or day range.");
      return;
    }

    if (!formData.IsClosed && !formData.TimeRange.trim()) {
      setError("Please enter the opening hours.");
      return;
    }

    const openingHourData = {
      Id: editing ? Number(formData.Id) : 0,
      DayRange: formData.DayRange.trim(),
      TimeRange: formData.IsClosed
        ? "Closed"
        : formData.TimeRange.trim(),
      IsClosed: Boolean(formData.IsClosed),
    };

    try {
      setSaving(true);

      if (editing) {
        await updateOpeningHour(openingHourData);
        setMessage("Opening hours updated successfully!");
      } else {
        await insertOpeningHour(openingHourData);
        setMessage("Opening hours added successfully!");
      }

      resetForm();
      await fetchOpeningHours();
    } catch (err) {
      setError(err.message || "Unable to save opening hours.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (hour) => {
    setFormData({
      Id: hour.Id,
      DayRange: hour.DayRange || "",
      TimeRange: hour.TimeRange || "",
      IsClosed: hour.IsClosed === true || hour.IsClosed === 1,
    });

    setEditing(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete these opening hours?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteOpeningHour(id);

      if (Number(formData.Id) === Number(id)) {
        resetForm();
      }

      setMessage("Opening hours deleted successfully!");
      await fetchOpeningHours();
    } catch (err) {
      setError(err.message || "Unable to delete opening hours.");
    }
  };

  const closedCount = openingHours.filter(
    (hour) => hour.IsClosed === true || hour.IsClosed === 1
  ).length;

  const openCount = openingHours.length - closedCount;

  return (
    <section style={styles.page}>
      <div style={styles.eyebrow}>Café Administration</div>

      <h2 style={styles.heading}>Opening Hours Management</h2>

      <p style={styles.subtitle}>
        Manage your café's weekly schedule and business hours.
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Total Schedules</div>
          <div style={styles.cardNumber}>{openingHours.length}</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Open Schedules</div>
          <div style={styles.cardNumber}>{openCount}</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Closed Schedules</div>
          <div style={styles.cardNumber}>{closedCount}</div>
        </div>
      </div>

      {message && (
        <div
          style={{
            background: "#edf7ee",
            color: "#28743b",
            padding: "13px 16px",
            borderRadius: "8px",
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
            background: "#fff0ed",
            color: "#bd4435",
            padding: "13px 16px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          {editing ? "Edit Opening Hours" : "Add New Opening Hours"}
        </h3>

        <p style={styles.sectionSubtitle}>
          {editing
            ? "Update the selected schedule."
            : "Enter the days and timings for your café."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Day / Day Range *</label>
              <input
                style={styles.input}
                name="DayRange"
                value={formData.DayRange}
                onChange={handleChange}
                placeholder="Example: Monday - Friday"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Time Range</label>
              <input
                style={{
                  ...styles.input,
                  background: formData.IsClosed ? "#f3eee9" : "#fff",
                  cursor: formData.IsClosed ? "not-allowed" : "text",
                }}
                name="TimeRange"
                value={formData.IsClosed ? "Closed" : formData.TimeRange}
                onChange={handleChange}
                placeholder="Example: 9:00 AM - 6:00 PM"
                disabled={formData.IsClosed}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginTop: "20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#59463a",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="IsClosed"
              checked={formData.IsClosed}
              onChange={handleChange}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#79543b",
              }}
            />
            Mark as closed
          </label>

          <p
            style={{
              color: "#8a7b72",
              fontSize: "12px",
              marginTop: "8px",
            }}
          >
            Select this option if the café is closed on the selected day.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "22px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.primaryButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update Opening Hours"
                  : "Add Opening Hours"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                style={styles.secondaryButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Existing Opening Hours</h3>

        <p style={styles.sectionSubtitle}>
          View and manage your café's weekly schedule.
        </p>

        {loading ? (
          <p style={{ color: "#8a7b72", padding: "20px 0" }}>
            Loading opening hours...
          </p>
        ) : openingHours.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 15px",
              color: "#8a7b72",
              background: "#faf8f6",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>🕒</div>
            <strong>No opening hours found</strong>
            <p style={{ fontSize: "13px" }}>
              Add your café's schedule using the form above.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "ID",
                    "Day / Day Range",
                    "Time Range",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={styles.th}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {openingHours.map((hour) => {
                  const isClosed =
                    hour.IsClosed === true || hour.IsClosed === 1;

                  return (
                    <tr key={hour.Id}>
                      <td style={styles.td}>{hour.Id}</td>

                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {hour.DayRange}
                      </td>

                      <td style={styles.td}>
                        {isClosed ? "Closed" : hour.TimeRange}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 11px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                            background: isClosed ? "#f5eeee" : "#eaf5eb",
                            color: isClosed ? "#a15b5b" : "#39804a",
                          }}
                        >
                          {isClosed ? "Closed" : "Open"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(hour)}
                            style={{
                              background: "#f3eee9",
                              color: "#79543b",
                              border: "none",
                              borderRadius: "6px",
                              padding: "7px 12px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(hour.Id)}
                            style={{
                              background: "#fff0ed",
                              color: "#bd4435",
                              border: "none",
                              borderRadius: "6px",
                              padding: "7px 12px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default OpeningHoursManagement;

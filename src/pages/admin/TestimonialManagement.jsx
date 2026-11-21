
import { useEffect, useState } from "react";
import {
  getTestimonials,
  insertTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/cafeService";

const initialForm = {
  Id: 0,
  CustomerName: "",
  Description: "",
  Rating: 10,
  Base64CustomerImage: "",
  CustomerImageFileName: "",
  CustomerExistingImagePath: "",
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
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #e5ddd6",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    minHeight: "105px",
    resize: "vertical",
    fontFamily: "inherit",
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
    minWidth: "850px",
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

function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTestimonials();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
  };

  const resetForm = () => {
    setFormData(initialForm);
    setImageFile(null);
    setEditing(false);

    const fileInput = document.getElementById("testimonial-image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.CustomerName.trim() ||
      !formData.Description.trim()
    ) {
      setError("Customer name and description are required.");
      return;
    }

    const rating = Number(formData.Rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a whole number between 1 and 10.");
      return;
    }

    try {
      setSaving(true);

      let base64Image = "";

      if (imageFile) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            const result = reader.result;
            resolve(String(result).split(",")[1] || "");
          };

          reader.onerror = () => {
            reject(new Error("Unable to read image."));
          };

          reader.readAsDataURL(imageFile);
        });
      }

      const testimonialData = {
        Id: editing ? Number(formData.Id) : 0,
        CustomerName: formData.CustomerName.trim(),
        Description: formData.Description.trim(),
        Rating: rating,
        Base64CustomerImage: base64Image,
        CustomerImageFileName: imageFile ? imageFile.name : "",
        CustomerExistingImagePath: editing
          ? formData.CustomerExistingImagePath
          : "",
      };

      if (editing) {
        await updateTestimonial(testimonialData);
        setMessage("Testimonial updated successfully!");
      } else {
        await insertTestimonial(testimonialData);
        setMessage("Testimonial added successfully!");
      }

      resetForm();
      await fetchTestimonials();
    } catch (err) {
      setError(err.message || "Unable to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      Id: testimonial.Id,
      CustomerName: testimonial.CustomerName || "",
      Description: testimonial.Description || "",
      Rating: testimonial.Rating ?? 10,
      Base64CustomerImage: "",
      CustomerImageFileName: "",
      CustomerExistingImagePath:
        testimonial.CustomerImagePath || "",
    });

    setImageFile(null);
    setEditing(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteTestimonial(id);

      if (Number(formData.Id) === Number(id)) {
        resetForm();
      }

      setMessage("Testimonial deleted successfully!");
      await fetchTestimonials();
    } catch (err) {
      setError(err.message || "Unable to delete testimonial.");
    }
  };

  const averageRating = testimonials.length
    ? (
        testimonials.reduce(
          (total, item) => total + Number(item.Rating || 0),
          0
        ) / testimonials.length
      ).toFixed(1)
    : "0.0";

  return (
    <section style={styles.page}>
      <div style={styles.eyebrow}>Café Administration</div>

      <h2 style={styles.heading}>Testimonial Management</h2>

      <p style={styles.subtitle}>
        Manage customer feedback, ratings and testimonials.
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Total Testimonials</div>
          <div style={styles.cardNumber}>{testimonials.length}</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Average Rating</div>
          <div style={styles.cardNumber}>
            {averageRating} / 10
          </div>
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
          {editing ? "Edit Testimonial" : "Add New Testimonial"}
        </h3>

        <p style={styles.sectionSubtitle}>
          {editing
            ? "Update the customer's feedback and rating."
            : "Add customer feedback to display on your café website."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Customer Name *</label>
              <input
                style={styles.input}
                name="CustomerName"
                value={formData.CustomerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Rating (1–10) *</label>
              <input
                style={styles.input}
                type="number"
                name="Rating"
                value={formData.Rating}
                onChange={handleChange}
                min="1"
                max="10"
                step="1"
                required
              />
              <span style={{ color: "#8a7b72", fontSize: "12px" }}>
                Enter a whole number between 1 and 10.
              </span>
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Customer Feedback *</label>
              <textarea
                style={styles.textarea}
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder="Enter the customer's testimonial"
                required
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>
                Customer Image (Optional, max 2 MB)
              </label>

              <div
                style={{
                  border: "1px dashed #cdbbaa",
                  borderRadius: "10px",
                  padding: "18px",
                  background: "#faf8f6",
                }}
              >
                <input
                  id="testimonial-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ fontSize: "13px", maxWidth: "100%" }}
                />

                <p
                  style={{
                    color: "#8a7b72",
                    fontSize: "12px",
                    margin: "9px 0 0",
                  }}
                >
                  Supported image formats. Maximum file size: 2 MB.
                </p>

                {imageFile && (
                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected customer"
                      style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          margin: "0 0 4px",
                        }}
                      >
                        {imageFile.name}
                      </p>
                      <span style={{ fontSize: "12px", color: "#8a7b72" }}>
                        Selected image
                      </span>
                    </div>
                  </div>
                )}

                {!imageFile &&
                  editing &&
                  formData.CustomerExistingImagePath && (
                    <p
                      style={{
                        color: "#79543b",
                        fontSize: "13px",
                        marginTop: "12px",
                      }}
                    >
                      Current image: {formData.CustomerExistingImagePath}
                    </p>
                  )}
              </div>
            </div>
          </div>

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
                  ? "Update Testimonial"
                  : "Add Testimonial"}
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
        <h3 style={styles.sectionTitle}>Existing Testimonials</h3>

        <p style={styles.sectionSubtitle}>
          View and manage customer testimonials.
        </p>

        {loading ? (
          <p style={{ color: "#8a7b72", padding: "20px 0" }}>
            Loading testimonials...
          </p>
        ) : testimonials.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 15px",
              color: "#8a7b72",
              background: "#faf8f6",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>💬</div>
            <strong>No testimonials found</strong>
            <p style={{ fontSize: "13px" }}>
              Add your first customer testimonial using the form above.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "ID",
                    "Customer",
                    "Feedback",
                    "Rating",
                    "Customer Image",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={styles.th}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.Id}>
                    <td style={styles.td}>{testimonial.Id}</td>

                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {testimonial.CustomerName}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        maxWidth: "280px",
                        lineHeight: "1.5",
                      }}
                    >
                      {testimonial.Description}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          display: "inline-block",
                          background: "#fff5df",
                          color: "#9a6b19",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ★ {testimonial.Rating}/10
                      </span>
                    </td>

                    <td style={styles.td}>
                      {testimonial.CustomerImagePath || "No image"}
                    </td>

                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(testimonial)}
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
                          onClick={() => handleDelete(testimonial.Id)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialManagement;

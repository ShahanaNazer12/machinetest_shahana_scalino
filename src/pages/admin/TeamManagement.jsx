
import { useEffect, useState } from "react";
import {
  getTeams,
  insertTeam,
  updateTeam,
  deleteTeam,
} from "../../services/cafeService";

const initialForm = {
  Id: 0,
  Name: "",
  Designation: "",
  SubText: "",
  Base64Image: "",
  ImageFileName: "",
  ExistingImagePath: "",
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
  summaryCard: {
    background: "#fff",
    border: "1px solid #eee7e1",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "25px",
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
    minHeight: "100px",
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

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
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

    const fileInput = document.getElementById("team-image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.Name.trim() || !formData.Designation.trim()) {
      setError("Name and designation are required.");
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

          reader.onerror = () => reject(new Error("Unable to read image."));
          reader.readAsDataURL(imageFile);
        });
      }

      const teamData = {
        Id: editing ? Number(formData.Id) : 0,
        Name: formData.Name.trim(),
        Designation: formData.Designation.trim(),
        SubText: formData.SubText.trim(),
        Base64Image: base64Image,
        ImageFileName: imageFile ? imageFile.name : "",
        ExistingImagePath: editing ? formData.ExistingImagePath : "",
      };

      if (editing) {
        await updateTeam(teamData);
        setMessage("Team member updated successfully!");
      } else {
        await insertTeam(teamData);
        setMessage("Team member added successfully!");
      }

      resetForm();
      await fetchTeams();
    } catch (err) {
      setError(err.message || "Unable to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (team) => {
    setFormData({
      Id: team.Id,
      Name: team.Name || "",
      Designation: team.Designation || "",
      SubText: team.SubText || "",
      Base64Image: "",
      ImageFileName: "",
      ExistingImagePath: team.ImagePath || "",
    });

    setImageFile(null);
    setEditing(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteTeam(id);

      if (Number(formData.Id) === Number(id)) {
        resetForm();
      }

      setMessage("Team member deleted successfully!");
      await fetchTeams();
    } catch (err) {
      setError(err.message || "Unable to delete team member.");
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.eyebrow}>Café Administration</div>

      <h2 style={styles.heading}>Team Management</h2>

      <p style={styles.subtitle}>
        Manage your café team members, designations and profile information.
      </p>

      <div style={styles.summaryCard}>
        <div style={styles.cardLabel}>Total Team Members</div>
        <div style={styles.cardNumber}>{teams.length}</div>
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
          {editing ? "Edit Team Member" : "Add New Team Member"}
        </h3>

        <p style={styles.sectionSubtitle}>
          {editing
            ? "Update the team member's information."
            : "Enter the details to add a new team member."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name *</label>
              <input
                style={styles.input}
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Designation *</label>
              <input
                style={styles.input}
                name="Designation"
                value={formData.Designation}
                onChange={handleChange}
                placeholder="Example: Head Barista"
                required
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                name="SubText"
                value={formData.SubText}
                onChange={handleChange}
                placeholder="Write a short description about the team member"
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>
                Profile Image (Optional, max 2 MB)
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
                  id="team-image"
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
                      alt="Selected team member"
                      style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "10px",
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

                {!imageFile && editing && formData.ExistingImagePath && (
                  <p
                    style={{
                      color: "#79543b",
                      fontSize: "13px",
                      marginTop: "12px",
                    }}
                  >
                    Current image: {formData.ExistingImagePath}
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
                  ? "Update Team Member"
                  : "Add Team Member"}
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
        <h3 style={styles.sectionTitle}>Existing Team Members</h3>

        <p style={styles.sectionSubtitle}>
          View and manage your café team members.
        </p>

        {loading ? (
          <p style={{ color: "#8a7b72", padding: "20px 0" }}>
            Loading team members...
          </p>
        ) : teams.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 15px",
              color: "#8a7b72",
              background: "#faf8f6",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>☕</div>
            <strong>No team members found</strong>
            <p style={{ fontSize: "13px" }}>
              Add your first team member using the form above.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "ID",
                    "Profile",
                    "Name",
                    "Designation",
                    "Description",
                    "Image Path",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={styles.th}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => (
                  <tr key={team.Id}>
                    <td style={styles.td}>{team.Id}</td>

                    <td style={styles.td}>
                      {team.ImagePath ? (
                        <img
                          src={`https://mockapi.scalinotechnologies.com${team.ImagePath}`}
                          alt={team.Name}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "9px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "9px",
                            background: "#f3eee9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#79543b",
                            fontWeight: "700",
                            fontSize: "18px",
                          }}
                        >
                          {team.Name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </td>

                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {team.Name}
                    </td>

                    <td style={styles.td}>{team.Designation}</td>

                    <td
                      style={{
                        ...styles.td,
                        maxWidth: "220px",
                        lineHeight: "1.5",
                      }}
                    >
                      {team.SubText || "-"}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        maxWidth: "180px",
                        overflowWrap: "anywhere",
                        fontSize: "11px",
                      }}
                    >
                      {team.ImagePath || "No image"}
                    </td>

                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(team)}
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
                          onClick={() => handleDelete(team.Id)}
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

export default TeamManagement;

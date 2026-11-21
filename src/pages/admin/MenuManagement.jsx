
import { useEffect, useState } from "react";
import {
  getMenus,
  getMenuCategories,
  insertMenu,
  updateMenu,
  deleteMenu,
} from "../../services/menuService";

const initialForm = {
  Id: 0,
  CategoryId: "",
  Name: "",
  Description: "",
  Price: "",
  OfferPrice: 0,
  TagName: "",
  IsActive: true,
};

const styles = {
  page: {
    padding: "28px",
    color: "#34251e",
  },
  heading: {
    fontSize: "27px",
    fontWeight: "700",
    margin: "5px 0",
  },
  eyebrow: {
    color: "#98765c",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
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
    minHeight: "85px",
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
  },
};

function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [menuData, categoryData] = await Promise.all([
        getMenus(),
        getMenuCategories(),
      ]);

      setMenus(Array.isArray(menuData) ? menuData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      setError(err.message || "Unable to load menu data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

    if (!formData.CategoryId || !formData.Name.trim()) {
      setError("Please select a category and enter a menu name.");
      return;
    }

    const price = Number(formData.Price);
    const offerPrice = Number(formData.OfferPrice);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    if (!Number.isFinite(offerPrice) || offerPrice < 0) {
      setError("Please enter a valid offer price.");
      return;
    }

    if (offerPrice > 0 && offerPrice >= price) {
      setError("Offer price must be less than the regular price.");
      return;
    }

    const menuData = {
      Id: editing ? Number(formData.Id) : 0,
      CategoryId: Number(formData.CategoryId),
      Name: formData.Name.trim(),
      Description: formData.Description.trim(),
      Price: price,
      OfferPrice: offerPrice,
      TagName: formData.TagName.trim(),
      IsActive: Boolean(formData.IsActive),
    };

    try {
      setSaving(true);

      if (editing) {
        await updateMenu(menuData);
        setMessage("Menu item updated successfully!");
      } else {
        await insertMenu(menuData);
        setMessage("Menu item added successfully!");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.message || "Unable to save menu item.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (menu) => {
    setFormData({
      Id: menu.Id,
      CategoryId: String(menu.CategoryId),
      Name: menu.Name || "",
      Description: menu.Description || "",
      Price: String(menu.Price ?? ""),
      OfferPrice: String(menu.OfferPrice ?? 0),
      TagName: menu.TagName || "",
      IsActive: Boolean(menu.IsActive),
    });

    setEditing(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteMenu(id);

      if (Number(formData.Id) === Number(id)) {
        resetForm();
      }

      setMessage("Menu item deleted successfully!");
      await fetchData();
    } catch (err) {
      setError(err.message || "Unable to delete menu item.");
    }
  };

  const activeCount = menus.filter((menu) => menu.IsActive).length;
  const inactiveCount = menus.length - activeCount;

  return (
    <section style={styles.page}>
      <div style={styles.eyebrow}>Café Administration</div>

      <h2 style={styles.heading}>Menu Management</h2>

      <p style={styles.subtitle}>
        Manage your café menu, prices, categories and availability.
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Total Menu Items</div>
          <div style={styles.cardNumber}>{menus.length}</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Active Items</div>
          <div style={styles.cardNumber}>{activeCount}</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.cardLabel}>Inactive Items</div>
          <div style={styles.cardNumber}>{inactiveCount}</div>
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
          {editing ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <p style={styles.sectionSubtitle}>
          {editing
            ? "Update the details of this menu item."
            : "Enter the details to add a new item to your café menu."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Menu Name *</label>
              <input
                style={styles.input}
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Enter menu name"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select
                style={styles.input}
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Regular Price *</label>
              <input
                style={styles.input}
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Offer Price</label>
              <input
                style={styles.input}
                type="number"
                name="OfferPrice"
                value={formData.OfferPrice}
                onChange={handleChange}
                placeholder="Enter offer price"
                min="0"
                step="0.01"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tag Name</label>
              <input
                style={styles.input}
                name="TagName"
                value={formData.TagName}
                onChange={handleChange}
                placeholder="Example: Recommended"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder="Enter menu description"
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
              name="IsActive"
              checked={formData.IsActive}
              onChange={handleChange}
              style={{ width: "16px", height: "16px", accentColor: "#79543b" }}
            />
            Active menu item
          </label>

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
                  ? "Update Menu Item"
                  : "Add Menu Item"}
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
        <h3 style={styles.sectionTitle}>Existing Menu Items</h3>

        <p style={styles.sectionSubtitle}>
          View, edit and manage all available menu items.
        </p>

        {loading ? (
          <p style={{ color: "#8a7b72", padding: "20px 0" }}>
            Loading menu items...
          </p>
        ) : menus.length === 0 ? (
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
            <strong>No menu items found</strong>
            <p style={{ fontSize: "13px" }}>
              Add your first menu item using the form above.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "ID",
                    "Menu Name",
                    "Category",
                    "Price",
                    "Offer Price",
                    "Tag",
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
                {menus.map((menu) => (
                  <tr key={menu.Id}>
                    <td style={styles.td}>{menu.Id}</td>

                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {menu.Name}
                    </td>

                    <td style={styles.td}>
                      {menu.CategoryName || "-"}
                    </td>

                    <td style={styles.td}>₹{menu.Price}</td>

                    <td style={styles.td}>
                      {Number(menu.OfferPrice) > 0
                        ? `₹${menu.OfferPrice}`
                        : "-"}
                    </td>

                    <td style={styles.td}>
                      {menu.TagName || "-"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "700",
                          background: menu.IsActive ? "#eaf5eb" : "#f5eeee",
                          color: menu.IsActive ? "#39804a" : "#a15b5b",
                        }}
                      >
                        {menu.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(menu)}
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
                          onClick={() => handleDelete(menu.Id)}
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

export default MenuManagement;

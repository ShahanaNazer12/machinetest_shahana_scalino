
import { useEffect, useState } from "react";

import {
  FaCoffee,
  FaThLarge,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaExclamationCircle,
  FaTags,
} from "react-icons/fa";

import {
  getMenuCategories,
  insertMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} from "../../services/menuService";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    Id: 0,
    Name: "",
    SubText: "",
    Priority: 0,
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMenuCategories();

      if (!Array.isArray(data)) {
        throw new Error("Invalid category response");
      }

      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      Id: 0,
      Name: "",
      SubText: "",
      Priority: 0,
    });

    setEditing(false);
  };

  // Add or update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.Name.trim()) {
      setError("Please enter a category name");
      return;
    }

    const categoryData = {
      Id: editing ? Number(formData.Id) : 0,
      Name: formData.Name.trim(),
      SubText: formData.SubText.trim(),
      Priority: Number(formData.Priority),
    };

    try {
      setSaving(true);

      if (editing) {
        await updateMenuCategory(categoryData);
        setMessage("Category updated successfully!");
      } else {
        await insertMenuCategory(categoryData);
        setMessage("Category added successfully!");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setFormData({
      Id: category.Id,
      Name: category.Name || "",
      SubText: category.SubText || "",
      Priority: category.Priority ?? 0,
    });

    setEditing(true);
    setMessage("");
    setError("");
  };

  // Delete category
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await deleteMenuCategory(id);

      setMessage("Category deleted successfully!");

      if (Number(formData.Id) === Number(id)) {
        resetForm();
      }

      await fetchCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="category-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="header-content">
          <span className="eyebrow">MENU MANAGEMENT</span>

          <h1>Category Management</h1>

          <p>
            Organize and manage your café menu categories.
          </p>
        </div>

        <div className="header-icon">
          <FaCoffee />
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div className="summary-card">
        <div className="summary-icon">
          <FaThLarge />
        </div>

        <div>
          <p className="summary-label">Total Categories</p>
          <h2 className="summary-number">
            {categories.length}
          </h2>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="success-message">
          <FaCheck />
          <span>{message}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-message">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      {/* ADD / EDIT CATEGORY FORM */}
      <div className="form-card">

        <div className="card-header">
          <div>
            <h2>
              {editing ? "Edit Category" : "Add New Category"}
            </h2>

            <p>
              {editing
                ? "Update the category details below."
                : "Enter the details to create a new menu category."}
            </p>
          </div>

          <span className="form-icon">
            {editing ? <FaEdit /> : <FaPlus />}
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* CATEGORY NAME */}
            <div className="form-group">
              <label htmlFor="categoryName">
                Category Name <span>*</span>
              </label>

              <input
                id="categoryName"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Example: Breakfast"
                required
                maxLength={100}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label htmlFor="categoryDescription">
                Description
              </label>

              <input
                id="categoryDescription"
                type="text"
                name="SubText"
                value={formData.SubText}
                onChange={handleChange}
                placeholder="Enter a short description"
              />
            </div>

            {/* PRIORITY */}
            <div className="form-group">
              <label htmlFor="categoryPriority">
                Priority
              </label>

              <input
                id="categoryPriority"
                type="number"
                name="Priority"
                value={formData.Priority}
                onChange={handleChange}
                min="0"
              />

              <small>
                Enter a number to set the display priority.
              </small>
            </div>

          </div>

          {/* FORM BUTTONS */}
          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : editing ? (
                <>
                  <FaCheck /> Update Category
                </>
              ) : (
                <>
                  <FaPlus /> Add Category
                </>
              )}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
              >
                <FaTimes /> Cancel
              </button>
            )}

          </div>
        </form>
      </div>

      {/* EXISTING CATEGORIES */}
      <div className="table-card">

        <div className="table-header">
          <div>
            <h2>Existing Categories</h2>

            <p>
              View, edit or delete your café categories.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCategories}
            className="refresh-button"
            disabled={loading}
          >
            <FaSyncAlt className={loading ? "spinning" : ""} />
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (

          /* EMPTY STATE */
          <div className="empty-state">
            <FaTags className="empty-icon" />

            <h3>No Categories Found</h3>

            <p>
              Add your first menu category using the form above.
            </p>
          </div>

        ) : (

          /* CATEGORY TABLE */
          <div className="table-wrapper">

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CATEGORY NAME</th>
                  <th>DESCRIPTION</th>
                  <th>PRIORITY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.Id}>

                    <td>
                      <span className="id-badge">
                        #{category.Id}
                      </span>
                    </td>

                    <td>
                      <strong className="category-name">
                        {category.Name}
                      </strong>
                    </td>

                    <td>
                      <span className="description-text">
                        {category.SubText || "No description"}
                      </span>
                    </td>

                    <td>
                      <span className="priority-badge">
                        {category.Priority}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="edit-button"
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category.Id)}
                          className="delete-button"
                        >
                          <FaTimes /> Delete
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

      {/* RESPONSIVE CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .category-page {
          width: 100%;
          min-width: 0;
          font-family: Arial, sans-serif;
          color: #33251f;
        }

        /* PAGE HEADER */

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .eyebrow {
          color: #9a704f;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.8px;
        }

        .header-content h1 {
          font-size: 27px;
          margin: 8px 0;
          color: #34251e;
          overflow-wrap: anywhere;
        }

        .header-content p {
          margin: 0;
          color: #888;
          font-size: 14px;
          line-height: 1.5;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #f0e6dc;
          color: #79543b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          flex-shrink: 0;
        }

        /* SUMMARY */

        .summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #fff;
          border: 1px solid #eee7e1;
          border-radius: 10px;
          margin-bottom: 25px;
          width: 100%;
          max-width: 260px;
        }

        .summary-icon {
          width: 45px;
          height: 45px;
          background: #f3e9df;
          color: #79543b;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .summary-label {
          margin: 0 0 5px;
          font-size: 12px;
          color: #888;
        }

        .summary-number {
          margin: 0;
          font-size: 24px;
          color: #34251e;
        }

        /* MESSAGES */

        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 16px;
          margin-bottom: 18px;
          border-radius: 7px;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .success-message {
          background: #eaf6ed;
          border: 1px solid #c9e8d0;
          color: #26723c;
        }

        .error-message {
          background: #fff0ef;
          border: 1px solid #f0ceca;
          color: #b43d35;
        }

        /* FORM CARD */

        .form-card,
        .table-card {
          background: #fff;
          border: 1px solid #eee7e1;
          border-radius: 10px;
          padding: 25px;
          width: 100%;
          min-width: 0;
        }

        .form-card {
          margin-bottom: 25px;
        }

        .card-header,
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .card-header {
          margin-bottom: 25px;
          padding-bottom: 18px;
          border-bottom: 1px solid #eee;
        }

        .card-header h2,
        .table-header h2 {
          margin: 0;
          font-size: 19px;
          color: #34251e;
        }

        .card-header p,
        .table-header p {
          margin: 7px 0 0;
          color: #888;
          font-size: 13px;
          line-height: 1.5;
        }

        .form-icon {
          width: 38px;
          height: 38px;
          background: #f3e9df;
          color: #79543b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        /* FORM GRID */

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(min(100%, 220px), 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 9px;
          min-width: 0;
        }

        .form-group label {
          font-size: 13px;
          font-weight: bold;
          color: #514238;
        }

        .form-group label span {
          color: #c0392b;
        }

        .form-group input {
          width: 100%;
          min-width: 0;
          padding: 12px 14px;
          border: 1px solid #ddd4cc;
          border-radius: 6px;
          font-size: 14px;
          color: #34251e;
          background: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #956b4e;
          box-shadow: 0 0 0 3px rgba(149,107,78,0.12);
        }

        .form-group small {
          color: #999;
          font-size: 11px;
          line-height: 1.4;
        }

        /* FORM BUTTONS */

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 25px;
        }

        .primary-button,
        .cancel-button,
        .refresh-button,
        .edit-button,
        .delete-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .primary-button {
          padding: 12px 20px;
          background: #79543b;
          color: #fff;
          font-size: 13px;
        }

        .cancel-button {
          padding: 12px 20px;
          background: #eee8e2;
          color: #514238;
          font-size: 13px;
        }

        .primary-button:disabled,
        .refresh-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* TABLE HEADER */

        .table-header {
          margin-bottom: 22px;
        }

        .refresh-button {
          padding: 9px 14px;
          background: #f3e9df;
          color: #79543b;
          font-size: 12px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* TABLE */

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .table-wrapper table {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
          text-align: left;
        }

        .table-wrapper th {
          padding: 14px 12px;
          background: #f8f5f1;
          color: #79543b;
          font-size: 11px;
          letter-spacing: 0.6px;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
        }

        .table-wrapper td {
          padding: 15px 12px;
          border-bottom: 1px solid #f0eeeb;
          font-size: 13px;
          color: #55483f;
        }

        .id-badge {
          padding: 5px 8px;
          background: #f2eee9;
          border-radius: 5px;
          font-size: 12px;
          color: #79543b;
          font-weight: bold;
          white-space: nowrap;
        }

        .category-name {
          color: #34251e;
          font-size: 13px;
        }

        .description-text {
          color: #888;
        }

        .priority-badge {
          padding: 5px 10px;
          background: #f3e9df;
          border-radius: 5px;
          color: #79543b;
          font-weight: bold;
        }

        /* ACTION BUTTONS */

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .edit-button {
          padding: 7px 10px;
          background: #f3e9df;
          color: #79543b;
          font-size: 12px;
        }

        .delete-button {
          padding: 7px 10px;
          background: #fff0ef;
          color: #b43d35;
          font-size: 12px;
        }

        /* LOADING */

        .loading {
          text-align: center;
          padding: 35px;
          color: #888;
        }

        .spinner {
          width: 25px;
          height: 25px;
          border: 3px solid #eee;
          border-top: 3px solid #79543b;
          border-radius: 50%;
          animation: categorySpin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes categorySpin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinning {
          animation: categorySpin 0.8s linear infinite;
        }

        /* EMPTY STATE */

        .empty-state {
          text-align: center;
          padding: 40px 15px;
          color: #888;
        }

        .empty-icon {
          font-size: 35px;
          color: #79543b;
        }

        .empty-state h3 {
          color: #34251e;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 13px;
          line-height: 1.5;
        }

        /* TABLET */

        @media (max-width: 768px) {
          .form-card,
          .table-card {
            padding: 20px;
          }

          .header-content h1 {
            font-size: 24px;
          }

          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .page-header {
            align-items: flex-start;
          }

          .header-content h1 {
            font-size: 21px;
          }

          .header-content p {
            font-size: 13px;
          }

          .header-icon {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }

          .summary-card {
            max-width: 100%;
            padding: 16px;
          }

          .form-card,
          .table-card {
            padding: 16px;
          }

          .card-header h2,
          .table-header h2 {
            font-size: 17px;
          }

          .card-header p,
          .table-header p {
            font-size: 12px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-actions {
            flex-direction: column;
          }

          .primary-button,
          .cancel-button {
            width: 100%;
            min-height: 43px;
          }

          .table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .refresh-button {
            align-self: flex-start;
          }

          .success-message,
          .error-message {
            font-size: 13px;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 380px) {
          .header-content h1 {
            font-size: 19px;
          }

          .header-icon {
            width: 36px;
            height: 36px;
            font-size: 17px;
          }

          .form-card,
          .table-card {
            padding: 13px;
          }

          .card-header {
            gap: 8px;
          }

          .form-icon {
            width: 32px;
            height: 32px;
          }

          .form-group input {
            padding: 11px;
            font-size: 13px;
          }
        }

      `}</style>
    </div>
  );
}

export default CategoryManagement;

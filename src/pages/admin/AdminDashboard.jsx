
import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaThLarge,
  FaCoffee,
  FaUsers,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FaThLarge />,
    },
    {
      name: "Menu Items",
      path: "/admin/menus",
      icon: <FaCoffee />,
    },
    {
      name: "Team Members",
      path: "/admin/teams",
      icon: <FaUsers />,
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      icon: <FaStar />,
    },
    {
      name: "Opening Hours",
      path: "/admin/opening-hours",
      icon: <FaClock />,
    },
    {
      name: "Reservations",
      path: "/admin/reservations",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Contact Messages",
      path: "/admin/contacts",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          font-family: Arial, sans-serif;
          background: #f5f6f8;
        }

        .admin-sidebar {
          width: 240px;
          min-width: 240px;
          background: #2c211b;
          color: white;
          padding: 25px 16px;
          display: flex;
          flex-direction: column;
        }

        .admin-logo {
          margin: 0;
          color: #e5b887;
          font-size: 23px;
        }

        .admin-subtitle {
          color: #b9aaa0;
          font-size: 12px;
          margin-top: 8px;
          margin-bottom: 35px;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-link {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e5ddd8;
          text-decoration: none;
          padding: 13px 12px;
          border-radius: 7px;
          font-size: 14px;
          transition: background 0.2s;
        }

        .admin-link:hover {
          background: #574033;
        }

        .admin-link.active {
          background: #8a6045;
          color: white;
          font-weight: bold;
        }

        .admin-icon {
          width: 20px;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .admin-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: auto;
          padding: 13px;
          background: #a83d35;
          color: white;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
        }

        .admin-logout:hover {
          background: #8e3029;
        }

        .admin-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          background: white;
          padding: 18px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e5e5;
          gap: 15px;
        }

        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-header-title {
          margin: 0;
          color: #30231d;
          font-size: 21px;
        }

        .admin-header-subtitle {
          margin: 5px 0 0;
          color: #888;
          font-size: 13px;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #8a6045;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .admin-role {
          margin: 3px 0 0;
          font-size: 11px;
          color: #888;
        }

        .admin-page {
          padding: 25px;
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .admin-footer {
          padding: 15px 25px;
          color: #888;
          font-size: 12px;
          text-align: center;
        }

        .admin-menu-button {
          display: none;
          border: none;
          background: #8a6045;
          color: white;
          font-size: 18px;
          border-radius: 6px;
          width: 40px;
          height: 38px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .admin-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 260px;
            min-width: 260px;
            height: 100vh;
            z-index: 1001;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 1000;
          }

          .admin-menu-button {
            display: flex;
            flex-shrink: 0;
          }

          .admin-header {
            padding: 15px 18px;
          }

          .admin-page {
            padding: 18px;
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .admin-header {
            padding: 13px;
            gap: 10px;
          }

          .admin-header-title {
            font-size: 18px;
          }

          .admin-header-subtitle {
            font-size: 11px;
          }

          .admin-info {
            gap: 6px;
          }

          .admin-info strong {
            font-size: 12px;
          }

          .admin-role {
            font-size: 10px;
          }

          .admin-avatar {
            width: 32px;
            height: 32px;
          }

          .admin-page {
            padding: 12px;
          }

          .admin-footer {
            padding: 12px;
          }
        }
      `}</style>

      <div className="admin-container">
        {menuOpen && (
          <div
            className="admin-overlay"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <aside
          className={`admin-sidebar ${menuOpen ? "open" : ""}`}
        >
          <div>
            <h2 className="admin-logo">Cafe Admin</h2>
            <p className="admin-subtitle">Management Panel</p>
          </div>

          <nav className="admin-nav">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`admin-link ${isActive ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="admin-icon">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <button onClick={handleLogout} className="admin-logout">
            <FaSignOutAlt />
            Logout
          </button>
        </aside>

        <main className="admin-content">
          <header className="admin-header">
            <div className="admin-header-left">
              <button
                className="admin-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
              >
                <FaBars />
              </button>

              <div>
                <h2 className="admin-header-title">Admin Panel</h2>
                <p className="admin-header-subtitle">
                  Manage your café website
                </p>
              </div>
            </div>

            <div className="admin-info">
              <div className="admin-avatar">A</div>
              <div>
                <strong>Admin</strong>
                <p className="admin-role">Administrator</p>
              </div>
            </div>
          </header>

          <section className="admin-page">
            <Outlet />
          </section>

          <footer className="admin-footer">
            © {new Date().getFullYear()} Cafe Admin Panel
          </footer>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;

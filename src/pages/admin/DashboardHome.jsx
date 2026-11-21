
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaThLarge,
  FaCoffee,
  FaUsers,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  getMenuCategories,
  getMenus,
} from "../../services/menuService";

import {
  getTeams,
  getTestimonials,
  getOpeningHours,
  getReservations,
  getContactMessages,
} from "../../services/cafeService";

function DashboardHome() {
  const [counts, setCounts] = useState({
    categories: 0,
    menus: 0,
    teams: 0,
    testimonials: 0,
    openingHours: 0,
    reservations: 0,
    contacts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          categories,
          menus,
          teams,
          testimonials,
          openingHours,
          reservations,
          contacts,
        ] = await Promise.all([
          getMenuCategories(),
          getMenus(),
          getTeams(),
          getTestimonials(),
          getOpeningHours(),
          getReservations(),
          getContactMessages(),
        ]);

        setCounts({
          categories: categories.length,
          menus: menus.length,
          teams: teams.length,
          testimonials: testimonials.length,
          openingHours: openingHours.length,
          reservations: reservations.length,
          contacts: contacts.length,
        });
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError(err.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Categories",
      value: counts.categories,
      icon: <FaThLarge />,
      color: "#e8f0fe",
      iconColor: "#356ac3",
      path: "/admin/categories",
    },
    {
      title: "Menu Items",
      value: counts.menus,
      icon: <FaCoffee />,
      color: "#fff0df",
      iconColor: "#b46b25",
      path: "/admin/menus",
    },
    {
      title: "Team Members",
      value: counts.teams,
      icon: <FaUsers />,
      color: "#e7f6ed",
      iconColor: "#26844c",
      path: "/admin/teams",
    },
    {
      title: "Testimonials",
      value: counts.testimonials,
      icon: <FaStar />,
      color: "#f4eaff",
      iconColor: "#8750b5",
      path: "/admin/testimonials",
    },
    {
      title: "Opening Hours",
      value: counts.openingHours,
      icon: <FaClock />,
      color: "#e5f5f5",
      iconColor: "#238383",
      path: "/admin/opening-hours",
    },
    {
      title: "Reservations",
      value: counts.reservations,
      icon: <FaCalendarAlt />,
      color: "#fff0f0",
      iconColor: "#c04b4b",
      path: "/admin/reservations",
    },
    {
      title: "Contact Messages",
      value: counts.contacts,
      icon: <FaEnvelope />,
      color: "#fff7df",
      iconColor: "#a47b18",
      path: "/admin/contacts",
    },
  ];

  if (loading) {
    return (
      <div style={styles.message}>
        <h3>Loading dashboard...</h3>
        <p>Please wait while we fetch the latest data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>

        <button
          onClick={() => window.location.reload()}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.welcome}>
        <div>
          <h2 style={styles.title}>Dashboard Overview</h2>

          <p style={styles.description}>
            Welcome back! Here's what's happening with your café website.
          </p>
        </div>

        <span style={styles.status}>Live API Data</span>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <Link
            to={card.path}
            key={card.title}
            style={styles.cardLink}
          >
            <div style={styles.card}>
              <div style={styles.cardTop}>
                <span
                  style={{
                    ...styles.iconBox,
                    background: card.color,
                    color: card.iconColor,
                  }}
                >
                  {card.icon}
                </span>

                <span style={styles.arrow}>
                  <FaExternalLinkAlt />
                </span>
              </div>

              <h2 style={styles.value}>{card.value}</h2>

              <p style={styles.cardTitle}>{card.title}</p>

              <span style={styles.viewText}>View details</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>Quick Information</h3>

        <p style={styles.infoText}>
          Use the sidebar to manage your café categories, menu items, team
          members, testimonials, opening hours, reservations and contact
          messages.
        </p>
      </div>
    </div>
  );
}

const styles = {
  welcome: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },

  title: {
    color: "#30231d",
    margin: "0 0 8px",
    fontSize: "24px",
  },

  description: {
    color: "#777",
    margin: 0,
    fontSize: "14px",
  },

  status: {
    background: "#e7f6ed",
    color: "#26844c",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },

  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
    transition: "transform 0.2s",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  arrow: {
    color: "#aaa",
    fontSize: "16px",
  },

  value: {
    margin: "22px 0 5px",
    fontSize: "30px",
    color: "#30231d",
  },

  cardTitle: {
    margin: "0 0 10px",
    color: "#666",
    fontSize: "14px",
  },

  viewText: {
    fontSize: "12px",
    color: "#8a6045",
    fontWeight: "bold",
  },

  infoBox: {
    marginTop: "28px",
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    border: "1px solid #eee",
  },

  infoTitle: {
    margin: "0 0 10px",
    color: "#30231d",
  },

  infoText: {
    color: "#777",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: 0,
  },

  message: {
    padding: "30px",
    textAlign: "center",
    color: "#666",
  },

  errorBox: {
    padding: "25px",
    background: "#fff0f0",
    borderRadius: "10px",
    color: "#a83232",
  },

  retryButton: {
    padding: "10px 18px",
    background: "#8a6045",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DashboardHome;

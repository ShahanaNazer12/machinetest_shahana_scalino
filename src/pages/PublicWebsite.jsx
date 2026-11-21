
import { useEffect, useState } from "react";

import {
  FaCoffee,
  FaUtensils,
  FaBirthdayCake,
  FaBreadSlice,
  FaMugHot,
  FaCookieBite,
  FaIceCream,
  FaStar,
} from "react-icons/fa";

import {
  getMenus,
  getMenuCategories,
} from "../services/menuService";

import {
  getOpeningHours,
  getTeams,
  getTestimonials,
} from "../services/cafeService";

import BookingContact from "../components/BookingContact";

// API image base URL
const IMAGE_BASE_URL = "https://mockapi.scalinotechnologies.com";

// Convert API image path into a complete URL
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${IMAGE_BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
};

// Find the available menu image field
const getMenuImage = (item) => {
  const imageFields = [
    "ImagePath",
    "MenuImagePath",
    "MenuImage",
    "ImageUrl",
    "ImageURL",
    "Image",
    "PhotoPath",
    "ItemImagePath",
  ];

  const imageField = imageFields.find(
    (field) =>
      typeof item[field] === "string" &&
      item[field].trim() !== ""
  );

  return imageField ? getImageUrl(item[imageField]) : "";
};

// Select an icon based on menu item name
const getMenuIcon = (name = "") => {
  const itemName = name.toLowerCase();

  if (
    itemName.includes("cake") ||
    itemName.includes("pancake")
  ) {
    return FaBirthdayCake;
  }

  if (
    itemName.includes("bread") ||
    itemName.includes("toast")
  ) {
    return FaBreadSlice;
  }

  if (
    itemName.includes("coffee") ||
    itemName.includes("latte") ||
    itemName.includes("tea") ||
    itemName.includes("cappuccino")
  ) {
    return FaCoffee;
  }

  if (
    itemName.includes("waffle") ||
    itemName.includes("cookie")
  ) {
    return FaCookieBite;
  }

  if (
    itemName.includes("ice cream") ||
    itemName.includes("chocolate")
  ) {
    return FaIceCream;
  }

  if (
    itemName.includes("chips") ||
    itemName.includes("fries")
  ) {
    return FaUtensils;
  }

  return FaMugHot;
};

// Image component with React Icon fallback
function ImageWithFallback({
  src,
  alt,
  placeholder,
  style,
  icon: Icon = FaCoffee,
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (!src || imageError) {
    return (
      <div style={placeholder}>
        <Icon size={55} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setImageError(true)}
    />
  );
}

function PublicWebsite() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          menuData,
          categoryData,
          teamData,
          testimonialData,
          openingHourData,
        ] = await Promise.all([
          getMenus(),
          getMenuCategories(),
          getTeams(),
          getTestimonials(),
          getOpeningHours(),
        ]);

        if (
          !Array.isArray(menuData) ||
          !Array.isArray(categoryData) ||
          !Array.isArray(teamData) ||
          !Array.isArray(testimonialData) ||
          !Array.isArray(openingHourData)
        ) {
          throw new Error("Invalid API response");
        }

        setMenus(
          menuData.filter(
            (item) => item.IsActive === 1 || item.IsActive === true
          )
        );

        setCategories(categoryData);
        setTeams(teamData);
        setTestimonials(testimonialData);
        setOpeningHours(openingHourData);

        console.log("MENU DATA:", menuData);
        console.log("TEAM DATA:", teamData);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to load café data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMenus =
    selectedCategory === "all"
      ? menus
      : menus.filter(
          (item) =>
            Number(item.CategoryId) === Number(selectedCategory)
        );

  if (loading) {
    return (
      <div style={styles.message}>
        <h2>
          <FaCoffee /> Preparing your café experience...
        </h2>
        <p>Please wait while we load our menu.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.message}>
        <h2>Unable to load café data</h2>
        <p>{error}</p>
        <button
          style={styles.primaryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.website}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <a href="#home" style={styles.logo}>
          <FaCoffee /> Brew & Bite
        </a>

        <div style={styles.navLinks}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#menu" style={styles.navLink}>Menu</a>
          <a href="#team" style={styles.navLink}>Our Team</a>
          <a href="#testimonials" style={styles.navLink}>Reviews</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </div>

        <a href="#booking" style={styles.navButton}>
          Book a Table
        </a>
      </nav>

      {/* HERO SECTION */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>WELCOME TO BREW & BITE</span>

          <h1 style={styles.heroTitle}>
            Fresh Coffee.
            <br />
            Fresh Moments.
          </h1>

          <p style={styles.heroDescription}>
            Enjoy delicious food, freshly brewed coffee and beautiful
            moments with the people you love.
          </p>

          <div style={styles.heroActions}>
            <a href="#menu" style={styles.primaryButton}>
              Explore Our Menu
            </a>

            <a href="#booking" style={styles.secondaryButton}>
              Reserve a Table
            </a>
          </div>
        </div>

        <div style={styles.heroDecoration}>
          <div style={styles.coffeeCircle}>
            <FaCoffee />
          </div>
          <p>Made with love, served with warmth.</p>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section style={styles.intro}>
        <span style={styles.sectionTag}>A LITTLE ABOUT US</span>
        <h2 style={styles.sectionTitle}>
          More Than Just a Cup of Coffee
        </h2>
        <p style={styles.sectionDescription}>
          We believe every cup tells a story. Visit us for freshly
          prepared favourites, friendly service and a welcoming
          atmosphere.
        </p>
      </section>

      {/* MENU SECTION */}
      <section id="menu" style={styles.section}>
        <div style={styles.sectionHeading}>
          <span style={styles.sectionTag}>TASTE THE DIFFERENCE</span>
          <h2 style={styles.sectionTitle}>Explore Our Menu</h2>
          <p style={styles.sectionDescription}>
            Discover something delicious for every mood.
          </p>
        </div>

        <div style={styles.categoryList}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === "all"
                ? styles.selectedCategory
                : {}),
            }}
          >
            All Items
          </button>

          {categories.map((category) => (
            <button
              key={category.Id}
              onClick={() => setSelectedCategory(String(category.Id))}
              style={{
                ...styles.categoryButton,
                ...(Number(selectedCategory) === Number(category.Id)
                  ? styles.selectedCategory
                  : {}),
              }}
            >
              {category.Name}
            </button>
          ))}
        </div>

        <div style={styles.menuGrid}>
          {filteredMenus.length > 0 ? (
            filteredMenus.map((item) => (
              <article key={item.Id} style={styles.menuCard}>
                <ImageWithFallback
                  src={getMenuImage(item)}
                  alt={item.Name}
                  style={styles.menuImage}
                  placeholder={styles.menuImagePlaceholder}
                  icon={getMenuIcon(item.Name)}
                />

                <div style={styles.menuContent}>
                  {item.TagName && (
                    <span style={styles.menuTag}>
                      {item.TagName}
                    </span>
                  )}

                  <h3 style={styles.menuName}>{item.Name}</h3>

                  <p style={styles.menuDescription}>
                    {item.Description || "Freshly prepared just for you."}
                  </p>

                  <p style={styles.menuCategory}>
                    {item.CategoryName}
                  </p>

                  <div style={styles.priceRow}>
                    {Number(item.OfferPrice) > 0 ? (
                      <>
                        <del style={styles.oldPrice}>
                          ₹{item.Price}
                        </del>
                        <strong style={styles.price}>
                          ₹{item.OfferPrice}
                        </strong>
                      </>
                    ) : (
                      <strong style={styles.price}>
                        ₹{item.Price}
                      </strong>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p style={styles.emptyMessage}>
              No menu items available in this category.
            </p>
          )}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" style={styles.sectionAlt}>
        <div style={styles.sectionHeading}>
          <span style={styles.sectionTag}>
            THE PEOPLE BEHIND THE MAGIC
          </span>

          <h2 style={styles.sectionTitle}>Meet Our Team</h2>

          <p style={styles.sectionDescription}>
            Our friendly team is here to make every visit special.
          </p>
        </div>

        <div style={styles.teamGrid}>
          {teams.map((member) => (
            <article key={member.Id} style={styles.teamCard}>
              <ImageWithFallback
                src={getImageUrl(member.ImagePath)}
                alt={member.Name}
                style={styles.teamImage}
                placeholder={styles.teamAvatar}
                icon={FaCoffee}
              />

              <h3 style={styles.teamName}>{member.Name}</h3>

              <p style={styles.teamDesignation}>
                {member.Designation}
              </p>

              <p style={styles.teamDescription}>
                {member.SubText}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={styles.section}>
        <div style={styles.sectionHeading}>
          <span style={styles.sectionTag}>CUSTOMER LOVE</span>
          <h2 style={styles.sectionTitle}>What People Say</h2>
          <p style={styles.sectionDescription}>
            Every happy customer makes our day better.
          </p>
        </div>

        <div style={styles.reviewGrid}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.Id} style={styles.reviewCard}>
              <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} />
                ))}
              </div>

              <p style={styles.reviewDescription}>
                "{testimonial.Description}"
              </p>

              <h3 style={styles.reviewName}>
                {testimonial.CustomerName}
              </h3>

              <span style={styles.rating}>
                Rating: {testimonial.Rating}/10
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* OPENING HOURS */}
      <section style={styles.hoursSection}>
        <div style={styles.hoursContent}>
          <span style={styles.sectionTag}>COME VISIT US</span>

          <h2 style={styles.hoursTitle}>Opening Hours</h2>

          <p style={styles.hoursDescription}>
            We look forward to welcoming you.
          </p>

          <div style={styles.hoursList}>
            {openingHours.map((hour) => (
              <div key={hour.Id} style={styles.hourRow}>
                <strong>{hour.DayRange}</strong>
                <span>{hour.TimeRange}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING AND CONTACT */}
      <section id="booking" style={styles.bookingSection}>
        <div style={styles.sectionHeading}>
          <span style={styles.sectionTag}>GET IN TOUCH</span>

          <h2 style={styles.sectionTitle}>
            We'd Love to Hear From You
          </h2>

          <p style={styles.sectionDescription}>
            Book your table or send us a message.
          </p>
        </div>

        <div id="contact">
          <BookingContact />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h2>
          <FaCoffee /> Brew & Bite
        </h2>
        <p>Good coffee. Good food. Good company.</p>

        <div style={styles.footerLinks}>
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#team">Our Team</a>
          <a href="#contact">Contact</a>
        </div>

        <p style={styles.copyright}>
          © {new Date().getFullYear()} Brew & Bite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  website: {
    fontFamily: "Arial, sans-serif",
    color: "#35251d",
    background: "#fffdf9",
  },

  navbar: {
    minHeight: "75px",
    padding: "15px 6%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "15px",
    background: "#fff",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "23px",
    fontWeight: "bold",
    color: "#75472c",
    textDecoration: "none",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  navLink: {
    textDecoration: "none",
    color: "#554238",
    fontSize: "14px",
  },

  navButton: {
    background: "#75472c",
    color: "white",
    padding: "12px 18px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "13px",
  },

  hero: {
    minHeight: "470px",
    padding: "75px 8%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
    background: "linear-gradient(120deg, #f4e5d5, #fdf6ed)",
  },

  heroContent: {
    maxWidth: "570px",
  },

  heroTag: {
    color: "#98613d",
    letterSpacing: "3px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  heroTitle: {
    fontSize: "clamp(42px, 6vw, 68px)",
    lineHeight: "1.1",
    margin: "20px 0",
    color: "#3c291e",
  },

  heroDescription: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#725e51",
    maxWidth: "480px",
  },

  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  primaryButton: {
    background: "#75472c",
    color: "white",
    padding: "14px 22px",
    borderRadius: "5px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #75472c",
    color: "#75472c",
    padding: "14px 22px",
    borderRadius: "5px",
    textDecoration: "none",
  },

  heroDecoration: {
    textAlign: "center",
    color: "#75472c",
    margin: "auto",
  },

  coffeeCircle: {
    width: "230px",
    height: "230px",
    borderRadius: "50%",
    background: "#e8cbb0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "100px",
    color: "#75472c",
    boxShadow: "0 15px 35px rgba(80,45,20,0.12)",
    margin: "auto",
  },

  intro: {
    padding: "75px 20px",
    textAlign: "center",
    maxWidth: "750px",
    margin: "auto",
  },

  section: {
    padding: "75px 7%",
  },

  sectionAlt: {
    padding: "75px 7%",
    background: "#f8f1e9",
  },

  sectionHeading: {
    textAlign: "center",
    marginBottom: "35px",
  },

  sectionTag: {
    color: "#98613d",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  sectionTitle: {
    fontSize: "32px",
    color: "#3c291e",
    margin: "12px 0",
  },

  sectionDescription: {
    color: "#817168",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  categoryList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "35px",
  },

  categoryButton: {
    padding: "11px 20px",
    border: "1px solid #d8c5b5",
    background: "white",
    color: "#65432f",
    borderRadius: "25px",
    cursor: "pointer",
  },

  selectedCategory: {
    background: "#75472c",
    color: "white",
    borderColor: "#75472c",
  },

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "22px",
  },

  menuCard: {
    background: "white",
    border: "1px solid #eee4da",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  },

  menuImage: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    display: "block",
  },

  menuImagePlaceholder: {
    height: "190px",
    background: "linear-gradient(135deg, #e8d1bb, #f5e9dd)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#75472c",
  },

  menuContent: {
    padding: "20px",
  },

  menuTag: {
    color: "#98613d",
    background: "#f8eee4",
    padding: "5px 9px",
    borderRadius: "4px",
    fontSize: "11px",
  },

  menuName: {
    margin: "12px 0 8px",
    color: "#3c291e",
  },

  menuDescription: {
    color: "#82756c",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  menuCategory: {
    color: "#a18a79",
    fontSize: "12px",
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
  },

  oldPrice: {
    color: "#999",
    fontSize: "13px",
  },

  price: {
    color: "#75472c",
    fontSize: "19px",
  },

  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#777",
  },

  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "22px",
  },

  teamCard: {
    background: "white",
    padding: "28px 20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  },

  teamImage: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    margin: "0 auto 15px",
    border: "3px solid #e8d1bb",
  },

  teamAvatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#e8d1bb",
    color: "#75472c",
    fontSize: "45px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },

  teamName: {
    margin: "10px 0 5px",
  },

  teamDesignation: {
    color: "#98613d",
    fontSize: "13px",
  },

  teamDescription: {
    color: "#82756c",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  reviewCard: {
    padding: "25px",
    background: "#fff",
    border: "1px solid #eee4da",
    borderRadius: "10px",
  },

  stars: {
    color: "#d69b38",
    fontSize: "17px",
    display: "flex",
    gap: "5px",
  },

  reviewDescription: {
    color: "#75665d",
    lineHeight: "1.8",
    fontSize: "14px",
  },

  reviewName: {
    color: "#3c291e",
    fontSize: "16px",
  },

  rating: {
    color: "#98613d",
    fontSize: "12px",
  },

  hoursSection: {
    padding: "75px 20px",
    background: "#38271e",
    color: "white",
    textAlign: "center",
  },

  hoursContent: {
    maxWidth: "550px",
    margin: "auto",
  },

  hoursTitle: {
    fontSize: "34px",
    margin: "15px 0",
  },

  hoursDescription: {
    color: "#d7c4b5",
  },

  hoursList: {
    marginTop: "30px",
  },

  hourRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    borderBottom: "1px solid #654b3b",
    padding: "15px 5px",
    textAlign: "left",
  },

  bookingSection: {
    padding: "75px 7%",
  },

  footer: {
    background: "#241912",
    color: "white",
    padding: "45px 20px",
    textAlign: "center",
  },

  footerLinks: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "22px",
    margin: "25px 0",
  },

  copyright: {
    color: "#b8a99d",
    fontSize: "12px",
    borderTop: "1px solid #49382c",
    paddingTop: "20px",
    marginTop: "25px",
  },

  message: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    color: "#75472c",
    padding: "20px",
    textAlign: "center",
  },
};

export default PublicWebsite;

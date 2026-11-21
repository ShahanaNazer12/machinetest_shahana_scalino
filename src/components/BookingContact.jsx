
import { useState } from "react";
import {
  insertReservation,
  insertContactUs,
} from "../services/cafeService";

function BookingContact() {
  const [booking, setBooking] = useState({
    FullName: "",
    PhoneNo: "",
    Date: "",
    Time: "",
    BookingCount: 1,
    Comment: "",
  });

  const [contact, setContact] = useState({
    Name: "",
    Email: "",
    Message: "",
  });

  const [bookingMessage, setBookingMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit reservation
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    try {
      setBookingLoading(true);

      const reservationData = {
        Id: 0,
        FullName: booking.FullName,
        PhoneNo: booking.PhoneNo,
        Time: booking.Time,
        Date: new Date(
          `${booking.Date}T${booking.Time}`
        ).toISOString(),
        BookingCount: Number(booking.BookingCount),
        Comment: booking.Comment,
        CreatedOn: new Date().toISOString(),
      };

      const response = await insertReservation(reservationData);

      setBookingMessage(
        response.Message || "Reservation submitted successfully!"
      );

      setBooking({
        FullName: "",
        PhoneNo: "",
        Date: "",
        Time: "",
        BookingCount: 1,
        Comment: "",
      });
    } catch (error) {
      setBookingMessage(
        error.message || "Failed to submit reservation."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Submit contact message
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactMessage("");

    try {
      setContactLoading(true);

      const contactData = {
        Id: 0,
        Name: contact.Name,
        Email: contact.Email,
        Message: contact.Message,
        IsViewed: false,
        CreatedOn: new Date().toISOString(),
      };

      const response = await insertContactUs(contactData);

      setContactMessage(
        response.Message || "Message sent successfully!"
      );

      setContact({
        Name: "",
        Email: "",
        Message: "",
      });
    } catch (error) {
      setContactMessage(
        error.message || "Failed to send message."
      );
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div style={styles.mainContainer}>

      {/* ================= RESERVATION SECTION ================= */}
      <section style={styles.reservationSection}>
        <div style={styles.container}>

          <div style={styles.sectionHeading}>
            <span style={styles.smallHeading}>BOOK YOUR EXPERIENCE</span>
            <h2 style={styles.sectionTitle}>Book a Table</h2>
            <p style={styles.sectionDescription}>
              Planning a visit? Reserve your table and enjoy
              a wonderful café experience with us.
            </p>
          </div>

          <div style={styles.formWrapper}>
            <form onSubmit={handleBookingSubmit} style={styles.form}>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="FullName"
                    value={booking.FullName}
                    onChange={handleBookingChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    type="tel"
                    name="PhoneNo"
                    value={booking.PhoneNo}
                    onChange={handleBookingChange}
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Reservation Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    name="Date"
                    value={booking.Date}
                    onChange={handleBookingChange}
                    min={new Date().toLocaleDateString("en-CA")}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Reservation Time</label>
                  <input
                    style={styles.input}
                    type="time"
                    name="Time"
                    value={booking.Time}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Guests</label>
                <select
                  style={styles.input}
                  name="BookingCount"
                  value={booking.BookingCount}
                  onChange={handleBookingChange}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Special Requests</label>
                <textarea
                  style={styles.textarea}
                  name="Comment"
                  value={booking.Comment}
                  onChange={handleBookingChange}
                  placeholder="Any special requests? (Optional)"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                style={{
                  ...styles.button,
                  opacity: bookingLoading ? 0.7 : 1,
                }}
              >
                {bookingLoading ? "Submitting..." : "Reserve Now →"}
              </button>

              {bookingMessage && (
                <p style={styles.message}>{bookingMessage}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section style={styles.contactSection}>
        <div style={styles.container}>

          <div style={styles.sectionHeading}>
            <span style={styles.smallHeading}>GET IN TOUCH</span>
            <h2 style={styles.sectionTitle}>Contact Us</h2>
            <p style={styles.sectionDescription}>
              Have a question, suggestion or feedback?
              Send us a message. We'd love to hear from you.
            </p>
          </div>

          <div style={styles.contactWrapper}>
            <form onSubmit={handleContactSubmit} style={styles.form}>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Your Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="Name"
                    value={contact.Name}
                    onChange={handleContactChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    style={styles.input}
                    type="email"
                    name="Email"
                    value={contact.Email}
                    onChange={handleContactChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Message</label>
                <textarea
                  style={{ ...styles.textarea, minHeight: "150px" }}
                  name="Message"
                  value={contact.Message}
                  onChange={handleContactChange}
                  placeholder="Write your message here..."
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                style={{
                  ...styles.button,
                  opacity: contactLoading ? 0.7 : 1,
                }}
              >
                {contactLoading ? "Sending..." : "Send Message →"}
              </button>

              {contactMessage && (
                <p style={styles.message}>{contactMessage}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= RESPONSIVE STYLES ================= */}
      <style>{`
        .booking-contact-input:focus,
        .booking-contact-textarea:focus {
          outline: none;
          border-color: #a87952;
          box-shadow: 0 0 0 3px rgba(168, 121, 82, 0.12);
        }

        .booking-contact-button:hover {
          background: #5e3e2c !important;
        }

        @media (max-width: 768px) {
          .booking-contact-row {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }

          .booking-contact-form-wrapper {
            padding: 25px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .booking-contact-section-title {
            font-size: 28px !important;
          }

          .booking-contact-section {
            padding: 45px 15px !important;
          }

          .booking-contact-description {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  mainContainer: {
    width: "100%",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1000px",
    width: "100%",
    margin: "0 auto",
  },

  reservationSection: {
    background: "#f8f5f1",
    padding: "75px 25px",
  },

  contactSection: {
    background: "#fff",
    padding: "75px 25px",
  },

  sectionHeading: {
    textAlign: "center",
    marginBottom: "38px",
  },

  smallHeading: {
    color: "#a87952",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  sectionTitle: {
    color: "#34251e",
    fontSize: "36px",
    margin: "12px 0",
  },

  sectionDescription: {
    color: "#777",
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "550px",
    margin: "0 auto",
  },

  formWrapper: {
    maxWidth: "750px",
    margin: "0 auto",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #eee7e1",
  },

  contactWrapper: {
    maxWidth: "750px",
    margin: "0 auto",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #eee7e1",
  },

  form: {
    width: "100%",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    marginBottom: "20px",
    minWidth: 0,
  },

  label: {
    color: "#514238",
    fontSize: "14px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    minWidth: 0,
    padding: "13px 14px",
    border: "1px solid #ddd4cc",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#34251e",
    background: "#fff",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "13px 14px",
    border: "1px solid #ddd4cc",
    borderRadius: "6px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#79543b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },

  message: {
    marginTop: "15px",
    padding: "12px",
    background: "#f3eee8",
    color: "#65452f",
    borderRadius: "6px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default BookingContact;

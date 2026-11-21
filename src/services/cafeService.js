
import api from "../api/axiosClient";

const extractResponse = (data) => {
  if (data.ResponseCode !== 200) {
    throw new Error(data.Message || "API request failed");
  }

  return data.Response;
};

// Get team members
export const getTeams = async () => {
  const response = await api.get("/cafe/getTeams");
  console.log("TEAM API:", response.data);
  return extractResponse(response.data);
};

// Get testimonials
export const getTestimonials = async () => {
  const response = await api.get("/cafe/getTestimonials");
  console.log("TESTIMONIAL API:", response.data);
  return extractResponse(response.data);
};

// Get opening hours
export const getOpeningHours = async () => {
  const response = await api.get("/cafe/getOpeningHours");
  console.log("OPENING HOURS API:", response.data);
  return extractResponse(response.data);
};


// Submit table reservation
export const insertReservation = async (reservationData) => {
  const response = await api.post(
    "/cafe/insertReservation",
    reservationData
  );

  const data = response.data;

  if (data.ResponseCode !== 200 && data.ResponseCode !== 0) {
    throw new Error(data.Message || "Reservation failed");
  }

  return data;
};

// Submit contact message
export const insertContactUs = async (contactData) => {
  const response = await api.post(
    "/cafe/insertContactUs",
    contactData
  );

  const data = response.data;

  if (data.ResponseCode !== 200 && data.ResponseCode !== 0) {
    throw new Error(data.Message || "Message submission failed");
  }

  return data;
};


// ================= TEAM MANAGEMENT APIs =================

export const insertTeam = async (teamData) => {
  try {
    const response = await api.post("/cafe/insertTeam", teamData);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Insert team error:", error);
    throw error;
  }
};

export const updateTeam = async (teamData) => {
  try {
    const response = await api.put("/cafe/updateTeam", teamData);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Update team error:", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await api.delete(`/cafe/deleteTeam/${id}`);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete team error:", error);
    throw error;
  }
};



// ================= TESTIMONIAL MANAGEMENT APIs =================

export const insertTestimonial = async (testimonialData) => {
  try {
    const response = await api.post(
      "/cafe/insertTestimonial",
      testimonialData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Insert testimonial error:", error);
    throw error;
  }
};

export const updateTestimonial = async (testimonialData) => {
  try {
    const response = await api.put(
      "/cafe/updateTestimonial",
      testimonialData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Update testimonial error:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(
      `/cafe/deleteTestimonial/${id}`
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete testimonial error:", error);
    throw error;
  }
};


// ================= OPENING HOURS MANAGEMENT APIs =================

export const insertOpeningHour = async (openingHourData) => {
  try {
    const response = await api.post(
      "/cafe/insertOpeningHour",
      openingHourData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Insert opening hour error:", error);
    throw error;
  }
};

export const updateOpeningHour = async (openingHourData) => {
  try {
    const response = await api.put(
      "/cafe/updateOpeningHour",
      openingHourData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Update opening hour error:", error);
    throw error;
  }
};

export const deleteOpeningHour = async (id) => {
  try {
    const response = await api.delete(
      `/cafe/deleteOpeningHour/${id}`
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete opening hour error:", error);
    throw error;
  }
};

// Get all reservations
export const getReservations = async () => {
  try {
    const response = await api.get("/cafe/getReservation");
    console.log("RESERVATION API:", response.data);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Get reservations error:", error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const response = await api.delete(
      `/cafe/deleteReservation/${id}`
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete reservation error:", error);
    throw error;
  }
};


// Get all contact messages
export const getContactMessages = async () => {
  try {
    const response = await api.get("/cafe/getContactUs");
    console.log("CONTACT MESSAGES API:", response.data);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Get contact messages error:", error);
    throw error;
  }
};

// Delete contact message
export const deleteContactMessage = async (id) => {
  try {
    const response = await api.delete(`/cafe/deleteContactUs/${id}`);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete contact message error:", error);
    throw error;
  }
};


import api from "../api/axiosClient";

const extractResponse = (data) => {
  if (data.ResponseCode !== 200 && data.ResponseCode !== 0) {
    throw new Error(data.Message || "API request failed");
  }

  return data.Response;
};

// ================= CATEGORY APIs =================

export const getMenuCategories = async () => {
  try {
    const response = await api.get("/menu/getMenuCategories");
    return extractResponse(response.data);
  } catch (error) {
    console.error("Get categories error:", error);
    throw error;
  }
};

export const insertMenuCategory = async (categoryData) => {
  try {
    const response = await api.post(
      "/menu/insertMenuCategory",
      categoryData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Insert category error:", error);
    throw error;
  }
};

export const updateMenuCategory = async (categoryData) => {
  try {
    const response = await api.put(
      "/menu/updateMenuCategory",
      categoryData
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
};

export const deleteMenuCategory = async (id) => {
  try {
    const response = await api.delete(
      `/menu/deleteMenuCategory/${id}`
    );
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};

// ================= MENU APIs =================

export const getMenus = async () => {
  try {
    const response = await api.get("/menu/getMenus");
    return extractResponse(response.data);
  } catch (error) {
    console.error("Get menus error:", error);
    throw error;
  }
};

export const insertMenu = async (menuData) => {
  try {
    const response = await api.post("/menu/insertMenu", menuData);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Insert menu error:", error);
    throw error;
  }
};

export const updateMenu = async (menuData) => {
  try {
    const response = await api.put("/menu/updateMenu", menuData);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Update menu error:", error);
    throw error;
  }
};

export const deleteMenu = async (id) => {
  try {
    const response = await api.delete(`/menu/deleteMenu/${id}`);
    return extractResponse(response.data);
  } catch (error) {
    console.error("Delete menu error:", error);
    throw error;
  }
};

import API from "../api/axios";

export const getAllLocations = async () => {
  const response = await API.get("/location/all");
  return response.data;
};

export const searchLocations = async (query) => {
  const response = await API.get(`/location/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getLocationBySlug = async (slug) => {
  const response = await API.get(`/location/slug/${slug}`);
  return response.data;
};

export const createLocation = async (locationData) => {
  const response = await API.post("/location/create", locationData);
  return response.data;
};

export const updateLocation = async (id, locationData) => {
  const response = await API.put(`/location/update/${id}`, locationData);
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await API.delete(`/location/delete/${id}`);
  return response.data;
};

// ====================== CATEGORY API SERVICES ======================
export const getAllCategories = async () => {
  const response = await API.get("/category/all");
  return response.data;
};

export const createCategory = async (catData) => {
  const response = await API.post("/category/create", catData);
  return response.data;
};

export const updateCategory = async (id, catData) => {
  const response = await API.put(`/category/update/${id}`, catData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/category/delete/${id}`);
  return response.data;
};

// ====================== SETTINGS API SERVICES ======================
export const getSettings = async () => {
  const response = await API.get("/settings");
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await API.put("/settings", settingsData);
  return response.data;
};

// ====================== MEDIA API SERVICES ======================
export const getAllMedia = async () => {
  const response = await API.get("/media/all");
  return response.data;
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await API.delete(`/media/delete/${id}`);
  return response.data;
};

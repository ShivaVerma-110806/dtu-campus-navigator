import API from "../api/axios";

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get("/auth/users");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await API.put(`/auth/users/${id}/role`, { role });
  return response.data;
};

export const updateUserStatus = async (id, isSuspended) => {
  const response = await API.put(`/auth/users/${id}/status`, { isSuspended });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/auth/users/${id}`);
  return response.data;
};

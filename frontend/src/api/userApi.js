import API from "./axios";

// current user
export const getProfile = () => API.get("/users/me");

// update profile
export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

// search with pagination
export const searchUsers = (keyword, page = 0, size = 10) =>
  API.get(`/users/search?keyword=${keyword}&page=${page}&size=${size}`);

// online status
export const updateUserStatus = (id, online) =>
  API.put(`/users/${id}/online?online=${online}`);

// delete user
export const deleteUser = (id) =>
  API.delete(`/users/${id}`);
import API from "./axios";

// create
export const createNotification = (data) =>
  API.post("/notification", data);

// get notifications
export const getUserNotifications = () =>
  API.get("/notification"); // ✅ FIXED

// mark seen
export const markAsSeen = (id) =>
  API.put(`/notification/seen/${id}`);

// unread count
export const getUnreadCount = () =>
  API.get("/notification/unread");
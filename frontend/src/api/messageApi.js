import API from "./axios";

// send message (normal + scheduled)
export const sendMessage = (data) =>
  API.post("/message", data);

// get messages
export const getMessages = (chatId) =>
  API.get(`/message/${chatId}`);

// delivered
export const markDelivered = (chatId) =>
  API.put(`/message/delivered/${chatId}`);

// seen
export const markSeen = (chatId) =>
  API.put(`/message/seen/${chatId}`);

// delete
export const deleteMessage = (id) =>
  API.delete(`/message/${id}`);

// edit
export const editMessage = (id, data) =>
  API.put(`/message/${id}`, data);

export const getScheduledMessages = (chatId) =>
  API.get(`/message/scheduled/${chatId}`);
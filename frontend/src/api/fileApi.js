import API from "./axios";

export const uploadFile = (file, chatId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chatId", chatId);

  return API.post("/file/upload", formData);
};

export const getFiles = (chatId) =>
  API.get(`/file/${chatId}`);
import API from "./axios";

// create or get existing chat
export const createChatRoom = (data) => {
    return API.post("/chatroom", data);
};

// optional: get all chats (future use)
export const getMyChats = () => {
    return API.get("/chatroom/my");
};
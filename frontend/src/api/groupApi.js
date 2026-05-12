import API from "./axios";

// create group
export const createGroup = (data) =>
  API.post("/group", data);

// my groups
export const getMyGroups = () =>
  API.get("/group/my");

// single group
export const getGroup = (groupId) =>
  API.get(`/group/${groupId}`);

// add member
export const addMember = (data) =>
  API.post("/group/add", data);

// remove member
export const removeMember = (data) =>
  API.post("/group/remove", data);

// leave group
export const leaveGroup = (data) =>
  API.post("/group/leave", data);

// delete group
export const deleteGroup = (groupId, userId) =>
  API.delete(`/group/${groupId}?userId=${userId}`);
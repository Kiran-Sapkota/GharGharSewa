import axiosInstance from "./axiosInstance";

export const getAllUsers = () => {
  return axiosInstance.get("/admin/users");
};

export const getAllProvidersAdmin = () => {
  return axiosInstance.get("/admin/providers");
};

export const getAllBookingsAdmin = () => {
  return axiosInstance.get("/admin/bookings");
};

export const verifyProvider = (providerId) => {
  return axiosInstance.patch(`/admin/providers/${providerId}/verify`);
};

export const unverifyProvider = (providerId) => {
  return axiosInstance.patch(`/admin/providers/${providerId}/unverify`);
};

export const deactivateAccount = (userId) => {
  return axiosInstance.patch(`/admin/users/${userId}/deactivate`);
};

export const reactivateAccount = (userId) => {
  return axiosInstance.patch(`/admin/users/${userId}/reactivate`);
};
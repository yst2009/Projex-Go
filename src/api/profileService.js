import apiClient from './apiClient.js';

export const getProfile = () => apiClient.get('/profile');

export const updateProfile = (data) =>
  apiClient.post('/profile/update', data);

export const searchUsers = (skills) =>
  apiClient.get(`/profile/search?skills=${skills}`);

export const createProfile = (data) =>
  apiClient.post('/profile/create', data);

export const getProfileById = (id) =>
  apiClient.get(`/profile/${id}`);

export const deleteProfile = (id) =>
  apiClient.delete(`/profile/${id}`);

export const updateUser = (data) =>
  apiClient.post('/user/update', data);

import apiClient from './apiClient.js';

export const register = (userData) =>
     apiClient.post('/register', userData);

export const login = (credentials) =>
     apiClient.post('/login', credentials);

export const logout = () =>
     apiClient.post('/logout');

export const deleteAccount = () =>
     apiClient.post('/delete');

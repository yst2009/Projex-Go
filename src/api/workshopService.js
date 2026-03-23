import apiClient from './apiClient';

export const getAllWorkshops = () => apiClient.post('/workshops');
export const getWorkshopDetails = (id) => apiClient.post(`/workshops/show/${id}`);
export const createWorkshop = (data) => apiClient.post('/workshops/store', data);
export const searchWorkshops = (keyword) => apiClient.post('/workshops/search', { q: keyword });
export const enrollInWorkshop = (id) => apiClient.post(`/workshops/enroll/${id}`);
export const trackProgress = (data) => apiClient.post('/workshops/progress', data);
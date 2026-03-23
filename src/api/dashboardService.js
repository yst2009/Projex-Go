import apiClient from './apiClient';

export const getUserStats = () => 
    apiClient.post('/dashboard/user');

export const getProjectStats = (projectId) => 
    apiClient.post(`/dashboard/project/${projectId}`);

export const getSystemStats = () => 
    apiClient.post('/dashboard/stats');

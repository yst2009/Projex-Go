import apiClient from './apiClient';

export const getInvestors = () => 
    apiClient.post('/investors');

export const proposeInvestment = (data) => 
    apiClient.post('/investments/propose', data);

export const acceptInvestment = (id) => 
    apiClient.post(`/investments/accept/${id}`);

export const rejectInvestment = (id) => 
    apiClient.post(`/investments/reject/${id}`);

export const completeInvestment = (id) => 
    apiClient.post(`/investments/complete/${id}`);

export const getInvestmentDetails = (id) => 
    apiClient.post(`/investments/show/${id}`);
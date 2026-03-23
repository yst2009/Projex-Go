import apiClient from './apiClient';

export const getAllChallenges = () => 
    apiClient.post('/challenges');

export const createChallenge = (data) => 
    apiClient.post('/challenges/store', data);

export const submitSolution = (id, submissionData) => 
    apiClient.post(`/challenges/submit/${id}`, submissionData);

export const acceptSolution = (id) => 
    apiClient.post(`/challenges/accept/${id}`);

export const rejectSolution = (id) => 
    apiClient.post(`/challenges/reject/${id}`);

export const reviewSolution = (id, reviewData) => 
    apiClient.post(`/challenges/Review/${id}`, reviewData);

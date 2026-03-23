import apiClient from './apiClient';

export const getAllMentorships = () => apiClient.get('/mentorships');

export const searchMentorBySkills = (skills) => 
    apiClient.post('/mentorships/searchmentorbyskills', { skills });

export const createMentorship = (data) => 
    apiClient.post('/mentorships/store', data);

export const inviteMentee = (data) => 
    apiClient.post('/mentorships/invitemember', data);

export const acceptMentorship = (data) => 
    apiClient.post('/mentorships/accept', data);

export const rejectMentorship = (data) => 
    apiClient.post('/mentorships/reject', data);

export const updateProgress = (data) => 
    apiClient.post('/mentorships/progress', data);

export const showProgress = (data) => 
    apiClient.post('/mentorships/ShowProgress', data);

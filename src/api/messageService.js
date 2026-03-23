import apiClient from './apiClient';

export const sendMessage = (data) => 
    apiClient.post('/messages/store', data);

export const getConversation = (data) => 
    apiClient.post('/messages/conversation', data);

export const getAllNotifications = () => 
    apiClient.post('/messages/showallnotifications');

export const markAsRead = (id) => 
    apiClient.post(`/messages/makeread/${id}`);

export const searchUsers = (query) => 
    apiClient.get(`/profile/search?query=${query}`);
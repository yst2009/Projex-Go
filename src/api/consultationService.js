import apiClient from './apiClient';

export const bookConsultation = (data) => apiClient.post('/consultations/store', data);
export const getConsultations = () => apiClient.post('/consultations/index');

export const acceptConsultation = (id) => apiClient.post(`/consultations/accept/${id}`);
export const rejectConsultation = (id) => apiClient.post(`/consultations/reject/${id}`);

export const completeConsultation = (id, results) =>
  apiClient.post(`/consultations/complete/${id}`, { professor_notes: results });

export const getConsultationDetails = (id) =>
  apiClient.post(`/consultations/show/${id}`);

export const updateConsultationStatus = (id, status) =>
  apiClient.post(`/consultations/updatestatus/${id}`, { status });

export const scheduleConsultation = (id, dateTime, link) =>
  apiClient.post(`/consultations/schedule/${id}`, { date_time: dateTime, meeting_link: link });


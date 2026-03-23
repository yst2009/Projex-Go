import apiClient from './apiClient.js';

export const getAllProjects = () =>
  apiClient.get('/projects');

export const getProjectById = (projectId) =>
  apiClient.get(`/projects/${projectId}`);

export const createProject = (projectData) =>
  apiClient.post('/projects/create', projectData);

export const updateProject = (projectData) =>
  apiClient.post('/projects/update', projectData);

export const deleteProject = (projectId) =>
  apiClient.delete(`/projects/${projectId}`); 

export const getTeamMembers = () =>
  apiClient.get('/projects/team');

export const inviteMember = (invitationData) =>
  apiClient.post('/projects/invite', invitationData);

export const getMyInvitations = () =>
  apiClient.get('/projects/invitations');

export const acceptInvitation = (invitationData) =>
  apiClient.post('/projects/accept', invitationData);

export const rejectInvitation = (invitationData) =>
  apiClient.post('/projects/reject', invitationData);

export const deleteMember = (projectId, memberId) =>
  apiClient.post('/projects/DeleteMember', { 
    project_id: projectId, 
    member_id: memberId 
  });
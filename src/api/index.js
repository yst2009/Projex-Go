import * as authService from './authService.js';
import * as profileService from './profileService.js';
import * as projectService from './projectService.js';
import * as mentorshipService from './mentorshipService.js';
import * as consultationService from './consultationService.js';
import * as investmentService from './investmentService.js';
import * as messageService from './messageService.js';
import * as workshopService from './workshopService.js';
import * as challengeService from './challengeService.js';
import * as dashboardService from './dashboardService.js';

const ApiService = {
  auth: authService,
  profile: profileService,
  projects: projectService,
  mentorships: mentorshipService,
  consultations: consultationService,
  investments: investmentService,
  messages: messageService,
  workshops: workshopService,
  challenges: challengeService,
  dashboard: dashboardService,
};

export default ApiService;

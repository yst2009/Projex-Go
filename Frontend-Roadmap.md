# 🎯 ProJex Go - Frontend Development Roadmap

**Complete API Backend Ready | 70+ Endpoints | Laravel 10**

## 📋 Table of Contents
| Part 1 | Part 2 | Part 3 |
|--------|--------|--------|
| [Authentication](#part-1-authentication-apis) | [Profile](#part-2-user-profile-apis) | [Projects](#part-3-projects-apis) |

| Part 4 | Part 5 | Part 6 |
|--------|--------|--------|
| [Mentorships](#part-4-mentorships-apis) | [Consultations](#part-5-consultations-apis) | [Investments](#part-6-investments-apis) |

| Part 7 | Part 8 | Part 9 |
|--------|--------|--------|
| [Messages](#part-7-messages-apis) | [Workshops](#part-8-workshops-apis) | [Challenges](#part-9-challenges-apis) |

| Part 10 |
|---------|
| [Dashboard](#part-10-dashboard-apis) |

---

# Part 1: Authentication APIs

## 🔗 Endpoints:
1. POST /register → Create new account
2. POST /login → Login with Email + Password
3. POST /logout → Logout (requires token)
4. POST /delete → Delete account

## 🔑 What it does?
- **Register**: New user creates account with Email + Password
- **Login**: User authenticates with existing credentials, system returns Token (access card)
- **Logout**: User logs out, Token expires
- **Delete**: Permanently delete account

## 👨‍💻 Frontend Work:
- Register Screen (Form with Email, Password, Confirm Password)
- Login Screen (Form with Email, Password)
- Save Token for use in other API calls

---

# Part 2: User Profile APIs

## 🔗 Endpoints:
1. GET /profile → Show profile data
2. POST /profile/update → Update profile data
3. POST /profile/create → Create new profile
4. GET /profile/{id} → Show other user profile
5. DELETE /profile/{id} → Delete profile
6. GET /profile/search → Search users
7. POST /user/update → Update user data

## 🔑 What it does?
- **index**: Show your profile
- **update**: Edit photo, name, bio
- **create**: Create new profile first time
- **search**: Search other users (for mentorship)
- **show**: View someone else's profile

## 👨‍💻 Frontend Work:
- Profile Screen (Display data + Edit button)
- Edit Profile Screen (Form + Avatar Upload)
- Search Users Screen (List + Filter)
- User Card (Other user profile display)

---

# Part 3: Projects APIs

## 🔗 Endpoints:
1. GET /projects → Show all your projects
2. POST /projects/create → Create new project
3. POST /projects/update → Update project
4. POST /projects/destroy → Delete project
5. GET /projects/{id} → Show project details
6. GET /projects/edit → Edit form
7. GET /projects/team → Show all team members
8. POST /projects/invite → Invite new member
9. POST /projects/accept → Accept invitation
10. POST /projects/reject → Reject invitation
11. POST /projects/DeleteMemeber → Remove team member
12. POST /projects/RequirmentofTheProject → Add project requirements

## 🔑 What it does?
- **Create**: Start new project (name, description, budget)
- **Update**: Update project details
- **Invite**: Invite people to work on your project
- **Accept/Reject**: Accept or reject team invitations

## 👨‍💻 Frontend Work:
- Projects List Screen (Table with all projects)
- Create Project Screen (Form)
- Project Details Screen (Info + Team + Requirements)
- Team Members Screen (List + Invite new)
- Edit Project Screen (Edit form)

---

# Part 4: Mentorships APIs

## 🔗 Endpoints:
1. GET /mentorships → Show all mentorship programs
2. POST /mentorships/searchmentorbyskills → Search mentor by skills
3. POST /mentorships/store → Create new mentorship program
4. POST /mentorships/invitemember → Invite mentee
5. POST /mentorships/accept → Accept program
6. POST /mentorships/reject → Reject program
7. POST /mentorships/progress → Track progress
8. POST /mentorships/ShowProgress → Show progress

## 🔑 What it does?
- **store**: Mentor creates training program for specific skill
- **searchmentorbyskills**: Student searches mentor by skill (JavaScript, etc.)
- **accept/reject**: Accept or reject mentorship program
- **progress**: Mentor updates "Student completed 50% of curriculum"

## 👨‍💻 Frontend Work:
- Mentors List Screen (List + Skills filter)
- Create Mentorship Screen (Form if you're mentor)
- Mentor Details Screen (Mentor information)
- Progress Tracker Screen (Progress chart)

---

# Part 5: Consultations APIs

## 🔗 Endpoints:
1. POST /consultations/store → Book consultation
2. POST /consultations/index → Show consultations
3. POST /consultations/accept/{id} → Accept consultation (expert)
4. POST /consultations/reject/{id} → Reject consultation
5. POST /consultations/complete/{id} → Consultation completed
6. POST /consultations/show/{id} → Show consultation details
7. POST /consultations/updatestatus/{id} → Update status
8. POST /consultations/schedule/{id} → Schedule appointment

## 🔑 What it does?
- **store**: Book consultation session with specific expert
- **accept**: Expert accepts consultation request
- **schedule**: Set date and time for meeting
- **complete**: Consultation finished, expert adds results

## 👨‍💻 Frontend Work:
- Book Consultation Screen (Select expert + Write topic)
- Pending Consultations Screen (Waiting for approval)
- Scheduled Consultations Screen (Scheduled sessions)
- Consultation Details Screen (Details + Notes)

---

# Part 6: Investments APIs

## 🔗 Endpoints:
1. POST /investors → Show investors list
2. POST /investments/propose → Propose investment
3. POST /investments/accept/{id} → Accept investment (investor)
4. POST /investments/reject/{id} → Reject investment
5. POST /investments/complete/{id} → Complete investment
6. POST /investments/show/{id} → Show investment details

## 🔑 What it does?
- **propose**: Project owner pitches idea to investor "I need 50K EGP"
- **accept**: Investor approves "I will fund this project"
- **complete**: Funding transferred successfully

## 👨‍💻 Frontend Work:
- Investment Proposals Screen (List of offers)
- Propose Investment Screen (Form)
- Investor Profile Screen (Investor information)
- Investment Details Screen (Details + Contract)

---

# Part 7: Messages APIs

## 🔗 Endpoints:
1. POST /messages/store → Send message
2. POST /messages/getmessages_sender → Messages sent by user
3. POST /messages/getmessages_receiver → Messages received by user
4. POST /messages/showallnotifications → Show all notifications
5. POST /messages/makeread/{id} → Mark message as read

## 🔑 What it does?
- **store**: Send message to another user
- **getmessages_sender/receiver**: Show chat between two users
- **showallnotifications**: All notifications in one place
- **makeread**: "I've read this message"

## 👨‍💻 Frontend Work:
- Chat Screen (1:1 messaging)
- Notifications Center Screen (All notifications)
- Unread Messages Badge Counter

---

# Part 8: Workshops APIs

## 🔗 Endpoints:
1. POST /workshops → Show all workshops
2. POST /workshops/show/{id} → Show workshop details
3. POST /workshops/store → Create new workshop
4. POST /workshops/search → Search workshops
5. POST /workshops/entroll/{id} → Enroll in workshop
6. POST /workshops/progress → Track progress

## 🔑 What it does?
- **store**: Create workshop (free or paid training)
- **entroll**: User registers for workshop
- **progress**: Track "How many completed workshop"

## 👨‍💻 Frontend Work:
- Workshops List Screen (List of workshops)
- Workshop Details Screen (Workshop information)
- Enroll Button
- Progress Tracker Screen

---

# Part 9: Challenges APIs

## 🔗 Endpoints:
1. POST /challenges → Show all challenges
2. POST /challenges/store → Create new challenge
3. POST /challenges/submit/{id} → Submit challenge solution
4. POST /challenges/accept/{id} → Accept solution (judge)
5. POST /challenges/reject/{id} → Reject solution
6. POST /challenges/Review/{id} → Review solution

## 🔑 What it does?
- **store**: Create coding challenge ("Build Todo App")
- **submit**: Contestant submits solution
- **accept/reject**: Judge approves or rejects solution
- **Review**: Judge writes feedback on solution

## 👨‍💻 Frontend Work:
- Challenges List Screen
- Challenge Details Screen (Description + Deadline)
- Submit Solution Screen (File upload or GitHub link)
- Leaderboard Screen (Contestant ranking)

---

# Part 10: Dashboard APIs

## 🔗 Endpoints:
1. POST /dashboard/user → User statistics
2. POST /dashboard/project/{id} → Project analytics
3. POST /dashboard/stats → System-wide statistics

## 🔑 What it does?
- **user**: Number of projects, messages, pending offers
- **project**: Team size, completion percentage
- **stats**: Total users, active projects, revenue metrics

## 👨‍💻 Frontend Work:
- Dashboard Screen (Main statistics overview)
- Charts & Graphs (Data visualization)
- Statistics Cards (Key metrics display)

---

## 🧪 Test APIs
📥 [Postman Collection](postman/projex-go-api.json)

**Base URL:** `http://your-domain/api`
**Authorization:** Bearer Token (from /login)
**Ready for:** React Native | Flutter | Vue.js | Next.js

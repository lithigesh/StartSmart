# StartSmart – AI-Powered Startup Evaluation & Funding Ecosystem

StartSmart is a full-stack platform for early-stage entrepreneurs to submit and validate startup ideas, request funding, participate in ideathons, and communicate with investors and admins.

---

## Live Access

| Interface | URL |
|-----------|-----|
| Frontend (User App) | [startsmart-frontend.vercel.app](https://startsmart-frontend.vercel.app/) |
| Admin Dashboard | [startsmart-frontend.vercel.app/admin](https://startsmart-frontend.vercel.app/admin) |
| Backend API | [startsmart-backend.onrender.com](https://startsmart-backend.onrender.com/) |

---

![Start Smart_page-0001](https://github.com/user-attachments/assets/5e059795-f4cd-4bd3-a044-eb7f9219db2a)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS, DaisyUI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT (JSON Web Tokens) |
| **AI Evaluation** | ChatGPT-4o (OpenAI) |
| **Email Service** | SendGrid |
| **Real-time** | Socket.IO |
| **PDF Reports** | PDF generation library |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Problem Statement

Early-stage founders often lack access to proper evaluation mechanisms or expert support to assess the feasibility and potential of their ideas. Traditional funding or ideathon processes can be subjective, slow, and sometimes biased. There is also no uniform digital space where investors can track ideas, analyze submissions, and allocate funds based on real merit.

---

## What We Built

### Three Role-Based Dashboards

StartSmart provides distinct, tailored dashboards for each user role:

**1. Entrepreneur Dashboard**
- Submit startup ideas through a structured form
- Receive AI-generated evaluation reports powered by ChatGPT-4o
- Raise funding requests based on evaluations
- Register for and participate in ideathons
- Track the status of submissions and funding in real time

**2. Investor Dashboard**
- Browse and analyze submitted startup ideas with AI reports
- Approve or reject funding requests
- Communicate with entrepreneurs through negotiation messaging
- Track investment history and active portfolio

**3. Admin Dashboard**
- Manage all users, roles, and platform access
- Oversee idea submissions and evaluations
- Create and manage ideathons, including results
- Monitor platform activity and handle content moderation

---

## Objective

- Provide an AI-based evaluation system for startup ideas.
- Create a platform where entrepreneurs and investors can interact digitally.
- Introduce a structured and fair way to conduct ideathons and funding competitions.
- Reduce delays and manual work in idea selection and funding allocation.
- Make startup innovation more accessible in educational and entrepreneurial environments.

---

## How It Works

1. User registers and selects a role (Entrepreneur, Investor, Admin).
2. Entrepreneurs submit their business ideas through a structured form.
3. The platform analyzes submissions using ChatGPT-4o and generates an evaluation report.
4. Entrepreneurs can raise funding requests based on the evaluation.
5. Investors view idea reports and decide whether to fund or reject requests.
6. Admins manage users, submissions, ideathons, and platform activities.

---

## User Roles and Access Levels

| Role | Key Permissions |
|------|-----------------|
| Entrepreneur | Submit ideas, view reports, request funding |
| Investor | Analyze ideas, approve funding, track investments |
| Admin | Manage users, content, ideathons, and platform settings |

---

## Real-World Use Cases

- Students participating in startup-based events or hackathons.
- Colleges conducting ideathons or entrepreneurship competitions.
- Freelance entrepreneurs looking for validation and investor visibility.
- Investors searching for early-stage innovative ideas to support.
- Incubation centers tracking and evaluating startup pipelines.

---

## Future Scope and Enhancements

- Integration with real payment gateways for automated funding.
- Support for video pitch submissions and feedback.
- Public idea leaderboard and community voting system.
- Additional AI insights such as market fit and risk analysis.
- Multilingual support for wider audience reach.

---

## Quickstart (Local Development)

### Prerequisites

- Node.js 18+
- MongoDB connection string (Atlas or local)

### 1) Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/startsmart
JWT_SECRET=change_me

# CORS
FRONTEND_URL=http://localhost:5173

# AI (OpenAI)
OPENAI_API_KEY=your_openai_key

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
VERIFIED_SENDER_EMAIL=verified_sender@example.com

# Admin defaults (optional)
ADMIN_EMAIL=admin@startsmart.com
ADMIN_PASSWORD=change_me
ADMIN_NAME=StartSmart Administrator
ADMIN_VERIFICATION_PASSWORD=change_me

# Server
PORT=5001
NODE_ENV=development
```

Run the API:

```bash
npm run dev
```

Backend runs on `http://localhost:5001`.

### 2) Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```bash
VITE_API_URL=http://localhost:5001
```

Run the app:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

> **Note:** Secrets such as API keys must be provided via environment variables and should never be committed to git. For backend API details, see `Backend/README.md`. For UI details, see `Frontend/README.md`.

---

## Contributors

| [Lithigesh P G](https://github.com/lithigesh) | [Ponabirami K A](https://github.com/Ponabirami1718) | [Nanthana S](https://github.com/Nanthana04) | [Kavinbalaji S](https://github.com/kavinbalaji2005) |
|-----------------------------------------------|-----------------------------------------------------|---------------------------------------------|-----------------------------------------------------|
| <img src="https://github.com/lithigesh.png" width="90px"> | <img src="https://github.com/Ponabirami1718.png" width="90px"> | <img src="https://github.com/Nanthana04.png" width="90px"> | <img src="https://github.com/kavinbalaji2005.png" width="90px"> |

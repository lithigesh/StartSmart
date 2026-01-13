# StartSmart – AI-Powered Startup Evaluation & Funding Ecosystem

StartSmart is a full-stack platform for early-stage entrepreneurs to submit and validate startup ideas, request funding, participate in ideathons, and communicate with investors/admins.

This repository contains:

- `Backend/`: Node.js + Express API (MongoDB, JWT, OpenRouter AI analysis, SendGrid email, Socket.IO server)
- `Frontend/`: React + Vite app (Tailwind + DaisyUI)

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

# AI (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_key
# Optional: defaults to openai/gpt-4o-mini
OPENROUTER_MODEL=openai/gpt-4o-mini

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

---

## Key Features

- **AI idea evaluation** via OpenRouter (configurable model; default `openai/gpt-4o-mini`)
- **Role-based access** (Entrepreneur / Investor / Admin) using JWT
- **Funding workflows** including negotiation messaging
- **Ideathon module** (create, register, withdraw, manage results)
- **Notifications** endpoints + Socket.IO server available on the backend
- **PDF report generation** for idea analysis

---

## Sample Login Credentials (Local/Demo)

The backend supports admin defaults via environment variables. If you haven’t customized them, the codebase includes fallbacks for local testing.

For production, always set strong values in `Backend/.env` and never commit secrets.

---

## Problem Statement

Early-stage founders often lack access to proper evaluation mechanisms or expert support to assess the feasibility and potential of their ideas. Traditional funding or ideathon processes can be subjective, slow, and sometimes biased. There is also no uniform digital space where investors can track ideas, analyze submissions, and allocate funds based on real merit.

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
3. The platform analyzes submissions using AI and generates an evaluation report.
4. Entrepreneurs can raise funding requests based on the evaluation.
5. Investors view idea reports and decide whether to fund or reject requests.
6. Admins manage users, submissions, ideathons, and platform activities.

---

## User Roles and Access Levels

| Role         | Key Permissions                                         |
| ------------ | ------------------------------------------------------- |
| Entrepreneur | Submit ideas, view reports, request funding             |
| Investor     | Analyze ideas, approve funding, track investments       |
| Admin        | Manage users, content, ideathons, and platform settings |

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

## Contributors

| [Lithigesh P G](https://github.com/lithigesh)             | [Ponabirami K A](https://github.com/Ponabirami1718)            | [Nanthana S](https://github.com/Nanthana04)                | [Kavinbalaji S](https://github.com/kavinbalaji2005)             |
| --------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| <img src="https://github.com/lithigesh.png" width="90px"> | <img src="https://github.com/Ponabirami1718.png" width="90px"> | <img src="https://github.com/Nanthana04.png" width="90px"> | <img src="https://github.com/kavinbalaji2005.png" width="90px"> |

---

## Notes

- Secrets such as API keys must be provided via environment variables and should not be committed to git.
- For backend API details, see `Backend/README.md`. For UI details, see `Frontend/README.md`.

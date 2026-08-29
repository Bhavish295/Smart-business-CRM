# Smart Business CRM

A full-stack Customer Relationship Management (CRM) application for managing leads, clients, follow-ups, employees, and business analytics.

![Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Stack](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)

---

## Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Stats overview, lead pipeline chart, recent leads |
| **Leads** | CRUD, search, status filter, convert to client |
| **Clients** | Full client management |
| **Follow-ups** | Schedule tasks, link to leads, mark complete |
| **Employees** | Team management with roles |
| **Reports** | Pie & bar charts, conversion rate |
| **Auth** | Register, login, JWT protected routes |

---

## Architecture

```
Browser (React + Vite)
        │
        ▼  Axios + JWT
Node.js + Express API
        │
        ▼
Supabase (PostgreSQL)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Supabase](https://supabase.com/) account (free tier works)
- npm (comes with Node.js)

---

## Quick Start

### 1. Clone & install

```bash
cd smart-business-crm

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

**Backend** — copy `.env.example` to `.env`:

```bash
cd backend
cp .env.example .env   # or create manually on Windows
```

Edit `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_secret_key_here
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:5173
```

Get Supabase keys from: **Project Settings → API → service_role (secret)**

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Set up database

Open Supabase **SQL Editor** and run in order:

1. `backend/supabase/schema.sql` — creates all tables
2. If tables already exist with wrong columns, run `backend/supabase/fix-all-tables.sql`

### 4. Run the app

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** → Register → Start using the CRM.

---

## Project Structure

```
smart-business-crm/
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/                # Supabase connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & error handling
│   ├── routes/                # API routes
│   ├── utils/                 # JWT helper
│   └── supabase/              # SQL schema & migrations
│
├── frontend/
│   └── src/
│       ├── pages/             # Dashboard, Leads, Clients...
│       ├── components/        # UI components
│       ├── context/           # Auth & Toast
│       ├── layouts/           # App shells
│       └── services/api.js    # Axios client
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (protected) |
| GET | `/api/dashboard/stats` | Dashboard data |
| GET/POST | `/api/leads` | List / create leads |
| PUT/DELETE | `/api/leads/:id` | Update / delete lead |
| GET/POST | `/api/clients` | List / create clients |
| POST | `/api/clients/convert/:leadId` | Convert lead to client |
| GET/POST | `/api/follow-ups` | Follow-up management |
| GET/POST | `/api/employees` | Employee management |
| GET | `/api/reports` | Analytics data |
| GET | `/api/health` | Health check |

All routes except auth and health require `Authorization: Bearer <token>` header.

---

## Daily Usage

### Start servers
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Recommended workflow
1. Add **Leads** from inquiries
2. Update status as you contact them (New → Contacted → Qualified)
3. Schedule **Follow-ups** for important leads
4. **Convert** won leads to **Clients**
5. Review **Dashboard** and **Reports** weekly

---

## Lead Status Flow

```
New → Contacted → Qualified → Won / Lost
                              ↓
                          Client (convert)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `permission denied for table` | Run `backend/supabase/migration.sql` in Supabase |
| `column user_id does not exist` | Run `backend/supabase/fix-all-tables.sql` |
| Login fails | Check backend is running on port 5000 |
| CORS errors | Verify `CLIENT_URL` in backend `.env` |
| Empty dashboard | Add leads first; data appears after creation |

---

## Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Recharts, Framer Motion, Lucide Icons

**Backend:** Node.js, Express 5, JWT, bcryptjs, Supabase JS client

**Database:** PostgreSQL via Supabase

---

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | backend | Start API with nodemon |
| `npm start` | backend | Start API (production) |
| `npm run dev` | frontend | Start dev server |
| `npm run build` | frontend | Production build |

---

## Security Notes

- Never commit `.env` files or expose the **service_role** key
- Use the **service_role** key only on the backend, never in frontend code
- Change `JWT_SECRET` before deploying to production
- Rotate Supabase keys if accidentally exposed

---

## License

ISC

---

## Author

Smart Business CRM — Built for small businesses to manage sales and customer relationships efficiently.

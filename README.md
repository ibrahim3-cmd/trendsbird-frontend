# Trendsbird — Frontend (Admin Dashboard)

> A modern React-based admin dashboard for the Trendsbird e-commerce platform, built as part of the **Trends Bird Limited — Backend Intern Assignment**.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Configuring the API Target](#configuring-the-api-target)
  - [Running the App](#running-the-app)
- [Login Credentials](#login-credentials)
- [Features Overview](#features-overview)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)
- [Deployment](#deployment)
- [Notes](#notes)

---

## Technology Stack

| Layer            | Technology                                                    |
| ---------------- | ------------------------------------------------------------- |
| **Framework**    | React 19 + TypeScript                                        |
| **Build Tool**   | Vite 5                                                       |
| **Styling**      | Tailwind CSS 4 (via `@tailwindcss/vite`)                     |
| **UI Library**   | shadcn/ui (Radix UI primitives + custom components)          |
| **State**        | Redux Toolkit + RTK Query                                    |
| **Routing**      | React Router v7                                              |
| **HTTP Client**  | Axios with interceptors (auto token refresh)                 |
| **Forms**        | React Hook Form + Zod validation                             |
| **Animations**   | Framer Motion                                                |
| **Icons**        | Lucide React                                                 |
| **Charts**       | Recharts                                                     |
| **Toasts**       | Sonner                                                       |
| **Hosting**      | Vercel                                                       |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22.x (LTS)
- **npm** ≥ 10.x
- A running instance of the [Trendsbird Backend](../trendsbird-backend) API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trendsbird-frontend

# Install dependencies
npm install
```

### Environment Variables

```bash
# Copy the example env file to create your own .env
cp .env.example .env
```

Open the newly created `.env` file and update as needed:

```env
VITE_IS_LIVE=false
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_BASE_URL_PROD=https://trendsbird-backend-1.onrender.com/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

| Variable              | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `VITE_IS_LIVE`        | Not directly used at runtime — see the `isLive` constant below       |
| `VITE_BASE_URL`       | API base URL for **local development**                               |
| `VITE_BASE_URL_PROD`  | API base URL for **production/deployed** backend                     |
| `VITE_FRONTEND_URL`   | This frontend's URL (used for CORS on the backend side)              |

### Configuring the API Target

The frontend uses an `isLive` flag to switch between local and production API URLs. This flag is a **hardcoded constant**, not an env variable:

**File: `src/constants/constant.ts`**

```ts
export const isLive = true;   // → uses VITE_BASE_URL_PROD (production API)
export const isLive = false;  // → uses VITE_BASE_URL (local API at localhost:5000)
```

> **⚠️ Important:** To develop against your local backend, change `isLive` to `false` in `src/constants/constant.ts` before starting the dev server.

### Running the App

```bash
# Development (with hot-reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The dev server will start on `http://localhost:5173`.

---

## Login Credentials

The backend seeds two default user accounts on startup. The login page provides a convenient **quick-switch toggle** to fill in credentials for either account:

| Account         | Email                  | Password       | Role          | Access Level                |
| --------------- | ---------------------- | -------------- | ------------- | --------------------------- |
| **Super Admin** | `admin@example.com`    | `admin1234`    | `superadmin`  | Full access — all modules   |
| **Catalog User**| `catalog@example.com`  | `Catalog123!`  | `catalog`     | Read-only — view dashboard, media, categories, brands, attributes, products |

The login page defaults to the Super Admin credentials. Use the **Admin / Catalog** toggle above the form to switch between accounts.

### Database Reset

A **Reset Database** button is available in the login page's settings menu (gear icon, top-right). This will:
1. Wipe all application data
2. Re-run migrations
3. Re-seed the default accounts and permissions

You will be prompted for a confirmation and a reset secret (`trendsbird-reset-secret` by default).

---

## Features Overview

### Dashboard
- Summary statistics and overview cards

### User Management
- List all users with search and role filtering
- Create, edit, and soft-delete users
- Assign roles to users
- Protected system users (admin, catalog) cannot be modified

### Role Management
- Create and manage custom roles
- Assign/remove permissions per role
- System roles are protected from deletion

### Permission Management
- View all permissions organized by module groups
- Permissions are seeded automatically (42 permissions across 9 modules)

### Media Library
- Upload single or multiple files (images, videos, PDFs)
- Grid-based media browser with search
- Image thumbnails auto-generated on upload
- Orphan protection — cannot delete media attached to products/categories

### Category Management
- Full CRUD with nested parent-child tree structure
- Image attachment via media picker
- Orphan protection — cannot delete categories with children or products

### Brand Management
- Full CRUD with logo media attachment
- Auto-generated slugs

### Attribute Management
- Full CRUD for product attributes
- Supports typed values: dropdown, radio, checkbox, colour, image

### Product Management
- Full CRUD with rich product data
- Multi-category assignment
- Multi-media attachment with thumbnail selection
- Brand association
- Product variant support with attribute value combinations

### Permission-Conditional UI
- UI elements are shown/hidden based on the logged-in user's permissions
- The Catalog user will see a read-only view with action buttons hidden

---

## Project Structure

```
trendsbird-frontend/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── layout/            # Sidebar, header, main layout
│   │   ├── modules/           # Feature-specific components
│   │   │   ├── Authentication/  # LoginForm
│   │   │   ├── Media/           # MediaPicker, MediaGrid
│   │   │   ├── Products/        # ProductForm, etc.
│   │   │   └── ...
│   │   └── ui/                # shadcn/ui base components
│   ├── config/                # API URL configuration
│   ├── constants/             # isLive flag, dev defaults, role names
│   ├── lib/                   # Axios instance with interceptors
│   ├── pages/                 # Route-level page components
│   │   ├── Login.tsx
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── media/
│   │   ├── categories/
│   │   ├── brands/
│   │   ├── attributes/
│   │   └── products/
│   ├── redux/
│   │   ├── baseApi.ts         # RTK Query base API
│   │   ├── axiosBaseQuery.ts  # Custom Axios-based RTK Query adapter
│   │   ├── features/          # Module-specific API slices
│   │   └── store.ts           # Redux store configuration
│   ├── App.tsx                # Root component with routing
│   └── main.tsx               # Entry point
├── .env.example               # Environment variable template
├── components.json            # shadcn/ui configuration
├── vite.config.ts             # Vite configuration
├── vercel.json                # Vercel deployment config
├── package.json
└── tsconfig.json
```

---

## Scripts Reference

| Script     | Command            | Description                                  |
| ---------- | ------------------ | -------------------------------------------- |
| `dev`      | `npm run dev`      | Start Vite dev server with HMR               |
| `build`    | `npm run build`    | Type-check and build for production           |
| `preview`  | `npm run preview`  | Preview the production build locally          |
| `lint`     | `npm run lint`     | Run ESLint                                    |

---

## Deployment

The frontend is configured for **Vercel** deployment:

- `vercel.json` includes a rewrite rule for SPA routing (all paths → `index.html`)
- Set `isLive = true` in `src/constants/constant.ts` before building for production
- Ensure `VITE_BASE_URL_PROD` in the Vercel environment variables points to your deployed backend

**Live URL:** [https://trendsbird-frontend-pi.vercel.app](https://trendsbird-frontend-pi.vercel.app)

---

## Notes

- This is a **companion frontend** built to demonstrate and test the backend API for the Trends Bird intern assignment.
- The frontend is not part of the assignment requirements but was created to provide a complete, functional admin dashboard for evaluation.
- The UI uses permission-based rendering — logging in as the Catalog user will hide all create/edit/delete actions while keeping the dashboard browsable.
- All API communication uses `Authorization: Bearer <token>` headers with automatic token refresh on 401 responses.

---

*Built as part of the Trends Bird Limited Backend Intern Assignment.*

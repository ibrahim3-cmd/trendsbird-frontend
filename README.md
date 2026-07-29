# Trends Bird Admin Frontend

Frontend dashboard for the Trends Bird e-commerce admin assignment. The UI should demonstrate the backend modules end to end and stay focused on admin workflows only.

## Project Summary

This frontend is expected to cover the assignment screens and behavior:

- Login and session restoration
- Sidebar-based dashboard shell with signed-in user and role
- Permission, role, user, media, category, brand, attribute, and product screens
- Permission-driven visibility for menu items and actions
- List, form, loading, empty, error, and validation states
- Transparent refresh-token retry handling on expired access tokens

## Current Repository Notes

- The existing template includes many unrelated CRM-style integrations and pages.
- Unnecessary features such as Vapi, Google Maps, extra analytics, and other non-assignment widgets should be removed from the project summary and implementation plan.
- Keep the UI practical and complete rather than decorative.

## Setup

### Requirements

- Node.js LTS
- npm

### Environment

Copy the example file and point the app at the backend API:

```bash
cp .env.example .env
```

### Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

## Environment Variables

| Variable        | Purpose              |
| --------------- | -------------------- |
| `VITE_BASE_URL` | Backend API base URL |

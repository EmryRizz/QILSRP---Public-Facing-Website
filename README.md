# QILSRP Public Website

Public website for the Queensland Indigenous Land and Sea Ranger Program. The site helps users browse ranger job opportunities, upcoming events, and ranger team information across Queensland.

## Team

Team 12

| Name | Student number |
| --- | --- |
| Emry Pramsewara | 12517984 |
| Ajhe | N12521396 |
| Josh Kim | N11760087 |
| Tommy Dinh | Not yet |

## Project Overview

This project is split into a frontend and backend:

- `frontend`: Next.js public website.
- `backend`: Express API server that reads data from Firebase Firestore.

The website provides:

- Job opportunity listings and detail pages.
- Event listings and event detail pages.
- Event participant registration.
- Ranger team detail pages.
- Google Maps integration for ranger teams, opportunities, and events.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: Firebase Firestore
- Maps: Google Maps JavaScript API

## Project Structure

```text
.
+-- backend
|   +-- src
|   |   +-- app.ts
|   |   +-- server.ts
|   |   +-- db
|   |   |   +-- firebase.ts
|   |   +-- routes
|   |       +-- events.ts
|   |       +-- opportunities.ts
|   |       +-- rangerTeams.ts
|   |       +-- test.ts
|   +-- package.json
+-- frontend
    +-- app
    |   +-- components
    |   +-- events
    |   +-- opportunities
    |   +-- ranger-teams
    |   +-- page.tsx
    +-- package.json
```

## Prerequisites

- Node.js
- npm
- Firebase service account key
- Google Maps JavaScript API key

## Environment Setup

### Backend

The backend uses Firebase Admin SDK and expects a service account file at:

```text
backend/src/config/serviceAccountKey.json
```

The API server runs on port `5000` by default. You can change the port with:

```bash
PORT=5000
```

### Frontend

Create `frontend/.env.local` and add:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation

From the project root, install backend dependencies:

```bash
cd backend
npm install
```

Then install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Project

Open a terminal at the project root and start the backend server:

```bash
cd backend
npm run dev
```

Open another terminal at the project root and start the frontend development server:

```bash
cd frontend
npm run dev
```

Open the website:

```text
http://localhost:3000
```

The backend API should be available at:

```text
http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/test-firestore` | Test Firestore connection |
| GET | `/opportunities` | Get approved job opportunities |
| GET | `/opportunities/:id` | Get one job opportunity |
| GET | `/events` | Get upcoming events |
| GET | `/events/:id` | Get one event |
| POST | `/events/:id/participants` | Register a participant for an event |
| GET | `/ranger-teams` | Get ranger teams |
| GET | `/ranger-teams/:id` | Get one ranger team |

## Available Scripts

### Backend

```bash
npm run dev
```

Starts the Express API server with `ts-node-dev`.

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

- `npm run dev`: starts the Next.js development server.
- `npm run build`: builds the frontend for production.
- `npm run start`: starts the production build.
- `npm run lint`: runs ESLint.

## Notes

- The frontend currently fetches API data from `http://localhost:5000`.
- The map requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- Firebase data is read from the `qilsr` Firestore database.

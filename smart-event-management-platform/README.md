# Smart Event Management Platform

A beginner-friendly MERN stack event management application for students and administrators.

## Features

- User registration and login
- bcrypt password hashing
- JWT authentication and protected routes
- Role-based admin authorization
- Upcoming and past event views
- Event search by title, category and location
- Event details
- Event registration
- Capacity management and available seats
- Duplicate registration prevention
- My Registrations
- Admin dashboard with statistics
- Admin event CRUD
- Admin view of event registrations
- Responsive CSS UI
- MVC backend architecture
- React components without a `pages` folder
- Fetch API only; no Axios

## Technologies

React, Vite, React Router DOM, JavaScript, Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs and CSS.

## Folder Structure

```text
smart-event-management-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   ├── seedAdmin.js
│   └── server.js
└── README.md
```

There is intentionally no `frontend/src/pages/` folder.

## Installation

### 1. MongoDB Atlas

Create a MongoDB Atlas cluster and database. Copy the connection string.

### 2. Backend environment

Inside `backend/`, copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Do not commit `.env`.

### 3. Install backend

```bash
cd backend
npm install
```

### 4. Create the admin

```bash
npm run seed-admin
```

The seed command creates the admin only if that email does not already exist.

### 5. Run backend

```bash
npm run dev
```

Backend: http://localhost:5000

### 6. Install and run frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API Documentation

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Events

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/events` | Public |
| GET | `/api/events/upcoming` | Public |
| GET | `/api/events/past` | Public |
| GET | `/api/events/:id` | Public |
| POST | `/api/events` | Admin |
| PUT | `/api/events/:id` | Admin |
| DELETE | `/api/events/:id` | Admin |
| GET | `/api/events/stats` | Admin |
| GET | `/api/events/:id/registrations` | Admin |

### Registrations

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/events/:id/register` | Authenticated user |
| GET | `/api/registrations/my` | Authenticated user |

## Interview Explanation

### Authentication flow

1. User registers.
2. Password is hashed with bcryptjs before it is saved.
3. During login, `bcrypt.compare()` checks the entered password against the stored hash.
4. The backend creates a JWT containing basic user information and role.
5. The frontend stores the token in localStorage.
6. Protected API calls send `Authorization: Bearer <token>`.
7. `authMiddleware` verifies the token and puts the decoded user on `req.user`.
8. `adminMiddleware` checks `req.user.role`.

### Why MVC?

- Models define MongoDB/Mongoose schemas.
- Routes define API endpoints.
- Controllers contain business logic.
- Middleware handles authentication, authorization and errors.

### How upcoming events work

The backend compares the event date with today's date. Events with a date greater than or equal to today are returned and sorted in ascending date order, so the nearest event appears first.

### Why `$regex`?

Search input is not an exact value. `$regex` lets MongoDB find documents whose title, category or location contains the search text. The `i` option makes the search case-insensitive.

## Notes

- This project intentionally uses simple React components and normal CSS so a fresher can understand the code.
- `node_modules`, `dist` and `.env` are not included.
- Replace the MongoDB connection string and JWT secret before running.

# ⚡ StudySpark – Smart Study Planner

A full-stack MERN application that helps students organise their academic activities through subject-wise task management, personalised dashboards and secure user authentication.

## 🌟 Overview

StudySpark is designed to make academic planning easier and more organised. Students can create subjects, manage study tasks, track completed and pending activities, and access their personal workspace securely.

## ✨ Features

- **User Authentication:** Secure signup and login using password hashing and JWT.
- **Personal Dashboard:** View total subjects, tasks, completed tasks and pending tasks.
- **Subject Management:** Add and manage custom study subjects.
- **Task Management:** Create, view, update and delete study tasks.
- **Task Priorities:** Organise tasks using Low, Medium and High priority levels.
- **User-specific Tasks:** Each authenticated user can access their own tasks.
- **Responsive Interface:** Layout adapts to different screen sizes.
- **Form Validation and Error Handling:** Basic input validation and API error handling.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- CSS
- Bootstrap
- React Router
- Fetch API

**Backend**
- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)
- bcryptjs

**Database**
- MongoDB Atlas
- Mongoose

**Tools**
- Visual Studio Code
- Git and GitHub
- Vite

## 📂 Project Structure

```text
studyspark-smart-study-planner/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── .gitignore
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aparsha26/studyspark-smart-study-planner.git
cd studyspark-smart-study-planner
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_private_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Security

- Passwords are hashed using bcryptjs.
- JWT authentication protects task API routes.
- Environment variables are used for sensitive configuration.
- Database credentials should never be committed to GitHub.

## 🎯 Project Objective

The objective of StudySpark is to provide students with a simple and organised platform to manage academic tasks, organise subjects and monitor study progress.

## 👩‍💻 Author

**Aparsha Agarwal**

MCA Student | Full Stack Development

GitHub: [@aparsha26](https://github.com/aparsha26)

---

⭐ If you find this project interesting, feel free to explore the repository!

<div align="center">

# 🎬 Nezflix - Streaming Platform

[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

*Nezflix is a modern, feature-rich streaming web application designed to bring a wide variety of movies and TV series to audiences globally. Explore, watch, and manage your personalized watchlist in a sleek, responsive interface.*

</div>

---

## ✨ Features

- **🔒 Secure Authentication:** Robust user registration and login system powered by bcrypt password hashing and JSON Web Tokens (JWT).
- **📂 Dynamic Content Catalog:** Browse through an extensive collection of movies and series categorized by genres.
- **❤️ Favorites & Watchlist:** Add, view, and remove your favorite movies and shows to curate your personal viewing list.
- **👤 Customizable User Profiles:** Manage personal information (username, email, phone number, birthday) and upload custom profile pictures.
- **🎨 Immersive UI/UX:** Responsive design built with modern libraries including Tailwind-inspired styling, Framer Motion animations, Swiper carousels, and 3D visual elements using Three.js & React Three Fiber.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js (v19) / Create React App
- **Routing:** React Router DOM (v7)
- **Animations & UI:** Framer Motion, Swiper, Font Awesome, Three.js / `@react-three/fiber`, ShaderGradient
- **HTTP Client:** Axios

### **Backend**
- **Environment:** Node.js & Express.js
- **Database:** MySQL (`mysql2`)
- **Authentication:** JWT (`jsonwebtoken`), Password Hashing (`bcrypt` / `bcryptjs`)
- **File Uploads:** `multer` for profile picture storage
- **Utilities:** `cors`, `body-parser`, `dotenv`

---

## 📁 Project Structure

```text
Movie-App/
├── movie-app/                 # Root workspace for app packages
│   ├── backend/               # Express server & API routes
│   │   ├── config/            # Database connection configuration
│   │   ├── controllers/       # Route business logic
│   │   ├── middleware/        # Authentication & request validation
│   │   ├── models/            # Data models & schemas
│   │   ├── routes/            # API endpoints (auth, movies, profile)
│   │   ├── uploads/           # Uploaded user profile pictures
│   │   ├── server.js          # Main backend server entry point
│   │   └── package.json       # Backend dependencies & scripts
│   ├── frontend/              # React client application
│   │   ├── public/            # Static assets & HTML template
│   │   ├── src/               # React components, pages, and styles
│   │   └── package.json       # Frontend dependencies & scripts
│   └── package.json           # Monorepo / root management scripts
└── movieapp (1).sql           # MySQL database schema & initial data
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL Server** (Running locally or remotely)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Movie-App.git
cd Movie-App/movie-app
```

### 2. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or CLI).
2. Create a database named `movieapp`:
   ```sql
   CREATE DATABASE movieapp;
   ```
3. Import the provided SQL dump (`movieapp (1).sql` located in the root directory) to set up tables and initial records.

### 3. Install Dependencies
You can install dependencies for the backend and frontend separately or via the root setup:

```bash
# Install root/concurrent dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Configuration
Ensure your backend environment configuration (or database connection settings in `backend/config/db.js` / `backend/server.js`) matches your local MySQL credentials:
- **Host:** `localhost`
- **User:** `root`
- **Password:** `""` (or your MySQL password)
- **Database:** `movieapp`

### 5. Running the Application
From the `movie-app` root directory, run both the backend and frontend concurrently:
```bash
npm start
```
- **Frontend URL:** `http://localhost:3000` (proxied to backend at port `5000`)
- **Backend API URL:** `http://localhost:5000`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user account | Public |
| `POST` | `/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/user` | Fetch authenticated user profile details | Protected |
| `PUT` | `/user/edit` | Update user profile information | Protected |
| `POST` | `/user/upload-profile-picture` | Upload & update profile picture | Protected |
| `GET` | `/favorites` | Fetch user's favorite movies/shows | Protected |
| `POST` | `/favorites` | Add item to favorites watchlist | Protected |
| `DELETE` | `/favorites/:contentId` | Remove item from favorites | Protected |

---

## 🤝 Contributors

- **Mohamed Nezhari**
- **Adil Bouhoum**
- **AIT BARREHIL Ilias**
- **Abderrazik Achraf**

---

# JIET Canteen Website

A modern, colorful, mobile-app-like responsive website for JIET Canteen.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose)

## Features
- **Homepage**: Attractive UI with quick links.
- **Menu Page**: Categorized food items with "Add to Cart".
- **Cart & Checkout**: Real-time cart updates and simulated UPI checkout.
- **Admin Panel**: Manage orders and update their status.
- **Resilient Data**: Automatically falls back to mock data if the backend/database is not running!

## How to Run

### 1. Start the Backend Server (Optional but Recommended)
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
*Note: The backend defaults to a local MongoDB instance (`mongodb://127.0.0.1:27017/jiet-canteen`). If MongoDB is not installed, the server will start but the database operations will log an error. The frontend will automatically detect this and switch to "Fallback Mock Data Mode" so you can still use the app!*

### 2. Start the Frontend Application
Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```

### 3. View the App
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

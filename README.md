# Expense Tracker

A full-stack expense tracking app with user authentication, expense management, and AI-powered spending insights.

## Features
- User signup and login
- Add, view, and delete expenses
- Categorized expense tracking
- AI-based spending insights
- Responsive frontend dashboard

## Project Structure
- frontend/ - React app
- backend/ - Express.js API
- database/ - SQL schema for the MySQL database

## Screenshots

![Home Page](images/Screenshot%202026-07-04%20135809.png)

![Dashboard Preview](images/Screenshot%202026-07-04%20135921.png)

![Login Preview](images/Screenshot%202026-07-04%20135937.png)

## Prerequisites
- Node.js and npm
- MySQL
- A Groq API key

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/syedjaffarali2908/expense-tracker.git
cd expense-tracker
```

### 2. Create the database
Import the SQL file into MySQL:
```bash
mysql -u root -p < database/expense_tracker.sql
```

### 3. Configure backend environment
Create a `.env` file inside the `backend` folder:
```env
GROQ_API_KEY=your_groq_api_key
```

### 4. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 5. Run the app
Start the backend:
```bash
cd backend
node server.js
```

Start the frontend in another terminal:
```bash
cd frontend
npm start
```

The frontend will run at http://localhost:3000 and the backend at http://localhost:5000.

## Notes
- The backend currently uses MySQL credentials from the code. If your local MySQL setup differs, update the connection details in `backend/server.js`.
- The AI insights feature requires a valid Groq API key.

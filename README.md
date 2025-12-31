Mini Postman – Frontend Application

Mini Postman is a frontend web application built as an assignment to simulate core features of tools like Postman. The application allows users to authenticate, create API requests with different HTTP methods and headers, send them to a custom backend, and manage saved requests through a clean and intuitive UI.The project is deployed on vercel at
"https://mini-postman-ten.vercel.app/"

This project focuses purely on frontend architecture, routing, authentication handling, and API interaction patterns.

Tech Stack
React (Vite) – Frontend framework and build tool
Tailwind CSS – Utility-first CSS framework for styling
Axios – HTTP and https client with a global request handler
React Router – Client-side routing and private route handling

Project Specifications
Authentication
Signup page for new users
Login page for existing users
Token-based authentication
Private route handler to restrict access to the main application
API Request Handling
Create API requests using:
Any HTTP method (GET, POST, PUT, DELETE, etc.)
Custom headers
Send save requests to a custom backend using a global Axios instance
Fetch and display all saved requests

Feature
Modal UI created for importing requests using:
curl
JSON format
Note: Only the modal UI is implemented. Import functionality is not yet implemented

Folder Highlights
Global Axios Handler – Centralized Axios instance for consistent API calls
Private Route Component – Protects authenticated routes
Components – Reusable UI components and clean separation of concerns

How to Run the Project
Prerequisites
Node.js (v16 or higher recommended)
npm or yarn
Steps

# Clone the repository

git clone (https://github.com/ManchadiY/MiniPostman.git)

# Install dependencies

npm install

# Start the development server

npm run dev

The application will run on:
http://localhost:5173

Future Improvements
Implement full curl and JSON import functionality
Better error handling and validation
Request collections
UI enhancements for response visualization
Unit and integration testing

Notes
This project is built as a frontend-focused assignment, emphasizing:
Clean component structure
Authentication flow
API communication patterns
Scalable frontend architecture

Backend implementation is handled separately.
on repo https://github.com/ManchadiY/firstServer
on vercel "https://first-server-nine.vercel.app/"

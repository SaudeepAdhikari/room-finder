# Room Finder

A full-stack monorepo application for listing, searching, and managing rental rooms. Built with React (Client & Admin), Node.js, Express, and MongoDB.

## Features

*   **User Platform**: Search, filter, and view room details with an interactive and modern UI.
*   **Property Management**: Post new rooms and manage existing listings.
*   **Admin Dashboard**: Dedicated React-based management panel for overseeing users and properties.
*   **Secure Authentication**: Role-based access control and secure session management.
*   **Payment Integration**: Native eSewa payment gateway integration for seamless transaction processes.
*   **Image Management**: Direct Cloudinary integration for handling property images securely.
*   **Rich UI Components**: Fluid animations powered by Framer Motion and immersive elements using Three.js and Vanta.js.

## Tech Stack

*   **Frontend (Client & Admin)**: React, React Router, Framer Motion, Recharts, Three.js, Axios
*   **Backend**: Node.js, Express.js, Mongoose (MongoDB), Bcrypt, Joi
*   **Cloud & Infrastructure**: Vercel (Deployment), Cloudinary (Image Storage)

## Prerequisites

Make sure you have the following installed or configured before running the project:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)
*   [Cloudinary Account](https://cloudinary.com/)
*   [eSewa Merchant Account](https://esewa.com.np/) (Testing/UAT credentials work for development)

## Getting Started

### 1. Project Setup
Given this is a monorepo, clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd room
```

### 2. Install Dependencies
The project leverages npm workspaces (`client`, `admin`, `backend`). You can install all dependencies across the entire monorepo from the root directory with a single command:

```bash
npm run install:all
```

*(Alternatively, you can just run `npm install` from the root).*

### 3. Environment Variables
You need to configure the environment variables for the frontend, backend, and third-party services.

Create a `.env` file in the root of the project (you can duplicate `.env.example`) and fill in your specific credentials:

```env
# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset

# Backend / API Configuration
REACT_APP_API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# eSewa Configuration (UAT/Testing values shown below)
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_VERIFY_URL=https://rc-epay.esewa.com.np/api/epay/transaction/status/
```

### 4. Running the Application Locally

You can leverage the npm workspace scripts defined in the root `package.json` to run different parts of the application. Open separate terminal tabs for each service you wish to run:

**Start the Backend Integration:**
```bash
npm run dev:backend
```
*(Runs the Express server on port 5000 default)*

**Start the Main Client App:**
```bash
npm run start:client
```
*(Runs the React client on port 3000 default)*

**Start the Admin Dashboard:**
```bash
npm run start:admin
```
*(Runs the React admin app)*

## Deployment

This monorepo is fully configured for deployment on **Vercel** as a unified full-stack application. 
The `vercel.json` file handles serverless function routing (`/api/*` maps to `api/index.js`) and static frontend deployment (`/*` maps to the client build). Ensure you set all the equivalent environment variables within your Vercel project settings.

# Sri Lanka Travel Blog

An interactive travel blog website featuring Sri Lanka's destinations with district-wise navigation.

## Features

- Interactive Sri Lanka map with district-wise navigation
- User authentication (registration & login)
- Blog creation for registered users
- District and destination management
- Photo upload functionality
- Responsive design for both international and local users

## Tech Stack

### Frontend
- React.js with Vite
- Material-UI for UI components
- React Router for navigation
- Axios for API requests
- Mapbox GL for interactive maps
- Styled Components for custom styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd tour_blog_info
   ```

2. **Backend Setup**
   ```
   cd server
   npm install
   ```
   
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sri_lanka_travel_blog
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```
   cd ../client
   npm install
   ```
   
   For using the map feature, you'll need a Mapbox token. Add it to the SriLankaMap component.

### Running the Application

1. **Start the Backend Server**
   ```
   cd server
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
tour_blog_info/
├── client/                # Frontend React application
│   ├── public/            # Static files
│   └── src/
│       ├── assets/        # Images and other assets
│       ├── components/    # Reusable UI components
│       ├── context/       # React context providers
│       ├── pages/         # Page components
│       └── utils/         # Utility functions and API calls
│
├── server/                # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── uploads/           # Uploaded files storage
```

## License

This project is licensed under the MIT License.

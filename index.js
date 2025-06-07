const express = require("express"); // Import the Express framework for building the web application
const mongoose = require("mongoose"); // Import Mongoose to interact with MongoDB
const bodyParser = require("body-parser"); // Import Body-Parser to parse incoming request bodies as JSON
require("dotenv").config(); // Load environment variables from a .env file

const User = require('./models/user'); // Import the User model

const app = express(); // Create an instance of the Express application

app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB using the URI from environment variables
mongoose.connect(
    process.env.MONGO_URI, // ✅ Use environment variable correctly
    {
        serverSelectionTimeoutMS: 5000, // Set timeout to 5 seconds for MongoDB server selection
    }
)
    .then(() => console.log("Connected to MongoDB")) // Log on successful connection
    .catch((err) => console.error("Failed to connect to MongoDB", err)); // Log error if connection fails

// Import route handler modules
const usersRoutes = require("./routes/users"); // User-related routes (e.g., GET /api/users/:id)
const costsRoutes = require("./routes/costs"); // Cost-related routes (e.g., POST /api/add)
const aboutRoutes = require("./routes/about"); // About/team route (e.g., GET /api/about)

// Define application routes and associate them with path prefixes
app.use("/api/users", usersRoutes); // Mount user routes at /api/users
app.use("/api", costsRoutes); // Mount cost routes directly under /api
app.use("/api", aboutRoutes); // Mount about route directly under /api

// Define the port number from environment variable or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the Express server and listen for incoming HTTP requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the Express app instance for external usage (e.g., testing)
module.exports = app;

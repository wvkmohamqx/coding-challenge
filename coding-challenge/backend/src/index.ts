import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Use user routes
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//initial request
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

import { Router } from "express";
import axios from "axios";

const router = Router();

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

let users: User[] = []; // In-memory store for users

// Fetch initial user list from Reqres API
const fetchInitialUsers = async () => {
  try {
    const response = await axios.get("https://reqres.in/api/users");
    users = response.data.data; // Cache the users from Reqres
  } catch (error) {
    console.error("Error fetching users from Reqres:", error);
  }
};

// Fetch the initial users when the server starts
fetchInitialUsers();

// GET all users
router.get("/", (req, res) => {
  res.json(users);
});

// POST to create a new user
router.post("/", (req, res) => {
  const newUser: User = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    avatar: req.body.avatar
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT to update an existing user
router.put("/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex >= 0) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
});

// DELETE a user
router.delete("/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  users = users.filter(user => user.id !== userId);
  res.status(204).send();
});

export default router;

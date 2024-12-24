// auth.routes.js
import express from 'express';
import { signup, login, logout } from '../controller/auth.controller.js'; // Adjust the path based on your file structure

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

export default router;

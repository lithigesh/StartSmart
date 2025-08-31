// routes/admin.routes.js
const express = require('express');
const router = express.Router();

// --- Controller Imports ---
const {
    loginAdmin,
    getAllUsers,
    getAllInvestors,
    getAllIdeas,
    deleteUser,
    deleteIdea
} = require('../controllers/admin.controller');

// --- Middleware Imports ---
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware'); // We will create this next

// --- Admin Login Route ---
// This route is public and does not use the 'protect' middleware.
router.post('/login', loginAdmin);

// --- Admin Protected Routes ---
// All routes below this require a valid JWT with an admin role.

// GET routes for viewing data
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/investors', protect, isAdmin, getAllInvestors);
router.get('/ideas', protect, isAdmin, getAllIdeas);

// DELETE routes for managing data
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.delete('/investors/:id', protect, isAdmin, deleteUser); // Reuses the deleteUser controller
router.delete('/ideas/:id', protect, isAdmin, deleteIdea);

module.exports = router;
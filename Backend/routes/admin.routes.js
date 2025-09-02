// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const {
    loginAdmin,
    getAllUsers,
    changeUserRole,
    deleteUser,
    deleteIdea,
    getAdminActivities
} = require('../controllers/admin.controller');

router.post('/login', loginAdmin);

// Protected Admin Routes
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, changeUserRole);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.delete('/ideas/:id', protect, isAdmin, deleteIdea);
router.get('/activities', protect, isAdmin, getAdminActivities);

module.exports = router;
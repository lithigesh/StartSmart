// validators/idea.validator.js
const { body } = require('express-validator');

// This exports an array of validation rules to be used as middleware in our routes.
exports.validateIdeaCreation = [
    // Rule 1: 'title' must not be empty.
    body('title', 'Title is required')
        .not().isEmpty()
        .trim()         // Remove leading/trailing whitespace
        .escape(),      // Convert HTML special characters to prevent XSS attacks

    // Rule 2: 'description' must not be empty.
    body('description', 'Description is required')
        .not().isEmpty()
        .trim()
        .escape(),

    // Rule 3: 'category' must not be empty.
    body('category', 'Category is required')
        .not().isEmpty()
        .trim()
        .escape(),
];
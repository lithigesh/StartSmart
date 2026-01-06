// validators/idea.validator.js
const { body } = require('express-validator');

// Define available categories
const validCategories = [
    'Technology', 'Healthcare', 'Education', 'Environmental', 'Fintech',
    'E-commerce', 'Social Impact', 'Manufacturing', 'Entertainment',
    'Food & Beverage', 'Transportation', 'Real Estate', 'Other'
];

// This exports an array of validation rules to be used as middleware in our routes.
exports.validateIdeaCreation = [
    // Basic Information (Required)
    body('title', 'Title is required and must be between 5-100 characters')
        .not().isEmpty()
        .isLength({ min: 5, max: 100 })
        .trim()
        .escape(),

    body('elevatorPitch', 'Elevator pitch is required and must be between 10-300 characters')
        .not().isEmpty()
        .isLength({ min: 10, max: 300 })
        .trim()
        .escape(),

    body('description', 'Detailed description is required and must be between 50-2000 characters')
        .not().isEmpty()
        .isLength({ min: 50, max: 2000 })
        .trim()
        .escape(),

    body('category', 'Category is required and must be valid')
        .not().isEmpty()
        .isIn(validCategories)
        .trim()
        .escape(),

    body('targetAudience', 'Target audience is required and must be between 10-500 characters')
        .not().isEmpty()
        .isLength({ min: 10, max: 500 })
        .trim()
        .escape(),

    // Problem & Solution (Required)
    body('problemStatement', 'Problem statement is required and must be between 20-1000 characters')
        .not().isEmpty()
        .isLength({ min: 20, max: 1000 })
        .trim()
        .escape(),

    body('solution', 'Solution is required and must be between 20-1000 characters')
        .not().isEmpty()
        .isLength({ min: 20, max: 1000 })
        .trim()
        .escape(),

    // Optional fields with validation if provided
    body('competitors')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('revenueStreams')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('pricingStrategy')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('keyPartnerships')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('marketSize')
        .optional()
        .isLength({ max: 500 })
        .trim()
        .escape(),

    body('goToMarketStrategy')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('scalabilityPlan')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('technologyStack')
        .optional()
        .isLength({ max: 500 })
        .trim()
        .escape(),

    body('developmentRoadmap')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('challengesAnticipated')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('ecoFriendlyPractices')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('socialImpact')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('fundingRequirements')
        .optional()
        .isLength({ max: 500 })
        .trim()
        .escape(),

    body('useOfFunds')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('equityOffer')
        .optional()
        .isLength({ max: 200 })
        .trim()
        .escape(),

    body('uniqueValueProposition')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),

    body('competitiveAdvantage')
        .optional()
        .isLength({ max: 1000 })
        .trim()
        .escape(),
];
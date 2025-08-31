// middlewares/role.middleware.js
const isEntrepreneur = (req, res, next) => {
    if (req.user && req.user.role === 'entrepreneur') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Entrepreneurs only.' });
    }
};

const isInvestor = (req, res, next) => {
    if (req.user && req.user.role === 'investor') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Investors only.' });
    }
};


const isAdmin = (req, res, next) => {
    // Check if the user object exists and the role is 'admin'
    // The user object is attached by the 'protect' middleware from the JWT payload
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/controller
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = { isEntrepreneur, isInvestor, isAdmin };

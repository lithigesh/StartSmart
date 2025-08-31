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

module.exports = { isEntrepreneur, isInvestor };
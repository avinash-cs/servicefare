const jwt = require('jsonwebtoken');
const AsyncErrorHandler = require('./asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');

const isAuthenticatedUser = AsyncErrorHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
})

module.exports = isAuthenticatedUser;
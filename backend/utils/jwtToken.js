const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + (30*24*3600000)
        ),
        httpOnly: false
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
}
module.exports = sendToken;

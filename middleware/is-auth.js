const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    try {
        const token = authHeader.split(' ')[1];
        // 'somesupersecretjwtsecretjwt' have to be the same as set in auth controller login
        decodedToken = jwt.verify(token, 'somesupersecretjwtsecretjwt');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    // console.log('token sent with requests', decodedToken);
    // req.userId = decodedToken.userId;
    next();
}
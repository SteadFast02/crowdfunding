import adminModel from '../models/adminModel.js';
import JWT from 'jsonwebtoken'

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const payload = JWT.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.userId}
        console.log("Auth",req.user)
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

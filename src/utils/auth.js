const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    console.log("----------> entered");
    const authHeader = req.get("Authorization");
    if(!authHeader){
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    try{
        const verified = jwt.verify(token, process.env.jwtSecret1);
        if(!verified){
            const err = new Error("Not Authenticated");
            err.statusCode = 401;
            throw err;
        }
    }
    catch(err){
        res.send("UnAuthorized");  
    }
    next();
}
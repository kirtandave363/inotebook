const jwt = require('jsonwebtoken');
const JWT_SECRET = "kirtanisagoodb$oy"; 

const fetchuser = (req,res,next)=>{
    // Get the user from the jwt token and add id to req obj
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({error : "Please authenticate with valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({error : "Please authenticate with valid token"});
    }
    
}

module.exports = fetchuser;
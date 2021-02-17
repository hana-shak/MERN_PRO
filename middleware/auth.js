const jwt = require('jsonwebtoken');
const config = require('config');


//
module.exports = function (req, res, next) { 
          
     //Get token from header
    const token = req.header('x-auth-token');
    
     //Check if not token
    if(!token){
        return res.status(401).json({ msg : 'No token, authorization denied'});
     }
    
     //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));    //verify to the decoded object , reset the user to the 
        req.user = decoded.user;  //use req.user to all routes
        next();
     } catch (err) {     //if not valid - no matching
        res.status(401).json({ msg: 'Token is not valid'});
    }
}
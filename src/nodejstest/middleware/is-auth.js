const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1]; // Auth: Bearer dfafaasf
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }try{
        decodedToken = jwt.verify(token, 'somesupersecrectkey');
    }catch(err){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}
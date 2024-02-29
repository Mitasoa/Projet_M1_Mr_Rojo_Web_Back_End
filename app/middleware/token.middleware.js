const { request, response } = require("express");
const { ERROR_STATUS_CODE, ERROR } = require("../constant/Error.constant");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY_TOKEN;

const checkTokenExistance = (request , response, next) => {
    const token = request.headers['authorization'] || request.headers['Authorization'];
    if(!token){
        response.status(ERROR_STATUS_CODE.UNAUTHORIZED).send(
            {
                message: ERROR.TOKEN.MISSING_TOKEN
            }
        );
        return;
    }
    request.token = token;
    next();
}


const decryptToken = (request, response, next) => {
    const token = request.headers['authorization'] || request.headers['Authorization'];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
            response.status(ERROR_STATUS_CODE.UNAUTHORIZED).send({
                message: ERROR.TOKEN.INVALID_OR_EXPIRED_TOKEN
            });
            return;
        }
        request.decoded = decoded;
       // console.log(  request.decoded)
        next();
    })
   
}

module.exports = {
    checkTokenExistance,
    decryptToken
}
const { ERROR_STATUS_CODE, ERROR } = require("../constant/Error.constant")

const getInfoClient  = async(request, response, next) => {
    if(!request.decoded.role || request.decoded.role !== 10){
        response.status(ERROR_STATUS_CODE.UNAUTHORIZED).send({
            message:  ERROR.TOKEN.INVALID_OR_EXPIRED_TOKEN
        }) 
        return;
    }
    next();
}

const getInfoEmploye = (request, response, next) => {
    if(!request.decoded.role || request.decoded.role !== 20) {
        response.status(ERROR_STATUS_CODE.UNAUTHORIZED).send({
            message:  ERROR.TOKEN.INVALID_OR_EXPIRED_TOKEN
        }) 
        return;
    }
    next();
}

const getInfoManager = (request, response, next) => {
    if(!request.decoded.role || request.decoded.role !== 30) {
        response.status(ERROR_STATUS_CODE.UNAUTHORIZED).send({
            message:  ERROR.TOKEN.INVALID_OR_EXPIRED_TOKEN
        }) 
        return;
    }
    next();
}

module.exports = {
    getInfoClient,
    getInfoEmploye,
    getInfoManager
}
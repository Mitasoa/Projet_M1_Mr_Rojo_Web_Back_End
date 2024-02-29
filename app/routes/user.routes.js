module.exports = app => {
    var router = require("express").Router();
    var tokenMiddleware = require('../middleware/token.middleware');
    
    const userController = require("../controllers/user.controller");
    
    router.get('/employes/active',userController.getActiveEmploye);
    app.use('/api/users', tokenMiddleware.checkTokenExistance,tokenMiddleware.decryptToken,router);
}
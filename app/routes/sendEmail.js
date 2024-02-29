module.exports = app => {
    var router = require("express").Router();
    var tokenMiddleware = require('../middleware/token.middleware');
    
    const userController = require("../controllers/user.controller");
    
    router.get('/sendEmail',userController.mailSender);
    app.use('/api',router);
}
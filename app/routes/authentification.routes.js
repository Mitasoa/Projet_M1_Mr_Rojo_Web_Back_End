module.exports = app => {
    var router = require("express").Router();

    const userController = require("../controllers/user.controller");
    router.post('/loginClient',userController.loginClient);
    router.post('/registerClient',userController.registerClient);
    router.post('/loginEmploye',userController.loginEmploye);
    router.post('/loginManager',userController.loginManager);

    app.use('/api/auth', router);
}
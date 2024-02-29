module.exports = app => {
    const depenseController = require("../controllers/depense.controller");
    var router = require("express").Router();
    const tokenMiddleware = require('../middleware/token.middleware');
    const identifierMiddleware = require('../middleware/identifier.middleware'); 
    
    router.get('/listedepenses', depenseController.getAllDepenses);
    router.post('/creerdepense',depenseController.createDepense);
    router.put('/updatedepense/:id',depenseController.updateDepense);
    router.delete('/deletedepense/:id',depenseController.deleteDepense);
    router.get('/detaildepense/:id',depenseController.getDepenseDetails);
    router.get('/rechercherdepense',depenseController.searchDepense);


    app.use('/api/depenses', tokenMiddleware.checkTokenExistance,tokenMiddleware.decryptToken,identifierMiddleware.getInfoManager,router);
}
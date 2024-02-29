module.exports = app => {
    const router = require("express").Router();
    const statistiqueController = require('../controllers/statistique.controller'); 
    const tokenMiddleware = require('../middleware/token.middleware');
    const identifierMiddleware = require('../middleware/identifier.middleware'); 

    router.get('/tempsmoyenne', statistiqueController.calculerTempsMoyenTravail);
    router.get('/statreservation', statistiqueController.obtenirStatistiquesReservations);
    router.get('/statCA', statistiqueController.obtenirStatistiquesChiffreAffaires);
    router.get('/statBenefice', statistiqueController.obtenirStatistiquesBenefice);    

    app.use('/api/stats', tokenMiddleware.checkTokenExistance,tokenMiddleware.decryptToken,identifierMiddleware.getInfoManager,router);
}
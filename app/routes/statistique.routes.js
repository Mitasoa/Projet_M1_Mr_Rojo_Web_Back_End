module.exports = app => {
    const router = require("express").Router();
    const statistiqueController = require('../controllers/statistique.controller'); 
    const tokenMiddleware = require('../middleware/token.middleware');
    const identifierMiddleware = require('../middleware/identifier.middleware'); 

    router.post('/tempsmoyenne', statistiqueController.calculerTempsMoyenTravail);
    router.post('/statreservation', statistiqueController.obtenirStatistiquesReservations);
    router.post('/statCA', statistiqueController.obtenirStatistiquesChiffreAffaires);
    router.post('/statBenefice', statistiqueController.obtenirStatistiquesBenefice);
    router.get('/listeemployes', statistiqueController.getAllEmploye);   

    app.use('/api/stats', tokenMiddleware.checkTokenExistance,tokenMiddleware.decryptToken,identifierMiddleware.getInfoManager,router);
}
const preferenceServiceController = require("../controllers/preferenceService.controller");

module.exports = app => {
    const router = require("express").Router();
    const rdv = require("../controllers/rdvController");
    const preferenceEmploye = require("../controllers/preferenceEmploye.controller");
    const preferenceService = require("../controllers/preferenceService.controller");
    const offreSpecial = require('../controllers/offreSpecial.controller');
    const tokenMiddleware = require('../middleware/token.middleware');
    const identifierMiddleware = require('../middleware/identifier.middleware'); 
    const horaireController = require('../controllers/horaire.controller');

    router.post('/rdv/emp',rdv.getListAvailableEmploye);
    router.post('/rdv/insert',rdv.setRdv);
    router.get('/rdv/offreSpecial',offreSpecial.findAll);
    router.get('/rdv/list',rdv.getListRDV);
    router.delete('/rdv/delete',rdv.deleteRdv);

    router.get('/services/pref',preferenceService.GetListPreferenceService);
    router.post('/services/pref',preferenceServiceController.SetPreferenceService);
    router.delete('/services/pref',preferenceService.RemovePreferenceService);

    router.get('/rdvs',rdv.getListRDV);
    router.post('/pref',preferenceEmploye.SetPrefernceEmp);
    router.delete('/pref',preferenceEmploye.RemovePreferenceEmp);
    router.get('/pref',preferenceEmploye.GetListPreferenceEmp);

    router.get('/horaire/list',horaireController.getListHoraire);
    app.use('/api/clients', tokenMiddleware.checkTokenExistance,tokenMiddleware.decryptToken,identifierMiddleware.getInfoClient,router);
}
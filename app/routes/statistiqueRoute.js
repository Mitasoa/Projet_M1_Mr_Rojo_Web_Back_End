const express = require('express');
const router = express.Router();
const statistiqueController = require('../controller/statistiqueController'); 

router.post('/tempsmoyenne', statistiqueController.calculerTempsMoyenTravail);
router.post('/statreservation', statistiqueController.obtenirStatistiquesReservations);
router.post('/statCA', statistiqueController.obtenirStatistiquesChiffreAffaires);
router.post('/statBenefice', statistiqueController.obtenirStatistiquesBenefice);
router.get('/listeemployes', statistiqueController.getAllEmploye);

module.exports = router;
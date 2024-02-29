const express = require('express');
const router = express.Router();
const depenseController = require('../controller/depenseController'); 

router.get('/listedepenses', depenseController.getAllDepenses);
router.post('/creerdepense',depenseController.createDepense);
router.put('/updatedepense/:id',depenseController.updateDepense);
router.delete('/deletedepense/:id',depenseController.deleteDepense);
router.get('/detaildepense/:id',depenseController.getDepenseDetails);
router.get('/rechercherdepense',depenseController.searchDepense);

module.exports = router;

const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController'); 
const upload = require('../config/multer.config');

router.get('/listeservices', serviceController.getAllServices);
router.post('/creerservice', upload.single('image'), serviceController.createService);
router.put('/updateservice/:id', upload.single('image'),serviceController.updateService);
router.put('/deleteservice/:id',serviceController.deleteService);
router.get('/detailservice/:id',serviceController.getServiceDetails);
router.get('/rechercherservice',serviceController.searchService);

module.exports = router;

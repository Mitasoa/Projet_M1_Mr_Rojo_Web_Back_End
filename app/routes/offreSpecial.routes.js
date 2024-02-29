module.exports = app =>{
    const offreSpecial = require('../controllers/offreSpecial.controller');
    var router = require("express").Router();
    router.post('/offre_special',offreSpecial.create);
    router.get('/offre_specials',offreSpecial.findAll);
    app.use('/api',router);
}
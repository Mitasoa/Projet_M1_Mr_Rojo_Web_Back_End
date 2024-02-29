const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.depense = require("./depense.model.js")(mongoose);
db.horaire = require("./horaire.model.js")(mongoose);
db.offreSpecial = require("./offreSpecial.model.js")(mongoose);
db.rdv = require("./rdv.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.device = require("./device.model.js")(mongoose);
db.preferenceEmploye=require("./preferenceEmploye.model.js")(mongoose);
db.preferenceServices=require("./preferenceService.model.js")(mongoose);
module.exports = db;
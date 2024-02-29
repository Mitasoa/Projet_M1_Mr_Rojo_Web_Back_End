const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.depense = require("./depense.model.js")(mongoose);
db.rdv = require("./rdv.model.js")(mongoose);
db.service = require("./service.model.js")(mongoose);
db.users = require("./user.model.js")(mongoose);


module.exports = db;
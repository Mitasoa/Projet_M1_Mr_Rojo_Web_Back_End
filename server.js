require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const path = require("path");
const reminder = require("./app/service/rappel.service");
var corsOptions = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOptions));


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const tokenMiddleware = require("./app/middleware/token.middleware");
const identifierMiddleware = require("./app/middleware/identifier.middleware");

const userRoutes = require("./app/routes/user");
const employeeRoutes = require("./app/routes/employee");

// Montage des routes sur l'application principale
app.use(
  "/api_user",
  tokenMiddleware.checkTokenExistance,
  tokenMiddleware.decryptToken,
  userRoutes
);
app.use(
  "/api_employee",
  tokenMiddleware.checkTokenExistance,
  tokenMiddleware.decryptToken,
  employeeRoutes
);

// parse requests of content-type - application/json
app.use(express.json());

//connect to database
const db = require("./app/models");
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

//Rappel tout les jours à 6 heure du matin

require("./app/routes/authentification.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/depense.routes")(app);
require("./app/routes/offreSpecial.routes")(app);
require("./app/routes/device.routes")(app);
require("./app/routes/manager.routes")(app);
require("./app/routes/statistique.routes")(app);
require("./app/routes/employe.routes")(app);
require("./app/routes/client.routes")(app);
require("./app/routes/service.routes")(app);
require("./app/routes/sendEmail")(app);
app.use('/api/uploads', express.static(path.join(__dirname, 'app/uploads')));


// set port, listen for requests
const PORT = process.env.PORT || 1672;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

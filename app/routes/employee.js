const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee");

// Route pour créer un nouvel utilisateur
router.get("/employee", (req, res) => {
  employeeController.afficherRdv(req, res);
});

router.post("/inserer_rdv", (req, res) => {
  employeeController.insererRdv(req, res);
});

router.get("/valider_un_rdv", (req, res) => {
  employeeController.modifierRdv(req, res);
});

module.exports = router;

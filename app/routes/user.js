const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Route pour créer un nouvel utilisateur
router.post("/users", (req, res) => {
  userController.createUser(req, res);
});

// Route pour récupérer tous les utilisateurs
router.get("/users", (req, res) => {
  userController.getUsers(req, res);
});

// Route pour récupérer un utilisateur par son ID
router.get("/users/:id", (req, res) => {
  userController.getUserById(req, res);
});

// Route pour mettre à jour un utilisateur
router.put("/users/:id", (req, res) => {
  userController.updateUser(req, res);
});

// Route pour supprimer un utilisateur
router.delete("/users/:id", (req, res) => {
  userController.deleteUser(req, res);
});

module.exports = router;

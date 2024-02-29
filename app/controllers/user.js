const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.user;

// Fonction pour créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { nom, prenom, mail, mdp, role } = req.body;

    // Vérification de la combinaison nom et prénom unique
    const existingUser = await User.findOne({ nom, prenom });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec ce nom et prénom existe déjà." });
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(mail)) {
      return res
        .status(400)
        .json({ message: "L'email n'est pas au bon format." });
    }

    // Vérification de la longueur du mot de passe
    if (mdp.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);
    console.log(role);

    // Vérification que le rôle est un entier positif
    if (!Number.isInteger(parseInt(role)) || parseInt(role) < 0) {
      return res
        .status(400)
        .json({ message: "Le rôle doit être un entier positif." });
    }

    // Création du nouvel utilisateur
    const newUser = new User({
      nom,
      prenom,
      mail,
      mdp: hashedPassword,
      role,
      etat: 1, // Etat par défaut à 1
    });

    // Enregistrement du nouvel utilisateur dans la base de données
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const { keyword, nom, prenom, mail, role, etat, page, limit } = req.query;

    let query = {};

    // Filtrer par mot-clé
    if (keyword && keyword.trim() !== "") {
      const keywordRegex = new RegExp(keyword, "i");
      query = {
        $or: [
          { nom: { $regex: keywordRegex } },
          { prenom: { $regex: keywordRegex } },
          { mail: { $regex: keywordRegex } },
        ],
      };
    }

    // Filtrer par autres champs
    if (nom && nom.trim() !== "") query.nom = { $regex: new RegExp(nom, "i") };
    if (prenom && prenom.trim() !== "")
      query.prenom = { $regex: new RegExp(prenom, "i") };
    if (mail && mail.trim() !== "")
      query.mail = { $regex: new RegExp(mail, "i") };
    if (role && role.trim() !== "") query.role = role;
    if (etat && etat.trim() !== "") query.etat = etat;

    const pageOptions = {
      page: parseInt(page, 10) || 0,
      limit: parseInt(limit, 10) || 10,
    };

    const users = await User.find(query)
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    console.log(req.decoded.userId);
    const user = await User.findById(userId);
    console.log(user + "jjj");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour mettre à jour un utilisateur
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedFields = req.body;

    // Vérification si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mise à jour des champs modifiables
    // Vous pouvez ajouter vos propres validations et contraintes ici pour chaque champ
    if (updatedFields.nom) {
      user.nom = updatedFields.nom;
    }
    if (updatedFields.prenom) {
      user.prenom = updatedFields.prenom;
    }
    if (updatedFields.mail) {
      user.mail = updatedFields.mail;
    }
    if (updatedFields.mdp) {
      user.mdp = await bcrypt.hash(updatedFields.mdp, 10);
    }
    if (updatedFields.role) {
      user.role = updatedFields.role;
    }

    // Enregistrement des modifications dans la base de données
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    // Mise à jour de l'état de l'utilisateur
    user.etat = -10;
    await user.save();
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

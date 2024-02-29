const db = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY_TOKEN;
const User = db.user;
const transporter_smtp = require('../utils/mailer');
const { ERROR_STATUS_CODE } = require("../constant/Error.constant");

exports.loginClient = async (request, response)=> {
    const {email, password} = request.body;
    try{
        const user = await User.login(email,password,10);
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            SECRET_KEY,
            {
                expiresIn:'24h',
            }
        );
        return response.send({
            user: user,
            token:token
        });
       
    }
    catch(error){
        response.status(500).send({
            message:
              error.message || "Some error occurred while creating the Tutorial."
        });
    }
}

exports.loginEmploye = async (request, response)=> {
    const {email, password} = request.body;
    try{
        const user = await User.login(email,password,20);
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            SECRET_KEY,
            {
                expiresIn:'24h',
            }
        );
        return response.send({
            user: user,
            token:token
        });
       
    }
    catch(error){
        response.status(500).send({
            message:
              error.message || "Some error occurred while creating the Tutorial."
        });
    }
}

exports.loginManager = async (request, response)=> {
    const {email, password} = request.body;
    try{
        const user = await User.login(email,password,30);
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            SECRET_KEY,
            {
                expiresIn:'24h',
            }
        );
        return response.send({
            user: user,
            token:token
        });
       
    }
    catch(error){
        response.status(500).send({
            message:
              error.message || "Some error occurred while creating the Tutorial."
        });
    }
}

exports.registerClient =async (request, response) =>{
    const {nom,prenom,mail,mdp,confirmMdp} = request.body;
    if(mdp !== confirmMdp){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : 'Veuillez reconfirmer votre mot de passe'
        });
        return;
    }
    try{
        const newClient = await User.register(nom,prenom,mail,mdp,10);
        response.send(newClient);
    }
    catch(error){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : error.message
        });
        return;
    }
}


exports.registerEmploye =async (request, response) =>{
    const {nom,prenom,mail,mdp,confirmMdp} = request.body;
    if(mdp !== confirmMdp){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : 'Veuillez reconfirmer votre mot de passe'
        });
        return;
    }
    try{
        const newClient = await User.register(nom,prenom,mail,mdp,20);
        response.send(newClient);
    }
    catch(error){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : error.message
        });
        return;
    }
}

exports.registerManager =async (request, response) =>{
    const {nom,prenom,mail,mdp,confirmMdp} = request.body;
    if(mdp !== confirmMdp){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : 'Veuillez reconfirmer votre mot de passe'
        });
        return;
    }
    try{
        const newClient = await User.register(nom,prenom,mail,mdp,30);
        response.send(newClient);
    }
    catch(error){
        response.status(ERROR_STATUS_CODE.BAD_REQUEST).send({
            message : error.message
        });
        return;
    }
}

exports.getUsers = async (req, res) =>{
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
    
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
}

exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé." });
      }
      res.send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
};

exports.updateUser = async (req, res) =>{
    try {
        const userId = req.params.id;
        const updatedFields = req.body;
    
        // Vérification si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send({ message: "Utilisateur non trouvé." });
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
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send({ message: "Utilisateur non trouvé." });
        }
        // Mise à jour de l'état de l'utilisateur
        user.etat = -10;
        await user.save();
        res.send({ message: "Utilisateur supprimé avec succès." });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }    
}

exports.getActiveEmploye = async (request, response) => {
    try{
        const employe = await User.find({etat : 1, role: 20});
        response.send(employe);
    }
   catch(error){
        response.send(500).send({message: error.message});
    }
}
exports.mailSender = (request, response) =>{
    // Envoyer l'e-mail
    try{
        transporter_smtp.emailSender('raltolotra@gmail.com','tolotra@kanteco.com','test','test');
        response.send({message:'Email envoyé avec succès'});
    }
    catch(error){
        response.status(500).send({message: error.message});
    }
}
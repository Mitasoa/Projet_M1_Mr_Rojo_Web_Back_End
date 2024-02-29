const bcrypt = require("bcrypt");
const db = require("../models");
const Rdv = db.rdv;
const mongoose = require("mongoose");

const afficherRdv = async (req, res) => {
  try {
    const { idService, idClient, idEmploye, status, etat } = req.query;

    let query = {};

    var id = req.decoded.userId;
    query.idEmploye = id;

    // Filtrer par idService
    if (idService && idService.trim() !== "") query.idService = idService;

    // Filtrer par idClient
    if (idClient && idClient.trim() !== "") query.idClient = idClient;

    // Filtrer par idEmploye
    if (idEmploye && idEmploye.trim() !== "") query.idEmploye = idEmploye;

    // Filtrer par status
    if (status && status.trim() !== "") query.status = parseInt(status);

    // Filtrer par etat
    if (etat && etat.trim() !== "") query.etat = parseInt(etat);

    const rdvs = await Rdv.find(query);

    // Pour chaque rendez-vous, effectuer une requête directe sur la table "services"
    const { ObjectId } = require("mongoose").Types;

    const rdvsWithService = [];
    for (let rdv of rdvs) {
      const service = await mongoose.connection
        .collection("services")
        .find({ _id: new ObjectId(rdv.idService) }) // Convertir rdv.idService en ObjectId
        .toArray();

      // Créer un nouvel objet pour stocker le rendez-vous avec le service
      const rdvWithService = {};

      // Ajouter les champs du rendez-vous un par un dans l'objet rdvWithService
      rdvWithService._id = rdv._id;
      rdvWithService.idService = rdv.idService;
      rdvWithService.idEmploye = rdv.idEmploye;
      rdvWithService.idClient = rdv.idClient;
      rdvWithService.dateheuredebut = rdv.dateheuredebut;
      rdvWithService.dateheurefin = rdv.dateheurefin;
      rdvWithService.status = rdv.status;
      rdvWithService.etat = rdv.etat;
      rdvWithService.prix = rdv.prix;

      // Ajouter le champ "service" contenant les informations du service
      rdvWithService.service = service[0];

      // Ajouter le rendez-vous avec le service au tableau rdvsWithService
      rdvsWithService.push(rdvWithService);
    }

    console.log(rdvsWithService); // Débogage

    res.json(rdvsWithService);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const insererRdv = async (req, res) => {
  try {
    const { idEmploye, dateheuredebut, dateheurefin, status } = req.body;

    if (
      !idEmploye ||
      !dateheuredebut ||
      !dateheurefin ||
      status === undefined
    ) {
      return res.status(400).json({
        message:
          "Les champs idEmploye, dateheuredebut, dateheurefin et status sont obligatoires.",
      });
    }

    var id = req.decoded.userId;

    // Convertir les dates en objets de date en spécifiant le fuseau horaire UTC
    const dateDebut = new Date(dateheuredebut + "Z");
    const dateFin = new Date(dateheurefin + "Z");

    // Vérifier si la date de début est inférieure à la date de fin
    if (dateDebut >= dateFin) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin.",
      });
    }

    // Vérifier si une date ultérieure est utilisée
    if (dateDebut < new Date()) {
      return res.status(400).json({
        message: "La date de début ne peut pas être dans le passé.",
      });
    }

    // Vérifier si un rendez-vous existe déjà dans l'intervalle de dates spécifié
    const existingRdv = await Rdv.findOne({
      idEmploye,
      $or: [
        {
          $and: [
            { dateheuredebut: { $gte: dateDebut } },
            { dateheuredebut: { $lt: dateFin } },
          ],
        },
        {
          $and: [
            { dateheurefin: { $gt: dateDebut } },
            { dateheurefin: { $lte: dateFin } },
          ],
        },
      ],
    });

    if (existingRdv) {
      return res.status(400).json({
        message:
          "Un rendez-vous existe déjà dans l'intervalle de dates spécifié",
      });
    }

    // Créer un nouveau rendez-vous et l'insérer dans la base de données
    const nouveauRdv = new Rdv({
      idEmploye: id,
      dateheuredebut: dateDebut, // Utiliser la date convertie
      dateheurefin: dateFin, // Utiliser la date convertie
      status: status || -10, // Par défaut, le statut est défini à -10 si non fourni
    });

    const rdvInsere = await nouveauRdv.save();

    return res.status(201).json(rdvInsere);
  } catch (error) {
    console.error("Erreur lors de l'insertion du rendez-vous :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'insertion du rendez-vous ", error });
  }
};

const modifierRdv = async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.query;

    // Vérifier si l'état est égal à 1
    const rdv = await Rdv.findById(id);
    if (!rdv) {
      return res
        .status(404)
        .json({ message: "Rendez-vous non trouvé pour l'ID fourni" });
    }

    if (rdv.etat !== 1) {
      return res.status(400).json({
        message:
          "Impossible de modifier le rendez-vous car l'état est différent de 1",
      });
    }

    // Mettre à jour le statut du rendez-vous
    const result = await Rdv.updateOne(
      { _id: id },
      { $set: { status: status } }
    );

    if (result.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Aucun rendez-vous n'a été modifié" });
    }

    return res.json({ message: "Rendez-vous modifié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification du rendez-vous :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la modification du rendez-vous" });
  }
};

module.exports = {
  afficherRdv,
  insererRdv,
  modifierRdv,
};

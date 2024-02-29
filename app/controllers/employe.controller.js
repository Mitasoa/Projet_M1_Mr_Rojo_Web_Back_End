const { ERROR_STATUS_CODE } = require("../constant/Error.constant");
const db = require("../models");
const Rdv = db.rdv;
const Service = require('../models/service.model');
const afficherRdv_with_paginate = async (req, res) => {
  try {
    const idEmploye = req.decoded.userId;
    const {
      idService,
      idClient,
      status,
      etat,
      page,
      limit,
    } = req.query;

    let query = {};

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

    console.log(query);

    const pageOptions = {
      page: parseInt(page, 10) || 0,
      limit: parseInt(limit, 10) || 10,
    };

    const rdvs = await Rdv.aggregate([
      {
        $match: query, // Filtre les documents Rdv selon la requête
       },
       {
        $lookup: {
            from: "services", // Nom de la collection Service
            localField: "idService",
            foreignField: "_id", // Champ à associer dans la collection Service
            as: "service" // Alias pour les résultats de la jointure
        }
    },
      {
        $unwind: "$service", // Déroule les résultats de la jointure
       },
      {
        $skip: pageOptions.page * pageOptions.limit, // Ignorer les documents selon la pagination
      },
      {
        $limit: pageOptions.limit, // Limiter le nombre de résultats selon la pagination
      }
    ]);

    res.json(rdvs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const afficherRdv = async (req,res) => {
  const idEmploye = req.decoded.userId;
  try {
    // Récupérer les rendez-vous
    const rdvs = await Rdv.find({idEmploye: idEmploye});

    // Récupérer les services correspondant aux idService des rendez-vous
    const serviceIds = rdvs.map(rdv => rdv.idService);
    const services = await Service.find({ _id: { $in: serviceIds } });

    // Mapper les services avec les rendez-vous
    const rdvsWithServices = rdvs.map(rdv => {
        const service = services.find(service => service.id == rdv.idService);
        return { ...rdv.toObject(), service };
    });
    console.log(rdvsWithServices);
    res.send(rdvsWithServices);
  } catch (error) {
      console.error(error);
      res.status(ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR).send({message:"Une erreur s'est produite lors de la récupération des rendez-vous avec les services :"+ error});
  }
}
const insererRdv = async (req, res) => {
  try {
    const idEmploye = req.decoded.userId;
    const {
      idService,
      idClient,
      dateheuredebut,
      dateheurefin,
      status
    } = req.body;

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
     // Vérifier si la date de début est inférieure à la date de fin
     if (new Date(dateheuredebut) >= new Date(dateheurefin)) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin.",
      });
    }

    // Vérifier si une date ultérieure est utilisée
    if (new Date(dateheuredebut) < new Date()) {
      return res.status(400).json({
        message: "La date de début ne peut pas être dans le passé.",
      });
    }
    // Vérifier si un rendez-vous existe déjà dans l'intervalle de dates spécifié
    const existingRdv = await Rdv.findOne({
      idService,
      idEmploye,
      $or: [
        {
          $and: [
            { dateheuredebut: { $gte: dateheuredebut } },
            { dateheuredebut: { $lt: dateheurefin } },
          ],
        },
        {
          $and: [
            { dateheurefin: { $gt: dateheuredebut } },
            { dateheurefin: { $lte: dateheurefin } },
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
      idService,
      idEmploye,
      idClient,
      dateheuredebut,
      dateheurefin,
      status: -10, // Par défaut, le statut est défini à 10 (rdv)
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
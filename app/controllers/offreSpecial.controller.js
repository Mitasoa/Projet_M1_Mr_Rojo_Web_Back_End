const db = require('../models');
const OffreSpecial = db.offreSpecial;
const Service = require('../models/service.model');

exports.create = async(req, res) => {
    if (!req.body.idService || !req.body.dateDebut || !req.body.dateFin || !req.body.reduction) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if(req.body.reduction && req.body.reduction < 0){
        res.status(400).send({ message: "Reduction doit être supérieur à 0" });
        return;
    }
    const offreSpecial = new OffreSpecial(
        {
            idService:req.body.idService,
            reduction:req.body.reduction,
            dateDebut:req.body.dateDebut,
            dateFin:req.body.dateFin
        }
    );  
    const service = await Service.findOne({_id:req.body.idService , etat: 5});
    if(!service){
        res.status(404).send({message: "Le service n'existe pas ou n'est plus actif"});
        return;
    }
    offreSpecial
        .save(offreSpecial)
        .then(data =>{
            const sendPushNotification = require("../firebase/firebaseUtils")("Offre speciale","Reduction de"+req.body.reduction+"% pour le service "+service.nom);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Tutorial."
            });
        });
}

exports.findAll = (req, res) => {
    OffreSpecial.find()
    .then(data => {
        res.send(data);
    })
    .catch(
        err =>{
            res.status(500).send({
                message: 
                err.message || "Some error occurred while retrieving tutorials"
            }
            );
        }
    )
}

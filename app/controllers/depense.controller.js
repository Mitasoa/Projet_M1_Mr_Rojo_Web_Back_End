const db  = require('../models');
const Depense = db.depense;

async function getAllDepenses(req, res) {
    try {
      const depenses = await Depense.find();
      res.json(depenses);
    } catch (error) {
      res.status(500).json({ "error": error });
    }
  }
  
async function createDepense(req, res) {
    try {
      const newDepense = new Depense(req.body); 
  
      await newDepense.save();
  
      res.status(201).json(newDepense);
    } catch (error) {
      res.status(400).json({ "error": error });
    }
}

async function updateDepense(req, res) {
    try {
      console.log(req.body)
      const updatedDepense = req.body;
      updatedDepense._id = updatedDepense.id;
  
      await Depense.findByIdAndUpdate(updatedDepense._id, updatedDepense);
  
      res.status(200).json({ message: 'Dépense mis à jour avec succès' });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Erreur lors de la mise à jour du service' });
    }
  }
  
  async function deleteDepense(req, res) {
    try {
      const depenseId = req.params.id;
  
      await Depense.deleteOne({_id: depenseId});
  
      res.status(200).json({ message: 'Dépense supprimé avec succès' });
    } catch (error) {
      res.status(400).json({ erreur: error.message });
    }
  }
  
  async function getDepenseDetails(req, res) {
    try {
      const depenseId = req.params.id;
  
      const depense = await Depense.findById(depenseId);
  
      if (!depense) {
        return res.status(404).json({ error: 'Dépense non trouvé' });
      }
  
      res.json(depense);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des détails du depense' });
    }
  }

  async function searchDepense(req, res) {
    try {
      console.log(req.query);
      const { date, libelle, depense } = req.query;
  
      const filtre = {};
  
      if (date) {
        filtre.date = date;
      }
  
      if (libelle) {
        filtre.libelle = { $regex: libelle, $options: 'i' };
      }
  
      if (depense) {
        filtre.depense = Number(depense);
      }
  
  
      const resultats = await Depense.find(filtre);
  
      res.json(resultats);
    } catch (erreur) {
      res.status(500).json({ erreur: 'Erreur lors de la recherche des services' });
    }
  }
  
  

module.exports = {
    getAllDepenses,
    createDepense,
    updateDepense,
    deleteDepense,
    getDepenseDetails,
    searchDepense
};
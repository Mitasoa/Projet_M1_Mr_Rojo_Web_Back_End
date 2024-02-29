const db = require('../models');
const Rdv = db.rdv;
const Service = require('../models/service.model');
const Depense = db.depense;
//Calcul temps moyen travail
async function calculerTempsMoyenTravail(req, res) {
    try {
        const { employeId, annee } = req.body;
        
        // Construire un objet de filtre en fonction des paramètres disponibles
        const filtre = {};
        if (employeId) {
            filtre.idEmploye = employeId;
        }
        if (annee) {
            filtre.dateheuredebut = {
                $gte: new Date(`${annee}-01-01`),
                $lt: new Date(`${annee}-12-31T23:59:59.999`)
            };
        }

        // Utiliser l'objet de filtre dans la requête MongoDB
        const rdvs = await Rdv.find(filtre);

        const heuresTravailParEmployeParMois = {};
        const nombreRdvsParEmployeParMois = {};

        rdvs.forEach((rdv) => {
            const { idEmploye, dateheuredebut, dateheurefin } = rdv;
            const dureeRdvEnHeures = (dateheurefin - dateheuredebut) / (60 * 60 * 1000);
            const mois = dateheuredebut.getMonth();

            heuresTravailParEmployeParMois[idEmploye] = heuresTravailParEmployeParMois[idEmploye] || Array(12).fill(0);
            nombreRdvsParEmployeParMois[idEmploye] = nombreRdvsParEmployeParMois[idEmploye] || Array(12).fill(0);

            heuresTravailParEmployeParMois[idEmploye][mois] += dureeRdvEnHeures;
            nombreRdvsParEmployeParMois[idEmploye][mois]++;
        });

        const nomsMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        const resultatFinal = [];

        for (const employeId in heuresTravailParEmployeParMois) {
            const tempsParMois = heuresTravailParEmployeParMois[employeId];
            const nombreRdvsParMois = nombreRdvsParEmployeParMois[employeId];

            const tempsMoyenParMois = tempsParMois.map((temps, mois) =>
                (temps / (nombreRdvsParMois[mois] || 1))
            );

            const employeData = {
                employeId,
                tempsMoyenParMois: tempsMoyenParMois.map((temps) => temps.toFixed(2))
            };

            resultatFinal.push(employeData);
        }

        res.json(resultatFinal);
    } catch (error) {
        res.status(500).json({ "error": error });
    }
}

//Statistique reservation
async function obtenirStatistiquesReservations(req, res) {
    try {
        let { annee } = req.body;

        if (!annee) {
            const dateActuelle = new Date();
            annee = dateActuelle.getFullYear().toString();
        }

        const rdvs = await Rdv.find({
            $expr: {
                $eq: [
                    { $year: "$dateheuredebut" },
                    parseInt(annee)
                ]
            }
        });

        const reservationsParMois = {};

        rdvs.forEach((rdv) => {
            const date = new Date(rdv.dateheuredebut);
            const mois = date.toLocaleString('default', { month: 'long' }).toLowerCase(); 
            const jour = date.getDate();

            reservationsParMois[mois] = reservationsParMois[mois] || {};
            reservationsParMois[mois][jour] = (reservationsParMois[mois][jour] || 0) + 1;
        });

        for (const mois in reservationsParMois) {
            reservationsParMois[mois].total = Object.values(reservationsParMois[mois]).reduce((total, value) => total + value, 0);
        }

        const tousLesMois = [
            'janvier', 'février', 'mars', 'avril',
            'mai', 'juin', 'juillet', 'août',
            'septembre', 'octobre', 'novembre', 'décembre'
        ];

        const resultatFinal = {};
        tousLesMois.forEach((mois) => {
            const moisData = reservationsParMois[mois] || { total: 0 };
            resultatFinal[mois] = {
                total: moisData.total,
                jours: Object.entries(moisData)
                    .filter(([jour, reservations]) => jour !== 'total' && reservations > 0)
                    .map(([jour, reservations]) => ({ jour, reservations }))
            };
        });

        res.json(resultatFinal);
    } catch (error) {
        res.status(500).json({ "error": error });
    }
}

//Statistique chiffre affaire
async function obtenirStatistiquesChiffreAffaires(req, res) {
    try {
        let { annee } = req.body;

        if (!annee) {
            const dateActuelle = new Date();
            annee = dateActuelle.getFullYear().toString();
        }

        const rdvs = await Rdv.find({
            $expr: {
                $eq: [
                    { $year: "$dateheuredebut" },
                    parseInt(annee)
                ]
            }
        });
        const services = await Service.find({etat:5});

        const chiffreAffairesParMois = {};

        const tousLesMois = [
            'janvier', 'février', 'mars', 'avril',
            'mai', 'juin', 'juillet', 'août',
            'septembre', 'octobre', 'novembre', 'décembre'
        ];

        tousLesMois.forEach((mois) => {
            chiffreAffairesParMois[mois] = { total: 0, jours: [] };
        });

        rdvs.forEach((rdv) => {
            const date = new Date(rdv.dateheuredebut);
            const mois = date.toLocaleString('default', { month: 'long' }).toLowerCase();
            const jour = date.getDate();

            const service = services.find(service => service.id === rdv.idservice);
            const montant = (service ? service.prix : 0);

            const jourExist = chiffreAffairesParMois[mois].jours.find(entry => entry.jour === jour);

            if (jourExist) {
                jourExist.chiffre_affaires += montant;
            } else {
                chiffreAffairesParMois[mois].jours.push({
                    "jour": jour,
                    "chiffre_affaires": montant
                });
            }

            chiffreAffairesParMois[mois].total += montant;
        });

        res.json(chiffreAffairesParMois);
    } catch (error) {
        res.status(500).json({ "error": error });
    }
}


async function obtenirStatistiquesBenefice(req, res) {
    try {
        let { annee } = req.body;

        if (!annee) {
            const dateActuelle = new Date();
            annee = dateActuelle.getFullYear().toString();
        }

        const rdvs = await Rdv.find({
            $expr: {
                $eq: [
                    { $year: "$dateheuredebut" },
                    parseInt(annee)
                ]
            }
        });
        const services = await Service.find({etat:5});
        const depenses = await Depense.find({
            $expr: {
                $eq: [
                    { $year: "$date" },
                    parseInt(annee)
                ]
            }
        });

        const beneficeParMois = {};

        const tousLesMois = [
            'janvier', 'février', 'mars', 'avril',
            'mai', 'juin', 'juillet', 'août',
            'septembre', 'octobre', 'novembre', 'décembre'
        ];

        tousLesMois.forEach((mois) => {
            beneficeParMois[mois] = 0;
        });

        rdvs.forEach(async (rdv) => {
            const date = new Date(rdv.dateheuredebut);
            const mois = date.toLocaleString('default', { month: 'long' }).toLowerCase(); 
            const service = services.find(service => service.id === rdv.idservice);

            beneficeParMois[mois] += (service ? service.prix-(service.prix*service.commission/100) : 0);
        });

        depenses.forEach((depense) => {
            const date = new Date(depense.date);
            const mois = date.toLocaleString('default', { month: 'long' }).toLowerCase(); 

            beneficeParMois[mois] -= depense.depense;
        });

        res.json(beneficeParMois);
    } catch (error) {
        res.status(500).json({ "error": error });
    }
}
module.exports = {
    calculerTempsMoyenTravail,
    obtenirStatistiquesReservations,
    obtenirStatistiquesChiffreAffaires,
    obtenirStatistiquesBenefice
};



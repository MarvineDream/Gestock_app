import { validationResult } from 'express-validator';
import Usage from '../models/UsageModel.js';
import mongoose from 'mongoose';
import Produit from '../models/produitModel.js';
import Agence from '../models/AgenceModels.js';
import Fournisseur from '../models/FournisseurModels.js';
import Distribution from '../models/DistributionModels.js';





export const generateWeeklyReport = async (req, res) => {
    const { agencyId } = req.params;

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Lundi de la semaine en cours
        const endDate = new Date();
        endDate.setHours(16, 0, 0, 0); // Vendredi à 16h

        const usages = await Usage.find({
            date: { $gte: startDate, $lte: endDate },
            agencyId: agencyId
        }).populate('produit');

        const report = usages.map(usage => ({
            produit: usage.produit.nom, 
            quantiteSortie: usage.quantiteSortie,
            date: usage.date
        }));

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const createConsumptionReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { agence, produit, fournisseur, stockInitial, entrees, sorties, stockFinal } = req.body;

    // Vérification des ObjectId
    if (!mongoose.isValidObjectId(agence) || !mongoose.isValidObjectId(produit) || !mongoose.isValidObjectId(fournisseur)) {
        return res.status(400).json({ error: 'Un ou plusieurs ObjectId sont invalides.' });
    }

    try {
        // Vérification de l'existence des entités
        const [produitExists, agenceExists, fournisseurExists] = await Promise.all([
            Produit.exists({ _id: produit }),
            Agence.exists({ _id: agence }),
            Fournisseur.exists({ _id: fournisseur })
        ]);

        if (!produitExists || !agenceExists || !fournisseurExists) {
            return res.status(404).json({ error: 'Produit, agence ou fournisseur introuvable.' });
        }

        // Vérification de la relation produit-fournisseur
        const produitFournisseur = await Produit.findOne({ _id: produit, fournisseur: fournisseur });
        if (!produitFournisseur) {
            return res.status(400).json({ error: 'Le produit n\'est pas associé à ce fournisseur.' });
        }

        // Vérification des relations avec l'agence
        const produitAgences = await Produit.find({ _id: produit, agence: agence });
        if (produitAgences.length === 0) {
            return res.status(400).json({ error: 'Le produit n\'est pas associé à cette agence.' });
        }

        // Validation des quantités
        if (stockInitial < 0 || entrees < 0 || sorties < 0) {
            return res.status(400).json({ error: 'Les quantités doivent être positives.' });
        }

        // Vérification du stock final
        const calculatedStockFinal = stockInitial + entrees - sorties;
        if (calculatedStockFinal !== stockFinal) {
            return res.status(400).json({ error: 'Le stock final ne correspond pas aux entrées et sorties.' });
        }

        // Création du rapport de consommation
        const newReport = new ConsumptionReport({
            fournisseur,
            stockInitial,
            entrees,
            sorties,
            stockFinal,
            date: new Date()
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const createConsumptionReportFromDistribution = async (req, res) => {
    const { produit, agence, fournisseur } = req.body;

    // Vérification des ObjectId
    if (!mongoose.isValidObjectId(agence) || !mongoose.isValidObjectId(produit) || !mongoose.isValidObjectId(fournisseur)) {
        return res.status(400).json({ error: 'Un ou plusieurs ObjectId sont invalides.' });
    }

    try {
        // Récupération de la distribution correspondante
        const distribution = await Distribution.findOne({ nom: produit, destinataire: agence, fournisseur: fournisseur }).sort({ date: -1 });
        
        if (!distribution) {
            return res.status(404).json({ error: 'Aucune distribution trouvée pour ce produit, agence ou fournisseur.' });
        }

        // Récupérer le stock initial (peut être une valeur fixe ou calculée)
        const stockInitial = distribution.quantite; // Par exemple, prendre la quantité de la dernière distribution

        // Définir les entrées et sorties
        const entrees = stockInitial; // Les entrées peuvent être définies en fonction de la logique métier
        const sorties = 0; // À ajuster selon vos besoins

        // Calculer le stock final
        const stockFinal = stockInitial + entrees - sorties;

        // Création du rapport de consommation
        const newReport = new ConsumptionReport({
            nom: produit,
            agence,
            fournisseur,
            stockInitial,
            entrees,
            sorties,
            stockFinal,
            date: new Date()
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



import Agence from '../models/AgenceModels.js';
import Distribution from '../models/DistributionModels.js';
import Produit from '../models/produitModel.js'; 
import mongoose from 'mongoose';



export const createDistribution = async (req, res) => {
    const { nom, quantite, destinataire, fournisseur, date } = req.body;
    console.log(req.body);
    
    // Vérification des champs requis
    if (!nom || !quantite || !destinataire || !fournisseur || !date) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        // Vérification de l'existence du produit
        const productFound = await Produit.findById(nom);
        if (!productFound) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Vérification de la quantité
        if (quantite > productFound.quantite) {
            return res.status(400).json({ error: 'Quantité demandée est supérieure à la quantité disponible' });
        }

        // Vérification de la validité de l'agence
        const validAgencyIds = await Agence.find().distinct('_id'); // Récupérer uniquement les IDs valides

        if (!validAgencyIds.includes(destinataire)) {
            return res.status(400).json({ error: 'Localisation non valide' });
        }

        // Création de la distribution
        const distribution = new Distribution({
            nom,
            quantite,
            destinataire,
            fournisseur,
            date,
        });

        await distribution.save();

        // Mise à jour de la quantité du produit
        productFound.quantite -= quantite;
        await productFound.save();

        res.status(201).json(distribution);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Erreur de validation', details: error.message });
        }

        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getAllDistributions = async (req, res) => {
    try {
        // Récupérer toutes les distributions
        const distributions = await Distribution.find();

        if (!distributions.length) {
            return res.status(404).json({ error: 'Aucune distribution trouvée' });
        }

        res.status(200).json(distributions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getDistributionsByDestinataire = async (req, res) => {
    const { destinataire } = req.params;
    console.log('Destinataire:', destinataire);

    try {
        // Récupérer les distributions pour le destinataire spécifié
        const distributions = await Distribution.find({ destinataire });

        if (!distributions.length) {
            return res.status(404).json({ error: 'Aucune distribution trouvée pour ce destinataire' });
        }

        res.status(200).json(distributions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const deleteDistribution = async (req, res) => {
    try {
        const distribution = await Distribution.findByIdAndDelete(req.params.id);
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDistributionById = async (req, res) => {
    try {
        const distribution = await Distribution.findById(req.params.id)
            .populate('nom') 
            .populate('destinataire')
            .populate('fournisseur'); // Corrigé pour peupler le fournisseur également
        
        if (!distribution) return res.status(404).json({ message: 'Distribution non trouvée' });
        res.status(200).json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
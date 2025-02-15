import Produit from '../models/produitModel.js';

export const stockMovement = async (nouveauProduit) => {
    try {
        // Ajout du nouveau produit à la base de données
        const produit = new Produit(nouveauProduit);
        await produit.save();

        // Récupération de tous les produits
        const produits = await Produit.find().populate('fournisseur').populate('categorie');

        // Affichage des informations des produits
        produits.forEach(prod => {
            console.log(`Code Produit: ${prod.code_produit}`);
            console.log(`Produit: ${prod.produit}`);
            console.log(`Fournisseur: ${prod.fournisseur.name}`); 
            console.log(`Catégorie: ${prod.categorie.name}`); 
            console.log(`Prix: ${prod.prix}`);
            console.log(`Gratuit: ${prod.gratuit}`);
            console.log(`Quantité: ${prod.quantite}`);
            console.log(`Stock Minimal: ${prod.Stockminimal}`);
            console.log('-------------------------');
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
    }
};
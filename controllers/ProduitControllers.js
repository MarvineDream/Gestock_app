import Produit from '../models/produitModel.js';

export const addProduct = async (req, res) => {
    const { code_produit, nom, fournisseur, categorie, prix, gratuit, quantite, Stockminimal } = req.body;

    try {
        // Vérification des champs requis
        if (!code_produit || !nom || !fournisseur || !categorie || !prix || quantite === undefined || Stockminimal === undefined) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérification de l'unicité du code produit
        const existingProduct = await Produit.findOne({ code_produit });
        if (existingProduct) {
            return res.status(409).json({ error: 'Le code produit doit être unique' });
        }

        // Vérification de l'existence du produit par nom
        const existingProductByName = await Produit.findOne({ nom, fournisseur });
        if (existingProductByName) {
            existingProductByName.quantite += quantite; // Mise à jour de la quantité
            await existingProductByName.save();
            return res.status(200).json({ message: 'Quantité mise à jour', product: existingProductByName });
        } else {
            // Création d'un nouveau produit
            const newProduct = new Produit({ code_produit, nom, fournisseur, categorie, prix, gratuit, quantite, Stockminimal });
            await newProduct.save();
            return res.status(201).json(newProduct);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Récupérer tous les produits
        const products = await Produit.find().populate('categorie fournisseur'); // Populate pour obtenir les détails des catégories et des fournisseurs

        // Vérifier si des produits existent
        if (products.length === 0) {
            return res.status(404).json({ message: 'Aucun produit trouvé' });
        }

        // Retourner les produits
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const getProductsBySupplier = async (req, res) => {
    const { supplierId } = req.params;

    try {
        const products = await Produit.find({ fournisseur: supplierId }).populate('categorie');
        if (!products.length) {
            return res.status(404).json({ error: 'Aucun produit trouvé pour ce fournisseur' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Produit.find({ categorie: categoryId }).populate('fournisseur');
        if (!products.length) {
            return res.status(404).json({ error: 'Aucun produit trouvé pour cette catégorie' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const product = await Produit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Produit.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};



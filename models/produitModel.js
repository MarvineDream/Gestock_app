import mongoose from 'mongoose';

const produitSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true },
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true }, 
    prix: { type: Number, required: true },  
    quantite: { type: Number, default: 0 },
    Stockminimal: { type: Number }
}, 
{ timestamps: true });

const Produit = mongoose.model('Produit', produitSchema);

export default Produit;


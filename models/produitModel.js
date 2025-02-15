import mongoose from 'mongoose';

const produitSchema = new mongoose.Schema({
    code_produit: { type: String, required: true },
    nom: { type: String, required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true },
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
    prix: { type: Number, required: true }, 
    gratuit: { type: Boolean, default: false }, 
    quantite: { type: Number, default: 0 },
    Stockminimal: { type: Number }
}, 
{ timestamps: true });

const Produit = mongoose.model('Produit', produitSchema);

export default Produit;









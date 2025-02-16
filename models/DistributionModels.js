import mongoose from 'mongoose';


const distributionSchema = new mongoose.Schema({
    nom: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }, 
    quantite: { type: Number, required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true }, 
    destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'Agence', required: true }, 
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

const Distribution = mongoose.model('Distribute', distributionSchema);

export default Distribution;

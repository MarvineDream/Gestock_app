import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
    nom: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    agence: { type: mongoose.Schema.Types.ObjectId, ref: 'Agence', required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Founisseur', required: true }, 
    quantite: { type: Number, required: true },
    type: { type: String, enum: ['distribution', 'consommation'], required: true },
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

const StockMovement = mongoose.model('stockMovement', stockMovementSchema);

export default StockMovement;

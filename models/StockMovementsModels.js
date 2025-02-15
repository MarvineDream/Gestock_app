import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
    code_produit: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    agence: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'supplier', required: true }, 
    quantite: { type: Number, required: true },
    type: { type: String, enum: ['distribution', 'consommation'], required: true },
    date: { type: Date, default: Date.now } 
}, 
{ timestamps: true });

const StockMovement = mongoose.model('stockMovement', stockMovementSchema);

export default StockMovement;

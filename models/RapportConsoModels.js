import mongoose from 'mongoose';

const consumptionReportSchema = new mongoose.Schema({ 
    nom: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }, 
    agence: { type: mongoose.Schema.Types.ObjectId, ref: 'Agence', required: true }, 
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true },  
    stockInitial: { type: Number, required: true }, 
    entrees: { type: Number, required: true }, 
    sorties: { type: Number, required: true },
    stockFinal: { type: Number, required: false }, 
    envoye: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}, 
{ timestamps: true });

const ConsumptionReport = mongoose.model('ConsumptionReport', consumptionReportSchema);
export default ConsumptionReport;
import mongoose from 'mongoose';

const consumptionReportSchema = new mongoose.Schema({ 
    nom: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    agence: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true }, 
    fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'supplier', required: true },  
    stockInitial: { type: Number, required: true }, 
    entrees: { type: Number, required: true }, 
    sorties: { type: Number, required: true },
    stockFinal: { type: Number, required: true }, 
    date: { type: Date, default: Date.now }
}, 
{ timestamps: true });

const ConsumptionReport = mongoose.model('ConsumptionReport', consumptionReportSchema);
export default ConsumptionReport;
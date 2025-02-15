import mongoose from 'mongoose';


const usageSchema = new mongoose.Schema({
    distributionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribution', required: true },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    quantiteUtilisee: { type: Number, required: true },
    date: { type: Date, default: Date.now }
},
{ timestaps: true });

const Usage = mongoose.model('usage', usageSchema);

export default Usage;

import mongoose from 'mongoose';

const fournisseurSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
}, 
{ timestamps: true });

const Fournisseur = mongoose.model('Fournisseur', fournisseurSchema);

export default Fournisseur;
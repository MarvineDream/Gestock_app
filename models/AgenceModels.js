import mongoose from 'mongoose';



const agencySchema = new mongoose.Schema({
    nom: { type: String, required: true },
}, 
{ timestamps: true });

const Agence = mongoose.model('agence', agencySchema);

export default Agence;














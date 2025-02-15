import mongoose from 'mongoose';



const categorieSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  
}, 
{ timestamps: true });

const Category = mongoose.model('Categorie', categorieSchema);

export default Category;


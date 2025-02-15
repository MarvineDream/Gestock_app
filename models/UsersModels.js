import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {  type: String, required: true, match: /.+\@.+\..+/ },
    role: { type: String, enum: ['root', 'admin'], required: true }, 
    agence: { type: mongoose.Schema.Types.ObjectId, ref: 'Agence', required: true }, 
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
},
{ timestaps: true });

const User = mongoose.model('user', userSchema);
export default User;



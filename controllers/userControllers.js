import User from '../models/UsersModels.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Agence from '../models/AgenceModels.js';
import crypto from 'crypto';




const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    return token;
};

export const registerUser = async (req, res) => {
    const { username, email, password, role, agence } = req.body;
    console.log(req.body);
    
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou email déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role, agence });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
    }
};





export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Vérification des entrées
    console.log('Requête de connexion reçue:', { email, password });
    
    if (!email || !password) {
        console.log('Erreur : Nom d\'utilisateur ou mot de passe manquant');
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    try {
        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user);

        // Vérification de l'existence de l'utilisateur
        if (!user) {
            console.log('Erreur : Utilisateur non trouvé');
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Comparaison de mot de passe réussie:', isMatch);
        
        if (!isMatch) {
            console.log('Erreur : Mot de passe incorrect');
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = generateToken(user._id);
        console.log('Token généré:', token);
        
        // Redirection en fonction du rôle et de l'agence
        let redirectPath;
        
        switch (user.role) {
            case 'root':
                console.log("Redirection vers le tableau de bord de l'admin root");
                redirectPath = '/accueil';
                break;
            case 'admin':
                console.log("Redirection vers le tableau de bord de l'admin de l'agence");
                redirectPath = `/admin2`;
                break;
            default:
                console.log('Erreur : Rôle non reconnu');
                return res.status(403).json({ message: 'Accès refusé' });
        }

        return res.status(200).json({
            token,
            redirect: redirectPath,
            user: { id: user._id, username: user.username, agency: user.agence }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};



export const createUserForAgency = async (req, res) => {
    // Validation des champs requis
    await body('username').notEmpty().withMessage('Nom d’utilisateur requis.').run(req);
    await body('email').isEmail().withMessage('Email invalide.').run(req);
    await body('role').notEmpty().withMessage('Rôle requis.').run(req);
    await body('agencyId').notEmpty().withMessage('ID de l’agence requis.').run(req);
    await body('password').notEmpty().withMessage('Mot de passe requis.').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, role, agencyId, password } = req.body;

    console.log('Première Données reçues:', req.body);

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Le nom d'utilisateur ou l'email existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            role, 
            agence: agencyId 
        });

        console.log('Seconde Données reçues:', newUser);

        await newUser.save();
        await Agence.findByIdAndUpdate(agencyId, { $push: { users: newUser._id } });

        const resetToken = crypto.randomBytes(32).toString('hex');
        newUser.resetPasswordToken = resetToken;
        newUser.resetPasswordExpires = Date.now() + 3600000;
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const resetUrl = `https://gestock-app.onrender.com/User/create-user/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'Gestock App',
            to: newUser.email,
            subject: 'Informations de connexion',
            text: `Bonjour ${username},\n\nVoici vos informations de connexion :\nLogin : ${email}\nMot de passe : ${password}\nAgence : ${agencyId}\n\nLien pour réinitialiser votre mot de passe : ${resetUrl}\n\nCordialement,\nL'équipe bamboo Assur`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role, agency } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, password, role, agency }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        // Envoi d'un message de confirmation après la suppression
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’utilisateur invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

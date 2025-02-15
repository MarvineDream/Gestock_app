import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import userRoutes from './Routes/userRoutes.js';
import AgenceRoutes from './Routes/AgenceRoutes.js';
import { generateWeeklyReport } from './controllers/RapportControllers.js';
import categorieRoutesRoutes from './Routes/CategorieRoutes.js';
import FournisseurRoutes from './Routes/FournisseurRoutes.js';
import ProduitRoutes from './Routes/ProduitRoutes.js';
import DistributionRoutes from './Routes/DistributionRoutes.js';
import connectToDatabase from './config/db.js';
import StockmovementRouter from './Routes/StockmovementRoutes.js';
import RapportConsoRoutes from './Routes/RapportConsoRoutes.js';







connectToDatabase();

dotenv.config();
const app = express();
const PORT = process.env.PORT 





// Middleware pour permettre l'accès à l'API (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '1800');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    // Gérer les requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Réponse vide pour les requêtes OPTIONS
    }

    next();
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));






app.use('/User', userRoutes);
app.use('/Agence', AgenceRoutes);
app.use('/Fournisseur', FournisseurRoutes);
app.use('/Produit', ProduitRoutes);
app.use('/Distribution', DistributionRoutes);
app.use('/Categorie', categorieRoutesRoutes);
app.use('/Stock', StockmovementRouter);
app.use('/Rapport', RapportConsoRoutes);






// Planifie la tâche pour chaque vendredi à 16h
cron.schedule('0 16 * * 5', () => {
    generateWeeklyReport();
});












app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    
})
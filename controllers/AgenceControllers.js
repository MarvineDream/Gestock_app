import Agence from '../models/AgenceModels.js';


const createAgency = async (req, res) => {
    const { nom } = req.body;
    console.log(req.body);
    

    try {
        // Vérifiez si le nom est fourni
        if (!nom) {
            return res.status(400).json({ error: 'Le nom de l\'agence est requis.' });
        }

        const newAgency = new Agence({ nom });
        await newAgency.save();
        res.status(201).json(newAgency);
    } catch (error) {
        // Gestion des erreurs de validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Données invalides', 
                details: error.message 
            });
        }
        // Gestion des erreurs de doublon
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'Agence déjà existante' 
            });
        }
        // Erreur générique du serveur
        res.status(500).json({ 
            error: 'Erreur du serveur', 
            details: error.message 
        });
    }
};



const getAgencies = async (req, res) => {
    try {
        const agencies = await Agence.find();
        res.status(200).json(agencies);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const getAgencyById = async (req, res) => {
    const { id } = req.params;

    try {
        const agency = await Agence.findById(id);
        if (!agency) {
            return res.status(404).json({ error: 'Agence non trouvée' });
        }
        res.json(agency);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’agence invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
}; 


const updateAgency = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedAgency = await Agence.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedAgency) {
            return res.status(404).json({ error: 'Agence non trouvée' });
        }
        res.json(updatedAgency);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: " ID d’agence invalide " });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


const deleteAgency = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAgency = await Agence.findByIdAndDelete(id);
        if (!deletedAgency) {
            return res.status(404).json({ error: 'Agence non trouvée' });
        }
        res.status(204).send();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d’agence invalide' });
        }
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};

export { createAgency, getAgencies, getAgencyById, updateAgency, deleteAgency };

import Usage from '../models/UsageModel.js';



export const generateWeeklyReport = async (req, res) => {
    const { agencyId } = req.params;

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Lundi de la semaine en cours
        const endDate = new Date();
        endDate.setHours(16, 0, 0, 0); // Vendredi à 16h

        const usages = await Usage.find({
            date: { $gte: startDate, $lte: endDate },
            agencyId: agencyId
        }).populate('produit');

        const report = usages.map(usage => ({
            produit: usage.produit.nom, 
            quantiteSortie: usage.quantiteSortie,
            date: usage.date
        }));

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


export const createConsumptionReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { agence, produit, fournisseur, stockInitial, entrees, sorties, stockFinal } = req.body;

    
    if (!mongoose.isValidObjectId(agence) || !mongoose.isValidObjectId(produit) || !mongoose.isValidObjectId(fournisseur)) {
        return res.status(400).json({ error: 'Un ou plusieurs ObjectId sont invalides.' });
    }

    try {
       
        const [produitExists, agenceExists, fournisseurExists] = await Promise.all([
            produit.exists({ _id: produit }),
            agence.exists({ _id: agence }),
            fournisseur.exists({ _id: fournisseur })
        ]);

        if (!produitExists || !agenceExists || !fournisseurExists) {
            return res.status(404).json({ error: 'Produit, agence ou fournisseur introuvable.' });
        }

        const newReport = new ConsumptionReport({
            nom,
            fournisseur,
            stockInitial,
            entrees,
            sorties,
            stockFinal,
            date: new Date()
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};


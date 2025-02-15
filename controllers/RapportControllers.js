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

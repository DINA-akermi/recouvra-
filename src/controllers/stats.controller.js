const Facture = require("../models/Facture");
const Paiement = require("../models/Paiement");

exports.getStats = async (req, res) => {
  try {
    
    const totalFactures = await Facture.countDocuments();

   
    const montantGlobalResult = await Facture.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const montantGlobalFactures =
      montantGlobalResult.length > 0 ? montantGlobalResult[0].total : 0;

    
    const montantPayeResult = await Paiement.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const montantTotalRecouvre =
      montantPayeResult.length > 0 ? montantPayeResult[0].total : 0;

  
    const resteARecouvrer =
      montantGlobalFactures - montantTotalRecouvre;

    
    const statusCounts = await Facture.aggregate([
      { $group: { _id: "$statut", count: { $sum: 1 } } }
    ]);

    const facturesParStatut = {};

    statusCounts.forEach((item) => {
      facturesParStatut[item._id] = item.count;
    });

    // Réponse
    res.status(200).json({
      totalFactures,
      montantGlobalFactures,
      montantTotalRecouvre,
      resteARecouvrer,
      facturesParStatut
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
};
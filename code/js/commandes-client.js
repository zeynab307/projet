// js/commandes-client.js : Commandes liées au compte client (T7.1)
// Dépend de : infos-client.js (pour utilisateurConnecte())

const CLE_COMMANDES = "commandes";

function lireCommandes() {
    try {
    const liste = JSON.parse(localStorage.getItem(CLE_COMMANDES));
    return Array.isArray(liste) ? liste : [];
    } catch (e) {
    return [];
    }
}

// À appeler par Wellvie (T6.4) AVANT d'enregistrer la commande.
// L'identifiant vient de la session, jamais d'un champ du formulaire.
// Retourne la commande avec idClient, ou null si personne n'est connecté.
function rattacherCommandeAuClient(commande) {
    const user = utilisateurConnecte();
    if (!user) return null;
    return Object.assign({}, commande, { idClient: user.id });
}

// Commandes du client connecté, de la plus récente à la plus ancienne.
function commandesDuClient() {
    const user = utilisateurConnecte();
    if (!user) return [];
    return lireCommandes()
    .filter((c) => c.idClient === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
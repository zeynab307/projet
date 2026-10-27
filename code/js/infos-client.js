// js/infos-client.js : Sauvegarde et pré-remplissage des infos client (T6.5)
// Dépend de : livraison-validation.js (T6.2)

const CLE_INFOS_CLIENTS = "infosClients";

// ---------- Pont vers la session (T8.4, Ngomba) ----------
// SEUL endroit à adapter selon la clé et le contenu choisis par Ngomba.
function utilisateurConnecte() {
  try {
    const session = JSON.parse(sessionStorage.getItem("session"));
    return session && session.id ? session : null;
  } catch (e) {
    return null;
  }
}

// ---------- Stockage : un objet { idUtilisateur: {nom, telephone, adresse} } ----------
function lireToutesInfos() {
  try {
    return JSON.parse(localStorage.getItem(CLE_INFOS_CLIENTS)) || {};
  } catch (e) {
    return {};
  }
}

function lireInfosClient() {
  const user = utilisateurConnecte();
  if (!user) return null;
  return lireToutesInfos()[user.id] || null;
}

// Retourne true si la sauvegarde a eu lieu
function sauvegarderInfosClient(infos) {
  const user = utilisateurConnecte();
  if (!user) return false; // visiteur non connecté : rien à mémoriser

  // On revalide avant d'enregistrer : on ne stocke jamais de données non nettoyées
  const resultat = validerLivraison(infos);
  if (!resultat.ok) return false;

  const toutes = lireToutesInfos();
  toutes[user.id] = resultat.valeurs;
  localStorage.setItem(CLE_INFOS_CLIENTS, JSON.stringify(toutes));
  return true;
}

function supprimerInfosClient() {
  const user = utilisateurConnecte();
  if (!user) return;
  const toutes = lireToutesInfos();
  delete toutes[user.id];
  localStorage.setItem(CLE_INFOS_CLIENTS, JSON.stringify(toutes));
}

// ---------- Pré-remplissage ----------
// ids = { nom: "nomClient", telephone: "telephoneClient", adresse: "adresseClient" }
function preRemplirFormulaire(ids) {
  const infos = lireInfosClient();
  if (!infos) return false;

  const champNom = document.getElementById(ids.nom);
  const champTel = document.getElementById(ids.telephone);
  const champAdresse = document.getElementById(ids.adresse);

  // .value ne lit jamais le HTML : pas de risque XSS
  // On ne remplace pas ce que le client a déjà commencé à taper
  if (champNom && !champNom.value) champNom.value = infos.nom || "";
  if (champTel && !champTel.value) champTel.value = infos.telephone || "";
  if (champAdresse && !champAdresse.value) champAdresse.value = infos.adresse || "";
  return true;
}
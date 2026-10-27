// js/livraison-validation.js : Validation des infos de livraison (T6.2)
// Utilisé par le formulaire d'Erwan (T6.1) et par la création de commande (T6.4, Wellvie).

// ---------- Nettoyage ----------
function nettoyerTexte(texte) {
  // Supprime les espaces en trop (début, fin, doublons) et les caractères de contrôle
  return String(texte || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function nettoyerTelephone(tel) {
  // Garde seulement le + de début et les chiffres : "+241 06 12 34 56" -> "+24106123456"
  const brut = String(tel || "").trim();
  const plus = brut.startsWith("+") ? "+" : "";
  return plus + brut.replace(/\D/g, "");
}

// ---------- Validation ----------
function validerLivraison({ nom, telephone, adresse }) {
  const erreurs = [];

  const nomNet = nettoyerTexte(nom);
  const telNet = nettoyerTelephone(telephone);
  const adresseNet = nettoyerTexte(adresse);

  // Nom : 2 à 60 caractères, lettres (accents inclus), espaces, apostrophes, tirets
  if (nomNet.length < 2 || nomNet.length > 60) {
    erreurs.push("Le nom doit contenir entre 2 et 60 caractères.");
  } else if (!/^[\p{L}][\p{L}\s'’-]*$/u.test(nomNet)) {
    erreurs.push("Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets.");
  }

  // Téléphone : 8 à 15 chiffres, + facultatif au début
  if (!/^\+?\d{8,15}$/.test(telNet)) {
    erreurs.push("Numéro de téléphone invalide (8 à 15 chiffres, ex : +241 06 12 34 56).");
  }

  // Adresse : 5 à 200 caractères, sans < ni >
  if (adresseNet.length < 5 || adresseNet.length > 200) {
    erreurs.push("L'adresse doit contenir entre 5 et 200 caractères.");
  } else if (/[<>]/.test(adresseNet)) {
    erreurs.push("L'adresse ne peut pas contenir les caractères < ou >.");
  }

  return {
    ok: erreurs.length === 0,
    erreurs: erreurs,
    // Valeurs nettoyées : c'est CELLES-CI qu'il faut enregistrer dans la commande
    valeurs: { nom: nomNet, telephone: telNet, adresse: adresseNet },
  };
}

// ---------- Affichage sécurisé ----------
// À utiliser pour TOUT texte venant d'un utilisateur : textContent ne lit jamais le HTML.
function afficherTexte(element, texte) {
  element.textContent = texte;
}

function afficherErreurs(zone, erreurs) {
  zone.textContent = "";
  erreurs.forEach((msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    p.className = "erreur";
    zone.appendChild(p);
  });
}
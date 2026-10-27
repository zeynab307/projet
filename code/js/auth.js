// js/auth.js : Gestion des comptes (T8.3)
// Partagé avec la connexion (T8.4) : ne pas renommer les fonctions sans prévenir l'équipe.

const CLE_UTILISATEURS = "utilisateurs";
const ROLES_VALIDES = ["client", "responsable"];

// ---------- Stockage ----------
function lireUtilisateurs() {
  try {
    return JSON.parse(localStorage.getItem(CLE_UTILISATEURS)) || [];
  } catch (e) {
    return [];
  }
}

function sauvegarderUtilisateurs(liste) {
  localStorage.setItem(CLE_UTILISATEURS, JSON.stringify(liste));
}

// ---------- Hachage (Web Crypto) ----------
function octetsVersHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexVersOctets(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));
}

function genererSel() {
  return octetsVersHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
}

// PBKDF2 + SHA-256 + sel : le mot de passe n'est jamais stocké en clair.
// La connexion (T8.4) doit réutiliser exactement cette fonction.
async function hacherMotDePasse(motDePasse, selHex) {
  const encodeur = new TextEncoder();
  const cle = await crypto.subtle.importKey(
    "raw",
    encodeur.encode(motDePasse),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexVersOctets(selHex), iterations: 100000, hash: "SHA-256" },
    cle,
    256
  );
  return octetsVersHex(bits);
}

// ---------- Validation ----------
function validerInscription({ nom, email, motDePasse, confirmation, role }) {
  const erreurs = [];
  nom = (nom || "").trim();
  email = (email || "").trim().toLowerCase();

  if (nom.length < 2 || nom.length > 50) {
    erreurs.push("Le nom doit contenir entre 2 et 50 caractères.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erreurs.push("Adresse e-mail invalide.");
  } else if (lireUtilisateurs().some((u) => u.email === email)) {
    erreurs.push("Un compte existe déjà avec cet e-mail.");
  }
  if (!motDePasse || motDePasse.length < 8 || !/[A-Za-z]/.test(motDePasse) || !/\d/.test(motDePasse)) {
    erreurs.push("Le mot de passe doit contenir au moins 8 caractères, avec une lettre et un chiffre.");
  }
  if (motDePasse !== confirmation) {
    erreurs.push("Les mots de passe ne correspondent pas.");
  }
  if (!ROLES_VALIDES.includes(role)) {
    erreurs.push("Rôle invalide.");
  }
  return erreurs;
}

// ---------- Création du compte ----------
async function creerCompte(donnees) {
  const erreurs = validerInscription(donnees);
  if (erreurs.length > 0) {
    return { ok: false, erreurs };
  }

  const sel = genererSel();
  const utilisateur = {
    id: "u" + Date.now(),
    nom: donnees.nom.trim(),
    email: donnees.email.trim().toLowerCase(),
    sel: sel,
    motDePasseHache: await hacherMotDePasse(donnees.motDePasse, sel),
    role: donnees.role,
  };

  const liste = lireUtilisateurs();
  liste.push(utilisateur);
  sauvegarderUtilisateurs(liste);
  return { ok: true, erreurs: [] };
}
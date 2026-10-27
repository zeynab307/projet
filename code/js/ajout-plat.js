// js/ajout-plat.js : Ajout d'un plat (T1.3)

// À ADAPTER avec la navigation par pays d'Erwan (T2.1)
const PAYS_DISPONIBLES = ["Sénégal", "Gabon", "Cameroun", "Côte d'Ivoire", "Maroc"];

// ---------- Pont vers T1.1 (Owen) ----------
// Si Owen a livré ajouterPlat(), on l'utilise. Sinon, solution temporaire.
// TODO : supprimer la partie temporaire quand T1.1 est fusionné dans main.
const CLE_PLATS = "plats";

function enregistrerPlat(plat) {
  if (typeof ajouterPlat === "function") {
    return ajouterPlat(plat);
  }
  let liste = [];
  try {
    liste = JSON.parse(localStorage.getItem(CLE_PLATS)) || [];
  } catch (e) {
    liste = [];
  }
  liste.push(plat);
  localStorage.setItem(CLE_PLATS, JSON.stringify(liste));
}

// ---------- Liste des pays ----------
function remplirPays() {
  const select = document.getElementById("paysPlat");
  PAYS_DISPONIBLES.forEach((pays) => {
    const option = document.createElement("option");
    option.value = pays;
    option.textContent = pays;
    select.appendChild(option);
  });
}

// ---------- Validation ----------
function validerPlat(plat) {
  const erreurs = [];
  if (plat.nom.length < 2 || plat.nom.length > 60) {
    erreurs.push("Le nom doit contenir entre 2 et 60 caractères.");
  }
  if (!PAYS_DISPONIBLES.includes(plat.pays)) {
    erreurs.push("Choisis un pays dans la liste.");
  }
  if (!Number.isInteger(plat.prix) || plat.prix <= 0) {
    erreurs.push("Le prix doit être un nombre entier supérieur à 0.");
  }
  if (plat.description.length > 300) {
    erreurs.push("La description ne doit pas dépasser 300 caractères.");
  }
  return erreurs;
}

// ---------- Messages (textContent uniquement) ----------
function afficherMessages(messages, succes) {
  const zone = document.getElementById("messagePlat");
  zone.textContent = "";
  messages.forEach((msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    p.className = succes ? "succes" : "erreur";
    zone.appendChild(p);
  });
}

// ---------- Soumission ----------
document.getElementById("formPlat").addEventListener("submit", (e) => {
  e.preventDefault();

  const plat = {
    id: "p" + Date.now(),
    nom: document.getElementById("nomPlat").value.trim(),
    pays: document.getElementById("paysPlat").value,
    prix: Number(document.getElementById("prixPlat").value),
    description: document.getElementById("descriptionPlat").value.trim(),
    image: document.getElementById("imagePlat").value.trim(),
    specialite: document.getElementById("specialitePlat").checked,
    disponible: document.getElementById("disponiblePlat").checked,
  };

  const erreurs = validerPlat(plat);
  if (erreurs.length > 0) {
    afficherMessages(erreurs, false);
    return;
  }

  enregistrerPlat(plat);
  afficherMessages(["Plat « " + plat.nom + " » ajouté au menu."], true);
  e.target.reset();
  document.getElementById("disponiblePlat").checked = true;
});

remplirPays();
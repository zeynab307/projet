// js/mes-commandes.js : Affichage de la page « Mes commandes » (T7.1)

function ligneCommande(libelle, valeur) {
    const p = document.createElement("p");
    const etiquette = document.createElement("strong");
    etiquette.textContent = libelle + " : ";
    p.appendChild(etiquette);
  p.appendChild(document.createTextNode(valeur)); // texte brut, jamais interprété comme HTML
    return p;
}

function afficherMesCommandes() {
    const message = document.getElementById("messageCommandes");
    const conteneur = document.getElementById("listeCommandes");
    conteneur.textContent = "";

    if (!utilisateurConnecte()) {
    message.textContent = "Connecte-toi pour voir tes commandes.";
    return;
    }

    const commandes = commandesDuClient();
    if (commandes.length === 0) {
    message.textContent = "Tu n'as pas encore passé de commande.";
    return;
    }
    message.textContent = "";

    commandes.forEach((c) => {
    const carte = document.createElement("div");
    carte.className = "carte-commande";

    const date = new Date(c.date);
    const dateTexte = isNaN(date) ? "date inconnue" : date.toLocaleString("fr-FR");

    carte.appendChild(ligneCommande("Commande n°", String(c.numero)));
    carte.appendChild(ligneCommande("Date", dateTexte));
    carte.appendChild(ligneCommande("Localisation", String(c.adresse || "non renseignée")));
    carte.appendChild(ligneCommande("Total", Number(c.total || 0).toLocaleString("fr-FR") + " FCFA"));
    carte.appendChild(ligneCommande("Statut", String(c.statut)));

    // Lien vers le détail (T7.3, Mamour)
    const lien = document.createElement("a");
    lien.textContent = "Voir le détail";
    lien.href = "detail-commande.html?numero=" + encodeURIComponent(c.numero);
    carte.appendChild(lien);

    conteneur.appendChild(carte);
    });
}

afficherMesCommandes();
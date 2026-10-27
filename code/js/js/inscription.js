// js/inscription.js : branche le formulaire d'inscription sur creerCompte()
document.getElementById("formInscription").addEventListener("submit", async (e) => {
  e.preventDefault();

  const resultat = await creerCompte({
    nom: document.getElementById("nom").value,
    email: document.getElementById("email").value,
    motDePasse: document.getElementById("motDePasse").value,
    confirmation: document.getElementById("confirmation").value,
    role: document.getElementById("role").value,
  });

  const zoneErreurs = document.getElementById("erreurs");
  zoneErreurs.textContent = "";

  if (!resultat.ok) {
    resultat.erreurs.forEach((msg) => {
      const p = document.createElement("p");
      p.textContent = msg; // textContent, jamais innerHTML (XSS)
      zoneErreurs.appendChild(p);
    });
    return;
  }
  window.location.href = "connexion.html";
});
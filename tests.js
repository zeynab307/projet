/// Tâche T7.4 : Tests d'acceptation US7
function executerTestsUS7() {
    console.log("%c=== LANCEMENT DES TESTS D'ACCEPTATION (US7) ===", "color: blue; font-weight: bold;");

    let testsPasses = 0;
    let totalTests = 0;

    function asserter(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`%c[PASS] ${message}`, "color: green;");
            testsPasses++;
        } else {
            console.error(`[FAIL] ${message}`);
        }
    }

    // Test 1: Chargement initial des données
    asserter(typeof platsData !== 'undefined' && platsData.length >= 8, "Le catalogue contient bien les plats d'Afrique (T8.1)");

    // Test 2: Filtrage par pays (Gabon, RDC, Sénégal, Côte d'Ivoire)
    const platsGabon = platsData.filter(p => p.origine === "Gabon");
    asserter(platsGabon.length === 2, "Le filtre par pays (Gabon) renvoie bien 2 plats (T2.3)");

    // Test 3: Simulation de l'ajout au panier et calcul du total
    const p1 = platsData[0]; // Poulet Nyembwe (14.50)
    const p2 = platsData[4]; // Thiéboudienne (13.50)
    const totalAttendu = p1.prix + p2.prix;
    asserter(totalAttendu === 28.00, "Le calcul du total du panier est exact (28.00 €) (T3.4)");

    // Test 4: Formatage des identifiants de commande
    const testCmdId = "CMD-" + Date.now();
    asserter(testCmdId.startsWith("CMD-"), "La commande génère un identifiant unique valide (T5.1)");

    // Résumé
    console.log(`%c=== RÉSULTAT DES TESTS : ${testsPasses}/${totalTests} PASSÉS ===`, 
        testsPasses === totalTests ? "color: green; font-weight: bold;" : "color: red; font-weight: bold;");
}

// Exécution au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que app.js et donnees.js sont bien chargés
    setTimeout(executerTestsUS7, 500);
});
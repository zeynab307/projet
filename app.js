let roleActuel = 'Client';
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let commandes = JSON.parse(localStorage.getItem('commandes')) || [];

// Gestion des onglets (Espaces séparés)
function changerOnglet(nomOnglet) {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });
    const cible = document.getElementById(`section-${nomOnglet}`);
    if (cible) {
        cible.classList.remove('hidden');
    }
}

// Affichage dynamique du menu avec images
function afficherMenu(platsAffiches = platsData) {
    const container = document.getElementById('menu-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (platsAffiches.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">Aucun plat ne correspond à votre recherche.</p>';
        return;
    }

    platsAffiches.forEach(plat => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between border border-gray-100">
                <div class="relative h-48 w-full">
                    <img src="${plat.image}" alt="${plat.nom}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                        ${plat.origine}
                    </span>
                </div>
                
                <div class="p-5 flex flex-col flex-grow justify-between">
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">${plat.nom}</h3>
                        <p class="text-red-600 font-extrabold text-xl mt-2">${plat.prix.toFixed(2)} €</p>
                    </div>
                    
                    <button onclick="ajouterAuPanier(${plat.id})" 
                        class="mt-5 w-full bg-red-500 text-white py-2.5 px-4 rounded-xl font-bold hover:bg-red-600 transition duration-200 shadow-sm ${!plat.disponible ? 'opacity-50 cursor-not-allowed' : ''}" 
                        ${!plat.disponible ? 'disabled' : ''}>
                        ${plat.disponible ? 'Ajouter au panier 🛒' : 'Indisponible'}
                    </button>
                </div>
            </div>
        `;
    });
}

// Filtre par pays et recherche par nom
function filtrerPlats() {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');

    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedCountry = countryFilter ? countryFilter.value : "Tous";

    const platsFiltres = platsData.filter(plat => {
        const correspondNom = plat.nom.toLowerCase().includes(searchText);
        const correspondPays = (selectedCountry === 'Tous' || plat.origine === selectedCountry);
        return correspondNom && correspondPays;
    });

    afficherMenu(platsFiltres);
}

// Gestion du Panier (Ajout, Suppression individuelle, Mise à jour)
function ajouterAuPanier(id) {
    const plat = platsData.find(p => p.id === id);
    if (plat) {
        panier.push(plat);
        localStorage.setItem('panier', JSON.stringify(panier));
        mettreAJourPanier();
    }
}

function supprimerDuPanier(index) {
    panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(panier));
    mettreAJourPanier();
}

function mettreAJourPanier() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) cartCount.innerText = panier.length;
    
    if (cartItems && cartTotal) {
        if (panier.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500">Votre panier est vide.</p>';
            cartTotal.innerText = '0.00';
            return;
        }
        
        cartItems.innerHTML = panier.map((item, index) => `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                <div>
                    <span class="font-bold text-gray-800">${item.nom}</span>
                    <span class="text-red-600 font-semibold ml-4">${item.prix.toFixed(2)} €</span>
                </div>
                <button onclick="supprimerDuPanier(${index})" class="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    Supprimer ❌
                </button>
            </div>
        `).join('');

        const total = panier.reduce((sum, item) => sum + item.prix, 0);
        cartTotal.innerText = total.toFixed(2);
    }
}

// Géolocalisation GPS (T6.3)
function obtenirGeolocalisation() {
    const geoStatus = document.getElementById('geoStatus');
    const adresseInput = document.getElementById('adresseInput');
    const carteContainer = document.getElementById('carteContainer');
    const carteLien = document.getElementById('carteLien');

    if (!navigator.geolocation) {
        if (geoStatus) geoStatus.innerText = "La géolocalisation n'est pas supportée.";
        return;
    }

    if (geoStatus) geoStatus.innerText = "Recherche GPS...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (adresseInput) adresseInput.value = `GPS : ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            if (geoStatus) geoStatus.innerText = "Position trouvée !";

            if (carteLien) carteLien.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
            if (carteContainer) carteContainer.classList.remove('hidden');
        },
        (error) => {
            if (geoStatus) geoStatus.innerText = "Erreur de géolocalisation.";
            console.error("Erreur GPS :", error);
        }
    );
}

// Validation de commande et enregistrement (T3.4 & T5.1)
function validerCommande() {
    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const adresseInput = document.getElementById('adresseInput');
    const adresse = adresseInput ? adresseInput.value.trim() : "";

    if (!adresse) {
        alert("Veuillez saisir ou récupérer une adresse de livraison !");
        return;
    }

    const nouvelleCommande = {
        id: "CMD-" + Date.now(),
        date: new Date().toISOString(),
        articles: [...panier],
        total: panier.reduce((sum, item) => sum + item.prix, 0),
        adresse: adresse,
        paye: false
    };

    commandes.push(nouvelleCommande);
    localStorage.setItem('commandes', JSON.stringify(commandes));

    panier = [];
    localStorage.removeItem('panier');
    if (adresseInput) adresseInput.value = "";
    
    mettreAJourPanier();
    afficherCommandes();
    alert("Commande enregistrée avec succès !");
    changerOnglet('commandes'); // Redirige vers l'onglet commandes
}

// Rôles et gestion des commandes (T4.4 & T5.1)
function changerRole() {
    const select = document.getElementById('roleSelect');
    if (select) {
        roleActuel = select.value;
        afficherCommandes();
    }
}

function afficherCommandes() {
    const container = document.getElementById('listeCommandes');
    if (!container) return;

    if (commandes.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Aucune commande enregistrée.</p>';
        return;
    }

    const commandesTriees = [...commandes].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = commandesTriees.map(cmd => {
        const dateFormatted = new Date(cmd.date).toLocaleString('fr-FR');
        return `
            <div class="border p-4 rounded-xl bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div class="font-bold text-lg text-gray-800">${cmd.id} <span class="text-xs font-normal text-gray-500">(${dateFormatted})</span></div>
                    <div class="text-sm text-gray-600 mt-1">Adresse : ${cmd.adresse}</div>
                    <div class="text-sm font-medium mt-1 text-gray-700">Articles : ${cmd.articles.map(a => a.nom).join(', ')}</div>
                    <div class="font-bold text-red-600 mt-1">Total : ${cmd.total.toFixed(2)} €</div>
                </div>

                <div class="flex flex-col items-end gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${cmd.paye ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${cmd.paye ? 'Payé ✓' : 'En attente de règlement'}
                    </span>

                    ${(roleActuel === 'Livreur' && !cmd.paye) ? `
                        <button onclick="confirmerReglement('${cmd.id}')" class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm">
                            💳 Confirmer le règlement
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function confirmerReglement(cmdId) {
    const cmd = commandes.find(c => c.id === cmdId);
    if (cmd) {
        cmd.paye = true;
        localStorage.setItem('commandes', JSON.stringify(commandes));
        afficherCommandes();
        alert(`Règlement confirmé pour la commande ${cmdId} !`);
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
    afficherMenu();
    mettreAJourPanier();
    afficherCommandes();
});
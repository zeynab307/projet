# 🍔 Application Web Restaurant - Saveur d'Afrique

Bienvenue sur l'application web interactive du restaurant **Saveur d'Afrique**, développée dans le cadre du projet web (Front-End HTML/CSS/JS & Back-End Java).

## 📌 Fonctionnalités Implémentées (Backlog - Mougala Grégoire Owen)

- **T8.1 - Structure du projet** : Arborescence modulaire (`index.html`, `js/`, `css/`), intégration de Tailwind CSS.
- **T1.1 - Modèle de données & Plats** : Spécialités d'Afrique centrale et de l'Ouest (Gabon, RDC, Sénégal, Côte d'Ivoire).
- **T2.3 - Filtre et Recherche** : Recherche dynamique par nom et filtrage par pays d'origine.
- **T3.4 - Gestion du Panier & Persistence** : Sauvegarde locale du panier d'achat via `localStorage`.
- **T6.3 - Localisation & GPS** : Récupération des coordonnées GPS du navigateur et lien vers la carte OpenStreetMap.
- **T4.4 - Confirmation du Règlement** : Interface dédiée au livreur / responsable pour passer une commande en statut "Payé".
- **T5.1 - Historique des Commandes** : Affichage et tri chronologique des commandes (de la plus récente à la plus ancienne).
- **T7.4 - Tests d'Acceptation (US7)** : Suite de tests automatisés vérifiant le bon fonctionnement du panier et des filtres dans la console.
- **Q2 - Documentation** : Présentation complète du projet et de l'architecture.

---

## 🏗️ Architecture du Projet

```text
site restaurant/
│
├── index.html              # Interface utilisateur principale
├── README.md               # Documentation du projet
│
├── js/                     # Scripts JavaScript
│   ├── donnees.js          # Dataset des plats d'Afrique
│   ├── app.js              # Logique métier (Panier, Filtres, GPS, Commandes)
│   └── tests.js            # Tests d'acceptation automatisés (US7)
│
└── creation des tables/    # Dossier Back-End
    └── Main.java           # Point d'entrée du serveur Java
# Simon & Simon — Prototype Démo

Plateforme de gestion interactive pour **Simon & Simon Esthétique Automobile**.

> **Prototype / Concept** — Démonstration interactive avec données fictives.

## Démo en ligne

**Live demo:** [https://omrannajdi33-cell.github.io/Demo---Simon-Simon/dashboard](https://omrannajdi33-cell.github.io/Demo---Simon-Simon/dashboard)

> GitHub Pages sert l'application à `/Demo---Simon-Simon/`. La page d'accueil redirige automatiquement vers le tableau de bord.

## Développement local

```bash
npm install
npm run dev      # Développement local (http://localhost:3000/Demo---Simon-Simon/dashboard)
npm run build    # Export statique dans out/
```

## Déploiement GitHub Pages

Le déploiement est automatisé via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.

1. Dans les paramètres du dépôt GitHub → **Pages** → Source : **GitHub Actions**
2. Pousser sur `main` déclenche le build et le déploiement

## Scénario de démonstration

1. Ouvrir `/demo-demande` — simuler un client qui soumet une demande
2. Remplir le formulaire en 4 étapes
3. Envoyer la demande
4. Retourner au `/dashboard` — la nouvelle demande apparaît avec notification
5. Explorer les demandes, clients, véhicules, rendez-vous
6. Montrer la page automatisations

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Vue d'ensemble avec statistiques |
| `/demandes` | Gestion des soumissions clients |
| `/clients` | Base de clients |
| `/vehicules` | Parc automobile |
| `/rendez-vous` | Calendrier simplifié |
| `/factures` | Aperçu facturation |
| `/automatisations` | Workflows automatiques |
| `/demo-demande` | Interface client (formulaire) |
| `/login` | Connexion simulée |

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- localStorage pour persistance démo

## Notes

- Données fictives uniquement (Marc Tremblay, etc.)
- Pas d'authentification réelle
- Pas de base de données — état local
- Bouton reset (↺) dans le header pour réinitialiser

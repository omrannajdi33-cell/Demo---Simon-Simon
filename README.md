# Simon & Simon — Prototype Démo

Plateforme de gestion interactive pour **Simon & Simon Esthétique Automobile**.

> **Prototype / Concept** — Démonstration interactive avec données fictives.

## Démo en ligne

Déployez sur Vercel pour obtenir une URL publique :

```bash
npm install
npm run dev      # Développement local
npm run build    # Build production
```

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

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage pour persistance démo

## Notes

- Données fictives uniquement (Marc Tremblay, etc.)
- Pas d'authentification réelle
- Pas de base de données — état local
- Bouton reset (↺) dans le header pour réinitialiser

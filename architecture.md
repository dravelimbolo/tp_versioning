# Architecture

Ce document décrit l’architecture cible du mini-CRM après refactorisation.

## Objectifs

- Séparer responsabilités : logique, persistance, DOM, navigation.
- Faciliter les tests unitaires (logique pure).
- Rendre la persistance déterministe.
- Autoriser l’évolution (router remplaçable, UI modulable).

## Découpage

- `src/contacts.js` : création, suppression, recherche, règles métier de contact.
- `src/tasks.js` : création, suppression, toggle, gestion des orphelines.
- `src/storage.js` : persistance locale (localStorage), sérialisation/désérialisation.
- `src/dom.js` : sélecteurs et interactions DOM, rendu des listes.
- `src/router.js` : navigation côté client (Accueil, Contacts, Tâches).
- `src/validation.js` : règles de validation (nom, email, titre).
- `src/events.js` : bus d’événements léger (CustomEvent ou simple pub/sub).
- `index.html` + `styles.css` : présentation.

## Flux principal

1. L’utilisateur interagit avec l’UI (DOM).
2. `dom.js` émet un événement (ex. `task:add`).
3. Le module concerné (`tasks.js`) met à jour l’état.
4. `storage.js` persiste de façon déterministe.
5. `dom.js` rerend la vue concernée.

## Persistance

- Interface unique :
  - `loadState() -> {contacts, tasks}`
  - `saveState(state) -> void`
- Aucune logique métier dans `storage.js`.

## Validation

- `validateContact({name, email})` -> `Ok | Err[]`
- `validateTask({title, assignedTo})` -> `Ok | Err[]`

## Tests

- Tester `contacts.js`, `tasks.js`, `validation.js` sans DOM.
- Mocker `storage.js` dans les tests pour vérifier les appels.

## Erreurs et UX

- Pas d’`alert()`.
- Retour d’erreurs structuré et affichage par la couche UI.
- Suppression confirmée via composant de confirmation non bloquant.

## Évolutivité

- Router isolé : remplaçable sans toucher au cœur métier.
- Possibilité d’ajouter une API distante ultérieurement derrière `storage.js`.

```bash
# Exemple de structure de fichiers
tree -I "node_modules|.git|coverage"
```

# Format des données pour l'IA — SénSanté

## Contexte
Les consultations stockent les symptômes en JSON dans PostgreSQL.
Dans le Lab IA (v0.5), ces symptômes seront envoyés à l'API Groq (Llama 3)
pour obtenir un pré-diagnostic automatique.

## Format des symptômes (entrée)
Les symptômes sont un tableau JSON de chaînes de caractères :
```json
["Fièvre", "Toux", "Fatigue"]
```

## Symptômes disponibles
- Fièvre
- Toux
- Maux de tête
- Fatigue
- Diarrhée
- Vomissements
- Douleur abdominale
- Éruption cutanée
- Frissons
- Douleur thoracique
- Essoufflement
- Vertiges

## Format attendu de la réponse IA (sortie)
```json
{
  "diagnostic": "Paludisme probable",
  "confiance": 78.5,
  "recommandation": "Consulter un médecin dans les 24h"
}
```

## Champs mis à jour dans la BDD après diagnostic
- `diagnosticIa` : string — le diagnostic proposé
- `confiance` : float — score de confiance (0-100)
- `statut` : "termine" après analyse IA
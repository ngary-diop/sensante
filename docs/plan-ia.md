# Plan IA - Intégration de Groq

## 1. Obtention de la clé API
- Compte Groq créé sur https://console.groq.com
- Clé API générée et ajoutée aux variables d'environnement (ne jamais commiter la clé en clair).

## 2. Test de l'API avec Curl
L'API a été testée avec succès via la commande `curl`.
**Note :** Le modèle `mixtral-8x7b-32768` étant obsolète, il est recommandé d'utiliser `llama3-8b-8192` ou `llama3-70b-8192`.

Commande de test validée :
```bash
curl "https://api.groq.com/openai/v1/chat/completions" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Explique-moi l importance de l IA en santé"
      }
    ],
    "model": "llama3-8b-8192"
  }'
```

## 3. Prochaines étapes
- Configurer le SDK ou les appels API dans le code Next.js (par exemple dans les routes d'API).
- Intégrer la logique pour le cas d'usage de la plateforme (Alerte IA, résumé médical, etc.).

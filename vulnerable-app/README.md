# 🔓 Laboratoire de Vulnérabilités Web

Une application web intentionnellement vulnérable conçue pour apprendre et pratiquer la sécurité web.

⚠️ **ATTENTION** : Cette application contient des vulnérabilités intentionnelles. **NE JAMAIS** utiliser ce code en production !

## 🎯 Objectif

Cette application est un environnement d'apprentissage sécurisé pour :
- Comprendre les vulnérabilités web courantes
- Pratiquer l'exploitation éthique
- Apprendre à sécuriser les applications web

## 🚀 Installation

1. Ouvrez simplement le fichier `index.html` dans votre navigateur
2. Aucune installation requise - tout fonctionne côté client

## 🛡️ Vulnérabilités Incluses

### 1. **Cross-Site Scripting (XSS)**
- **XSS Réfléchi** : L'entrée utilisateur est directement affichée sans échappement
- **XSS Stocké** : Les commentaires malveillants sont stockés et exécutés
- **XSS basé sur DOM** : Manipulation dangereuse du DOM

**Exemple d'exploitation** :
```javascript
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

### 2. **SQL Injection**
- **Authentification bypass** : Contourner la connexion
- **Extraction de données** : Récupérer des informations sensibles

**Exemples** :
```sql
admin' --
' OR '1'='1
1' UNION SELECT username, password FROM users--
```

### 3. **Authentication Bypass**
- **Cookies faibles** : Modifier `isAdmin=false` en `isAdmin=true`
- **JWT vulnérable** : Algorithme "none" accepté

### 4. **Cross-Site Request Forgery (CSRF)**
- Aucune protection par token CSRF
- Les formulaires peuvent être soumis depuis des sites externes

### 5. **File Upload Vulnerabilities**
- Aucune validation du type de fichier
- Upload de fichiers malveillants possible (.php, .exe, etc.)

### 6. **Command Injection**
- Injection de commandes système via le formulaire ping

**Exemples** :
```bash
8.8.8.8; ls -la
google.com && whoami
```

### 7. **Directory Traversal**
- Accès aux fichiers système via des chemins relatifs

**Exemples** :
```
../../../etc/passwd
..\..\..\..\windows\system32\drivers\etc\hosts
```

### 8. **XML External Entity (XXE)**
- Parser XML vulnérable aux entités externes

**Exemple** :
```xml
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<data>&xxe;</data>
```

### 9. **Autres Vulnérabilités**
- **Stockage de mots de passe en clair**
- **Exposition de données sensibles** dans les commentaires HTML
- **IDOR** (Insecure Direct Object Reference)

## 📚 Guide d'Apprentissage

### Pour Chaque Vulnérabilité :

1. **Comprendre** : Lisez la description et l'indice
2. **Explorer** : Essayez différentes entrées
3. **Exploiter** : Utilisez les exemples fournis
4. **Analyser** : Examinez le code source pour comprendre pourquoi ça fonctionne
5. **Sécuriser** : Réfléchissez à comment corriger la vulnérabilité

### Bonnes Pratiques de Sécurité :

#### Contre XSS :
- Échapper toutes les sorties HTML
- Utiliser `textContent` au lieu de `innerHTML`
- Implémenter une Content Security Policy (CSP)

#### Contre SQL Injection :
- Utiliser des requêtes préparées
- Valider et échapper les entrées
- Principe du moindre privilège

#### Contre CSRF :
- Utiliser des tokens CSRF
- Vérifier l'origine des requêtes
- Double-submit cookies

#### Contre les uploads malveillants :
- Valider le type MIME
- Scanner les fichiers
- Stocker hors du webroot

## 🔍 Outils Recommandés

Pour une expérience complète :
- **Browser DevTools** : F12 pour inspecter
- **Burp Suite** : Intercepter les requêtes
- **OWASP ZAP** : Scanner automatique

## 📖 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.eu/)

## ⚖️ Éthique

Cette application est destinée à des fins éducatives uniquement. L'exploitation de vulnérabilités sur des systèmes sans autorisation est illégale.

## 🤝 Contribution

N'hésitez pas à ajouter de nouvelles vulnérabilités ou à améliorer les existantes pour l'apprentissage !

---

**Rappel** : Ne jamais utiliser ces techniques sur des systèmes réels sans autorisation explicite ! 
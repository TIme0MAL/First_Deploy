// Simulated database for demonstration
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user1', password: 'password1', role: 'user' },
    { id: 3, username: 'user2', password: 'password2', role: 'user' },
    { id: 4, username: 'john', password: 'john123', role: 'user' },
    { id: 5, username: 'jane', password: 'jane456', role: 'user' }
];

const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Tablet', price: 499 },
    { id: 4, name: 'Monitor', price: 299 },
    { id: 5, name: 'Keyboard', price: 99 }
];

// ============= XSS Vulnerabilities =============

// 1. Reflected XSS
document.getElementById('xss-reflected-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const output = document.getElementById('xss-reflected-output');
    
    // VULNERABLE: Direct HTML injection without sanitization
    output.innerHTML = `<p>Bonjour, ${username}!</p>`;
});

// 2. Stored XSS
document.getElementById('xss-stored-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const comment = document.getElementById('comment').value;
    
    // Get existing comments
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({
        text: comment,
        date: new Date().toLocaleString()
    });
    
    // Store in localStorage
    localStorage.setItem('comments', JSON.stringify(comments));
    
    // Clear form
    document.getElementById('comment').value = '';
    
    // Display comments
    displayComments();
});

function displayComments() {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const commentsList = document.getElementById('comments-list');
    
    // VULNERABLE: Direct HTML injection of stored content
    commentsList.innerHTML = comments.map(comment => `
        <div style="border: 1px solid #333; padding: 10px; margin: 5px 0; border-radius: 5px;">
            <p>${comment.text}</p>
            <small style="color: #888;">Posté le: ${comment.date}</small>
        </div>
    `).join('');
}

// Clear comments button
document.getElementById('clear-comments').addEventListener('click', () => {
    localStorage.removeItem('comments');
    displayComments();
});

// Load comments on page load
displayComments();

// 3. DOM-based XSS
function performSearch() {
    const searchTerm = document.getElementById('search-input').value;
    const resultsDiv = document.getElementById('search-results');
    
    // VULNERABLE: Using innerHTML with user input
    resultsDiv.innerHTML = `<p>Résultats de recherche pour: <strong>${searchTerm}</strong></p>`;
}

// ============= SQL Injection =============

// Login vulnerability
document.getElementById('sql-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('sql-username').value;
    const password = document.getElementById('sql-password').value;
    const resultDiv = document.getElementById('sql-result');
    
    // Simulate SQL query (VULNERABLE)
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    
    // Show the "SQL query"
    resultDiv.innerHTML = `<p style="color: #888; font-size: 0.9em;">Query: ${query}</p>`;
    
    // Simulate SQL injection vulnerability
    if (username.includes("'") || username.includes("--") || username.includes("OR")) {
        // SQL injection successful
        resultDiv.innerHTML += `<div class="success">
            <i class="fas fa-check-circle"></i> Connexion réussie!<br>
            Utilisateur: admin<br>
            Rôle: administrator<br>
            <small>SQL Injection détectée!</small>
        </div>`;
    } else {
        // Normal authentication check
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            resultDiv.innerHTML += `<div class="success">
                <i class="fas fa-check-circle"></i> Connexion réussie!<br>
                Utilisateur: ${user.username}<br>
                Rôle: ${user.role}
            </div>`;
        } else {
            resultDiv.innerHTML += `<div class="error">
                <i class="fas fa-times-circle"></i> Identifiants incorrects
            </div>`;
        }
    }
});

// Product search vulnerability
function searchProduct() {
    const productId = document.getElementById('product-id').value;
    const resultDiv = document.getElementById('product-result');
    
    // Simulate SQL query
    const query = `SELECT * FROM products WHERE id = ${productId}`;
    resultDiv.innerHTML = `<p style="color: #888; font-size: 0.9em;">Query: ${query}</p>`;
    
    // Check for UNION injection
    if (productId.includes('UNION')) {
        // Show "secret" data
        resultDiv.innerHTML += `<div class="success">
            <p><strong>Données extraites:</strong></p>
            <table style="width: 100%; margin-top: 10px;">
                <tr><th>Username</th><th>Password</th></tr>
                ${users.map(u => `<tr><td>${u.username}</td><td>${u.password}</td></tr>`).join('')}
            </table>
            <small style="color: #ff9500;">SQL Injection UNION réussie!</small>
        </div>`;
    } else {
        // Normal product search
        const product = products.find(p => p.id == productId);
        if (product) {
            resultDiv.innerHTML += `<div class="success">
                <p><strong>Produit trouvé:</strong></p>
                <p>Nom: ${product.name}</p>
                <p>Prix: $${product.price}</p>
            </div>`;
        } else {
            resultDiv.innerHTML += `<div class="error">Produit non trouvé</div>`;
        }
    }
}

// ============= Authentication Bypass =============

// Weak cookie authentication
function checkAdminAccess() {
    const resultDiv = document.getElementById('admin-result');
    
    // Set a weak cookie
    document.cookie = "isAdmin=false";
    
    // Get cookie value
    const isAdmin = document.cookie.split(';').find(c => c.trim().startsWith('isAdmin='));
    const adminValue = isAdmin ? isAdmin.split('=')[1] : 'false';
    
    if (adminValue === 'true') {
        resultDiv.innerHTML = `<div class="success">
            <i class="fas fa-shield-alt"></i> Accès administrateur accordé!<br>
            <p>Panneau d'administration:</p>
            <ul>
                <li>Gérer les utilisateurs</li>
                <li>Voir les logs système</li>
                <li>Modifier les paramètres</li>
            </ul>
        </div>`;
    } else {
        resultDiv.innerHTML = `<div class="error">
            <i class="fas fa-ban"></i> Accès refusé!<br>
            <small>Cookie actuel: isAdmin=${adminValue}</small>
        </div>`;
    }
}

// Vulnerable JWT
function generateVulnerableJWT() {
    // Create a JWT with "none" algorithm (VULNERABLE)
    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ 
        user: "guest", 
        role: "user", 
        exp: Date.now() + 3600000 
    }));
    
    const jwt = `${header}.${payload}.`;
    document.getElementById('jwt-token').value = jwt;
}

function verifyJWT() {
    const jwt = document.getElementById('jwt-token').value;
    const resultDiv = document.getElementById('jwt-result');
    
    if (!jwt) {
        resultDiv.innerHTML = '<div class="error">Veuillez d\'abord générer un JWT</div>';
        return;
    }
    
    try {
        const parts = jwt.split('.');
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        resultDiv.innerHTML = `<div class="success">
            <p><strong>Header:</strong></p>
            <pre>${JSON.stringify(header, null, 2)}</pre>
            <p><strong>Payload:</strong></p>
            <pre>${JSON.stringify(payload, null, 2)}</pre>
            <p style="color: #ff9500;">⚠️ Algorithm "none" accepté - JWT vulnérable!</p>
        </div>`;
    } catch (e) {
        resultDiv.innerHTML = '<div class="error">JWT invalide</div>';
    }
}

// ============= CSRF =============

document.getElementById('transfer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const to = e.target.to.value;
    const amount = e.target.amount.value;
    const resultDiv = document.getElementById('transfer-result');
    
    // VULNERABLE: No CSRF token validation
    resultDiv.innerHTML = `<div class="success">
        <i class="fas fa-check"></i> Transfert effectué!<br>
        Destinataire: ${to}<br>
        Montant: $${amount}<br>
        <small style="color: #ff9500;">⚠️ Aucune protection CSRF!</small>
    </div>`;
});

// ============= File Upload =============

document.getElementById('upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const resultDiv = document.getElementById('upload-result');
    
    if (!file) {
        resultDiv.innerHTML = '<div class="error">Veuillez sélectionner un fichier</div>';
        return;
    }
    
    // VULNERABLE: No file type validation
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const dangerousExtensions = ['php', 'exe', 'sh', 'bat', 'cmd', 'ps1'];
    
    if (dangerousExtensions.includes(fileExtension)) {
        resultDiv.innerHTML = `<div class="success">
            <i class="fas fa-exclamation-triangle"></i> Fichier uploadé!<br>
            Nom: ${file.name}<br>
            Type: ${file.type}<br>
            Taille: ${(file.size / 1024).toFixed(2)} KB<br>
            <span style="color: #ff3838;">⚠️ Fichier potentiellement dangereux accepté!</span>
        </div>`;
    } else {
        resultDiv.innerHTML = `<div class="success">
            <i class="fas fa-check"></i> Fichier uploadé!<br>
            Nom: ${file.name}<br>
            Type: ${file.type}<br>
            Taille: ${(file.size / 1024).toFixed(2)} KB
        </div>`;
    }
});

// ============= Command Injection =============

function executePing() {
    const host = document.getElementById('ping-host').value;
    const resultDiv = document.getElementById('ping-result');
    
    // Simulate command execution
    const command = `ping ${host}`;
    resultDiv.innerHTML = `<p style="color: #888;">Command: ${command}</p>`;
    
    // Check for command injection
    if (host.includes(';') || host.includes('&&') || host.includes('|')) {
        // Simulate command injection success
        const injectedCommand = host.split(/[;&|]/)[1];
        resultDiv.innerHTML += `<div class="success">
            <pre>PING ${host.split(/[;&|]/)[0]} (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=64 time=0.055 ms

--- ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss

<span style="color: #ff3838;">Command injection détectée!</span>
Commande exécutée: ${injectedCommand}

Résultat simulé:
${getSimulatedCommandOutput(injectedCommand)}
</pre>
        </div>`;
    } else {
        // Normal ping simulation
        resultDiv.innerHTML += `<div class="success">
            <pre>PING ${host} (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=64 time=0.055 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=64 time=0.044 ms

--- ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss</pre>
        </div>`;
    }
}

function getSimulatedCommandOutput(command) {
    const cmd = command.trim().toLowerCase();
    if (cmd.includes('ls') || cmd.includes('dir')) {
        return `index.html
style.css
vulnerable.js
uploads/
config/
.env`;
    } else if (cmd.includes('whoami')) {
        return 'www-data';
    } else if (cmd.includes('cat') || cmd.includes('type')) {
        return 'SECRET_KEY=1234567890abcdef\nDB_PASSWORD=admin123';
    }
    return 'Command executed';
}

// ============= Directory Traversal =============

function readFile() {
    const filePath = document.getElementById('file-path').value;
    const resultDiv = document.getElementById('file-content');
    
    // Check for directory traversal
    if (filePath.includes('../') || filePath.includes('..\\')) {
        // Simulate file reading with directory traversal
        if (filePath.includes('passwd')) {
            resultDiv.innerHTML = `<div class="success">
                <p><strong>Contenu du fichier:</strong></p>
                <pre>root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin

<span style="color: #ff3838;">Directory traversal réussi!</span></pre>
            </div>`;
        } else if (filePath.includes('hosts')) {
            resultDiv.innerHTML = `<div class="success">
                <p><strong>Contenu du fichier:</strong></p>
                <pre>127.0.0.1       localhost
::1             localhost
192.168.1.100   secret-server.local
10.0.0.50       database.internal

<span style="color: #ff3838;">Directory traversal réussi!</span></pre>
            </div>`;
        } else {
            resultDiv.innerHTML = `<div class="error">Fichier non trouvé (mais la traversée de répertoire est possible!)</div>`;
        }
    } else {
        // Normal file reading
        resultDiv.innerHTML = `<div class="success">
            <p><strong>Contenu de ${filePath}:</strong></p>
            <pre>Ceci est le contenu du fichier demandé.
Lorem ipsum dolor sit amet...</pre>
        </div>`;
    }
}

// ============= XXE =============

function parseXML() {
    const xmlInput = document.getElementById('xml-input').value;
    const resultDiv = document.getElementById('xml-result');
    
    // Check for XXE patterns
    if (xmlInput.includes('<!DOCTYPE') || xmlInput.includes('<!ENTITY')) {
        // Simulate XXE vulnerability
        if (xmlInput.includes('file:///')) {
            resultDiv.innerHTML = `<div class="success">
                <p><strong>XML parsé avec XXE:</strong></p>
                <pre>root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin

<span style="color: #ff3838;">XXE Injection réussie! Fichier système exposé!</span></pre>
            </div>`;
        } else {
            resultDiv.innerHTML = `<div class="error">Entité externe détectée mais non résolue</div>`;
        }
    } else {
        // Normal XML parsing
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlInput, "text/xml");
            const errorNode = xmlDoc.querySelector("parsererror");
            
            if (errorNode) {
                resultDiv.innerHTML = `<div class="error">Erreur de parsing XML</div>`;
            } else {
                resultDiv.innerHTML = `<div class="success">
                    <p><strong>XML parsé avec succès:</strong></p>
                    <pre>${xmlInput}</pre>
                </div>`;
            }
        } catch (e) {
            resultDiv.innerHTML = `<div class="error">Erreur: ${e.message}</div>`;
        }
    }
}

// ============= Other Vulnerabilities =============

// Insecure password storage
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    // VULNERABLE: Storing password in plain text
    let storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    storedUsers.push({ username, password });
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    alert('Compte créé avec succès!');
    e.target.reset();
});

function showStoredPasswords() {
    const resultDiv = document.getElementById('password-storage');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.length === 0) {
        resultDiv.innerHTML = '<div class="error">Aucun utilisateur enregistré</div>';
    } else {
        resultDiv.innerHTML = `<div class="success">
            <p><strong>Mots de passe stockés en clair:</strong></p>
            <table style="width: 100%; margin-top: 10px;">
                <tr><th>Username</th><th>Password (Plain Text!)</th></tr>
                ${storedUsers.map(u => `<tr><td>${u.username}</td><td>${u.password}</td></tr>`).join('')}
            </table>
            <span style="color: #ff3838;">⚠️ Les mots de passe ne devraient JAMAIS être stockés en clair!</span>
        </div>`;
    }
}

// View hidden comments
function viewPageSource() {
    const resultDiv = document.getElementById('hidden-data');
    resultDiv.innerHTML = `<div class="success">
        <p><strong>Données sensibles trouvées dans les commentaires HTML:</strong></p>
        <pre>&lt;!-- API Key: sk-1234567890abcdef --&gt;
&lt;!-- Admin Password: admin123 --&gt;
&lt;!-- Database Connection: mysql://root:password@localhost/vulnerable_db --&gt;</pre>
        <span style="color: #ff3838;">⚠️ Ne jamais laisser d'informations sensibles dans le code!</span>
    </div>`;
}

// IDOR vulnerability
function getUserProfile() {
    const userId = document.getElementById('user-id').value;
    const resultDiv = document.getElementById('user-profile');
    
    // VULNERABLE: No authorization check
    const user = users.find(u => u.id == userId);
    
    if (user) {
        resultDiv.innerHTML = `<div class="success">
            <p><strong>Profil utilisateur #${userId}:</strong></p>
            <p>Username: ${user.username}</p>
            <p>Password: ${user.password}</p>
            <p>Role: ${user.role}</p>
            <span style="color: #ff9500;">⚠️ IDOR - Accès non autorisé aux données d'autres utilisateurs!</span>
        </div>`;
    } else {
        resultDiv.innerHTML = '<div class="error">Utilisateur non trouvé</div>';
    }
} 
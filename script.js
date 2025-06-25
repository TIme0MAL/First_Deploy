// Classe pour représenter un livre
class Book {
    constructor(title, author, isbn, year, category) {
        this.id = Date.now().toString();
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.category = category;
        this.status = 'disponible';
        this.borrower = null;
        this.borrowDate = null;
        this.returnDate = null;
    }
}

// Classe pour gérer la bibliothèque
class Library {
    constructor() {
        this.books = this.loadBooks();
        this.currentBookId = null;
    }

    // Charger les livres depuis localStorage
    loadBooks() {
        const storedBooks = localStorage.getItem('libraryBooks');
        return storedBooks ? JSON.parse(storedBooks) : [];
    }

    // Sauvegarder les livres dans localStorage
    saveBooks() {
        localStorage.setItem('libraryBooks', JSON.stringify(this.books));
    }

    // Ajouter un livre
    addBook(book) {
        this.books.push(book);
        this.saveBooks();
    }

    // Supprimer un livre
    removeBook(id) {
        this.books = this.books.filter(book => book.id !== id);
        this.saveBooks();
    }

    // Emprunter un livre
    borrowBook(id, borrower, borrowDate, returnDate) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.status = 'emprunte';
            book.borrower = borrower;
            book.borrowDate = borrowDate;
            book.returnDate = returnDate;
            this.saveBooks();
        }
    }

    // Retourner un livre
    returnBook(id) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.status = 'disponible';
            book.borrower = null;
            book.borrowDate = null;
            book.returnDate = null;
            this.saveBooks();
        }
    }

    // Obtenir les statistiques
    getStats() {
        const total = this.books.length;
        const available = this.books.filter(b => b.status === 'disponible').length;
        const borrowed = this.books.filter(b => b.status === 'emprunte').length;
        return { total, available, borrowed };
    }

    // Rechercher et filtrer les livres
    searchAndFilter(searchTerm, category, status) {
        return this.books.filter(book => {
            const matchesSearch = !searchTerm || 
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn.includes(searchTerm);
            
            const matchesCategory = !category || book.category === category;
            const matchesStatus = !status || book.status === status;
            
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }
}

// Instance de la bibliothèque
const library = new Library();

// Éléments DOM
const addBookForm = document.getElementById('addBookForm');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const filterStatus = document.getElementById('filterStatus');
const booksContainer = document.getElementById('booksContainer');
const noResults = document.getElementById('noResults');
const borrowModal = document.getElementById('borrowModal');
const borrowForm = document.getElementById('borrowForm');
const closeModal = document.querySelector('.close');

// Fonction pour afficher les livres
function displayBooks(books = library.books) {
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        booksContainer.appendChild(bookCard);
    });
}

// Créer une carte de livre
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    const statusClass = book.status === 'disponible' ? 'status-available' : 'status-borrowed';
    const statusText = book.status === 'disponible' ? 'Disponible' : 'Emprunté';
    
    card.innerHTML = `
        <h3>${book.title}</h3>
        <div class="book-info">
            <p><i class="fas fa-user"></i> ${book.author}</p>
            <p><i class="fas fa-barcode"></i> ${book.isbn}</p>
            <p><i class="fas fa-calendar"></i> ${book.year}</p>
            <p><i class="fas fa-tag"></i> ${book.category}</p>
        </div>
        <span class="book-status ${statusClass}">${statusText}</span>
        ${book.borrower ? `
            <div class="borrower-info">
                <p><strong>Emprunteur:</strong> ${book.borrower}</p>
                <p><strong>Date d'emprunt:</strong> ${formatDate(book.borrowDate)}</p>
                <p><strong>Retour prévu:</strong> ${formatDate(book.returnDate)}</p>
            </div>
        ` : ''}
        <div class="book-actions">
            ${book.status === 'disponible' ? 
                `<button class="btn btn-success btn-small" onclick="openBorrowModal('${book.id}')">
                    <i class="fas fa-hand-holding"></i> Emprunter
                </button>` :
                `<button class="btn btn-primary btn-small" onclick="returnBook('${book.id}')">
                    <i class="fas fa-undo"></i> Retourner
                </button>`
            }
            <button class="btn btn-danger btn-small" onclick="deleteBook('${book.id}')">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
    `;
    
    return card;
}

// Formater une date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Mettre à jour les statistiques
function updateStats() {
    const stats = library.getStats();
    document.getElementById('totalBooks').textContent = stats.total;
    document.getElementById('availableBooks').textContent = stats.available;
    document.getElementById('borrowedBooks').textContent = stats.borrowed;
}

// Ajouter un livre
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(addBookForm);
    const book = new Book(
        formData.get('title'),
        formData.get('author'),
        formData.get('isbn'),
        formData.get('year'),
        formData.get('category')
    );
    
    library.addBook(book);
    addBookForm.reset();
    displayBooks();
    updateStats();
    
    // Animation de confirmation
    showNotification('Livre ajouté avec succès!', 'success');
});

// Recherche et filtrage
function applyFilters() {
    const searchTerm = searchInput.value;
    const category = filterCategory.value;
    const status = filterStatus.value;
    
    const filteredBooks = library.searchAndFilter(searchTerm, category, status);
    displayBooks(filteredBooks);
}

searchInput.addEventListener('input', applyFilters);
filterCategory.addEventListener('change', applyFilters);
filterStatus.addEventListener('change', applyFilters);

// Ouvrir le modal d'emprunt
function openBorrowModal(bookId) {
    library.currentBookId = bookId;
    borrowModal.style.display = 'block';
    
    // Définir la date d'aujourd'hui comme date d'emprunt par défaut
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('borrowDate').value = today;
    
    // Définir la date de retour par défaut (30 jours plus tard)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 30);
    document.getElementById('returnDate').value = returnDate.toISOString().split('T')[0];
}

// Fermer le modal
closeModal.addEventListener('click', () => {
    borrowModal.style.display = 'none';
    borrowForm.reset();
});

window.addEventListener('click', (e) => {
    if (e.target === borrowModal) {
        borrowModal.style.display = 'none';
        borrowForm.reset();
    }
});

// Emprunter un livre
borrowForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const borrower = document.getElementById('borrowerName').value;
    const borrowDate = document.getElementById('borrowDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    library.borrowBook(library.currentBookId, borrower, borrowDate, returnDate);
    
    borrowModal.style.display = 'none';
    borrowForm.reset();
    displayBooks();
    updateStats();
    
    showNotification('Livre emprunté avec succès!', 'success');
});

// Retourner un livre
function returnBook(bookId) {
    if (confirm('Confirmer le retour de ce livre?')) {
        library.returnBook(bookId);
        displayBooks();
        updateStats();
        showNotification('Livre retourné avec succès!', 'success');
    }
}

// Supprimer un livre
function deleteBook(bookId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) {
        library.removeBook(bookId);
        displayBooks();
        updateStats();
        showNotification('Livre supprimé avec succès!', 'danger');
    }
}

// Afficher une notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Ajouter les styles pour les notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 250px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 2000;
    }
    
    .notification-success {
        background-color: #10b981;
    }
    
    .notification-danger {
        background-color: #ef4444;
    }
`;
document.head.appendChild(notificationStyles);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    updateStats();
    
    // Ajouter quelques livres d'exemple si la bibliothèque est vide
    if (library.books.length === 0) {
        const sampleBooks = [
            new Book("Le Petit Prince", "Antoine de Saint-Exupéry", "978-2070413095", "1943", "roman"),
            new Book("1984", "George Orwell", "978-2070368228", "1949", "science-fiction"),
            new Book("Clean Code", "Robert C. Martin", "978-0132350884", "2008", "informatique"),
            new Book("Sapiens", "Yuval Noah Harari", "978-2226257017", "2011", "histoire")
        ];
        
        sampleBooks.forEach(book => library.addBook(book));
        displayBooks();
        updateStats();
    }
}); 
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const PORT = 3000;

// In-memory data
let books = {
    "12345": { isbn: "12345", title: "Harry Potter", author: "JK Rowling", reviews: {} },
    "67890": { isbn: "67890", title: "The Hobbit", author: "JRR Tolkien", reviews: {} }
};
let users = [];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(Object.values(books));
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) res.json(book);
    else res.status(404).send('Book not found');
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const result = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
    res.json(result);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const result = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
    res.json(result);
});

// Task 5: Get book Review
app.get('/books/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) res.json(book.reviews);
    else res.status(404).send('Book not found');
});

// Task 6: Register New user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).send('User exists');
    users.push({ username, password });
    res.send('User registered successfully');
});

// Task 7: Login as a Registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(400).send('Invalid credentials');
    res.send('Login successful');
});

// Task 8: Add/Modify a book review (Registered Users)
app.post('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const { username, review } = req.body;
    const book = books[isbn];
    if (!book) return res.status(404).send('Book not found');
    if (!users.find(u => u.username === username)) return res.status(403).send('User not registered');
    book.reviews[username] = review;
    res.send('Review added/updated successfully');
});

// Task 9: Delete book review added by that particular user (Registered Users)
app.delete('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const username = req.query.username;
    const book = books[isbn];
    if (!book) return res.status(404).send('Book not found');
    if (!username) return res.status(400).send('Username is required');
    if (!book.reviews[username]) return res.status(404).send('Review not found');
    delete book.reviews[username];
    res.send('Review deleted successfully');
});

// Node.js program with 4 methods (Tasks 10-13)
// Task 10: Get all books – Using async callback function
function getAllBooksAsync(callback) {
    setTimeout(() => {
        callback(null, Object.values(books));
    }, 100);
}

// Task 11: Search by ISBN – Using Promises
function searchByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject('Book not found');
    });
}

// Task 12: Search by Author – Using async/await
async function searchByAuthor(author) {
    return Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
}

// Task 13: Search by Title – Using Promises
function searchByTitle(title) {
    return new Promise((resolve) => {
        const result = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
        resolve(result);
    });
}

// Example usage (for demonstration, can be commented out)
getAllBooksAsync((err, data) => {
    if (err) console.log(err);
    else console.log('All Books:', data);
});

searchByISBN('12345').then(data => console.log('By ISBN:', data)).catch(err => console.log(err));
searchByAuthor('JK Rowling').then(data => console.log('By Author:', data));
searchByTitle('Harry Potter').then(data => console.log('By Title:', data));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
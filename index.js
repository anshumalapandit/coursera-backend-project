const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
const PORT = 3000;
const JWT_SECRET = 'bookstore-backend-secret-key-for-coursera-peer-review-2025'; // Change this in production

// In-memory data
let books = {
    "12345": { 
        isbn: "12345", 
        title: "Harry Potter", 
        author: "JK Rowling", 
        reviews: {
            "john": "Great book!",
            "alice": "Loved the characters"
        } 
    },
    "67890": { 
        isbn: "67890", 
        title: "The Hobbit", 
        author: "JRR Tolkien", 
        reviews: {
            "bob": "Amazing adventure"
        } 
    }
};

let users = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(Object.values(books));
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) res.json(book);
    else res.status(404).json({ message: 'Book not found' });
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const result = Object.values(books).filter(b => 
        b.author.toLowerCase().includes(author.toLowerCase())
    );
    res.json(result);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const result = Object.values(books).filter(b => 
        b.title.toLowerCase().includes(title.toLowerCase())
    );
    res.json(result);
});

// Task 5: Get book Review
app.get('/books/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) res.json(book.reviews);
    else res.status(404).json({ message: 'Book not found' });
});

// Task 6: Register New user - FIXED
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        users.push({ 
            username, 
            password: hashedPassword 
        });
        
        res.status(201).json({ 
            message: 'User registered successfully',
            username: username
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Task 7: Login as a Registered user - FIXED
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ 
            message: 'Login successful',
            token: token,
            username: username
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// Task 8: Add/Modify a book review (Registered Users) - FIXED
app.post('/review/:isbn', authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;
    
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    book.reviews[username] = review;
    res.json({ 
        message: 'Review added/updated successfully',
        book: book.title,
        review: review
    });
});

// Task 9: Delete book review added by that particular user (Registered Users) - FIXED
app.delete('/review/:isbn', authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;
    
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!book.reviews[username]) {
        return res.status(404).json({ message: 'Review not found' });
    }
    
    delete book.reviews[username];
    res.json({ 
        message: 'Review deleted successfully',
        book: book.title
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
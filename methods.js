// nodejs-methods.js
// Tasks 10-13: Node.js program with 4 methods using Axios

const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

// Task 10: Get all books – Using async callback function
async function getAllBooksAsync() {
    try {
        console.log('=== Task 10: Get all books (Async/Await) ===');
        const response = await axios.get(`${BASE_URL}/books`);
        console.log('All Books:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Task 11: Search by ISBN – Using Promises
function searchByISBN(isbn) {
    console.log('=== Task 11: Search by ISBN (Promises) ===');
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/books/isbn/${isbn}`)
            .then(response => {
                console.log('Book by ISBN:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error:', error.message);
                reject(error);
            });
    });
}

// Task 12: Search by Author – Using async/await
async function searchByAuthor(author) {
    try {
        console.log('=== Task 12: Search by Author (Async/Await) ===');
        const response = await axios.get(`${BASE_URL}/books/author/${author}`);
        console.log('Books by Author:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Task 13: Search by Title – Using Promises
function searchByTitle(title) {
    console.log('=== Task 13: Search by Title (Promises) ===');
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/books/title/${title}`)
            .then(response => {
                console.log('Books by Title:', response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error:', error.message);
                reject(error);
            });
    });
}

// Execute all methods
async function demonstrateAllMethods() {
    console.log('=== Demonstrating Node.js Methods (Tasks 10-13) ===\n');
    
    // Task 10
    await getAllBooksAsync();
    console.log('');
    
    // Task 11
    await searchByISBN('12345');
    console.log('');
    
    // Task 12
    await searchByAuthor('JK Rowling');
    console.log('');
    
    // Task 13
    await searchByTitle('Harry Potter');
    console.log('');
}

// Run demonstration
demonstrateAllMethods().catch(console.error);
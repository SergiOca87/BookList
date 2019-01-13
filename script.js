//Event delegation, ES6 classes, Form Validation., Local Storage

//Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
    
        //Get books from the localStorage
        const books = Store.getBooks();

        books.forEach( (book) => UI.addBookToList(book) );

    }

    static addBookToList(book){
        const listRow = document.querySelector('.book-list-row');

        const bookElement = document.createElement('div');

        bookElement.classList.add('card', 'mr-2', 'ml-2');

        bookElement.innerHTML = `
            <div class="card-body p-5">
                <blockquote class="blockquote mb-0">
                    <p class="book-title lead">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-isbn">${book.isbn}</p>
                    <footer><button class="btn btn-small btn-danger delete-book-button">Delete book</button></footer>
                </blockquote>
            </div>
        `;

        listRow.appendChild(bookElement);
    }

    static showFormAlerts(message, className){

        //First remove previous alert if there is one
        const alertExists = document.querySelector('.alert');

        //if the alert element exists, remove it
        if(alertExists){
            alertExists.remove();
        }

        //Also, remove the message after a few seconds
        setTimeout( () => document.querySelector('.alert').remove(), 3000);

        //if it doesn't exist, create one with the passed in parameters
        const alertDiv = document.createElement('div');

        alertDiv.className = `mt-5 mb-5 text-center alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(message));
    
        const form = document.querySelector('#main-form');
        form.appendChild(alertDiv);
    }

    static clearFormFields(){
        const title = document.querySelector('#title').value = '';
        const author = document.querySelector('#author').value = '';
        const isbn = document.querySelector('#isbn').value = '';
    }

    //Create DeleteBook
    static deleteBook(clickedButton){
        if( clickedButton.classList.contains('delete-book-button') ){
            clickedButton.closest('div.card').remove();
            
            UI.showFormAlerts('Book was deleted', 'warning')
        }
    }
}


//Store Class: Local Storage
    //LocalStorage stores key value pairs,
    //It only stores strings, we need to stringify or parse values
class Store {
    static getBooks(){
        let books;
        //getItem and setItem are localStorage methods
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse( localStorage.getItem('books') );
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books) );
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach( (book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books) );
    }
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
    //on Form submit
    document.querySelector('#main-form').addEventListener('submit', function(e){
        e.preventDefault();

        const title = document.querySelector('#title').value; 
        const author = document.querySelector('#author').value; 
        const isbn = document.querySelector('#isbn').value; 

        //Form Validation
        if(title === '' || author === '' || isbn === ''){
            UI.showFormAlerts('Please fill in all fields', 'danger');
        } else {
            UI.showFormAlerts('Book Added', 'success');

            const book = new Book(title, author, isbn);

            //Add book to the UI
            UI.addBookToList(book);

            //Clear book from the UI
            UI.clearFormFields();

            //Add book to LocalStorage
            Store.addBook(book);
        }
    });




//Event: remove a book
document.querySelector('.book-list-row').addEventListener('click', function(e){
    const clickedButton = e.target;

    //Delete book from localStorage
    Store.removeBook( clickedButton.parentElement.parentElement.querySelector('.book-isbn').textContent );

    console.log( clickedButton.parentElement.parentElement.querySelector('.book-isbn').textContent );
    //Delete book from the UI
    UI.deleteBook(clickedButton);

    
    
})
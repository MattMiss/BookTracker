const dbOpenedEvent = new Event("databaseLoaded");
let dbLoaded = false;

let db;
let dbRequest = indexedDB.open('myDatabase', 1);
let myBooks;

dbRequest.onupgradeneeded = function(e){
    // Set the db variable to our database so we can use it!  
    db = e.target.result;

    // Create an object store named notes. Object stores in databases are where data are stored.
    let notes = db.createObjectStore('books', {keypath: 'isbn13'});
}

dbRequest.onsuccess = function(e){
    db = e.target.result;
    loadDatabase();
}

dbRequest.onerror = function(e){
    alert('error opening database' + e.target.errorCode);
}

function addSavedBook(db, bookInfo, bookID){
    // Start a database transaction and get the book object store
    const tx = db.transaction(['books'], 'readwrite');
    const store = tx.objectStore('books');

    // Add the book to the object store
    const book = {info: bookInfo, created: Date.now()};
    store.add(book, bookID);

    // Wait for the database transaction to complete
    tx.oncomplete = function(){
        console.log('stored book!');
    }
    tx.onerror = function(e){
        alert('error storing book ' + e.target.errorCode);
    }
}

function loadDatabase(){
    console.log('trying to load database');
    // Start a database transaction and get the book object store
    const tx = db.transaction(['books'], 'readonly');
    const store = tx.objectStore('books');
    const books = store.getAll();

    books.onerror = (event) => {
        // Handle errors!
    };

    books.onsuccess = (event) => {
        myBooks = books.result;
        document.dispatchEvent(dbOpenedEvent);
        dbLoaded = true;
    };
}

function updateSavedBook(bookToUpdate, bookID, onSave){
    console.log("saving database");
    // Start a database transaction and get the book object store
    const tx = db.transaction(['books'], 'readwrite');
    const store = tx.objectStore('books');
    const request = store.put(bookToUpdate, bookID);

    request.onsuccess = function(e){
        // Update page with new database
        console.log("Updated Database");
        document.dispatchEvent(dbOpenedEvent);
        onSave();
        console.log("hmm");
    };
    request.onerror = function(e){
        console.log('Error adding: '+e);
    };

}
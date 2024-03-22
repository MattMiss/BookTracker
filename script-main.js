let currentBook;
let selectedListCardType = -1;
let genreList;

window.onload = () => {
    document.addEventListener('databaseLoaded', ()=>{
        console.log("books loaded");
        console.log(myBooks);
        console.log("User preferred Display Index: " + selectedListCardType);
        initGenreList();
        console.log(genreList['adventure']);
        changeListDisplayType(getPreferredDisplayType());
    }, false)
};

function changeListDisplayType(typeIndex){
    const displayBtns = $('.display-type-button');
    if (selectedListCardType !== typeIndex){
        console.log("Changing display type to: " + typeIndex);
        if (selectedListCardType !== -1){
            displayBtns[selectedListCardType].classList.remove('btn-selected');
        }
        displayBtns[typeIndex].classList.add('btn-selected');
        selectedListCardType = typeIndex;
        savePreferredDisplayType(typeIndex);

        loadBooks(typeIndex);
    }
}

function getPreferredDisplayType(){
    let typeIndex = 1;
    const savedIndex = localStorage.getItem('preferredDisplayType');
    if (savedIndex){
        typeIndex = savedIndex;
    }
    return parseInt(typeIndex);
}

function savePreferredDisplayType(typeIndex){
    localStorage.setItem('preferredDisplayType', typeIndex);
}


function loadBooks(displayTypeIndex){
    $('.book-results').empty();
    
    switch (displayTypeIndex){
        case 0:
            loadBooksAsListView();
            break;
        case 1:
            loadBooksAsDetailsView();
            break;
        case 2:
            loadBooksAsGridView();
            break;
    }  
}

function loadBooksAsListView(){
    console.log("Loading books as list");
    myBooks.forEach(e => {
        console.log(e);
        createBookListViewItem(e);
    });
}
function loadBooksAsDetailsView(){
    console.log("Loading books as details");
    myBooks.forEach(e => {
        console.log(e);
        createBookDetailsViewItem(e);
    });
}
function loadBooksAsGridView(){
    console.log("Loading books as grid");
    myBooks.forEach(e => {
        console.log(e);
        createBookGridViewItem(e);
    });
}

/*
function createBookListViewItem(bookInfo){
    const bookResultsDiv = $('.book-results');

    // Change results class to list
    changeViewClass(bookResultsDiv, 'grid-view', 'list-view');

    // Create outer div row
    const item = createDivElem(true, 'book-list-item');
    bookResultsDiv.append(item);

    // Create Title div
    const titleDiv = createItemColElem(true, true, 'width-30');
    const title = createDivElem(true, 'book-title');
    title.innerHTML = bookInfo.info.title;
    titleDiv.append(title);
    item.append(titleDiv);

    // Create Author div
    const authorDiv = createItemColElem(true, true, 'width-20');
    const author = createDivElem(true, 'book-author');
    author.innerHTML = getAuthorsString(bookInfo.info.authors);
    authorDiv.append(author);
    item.append(authorDiv);

    // Create/Add Book Series' Name. Leave empty if not a series
    const seriesDiv = createItemColElem(true, true, 'width-20');
    const series = createDivElem(true, 'book-series');
    if (bookInfo.info.seriesName != 'na'){
        series.innerHTML = bookInfo.info.seriesName;
    }
    seriesDiv.append(series);
    item.append(seriesDiv);
    
    // Create Page Count div
    const pageCountCol = createItemColElem(true, true, 'width-10');
    const pageCountRow = createItemRowElem(false, true);
    pageCountCol.append(pageCountRow);
    const pageIcon = createIconElem(['fa-sharp', 'fa-solid', 'fa-book-open']);
    pageCountRow.append(pageIcon);
    const pageNum = createSpanElem(bookInfo.info.pageCount);
    pageCountRow.append(pageNum);
    item.append(pageCountCol);

    // Create Ratings div
    const ratingCol = createItemColElem(true, true,  'width-10');
    const ratingRow = createAndSetRatingStars(bookInfo.info.userRating, 'rating-container');
    ratingCol.append(ratingRow);
    item.append(ratingCol);

    // Create completed Date div
    const completedDateCol = document.createElement('div');
    completedDateCol.classList.add('completed-date-col');
    completedDateCol.classList.add('width-10');
    if (bookInfo.info.completed){   
        const completedDateRow = createCompletedElem(bookInfo.info.datesRead, false);
        completedDateCol.append(completedDateRow);
    }
    item.append(completedDateCol);

    item.onclick = function(){
        viewBookSelection(bookInfo, () => editBookSelection(bookInfo));
    }
}
*/

function createBookListViewItem(bookInfo) {
    const bookResultsDiv = $('.book-results');

    // Change results class to list
    changeViewClass(bookResultsDiv, 'grid-view', 'list-view');

    // Create a string from the last date read if one exists, otherwise show an empty string ''
    let dateReadString = '';
    if (bookInfo.info.datesRead.length > 0){
        const dateRead = bookInfo.info.datesRead[bookInfo.info.datesRead.length-1].replaceAll('-', '.');
        const year = dateRead[dateRead.length-2]+dateRead[dateRead.length-1];
        dateReadString = dateRead.substring(0, 6) + year;
    }

    const listItem = document.createElement('div');
    listItem.className += "book-list-item row py-2";

    const itemInner =    `<div class="my-auto book-info-left">\n` +
                                        `<div class="row">\n` +
                                            `<div class="col-md-4 my-auto">\n` +
                                                `<div class="book-title">${bookInfo.info.title}</div>\n` +
                                            `</div>\n` +
                                            `<div class="col-md-4 my-auto">\n` +
                                                `<div class="book-author">${getAuthorsString(bookInfo.info.authors)}</div>\n` +
                                            `</div>\n` +
                                            `<div class="col-md-4 my-auto">\n` +
                                                `<div class="book-series">${bookInfo.info.seriesName !== 'na' ? bookInfo.info.seriesName : ''}</div>\n` +
                                            `</div>\n` +
                                        `</div>\n` +
                                    `</div>\n` +
                                    `<div class="my-auto book-info-right ms-auto">\n` +
                                        `<div class="row">\n` +
                                            `<div class="col-sm-5 m-auto px-2 py-1">\n` +
                                                `<div class="book-pages">${bookInfo.info.pageCount} pages</div>\n` +
                                            `</div>\n` +
                                            `<div class="col-sm-7 my-auto px-2 py-1">\n` +
                                                `<div class="progress" role="progressbar" aria-label="Book Rating" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">\n` +
                                                    `<div class="progress-bar w-50">50</div>\n` +
                                                `</div>\n` +
                                            `</div>\n` +
                                        `</div>\n` +
                                    `</div>\n` +
                                    `<div class="my-auto book-info-completed">\n` +
                                        `<div class="row">\n` +
                                            `<div class="book-date col-8 my-auto pe-2 text-end">\n` +
                                                `${dateReadString}\n` +
                                            `</div>\n` +
                                            `<div class="col-4 my-auto px-0">\n` +
                                                `<i class="fa-solid fa-circle-check ${bookInfo.info.completed ? '' : 'not-'}completed"></i>\n` +
                                            `</div>\n` +
                                        `</div>\n` +
                                    `</div>`;

    listItem.onclick = function () {
        viewBookSelection(bookInfo, () => editBookSelection(bookInfo));
    }
    listItem.innerHTML = itemInner;
    bookResultsDiv.append(listItem);


    /*
    // Create outer div row
    const item = createDivElem(true, 'book-list-item');
    // Create Title div
    const titleDiv = createItemColElem(true, true, 'width-30');
    const title = createDivElem(true, 'book-title');
    title.innerHTML = bookInfo.info.title;
    titleDiv.append(title);
    item.append(titleDiv);

    // Create Author div
    const authorDiv = createItemColElem(true, true, 'width-20');
    const author = createDivElem(true, 'book-author');
    author.innerHTML = getAuthorsString(bookInfo.info.authors);
    authorDiv.append(author);
    item.append(authorDiv);

    // Create/Add Book Series' Name. Leave empty if not a series
    const seriesDiv = createItemColElem(true, true, 'width-20');
    const series = createDivElem(true, 'book-series');
    if (bookInfo.info.seriesName != 'na') {
        series.innerHTML = bookInfo.info.seriesName;
    }
    seriesDiv.append(series);
    item.append(seriesDiv);

    // Create Page Count div
    const pageCountCol = createItemColElem(true, true, 'width-10');
    const pageCountRow = createItemRowElem(false, true);
    pageCountCol.append(pageCountRow);
    const pageIcon = createIconElem(['fa-sharp', 'fa-solid', 'fa-book-open']);
    pageCountRow.append(pageIcon);
    const pageNum = createSpanElem(bookInfo.info.pageCount);
    pageCountRow.append(pageNum);
    item.append(pageCountCol);

    // Create Ratings div
    const ratingCol = createItemColElem(true, true, 'width-10');
    const ratingRow = createAndSetRatingStars(bookInfo.info.userRating, 'rating-container');
    ratingCol.append(ratingRow);
    item.append(ratingCol);

    // Create completed Date div
    const completedDateCol = document.createElement('div');
    completedDateCol.classList.add('completed-date-col');
    completedDateCol.classList.add('width-10');
    if (bookInfo.info.completed) {
        const completedDateRow = createCompletedElem(bookInfo.info.datesRead, false);
        completedDateCol.append(completedDateRow);
    }
    item.append(completedDateCol);

    item.onclick = function () {
        viewBookSelection(bookInfo, () => editBookSelection(bookInfo));
    }
     */
}

function createBookDetailsViewItem(bookInfo) {
    const bookResultsDiv = $('.book-results');

    // Change results class to list
    changeViewClass(bookResultsDiv, 'grid-view', 'list-view');

    // Create outer div row
    const item = createDivElem(true, 'book-list-item');
    bookResultsDiv.append(item);

    // Create Book Cover Div
    const coverDiv = createItemColElem(false, true);
    const img = createImageElem(bookInfo.info.imageLinks.smallThumbnail, true, 'book-list-image');
    coverDiv.append(img);
    item.append(coverDiv);

    // Create Title/Author/Series Name Div
    const tAndA = createItemColElem(true, true, 'width-40');
    const title = createDivElem(true, 'book-title');
    title.innerHTML = bookInfo.info.title;
    tAndA.append(title);

    // Create/Add author div
    const author = createDivElem(true, 'book-author');
    author.innerHTML = getAuthorsString(bookInfo.info.authors);
    tAndA.append(author);
    item.append(tAndA);

    // Create/Add Book Series' Name. Leave empty if not a series
    const series = createDivElem(true, 'book-series');
    if (bookInfo.info.seriesName !== 'na') {
        series.innerHTML = bookInfo.info.seriesName;
    }
    tAndA.append(series);

    // Create Genre(s) div
    const genreCol = createItemColElem(true, true, 'width-20');
    const genre = createDivElem(true, 'list-item-genre-container');
    genreCol.append(genre);
    item.append(genreCol);

    bookInfo.info.genres.forEach((e) => {
        createGenreElem(e, genre, false);
    })

    // Create Page Count div
    const pageCountCol = createItemColElem(true, true, 'width-10');
    const pageCountRow = createItemRowElem(false, true);
    pageCountCol.append(pageCountRow);
    const pageIcon = createIconElem(['fa-sharp', 'fa-solid', 'fa-book-open']);
    pageCountRow.append(pageIcon);
    const pageNum = createSpanElem(bookInfo.info.pageCount);
    pageCountRow.append(pageNum);
    item.append(pageCountCol);

    // Create Ratings div
    const ratingCol = createItemColElem(true, true, 'width-10');
    const ratingRow = createAndSetRatingStars(bookInfo.info.userRating, 'rating-container');
    ratingCol.append(ratingRow);
    item.append(ratingCol);

    // Create completed Date div
    const completedDateCol = document.createElement('div');
    completedDateCol.classList.add('completed-date-col');
    completedDateCol.classList.add('width-10');
    if (bookInfo.info.completed){   
        const completedDateRow = createCompletedElem(bookInfo.info.datesRead, true);
        completedDateCol.append(completedDateRow);
    }
    item.append(completedDateCol);

    item.onclick = function(){
        viewBookSelection(bookInfo, () => editBookSelection(bookInfo));
    }
}

function createBookGridViewItem(bookInfo){
    const bookResultsDiv = $('.book-results');

    // Change results class to list
    changeViewClass(bookResultsDiv, 'list-view', 'grid-view');

    // Create outer div row
    const item = createDivElem(true, 'book-grid-item');
    bookResultsDiv.append(item);

    // Create left and right side divs
    const leftDiv = createItemColElem(true, false, 'width-30');
    const middleDiv = createItemColElem(true, false, 'width-50');
    const rightDiv = createItemColElem(true, false, 'width-20');
    item.append(leftDiv);
    item.append(middleDiv);
    item.append(rightDiv);

    // Create Book Cover Div
    const img = createImageElem(bookInfo.info.imageLinks.smallThumbnail, true, 'book-grid-image');
    leftDiv.append(img);

    // Create page count div
    const pageCountRow = createItemRowElem(false, true);
    const pageIcon = createIconElem(['fa-sharp', 'fa-solid', 'fa-book-open']);
    pageCountRow.append(pageIcon);
    const pageNum = createSpanElem(bookInfo.info.pageCount);
    pageCountRow.append(pageNum);
    leftDiv.append(pageCountRow);

    // Create Title/Author/Series Name Div
    const outerDiv = createItemRowElem(false, false);
    middleDiv.append(outerDiv);
    const innerDiv = createItemColElem(false, false);
    outerDiv.append(innerDiv);
    const title = createDivElem(true, 'book-title');
    title.innerHTML = bookInfo.info.title;
    innerDiv.append(title);

    // Create/Add author div
    const author = createDivElem(true, 'book-author');
    author.innerHTML = getAuthorsString(bookInfo.info.authors);
    innerDiv.append(author);
    
    // Create/Add Book Series' Name. Leave empty if not a series
    const series = createDivElem(true, 'book-series');
    if (bookInfo.info.seriesName !== 'na'){
        series.innerHTML = bookInfo.info.seriesName;
    }
    innerDiv.append(series);

    // Create Genre(s) div
    
    const genre = createDivElem(true, 'grid-item-genre-container');
    middleDiv.append(genre);

    bookInfo.info.genres.forEach((e) => {
        createGenreElem(e, genre, false);
    })

    // Create completed Date div
    if (bookInfo.info.completed){   
        const completedDateRow = createCompletedElem(bookInfo.info.datesRead, true);
        rightDiv.append(completedDateRow);
    }

    item.onclick = function(){
        viewBookSelection(bookInfo, () => editBookSelection(bookInfo));
    }
}

function createItemColElem(hasClass, isList, className){
    const col = document.createElement('div');
    col.classList.add(isList ? 'list-item-col' : 'grid-item-col');
    if (hasClass){
        col.classList.add(className);
    }
    return col;
}



function createItemRowElem(hasClass, isList, className){
    const row = document.createElement('div');
    row.classList.add(isList ? 'list-item-row' : 'grid-item-row');
    if (hasClass){
        row.classList.add(className);
    }
    return row;
}

function createDivElem(hasClass, className){
    const div = document.createElement('div');
    if (hasClass){
        div.classList.add(className);
    }
    return div;
}

function createIconElem(classList){
    const icon = document.createElement('i');
    classList.forEach((e) => {
        console.log(e);
        icon.classList.add(e);
    });
    return icon;
}

function createSpanElem(innerHTML){
    const span = document.createElement('span');
    span.innerHTML = innerHTML;
    return span;
}

function createImageElem(imgSrc, hasClass, className){
    const img = document.createElement('img');
    img.src = imgSrc;
    if (hasClass){
        img.classList.add(className);
    }
    return img;
}

function createCompletedElem(datesRead, isVertical){
    const completedDateRow = document.createElement('div');
    completedDateRow.classList.add('completed-date-row');
        
    let day = '-';
    let month ='-';
    let year ='-';
    if(datesRead.length > 0){
        const latestDate = datesRead[datesRead.length-1].split('-');
        month = latestDate[0];
        day = latestDate[1];
        year = latestDate[2].slice(2, 4);
    }

    // Create Month Div
    const monthDiv = createDivElem(true, 'completed-date');
    monthDiv.classList.add('month');
    const monthSpan = createSpanElem(month);
    monthDiv.append(monthSpan);
    // Create Day Div
    const dayDiv = createDivElem(true, 'completed-date');
    dayDiv.classList.add('day');
    const daySpan = createSpanElem(day);
    dayDiv.append(daySpan);
    // Create Year Div
    const yearDiv = createDivElem(true, 'completed-date');
    yearDiv.classList.add('year');
    const yearSpan = createSpanElem(year);
    yearDiv.append(yearSpan);

    if (isVertical){
        const verticalDiv = createDivElem(true, 'completed-vertical');
        verticalDiv.append(monthDiv);
        verticalDiv.append(dayDiv);
        verticalDiv.append(yearDiv);
        completedDateRow.append(verticalDiv);
    }else{

        completedDateRow.append(monthDiv);
        completedDateRow.append(dayDiv);
        completedDateRow.append(yearDiv);
    }

    // Create Checkmark Div
    const checkDiv = createDivElem(true, 'completed-date-check');
    const checkIcon = createIconElem(['fa-solid', 'fa-check']);
    checkDiv.append(checkIcon);

    completedDateRow.append(checkDiv);

    return completedDateRow;
}


function viewBookSelection(bookInfo, onEdit){
    currentBook = bookInfo;
    console.log(bookInfo);
    const fClose = () => {
        modal.modal("hide");
        loadBooks(getPreferredDisplayType());
    };
    const fSave = () => {
        console.log(currentBook);
        saveCurrentBook(currentBook);
        toggleEditElements(false);
    };

    const fCancel = () => {
        console.log(bookInfo);
        fillInEditModalInfo(bookInfo.info);
        toggleEditElements(false);
    };

    var modal = $("#edit-book-modal");
    modal.modal("show");

    fillInEditModalInfo(bookInfo.info);

    $("#edit-confirm-message").empty().append('Add ' + bookInfo.title + '?');
    $("#edit-confirm-save").unbind().bind('click', fSave);
    $("#edit-confirm-edit").unbind().bind('click', onEdit);
    $("#edit-confirm-cancel").unbind().bind("click", fCancel);
    $("#edit-confirm-close").unbind().bind("click", fClose);

    $('#add-date-button').unbind().bind('click', chooseDate);
    $('#add-note-button').unbind().bind('click', () => {
        addNewNoteOrGenre('Add New Note', 'Enter Note', confirmAddNote);
    });
    $('#add-genre-button').unbind().bind('click', () => {
        addNewNoteOrGenre('Add New Genre', 'Enter Genre', confirmAddGenre);
    });
}

function chooseDate(){
    var fClose = () => {
        modal.modal("hide");
    };

    var modal = $("#add-date-modal");
    modal.modal("show");

    var fOnAdded = () => {
        fClose();
    };

    var fConfirm = () => {
        confirmAddDate(new Date($('#calendar').val()), fOnAdded);
    }
    
    const date = new Date();
    const todaysDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`

    $('#calendar').val(todaysDate);
    $("#add-date-ok").unbind().one('click', fConfirm);
    $("#add-date-cancel").unbind().one("click", fClose);
    $("#add-date-close").unbind().one("click", fClose);
}



// Add functions
function addNewNoteOrGenre(titleText, placeholderText, onConfirm){
    const fClose = () => {
        modal.modal("hide");
    };

    var modal = $("#add-note-genre-modal");
    modal.modal("show");

    const fAdd = (genre) => {
        onConfirm(genre);
        fClose();
    };

    const commonListDiv = $('#genre-list-common');
    const otherListDiv = $('#genre-list-other');
    const userListDiv = $('#genre-list-user');
    // Fill in genre choices from saved localStorage prefs
    populateGenreChoices(genreList, commonListDiv, otherListDiv, userListDiv, fAdd);

    const input = $('#add-note-genre-input');
    input.val('');
    input.attr('placeholder', placeholderText);

    $('#add-note-genre-title').empty().append(titleText);
    $("#add-note-genre-ok").unbind().one('click', onConfirm).one('click', fClose);
    $("#add-note-genre-cancel").unbind().one("click", fClose);
    $("#add-note-genre-close").unbind().one("click", fClose);
}

// Confirm functions
function confirmAddDate(date, onAdded){
    console.log("adding date: " + date);
    const day = (date.getDate() + 1).toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const dateText = `${month}-${day}-${year}`;

    if(currentBook.info.datesRead.includes(dateText)){
        // Date already exists. Don't add a duplicate
        alert("Date already exists! Please choose a different date.");
    }else{
        // Date doesn't exist. Add date to datesRead list
        currentBook.info.datesRead.push(dateText);
        currentBook.info.completed = true;
        setCompletedBook(true);
        createDateElem(dateText);
        onAdded();
    }
}

function confirmAddNote(){
    let note = $('#add-note-genre-input').val().trim();
    if (note.length > 1){
        currentBook.info.notes.push(note);
        console.log(currentBook.info.notes);
        createNoteElem(note);
    }
}

function confirmAddGenre(genre){
    console.log("adding genre");
    currentBook.info.genres.push(genre);
    createGenreElem(genre, $('#book-genres'), true);

}

// Create element functions
function createNoteElem(noteText){
    // Create text for note
    const p = document.createElement('p');
    p.innerHTML = noteText;
    // Create Note list item for note-list
    const item = document.createElement('li');
    item.classList.add('notes-list-item');
    //Create inner div to hold text and button
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('list-item-inner');
    // Create delete button to the right of the text
    const btn = createDeleteBtnElem();
    // Add button to inner div
    innerDiv.append(btn);
    innerDiv.append(p);
    // add div to dates-read-list-item div
    item.append(innerDiv);
    btn.addEventListener('click', () => {
        console.log("Note Clicked: " + noteText);
        removeNote(item, noteText);
    });
    // Add note to notes-list
    $('#notes-list').append(item);
}

function createDateElem(dateText){
    // Create text for note
    const p = document.createElement('p');
    p.innerHTML = dateText;   
    // Create Note list item for note-list
    const item = document.createElement('li');
    item.classList.add('dates-read-list-item');
    //Create inner div to hold text and button
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('list-item-inner');
    // Create delete button to the right of the text
    const btn = createDeleteBtnElem();
    // Add button to inner div
    innerDiv.append(btn);
    innerDiv.append(p);
    // add div to dates-read-list-item div
    item.append(innerDiv);
    btn.addEventListener('click', () => {
        console.log("Date Clicked: " + dateText);
        removeDate(item, dateText);
    });
    // Add note to notes-list
    $('#dates-read-list').append(item);
}

function createGenreElem(genreID, targetElem, addButton){
    const genre = genreList[genreID];
    // Create outer div row
    const outerDiv = document.createElement('div');
    outerDiv.classList.add('genre-item');
    outerDiv.id = genreID;
    // Create delete button to the right of the text
    if (addButton){
        const btn = createDeleteBtnElem();
        btn.addEventListener('click', () => {
            console.log("Genre Removed: " + genreID);
            removeGenre(outerDiv, genreID);
        });
        outerDiv.append(btn);
    }
    // Create span element with text
    const p = document.createElement('span');
    p.innerHTML = genreList[genreID].label;
    //Create inner div to hold text and button
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('genre-item-inner');
    innerDiv.style.borderColor = genre.color;
    // Add button to inner div
    innerDiv.append(p);
    outerDiv.append(innerDiv);

    // Add genre text to genre div
    targetElem.append(outerDiv);
}

function createDeleteBtnElem(){
    // Create delete button to the right of the text
    const b = document.createElement('button');
    b.classList.add('delete-btn')
    b.classList.add('btn');
    b.classList.add('btn-danger');
    const x = document.createElement('span');
    x.innerHTML = 'X';
    // Add X to button text
    b.append(x);
    return b;
}



function fillInEditModalInfo(bookInfo){
    if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail){
        $('#edit-modal-image').attr('src', bookInfo.imageLinks.thumbnail);
        console.log( bookInfo.imageLinks.thumbnail);
    }

    // Set book completed
    setCompletedBook(bookInfo.completed);

    // Clear notes-list and re-fill with notes array
    $('#notes-list').empty();
    bookInfo.notes.forEach(e => {
        createNoteElem(e);
    });

    // Clear book-genres div and re-fill with genres array
    $('#book-genres').empty();
    bookInfo.genres.forEach(genre => {
        createGenreElem(genre, $('#book-genres'), true);
    });

    // Clear datesread list and re-fill with dates read array
    $('#dates-read-list').empty();
    bookInfo.datesRead.forEach(e => {
        createDateElem(e);
    })

    // Create div and Set User rating for book
    const ratingOuter = $('#rating-container-outer');
    ratingOuter.empty();
    const ratingRow = createAndSetRatingStars(bookInfo.userRating, 'rating-container');
    ratingOuter.append(ratingRow);

    // Fill in text values
    $('#rating-slider').val(bookInfo.userRating);
    $('#rating-slider-value').text(bookInfo.userRating);

    $('#edit-modal-book-title').text(bookInfo.title ? bookInfo.title : '-');
    $('#edit-modal-book-author').text(bookInfo.authors && bookInfo.authors[0] ? bookInfo.authors[0] : '-');
    $('#edit-modal-book-description').text(bookInfo.description ? bookInfo.description : '-');
    $('#edit-modal-book-pagecount').text(bookInfo.pageCount ? bookInfo.pageCount : '-');
    $('#publisher-name').text(bookInfo.publisher ? bookInfo.publisher : '-');
    $('#published-date').text(bookInfo.publishedDate ? bookInfo.publishedDate : '-')
    $('#book-series').text(bookInfo.seriesName === 'na' ? '' : bookInfo.seriesName);

    // Hide edit elements
    toggleEditElements(false);
}

function editBookSelection(bookInfo){
    console.log("editing book");

    toggleEditElements(true);
}

function completedCheckClicked(){
    const completed = $('#completed-book-checkbox').is(':checked');
    currentBook.info.completed = completed;
    setCompletedBook(completed);   
}

function setCompletedBook(completed){
    $('#completed-book-bg').removeClass(completed ? 'unchecked' : 'checked').addClass(completed ? 'checked' : 'unchecked');
    $('#completed-book-checkbox').attr("checked", completed);
}

function saveCurrentBook(bookToSave){
    console.log("werfgwergerg");
    const bookID = bookToSave.info.isbn13;

    const seriesName = $('#book-series-input').val();
    console.log(seriesName);
    bookToSave.info.seriesName = seriesName === '' ? 'na' : seriesName;
    $('#book-series').text(seriesName);
    

    let onSave = () => {
        console.log("books");
    };

    updateSavedBook(bookToSave, bookID, onSave);
}

function ratingChanged(){
    const rating = $('#rating-slider').val();
    $('#rating-slider-value').text(rating);

    console.log("rating changed");
    currentBook.info.userRating = rating;
    console.log(currentBook);
}

function toggleEditElements(show){
    const seriesName = $('#book-series');
    const seriesInput = $('#book-series-input');

    if (show){
        // Show all editable elements
        $('#edit-confirm-save').show();
        $('#edit-confirm-cancel').show();
        $('#add-date-button').show();
        $('#add-note-button').show();
        $('#add-genre-button').show();
        $('#edit-rating-container').show();
        seriesInput.show();
        seriesInput.val(seriesName.text());
        $('.delete-btn').each((i, obj) => {
            obj.style.display = 'block';
        });

        // Hide all non-editable elements
        $('#edit-confirm-edit').hide();
        $('#view-rating-container').hide();
        seriesName.hide();
    }else{
        // Hide all editable elements
        $('#edit-confirm-save').hide();
        $('#edit-confirm-cancel').hide();
        $('#add-date-button').hide();
        $('#add-note-button').hide();
        $('#add-genre-button').hide();
        $('#edit-rating-container').hide();
        seriesInput.hide();
        $('.delete-btn').each((i, obj) => {
            obj.style.display = 'none';
        });

        // Show all non-editable elements
        $('#edit-confirm-edit').show();
        $('#view-rating-container').show();
        seriesName.show();
    }
}

function createAndSetRatingStars(rating, divClass){
    const div = createDivElem(true, divClass);

    for (let i = 0; i < 5; i++) {
        const innerDiv = createDivElem(true, 'star-inner-div');
        div.append(innerDiv);

        // Create back solid star
        const span = document.createElement('span');
        span.classList.add('star');
        const star = document.createElement('i');

        if (rating - (i+1) >= 0){   //Full star
            star.classList.add('fa-solid');
            star.classList.add('fa-star');
        }else if (rating - (i+1) === -0.5){ // Half star
            star.classList.add('fa-regular');
            star.classList.add('fa-star-half-stroke');
        }else{
            star.classList.add('fa-star');
            star.classList.add('fa-regular');
        }
        
        span.append(star);
        innerDiv.append(span);
    }

    return div;
}


// Return a string with all authors separated by a ,
function getAuthorsString(authorList){
    let aString = authorList.length > 0 ? authorList[0] : '';

    if (authorList.length > 1){
        for (let i = 1; i < authorList.length; i++) {
            aString += ', ' + authorList[i];
        }
    }

    return aString;
}

function createDateCompletedElem(date){
    let dateText = '-';
    if (date != null && date.length > 0){
        dateText = date[0];
    }
    const dateSpan = document.createElement('span');
    dateSpan.innerHTML = dateText;
    
    return dateSpan;
}

function removeDate(listItem, dateText){
    console.log(listItem);
    listItem.remove();
    
    var index = currentBook.info.datesRead.findIndex(function(item, i){
        return item === dateText;
    });

    currentBook.info.datesRead.splice(index, 1);
}

function removeNote(listItem, noteText){
    listItem.remove();
    
    var index = currentBook.info.notes.findIndex(function(item, i){
        return item === noteText;
    });

    currentBook.info.notes.splice(index, 1);
}

function removeGenre(listItem, genreID){
    listItem.remove();

    var index = currentBook.info.genres.findIndex(function(item, i){
        return item === genreID;
    });

    currentBook.info.genres.splice(index, 1);
}

function changeViewClass(resultsDiv, removeClass, addClass){
    if (resultsDiv.hasClass(removeClass)){
        resultsDiv.removeClass(removeClass);
    }
    resultsDiv.addClass(addClass);
}

function populateGenreChoices(savedGenres, commonListDiv, otherListDiv, userListDiv, onConfirm){

    if (!commonListDiv || !otherListDiv || !userListDiv){
        return;
    }
    commonListDiv.empty();
    otherListDiv.empty();
    userListDiv.empty();

    if (savedGenres){
        Object.entries(savedGenres).forEach((entry) => {
            const [key, value] = entry;
            const genreDiv = createDivElem(true, 'genre-choice-item');
            genreDiv.id = key;
            genreDiv.style.borderColor = value.color;
            const span = createSpanElem(value.label);
            genreDiv.append(span);
            switch(value.type){
                case 'common':
                    commonListDiv.append(genreDiv);
                    break;
                case 'other':
                    otherListDiv.append(genreDiv);
                    break;
                case 'user':
                    userListDiv.append(genreDiv);
                    break;
            }

            genreDiv.onclick = (e) => {
                console.log(e);
                onConfirm(key);
            };
        });
    }
}




function initGenreList(){
    const genrePrefs = localStorage.getItem('genreList');

    if (!genrePrefs){
        const defaultGenres = {
            'adventure' : {'label' : 'Adventure', 'color' : '#d3c6f7', 'type' : 'common'},     
            'autobiography' : {'label' : 'Autobiography', 'color' : '#a18cdb', 'type' : 'other'},
            'biography' : {'label' : 'Biography', 'color' : '#8b73c9', 'type' : 'other'},
            'childrens' : {'label' : 'Childrens', 'color' : '#715ba6', 'type' : 'other'},
            'cookbook' : {'label' : 'Cookbook', 'color' : '#51417f', 'type' : 'other'},
            'dystopian' : {'label' : 'Dystopian', 'color' : '#5b95ad', 'type' : 'common'},
            'fantasy' : {'label' : 'Fantasy', 'color' : '#4e7b90', 'type' : 'common'},
            'fiction' : {'label' : 'Fiction', 'color' : '#426578', 'type' : 'common'},
            'foodAndDrink' : {'label' : 'Food & Drink', 'color' : '#354f5b', 'type' : 'other'},
            'graphicNovel' : {'label' : 'Graphic Novel', 'color' : '#aed9e9', 'type' : 'common'},
            'historicalFiction' : {'label' : 'Historical Fiction', 'color' : '#6ecde9', 'type' : 'other'},
            'history' : {'label' : 'History', 'color' : '#3fc3e7', 'type' : 'common'},
            'horror' : {'label' : 'Horror', 'color' : '#26bfeb', 'type' : 'common'},
            'howTo' : {'label' : 'How-To', 'color' : '#a8de8d', 'type' : 'other'},
            'humor' : {'label' : 'Humor', 'color' : '#95d17d', 'type' : 'common'},
            'lgbtqiaPlus' : {'label' : 'LGBTQIA+', 'color' : '#91c37a', 'type' : 'other'},
            'mystery' : {'label' : 'Mystery', 'color' : '#69a84b', 'type' : 'common'},
            'nonFiction' : {'label' : 'Non-Fiction', 'color' : '#e9dc98', 'type' : 'common'},
            'parenting' : {'label' : 'Parenting', 'color' : '#ecd569', 'type' : 'other'},
            'philosophy' : {'label' : 'Philosophy', 'color' : '#decc68', 'type' : 'other'},
            'poetry' : {'label' : 'Poetry', 'color' : '#dac34d', 'type' : 'other'},
            'religion' : {'label' : 'Religion', 'color' : '#ec8b49', 'type' : 'other'},
            'romance' : {'label' : 'Romance', 'color' : '#e89257', 'type' : 'other'},
            'sciFi' : {'label' : 'Sci-Fi', 'color' : '#f1701b', 'type' : 'common'},
            'selfHelp' : {'label' : 'Self-Help', 'color' : '#eb630b', 'type' : 'other'},
            'shortStory' : {'label' : 'Short Story', 'color' : '#eb9894', 'type' : 'common'},
            'spirituality' : {'label' : 'Spirituality', 'color' : '#e9776f', 'type' : 'other'},
            'thriller' : {'label' : 'Thriller', 'color' : '#e86c64', 'type' : 'common'},
            'travel' : {'label' : 'Travel', 'color' : '#e44a40', 'type' : 'other'},
            'trueCrime' : {'label' : 'True Crime', 'color' : '#d02a1e', 'type' : 'common'},
            'youngAdult' : {'label' : 'Young Adult', 'color' : '#bb170d', 'type' : 'common'}
        };
        localStorage.setItem('genreList', JSON.stringify(defaultGenres));
    }
    genreList = JSON.parse(localStorage.getItem('genreList'));
}

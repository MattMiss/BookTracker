const MAX_SEARCH_RESULTS = 10;
let searchInput;
let searchResultsDiv;

$(window).on('load', () => {
    searchInput = $('#search-input');
    searchResultsDiv = $('#search-results');
    searchInput.keypress((e) => {
        if (e.key === 'Enter'){
            searchBook();
        }
    })
});

function searchBook(){
    searchResultsDiv.empty();

    $.ajax({
        dataType: 'json',
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput.val(),
        success: handleSearchResponse
    });
}

function handleSearchResponse(response){
    $.each( response.items, function( i, result) {
        if ( i < MAX_SEARCH_RESULTS)
        {
            console.log(result);
            createResultBookItem(result);
        }
    });
}


function createResultBookItem(item){
    let img = `<div class="missing-img d-flex justify-content-center align-items-center text-center"><i class="fa-regular fa-image"></i></div>`;
    if (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail){
        img = `<img src="${item.volumeInfo.imageLinks.thumbnail}" class="img-search-result">`;
    }

    let bookResultItem = document.createElement('div');
    bookResultItem.className += "search-result-item row py-2";

    const onSaveBook = () => {
        addBookToSavedList(item, item.volumeInfo.industryIdentifiers);
    }

    bookResultItem.onclick = () => {
        confirmBookSelection(item.volumeInfo, onSaveBook);
    }

    console.log(img);

    bookResultItem.innerHTML =
        `<div class="col-auto">
            ${img}
         </div>
         <div class="col">
             <div class="book-title">${item.volumeInfo.title ? item.volumeInfo.title : '-'}</div>
             <div class="book-author">${item.volumeInfo.authors && item.volumeInfo.authors[0] ? item.volumeInfo.authors[0] : '-'}</div>
             <div class="book-pages">${item.volumeInfo.pageCount ? item.volumeInfo.pageCount + ' pages': ''}</p>
             <div class="book-description">${item.volumeInfo.description ? item.volumeInfo.description : ''}</div>
         </div>`;

    searchResultsDiv.append(bookResultItem);

    /*
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const t = document.createElement('p');
    t.classList.add('book-title');
    t.innerHTML = item.volumeInfo.title ? item.volumeInfo.title : '-';
    cardInfo.append(t);

    const a = document.createElement('p');
    a.classList.add('book-author');
    a.innerHTML = item.volumeInfo.authors && item.volumeInfo.authors[0] ? item.volumeInfo.authors[0] : '-';
    cardInfo.append(a);

    const d = document.createElement('p');
    d.classList.add('book-description');
    d.innerHTML = item.volumeInfo.description ? item.volumeInfo.description : '-';
    cardInfo.append(d);

    const resultCard = document.createElement('div');
    resultCard.classList.add('result-card');

    const icon = document.createElement('img');
    if (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail){
        icon.src = item.volumeInfo.imageLinks.thumbnail;
    }

    const pageCount = document.createElement('div');
    pageCount.classList.add('page-count-container');

    const pageIcon = document.createElement('i');
    pageIcon.classList.add('fa-sharp');
    pageIcon.classList.add('fa-solid');
    pageIcon.classList.add('fa-book-open');

    const p = document.createElement('p');
    p.innerHTML = item.volumeInfo.pageCount ? item.volumeInfo.pageCount : '-';

    pageCount.append(pageIcon);
    pageCount.append(p);

    resultCard.append(icon);
    resultCard.append(cardInfo);
    resultCard.append(pageCount);

    // Select book when card is clicked
    resultCard.onclick = function(){
        confirmBookSelection(item.volumeInfo, function(){
            // Add book to users list here
            addBookToSavedList(item, item.volumeInfo.industryIdentifiers);
        });
    }

    $('#search-results').append(resultCard);
    */
}

function confirmBookSelection(bookInfo, onConfirm){
    var fClose = function(){
        modal.modal("hide");
    };
    var modal = $("#add-book-modal");
    modal.modal("show");

    populateSaveModalInfo(bookInfo);

    $("#save-confirm-message").empty().append('Add ' + bookInfo.title + '?');
    $("#save-confirm-ok").unbind().one('click', onConfirm).one('click', fClose);
    $("#save-confirm-cancel").unbind().one("click", fClose);
    $("#save-confirm-close").unbind().one("click", fClose);
}

function addBookToSavedList(bookInfo, identifiers){

    let id = '0';
    if (identifiers[0].type == 'ISBN_13'){
        id = identifiers[0].identifier;
    }else if (identifiers[1].type == 'ISBN_13'){
        id = identifiers[1].identifier;
    }

    let bookBlueprint = {
        infoLink: bookInfo.selfLink,
        title: bookInfo.volumeInfo.title,
        authors: bookInfo.volumeInfo.authors,
        description: bookInfo.volumeInfo.description,
        publisher: bookInfo.volumeInfo.publisher,
        publishedDate: bookInfo.volumeInfo.publishedDate,
        pageCount: bookInfo.volumeInfo.pageCount,
        imageLinks: bookInfo.volumeInfo.imageLinks,
        isbn13: id,
        userRating: 0,
        seriesName: 'na',
        genres: [],
        notes: [],
        datesRead: [],
        completed: false
    }


    addSavedBook(db,bookBlueprint, id);
}

function populateSaveModalInfo(bookInfo){
    if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail){
        $('#save-modal-image').attr('src', bookInfo.imageLinks.thumbnail);
        console.log( bookInfo.imageLinks.thumbnail);
    }

    $('#save-modal-book-title').text(bookInfo.title ? bookInfo.title : '-');
    $('#save-modal-book-author').text(bookInfo.authors && bookInfo.authors[0] ? bookInfo.authors[0] : '-');
    $('#save-modal-book-description').text(bookInfo.description ? bookInfo.description : '-');
    $('#save-modal-book-pages').text(bookInfo.pageCount ? bookInfo.pageCount : '-');
}
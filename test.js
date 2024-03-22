let currentBook;
let selectedListCardType = -1;
let genreList;
let myBookList;
let displayBtns;
let viewEditModal;

$(window).on('load', () => {
    console.log('window loaded');
    // Initialize List if database has already finished loading
    if (dbLoaded){
        initializeList();
    }else{
        // If database hasn't finished loading yet, Wait for the database to be loaded from db.js before loading my-book-list
        document.addEventListener('databaseLoaded', (e)=>{
            initializeList();
        }, false)
    }
});

function initializeList(){
    console.log("books loaded");
    console.log(myBooks);
    console.log("User preferred Display Index: " + selectedListCardType);
    myBookList = $('#my-book-list');
    displayBtns = $('.display-type-button');
    viewEditModal = $('#book-view-modal');
    initGenreList();
    loadBookListByDisplayType(getPreferredDisplayType());
}

function modalClicked(){
    //$('#book-view-modal').toggle();
}


// If the new index for the Display Type is different than the current index, this will add the 'btn-selected' class
// to the button of selected index, and remove 'btn-selected' class from the previously selected button.
// The new Preferred Display Type (new Index) is saved into Local Storage and the book list is reloaded
function changeListDisplayType(typeIndex){
    // Don't do anything if the display type index is the same as the current index
    if (selectedListCardType !== typeIndex){
        console.log("Changing display type to: " + typeIndex);
        // Remove 'btn-selected' class from previously selected button
        if (selectedListCardType !== -1){
            displayBtns[selectedListCardType].classList.remove('btn-selected');
        }
        // Add 'btn-selected' class to newly selected button
        displayBtns[typeIndex].classList.add('btn-selected');
        selectedListCardType = typeIndex;

        // Save preferred display type index and reload the book list
        savePreferredDisplayType(typeIndex);
        loadBookListByDisplayType(typeIndex);
    }
}

// Return the saved preferred display type index from Local Storage
// Will return index 1 if no display type is saved in local storage
function getPreferredDisplayType(){
    let typeIndex = 1;
    const savedIndex = localStorage.getItem('preferredDisplayType');
    if (savedIndex){
        typeIndex = savedIndex;
    }
    return parseInt(typeIndex);
}

// Saved preferred display type (index) into Local Storage
function savePreferredDisplayType(typeIndex){
    localStorage.setItem('preferredDisplayType', typeIndex);
}

// DisplayTypeIndex 0 = List View
// DisplayTypeIndex 1 = Details View
// DisplayTypeIndex 2 = Grid View (aka Card View)
function loadBookListByDisplayType(displayTypeIndex){
    console.log(myBookList);
    myBookList.empty();
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

// Create a List View Item for each book saved in myBooks (from db.js)
function loadBooksAsListView(){
    console.log("Loading books as list");
    // #my-book-list element class becomes 'd-flex list-view'
    myBookList.removeClass('grid-view');
    myBookList.removeClass('justify-content-between');
    if (!myBookList.hasClass('list-view')){myBookList.addClass('list-view')}

    myBooks.forEach(book => {
        console.log(book);
        createBookListViewItem(book);
    });
}
// Create a Details View Item for each book saved in myBooks (from db.js)
function loadBooksAsDetailsView(){
    console.log("Loading books as details");
    // #my-book-list element class becomes 'd-flex list-view'
    myBookList.removeClass('grid-view');
    myBookList.removeClass('justify-content-between');
    if (!myBookList.hasClass('list-view')){myBookList.addClass('list-view')}

    myBooks.forEach(book => {
        console.log(book);
        createBookDetailsViewItem(book);
    });
}
// Create a Grid View Item for each book saved in myBooks (from db.js)
function loadBooksAsGridView(){
    console.log("Loading books as grid");
    // #my-book-list element class becomes 'd-flex grid-view justify-content-between'
    myBookList.removeClass('list-view');
    myBookList.addClass('grid-view');
    myBookList.addClass('justify-content-between');

    myBooks.forEach(book => {
        console.log(book);
        createBookGridViewItem(book);
    });
}

function createBookListViewItem(bookInfo) {
    console.log(bookInfo);
    // Create a string from the last date read if one exists, otherwise show an empty string ''
    let dateReadString = getMiniDateString(bookInfo.info.datesRead);

    const listItem = document.createElement('div');
    listItem.className += "book-list-item row py-2";
    // Set book-view-modal as target in order to show modal on click
    setTargetModal(listItem, '#book-view-modal');

    listItem.innerHTML =
        `<div class="my-auto book-info-left">\n` +
        `    <div class="row">\n` +
        `        <div class="col-md-4 my-auto">\n` +
        `            <div class="book-title">${bookInfo.info.title}</div>\n` +
        `        </div>\n` +
        `        <div class="col-md-4 my-auto">\n` +
        `            <div class="book-author">${getAuthorsStringFromList(bookInfo.info.authors)}</div>\n` +
        `        </div>\n` +
        `        <div class="col-md-4 my-auto">\n` +
        `            <div class="book-series">${bookInfo.info.seriesName !== 'na' ? bookInfo.info.seriesName : ''}</div>\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>\n` +
        `<div class="my-auto book-info-right ms-auto">\n` +
        `    <div class="row">\n` +
        `        <div class="col-sm-5 m-auto px-2 py-1">\n` +
        `            <div class="book-pages">${bookInfo.info.pageCount} pages</div>\n` +
        `        </div>\n` +
        `        <div class="col-sm-7 my-auto px-2 py-1">\n` +
        `            <div class="text-end"><span class="book-rating-label">${bookInfo.info.userRating}</span><span class="book-rating-100">/100</span></div>\n` +
        `            <div class="progress w-100 book-prog-bar-outer" role="progressbar" aria-label="Book Rating" aria-valuenow="${bookInfo.info.userRating}" aria-valuemin="0" aria-valuemax="100">\n` +
        `                <div class="progress-bar book-prog-bar-inner" style="width: ${bookInfo.info.userRating}%; background-color: ${getColorFromRating(bookInfo.info.userRating)}"></div>\n` +
        `            </div>\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>\n` +
        `<div class="my-auto book-info-completed">\n` +
        `    <div class="row">\n` +
        `        <div class="book-date col-8 my-auto pe-2 text-end">${dateReadString}</div>\n` +
        `        <div class="col-4 my-auto px-0">\n` +
        `            <i class="fa-solid fa-circle-check ${bookInfo.info.completed ? '' : 'not-'}completed"></i>\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>`;

    listItem.onclick =  () => {
        console.log(listItem);
        console.log(bookInfo);
        viewBookSelectionModal(bookInfo, () => editBookSelection(bookInfo));
    }

    myBookList.append(listItem);
}

function createBookDetailsViewItem(bookInfo) {
    // Create a string from the last date read if one exists, otherwise show an empty string ''
    let dateReadString = getMiniDateString(bookInfo.info.datesRead);

    const listItem = document.createElement('div');
    listItem.className += "book-list-item row py-2";
    // Set book-view-modal as target in order to show modal on click
    setTargetModal(listItem, '#book-view-modal');

    const itemInner =
        `<div class="col-auto">\n` +
        `    <img class="book-list-image img-fluid" src="${bookInfo.info.imageLinks.smallThumbnail}">\n` +
        `</div>\n` +
        `<div class="col-3">\n` +
        `    <div class="book-title">${bookInfo.info.title}</div>\n` +
        `    <div class="book-author">${getAuthorsStringFromList(bookInfo.info.authors)}</div>\n` +
        `    <div class="book-series">${bookInfo.info.seriesName !== 'na' ? bookInfo.info.seriesName : ''}</div>\n` +
        `</div>\n` +
        `<div class="col my-auto">\n` +
        `    <div class="row">\n` +
        `        <div class="col-md-5 my-auto px-2">\n` +
        `            <div class="d-flex flex-wrap">\n` +
        `                ${getGenreListHTML(bookInfo.info.genres)}` +
        `            </div>\n` +
        `        </div>\n` +
        `        <div class="col-md-7 my-auto">\n` +
        `            <div class="row">\n` +
        `                <div class="col-sm-5 m-auto px-2 py-1">\n` +
        `                    <div class="book-pages">${bookInfo.info.pageCount} pages</div>\n` +
        `                </div>\n` +
        `                <div class="col-sm-7 my-auto px-2 py-1">\n` +
        `                     <div class="text-end"><span class="book-rating-label">${bookInfo.info.userRating}</span><span class="book-rating-100">/100</span></div>\n` +
        `                         <div class="progress w-100 book-prog-bar-outer" role="progressbar" aria-label="Book Rating" aria-valuenow="${bookInfo.info.userRating}" aria-valuemin="0" aria-valuemax="100">\n` +
        `                         <div class="progress-bar book-prog-bar-inner" style="width: ${bookInfo.info.userRating}%; background-color: ${getColorFromRating(bookInfo.info.userRating)}"></div>\n` +
        `                     </div>\n` +
        `                </div>\n` +
        `            </div>\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>\n` +
        `<div class="my-auto book-info-completed">\n` +
        `    <div class="row">\n` +
        `        <div class="book-date col-8 my-auto pe-2 text-end">${dateReadString}</div>\n` +
        `        <div class="col-4 my-auto px-0">\n` +
        `            <i class="fa-solid fa-circle-check ${bookInfo.info.completed ? '' : 'not-'}completed"></i>\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>`;

    listItem.onclick = function () {
        viewBookSelectionModal(bookInfo, () => editBookSelection(bookInfo));
    }
    listItem.innerHTML = itemInner;
    myBookList.append(listItem);
}

function createBookGridViewItem(bookInfo) {
    // Create a string from the last date read if one exists, otherwise show an empty string ''
    let dateReadString = getMiniDateString(bookInfo.info.datesRead);

    const listItem = document.createElement('div');
    listItem.className += "book-grid-item row py-2";
    // Set book-view-modal as target in order to show modal on click
    setTargetModal(listItem, '#book-view-modal');

    const itemInner =
        `<div class="col-auto mt-1 mb-auto">
                <img class="book-grid-image img-fluid" src="${bookInfo.info.imageLinks.smallThumbnail}">
                <div class="book-pages pt-2">${bookInfo.info.pageCount} pages</div>
                <div class="pt-2">
                    <div class="text-end"><span class="book-rating-label">${bookInfo.info.userRating}</span><span class="book-rating-100">/100</span></div>
                    <div class="progress w-100 book-prog-bar-outer" role="progressbar" aria-label="Book Rating" aria-valuenow="${bookInfo.info.userRating}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar book-prog-bar-inner" style="width: ${bookInfo.info.userRating}%; background-color: ${getColorFromRating(bookInfo.info.userRating)}"></div>
                    </div>
                </div>
            </div>
            <div class="col position-relative pb-4 px-0">
                <div class="ps-2">
                    <div class="book-title">${bookInfo.info.title}</div>
                    <div class="book-author">${getAuthorsStringFromList(bookInfo.info.authors)}</div>
                    <div class="book-series">${bookInfo.info.seriesName !== 'na' ? bookInfo.info.seriesName : ''}</div>
                </div>
                <div class="d-flex flex-wrap ps-1 pt-2 pb-2">
                    ${getGenreListHTML(bookInfo.info.genres)}
                </div>
                <div class="row position-absolute bottom-0 end-0 book-info-completed">
                    <div class="book-date col-8 my-auto pe-3 text-end">${dateReadString}</div>
                    <div class="col-4 my-auto px-0">
                        <i class="fa-solid fa-circle-check ${bookInfo.info.completed ? '' : 'not-'}completed"></i>
                    </div>
                </div>
            </div>`;

    listItem.onclick = function () {
        viewBookSelectionModal(bookInfo, () => editBookSelection(bookInfo));
    }
    listItem.innerHTML = itemInner;
    myBookList.append(listItem);
}

function setTargetModal(item, targetModal){
    item.setAttribute('data-bs-target', targetModal);
    item.setAttribute('data-bs-toggle', 'modal');
}

// Returns a date string in the format mm.dd.yy
function getMiniDateString(datesReadArray){
    if (datesReadArray.length > 0){
        const dateReadString = datesReadArray[datesReadArray.length-1].replaceAll('-', '.');
        const year = dateReadString[dateReadString.length-2]+dateReadString[dateReadString.length-1];
        return dateReadString.substring(0, 6) + year;   // Return date with the year containing only the last two digits
    }else{
        return '';
    }
}

// Returns 1 or multiple <li> with the date in format mm.dd.yy
function getFullDateString(datesRead){
    let dateString = '';
    datesRead.forEach(date => {
        dateString += `<li><div>${date.replaceAll('-', '.')}</div></li>`;
    });
    return dateString;
}


// Return a string with all authors separated by a ',' from a supplied array of author strings
function getAuthorsStringFromList(authorList) {
    let aString = authorList.length > 0 ? authorList[0] : '';

    if (authorList.length > 1) {
        for (let i = 1; i < authorList.length; i++) {
            aString += ', ' + authorList[i];
        }
    }

    return aString;
}

// Return an array of author strings from a supplied string with all authors separated by a ', '
function getAuthorsListFromString(authorString){
    return authorString.split(', ');
}


// Create a genre div with a div for each genre in the genreList
function getGenreListHTML(genres) {
    console.log(genres);
    let genreListHTML = '';
    genres.forEach(genre => {
        const genreHTML =
            `<div class="genre-item d-flex pb-1 pe-1" id=${genre}>\n` +
            `    <div class="genre-item-inner px-1" style="border-color: ${genreList[genre].color};"><span>${genreList[genre].label}</span></div>\n` +
            `</div>`;
        genreListHTML += genreHTML;
    })

    return genreListHTML;
}

// Set all the fields for the book-view-modal when a book is clicked and it gets shown as view-only
function viewBookSelectionModal(selectedBook, onEdit){
    currentBook = selectedBook;
    // Toggle Edit elements off before showing modal
    toggleEditElements(false);
    // Populate all fields in book modal
    populateViewBookModal(currentBook);
}

// Populate book-view-modal fields with info from selected book
function populateViewBookModal(bookInfo){
    console.log(bookInfo);
    // Set Input Refs
    const titleInput = $('#modal-book-title-input');
    const authorInput = $('#modal-book-author-input');
    const seriesInput = $('#modal-book-series-input');
    const descriptionInput = $('#modal-book-description-input');
    const pagesInput = $('#modal-book-pages-input');
    const publishedInput = $('#modal-book-published-input');
    const ratingProgBarOuter = $('#modal-book-prog-bar-outer');
    const ratingProgBarInner = $('#modal-book-prog-bar-inner');
    const ratingTextLabel = $('#modal-book-rating-text');
    const ratingProgressInput = $('#modal-book-progress-input');

    // Set Button Refs
    const editBtn = $('#view-modal-edit-btn');
    const cancelBtn = $('#view-modal-cancel-btn');
    const saveBtn = $('#view-modal-save-btn');

    // Set Book Cover Img Src
    $('#modal-book-cover').attr('src', (bookInfo.info.imageLinks.thumbnail ? bookInfo.info.imageLinks.thumbnail : ''));

    // Set Input Values and Add a ReadOnly attribute
    setInputTextAndReadOnly(titleInput, bookInfo.info.title ? bookInfo.info.title : '', true);
    setInputTextAndReadOnly(authorInput, bookInfo.info.authors ? getAuthorsStringFromList(bookInfo.info.authors) : '', true);
    setInputTextAndReadOnly(seriesInput, bookInfo.info.seriesName === 'na' ? '' : bookInfo.info.seriesName, true);
    setInputTextAndReadOnly(descriptionInput, bookInfo.info.description ? bookInfo.info.description : '', true);
    setInputTextAndReadOnly(pagesInput, bookInfo.info.pageCount ? bookInfo.info.pageCount : '', true);
    setInputTextAndReadOnly(publishedInput, bookInfo.info.publishedDate ? bookInfo.info.publishedDate : '', true);

    // Set author title = 'Authors' if multiple authors and 'Author' if only a single author
    if (bookInfo.info.authors && bookInfo.info.authors.length > 1){
        $('#modal-book-author-title').text('Authors');
    }else{
        $('#modal-book-author-title').text('Author');
    }

    console.log()

    // Set Rating progress bar value
    setRatingProgressBar(ratingProgBarOuter, ratingProgBarInner, ratingTextLabel, bookInfo.info.userRating);

    // Add Genre Elements to the Genre container
    $('#modal-book-genre').empty().append(getGenreListHTML(bookInfo.info.genres));   // Empty Genre list and repopulate

    // Add Dates Read elements to the Dates Read List
    $('#modal-book-dates-read').empty().append(getFullDateString(bookInfo.info.datesRead));

    // Show Edit Button - Hide Cancel and Save Buttons
    editBtn.removeClass('hidden');
    cancelBtn.addClass('hidden');
    saveBtn.addClass('hidden');

    // Add an onchange listener to the rating input bar so the Progress bar and Input Range match each other
    ratingProgressInput.on('input change', () => {
        setRatingProgressBar(ratingProgBarOuter, ratingProgBarInner, ratingTextLabel, ratingProgressInput.val());
    })

    // Remove all listeners from Edit Button and then add a click listener back on
    editBtn.off()
    editBtn.click(() => {
        editBookSelection(bookInfo);
    })

    // Remove all listeners from Cancel Button and then add a click listener back on
    cancelBtn.off();
    cancelBtn.click(() => {
        // Turn edititable elements off
        toggleEditElements(false);
        // Repopulate the modal view back to original info
        populateViewBookModal(currentBook);
    })

    // Remove all listeners from Save Button and then add a click listener back on
    saveBtn.off();
    saveBtn.click(() => {
        // TODO: Update the bookInfo with new input values

        bookInfo.info.title = titleInput.val();
        bookInfo.info.authors = getAuthorsListFromString(authorInput.val());
        bookInfo.info.seriesName = seriesInput.val();
        bookInfo.info.description = descriptionInput.val();
        bookInfo.info.pageCount = pagesInput.val();
        bookInfo.info.publishedDate = publishedInput.val()
        bookInfo.info.userRating = ratingProgressInput.val();

        console.log(bookInfo);
        saveCurrentBook(bookInfo);
        toggleEditElements(false);

    })
}

// Switch fields in book-view-modal from view-only to be editable inputs
function editBookSelection(bookInfo){
    console.log("editing book");

    toggleEditElements(true);

    // Set range input value to book userRating
    $('#modal-book-progress-input').val(bookInfo.info.userRating);
}

// Toggle fields in book-view-modal between view-only and editable inputs
function toggleEditElements(showElements){

    $('#modal-book-title-input').attr('readonly', !showElements);
    $('#modal-book-author-input').attr('readonly', !showElements);
    $('#modal-book-series-input').attr('readonly', !showElements);
    $('#modal-book-description-input').attr('readonly', !showElements);
    $('#modal-book-pages-input').attr('readonly', !showElements);
    $('#modal-book-published-input').attr('readonly', !showElements);

    if (showElements){
        // Add 'editing' class to modal
        $('#book-view-modal').addClass('editing');

        // Hide Edit button and Show Cancel and Save buttons
        $('#view-modal-edit-btn').addClass('hidden');
        $('#view-modal-cancel-btn').removeClass('hidden');
        $('#view-modal-save-btn').removeClass('hidden');

    }else{
        // Remove 'editing' class from modal
        $('#book-view-modal').removeClass('editing');

        // Show Edit button and Hide Cancel and Save buttons
        $('#view-modal-edit-btn').removeClass('hidden');
        $('#view-modal-cancel-btn').addClass('hidden');
        $('#view-modal-save-btn').addClass('hidden');
    }
}

// Sets the value and Adds or Removes the Readonly attribute from a provided <Input> Element
function setInputTextAndReadOnly(targetInput, value, isReadOnly){
    if (targetInput != null){
        targetInput.val(value);
        targetInput.attr('readonly', isReadOnly);
    }
}

// Set the progressbar value and width
function setRatingProgressBar(outerDiv, innerDiv, label, value){
    outerDiv.attr('aria-valuenow', value);
    innerDiv.css('width', value + '%');
    innerDiv.css('background-color', getColorFromRating(value));
    label.text(value);
}

// Save the book to the database with the book isbn13 number as the ID
function saveCurrentBook(bookToSave){
    const bookID = bookToSave.info.isbn13;
    let onSave = () => {
        // TODO: Show saved successful popup
        console.log("Save Was Successful");
        //loadBookListByDisplayType(selectedListCardType);
    };
    // Save into database in  db.js
    updateSavedBook(bookToSave, bookID, onSave);
}

// Return the HEX color based on the rating. 0-39 = red. 40-69 = yellow. 70-100 = green
function getColorFromRating(rating){
    if (rating >= 70){
        return '#66d05a';
    }else if (rating >= 40){
        return '#d9d908';
    }else {
        return '#d24747';
    }
}

// Load the saved Genre List into the genreList variable. If it is the first time loading the genre list and/or
// there is no list found in localstorage, a default genre list will be initialized and saved into localstorage.
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
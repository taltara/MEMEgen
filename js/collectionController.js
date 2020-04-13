'use strict';

var gCurrCollectionSize = 1;

window.onclick = function (event) {
    var elModal = document.querySelector('.modal-meme');
    if (event.target != elModal) {
        if (elModal.classList.contains('show')) {
            console.log('here');
            
            elModal.classList.remove('show');
        }
    }
}


function initMemesCollection() {

    changeGallerySize(2, '.card');
    updateNavBarCurrent('memes');
    getAllMemeCollection();
    populateCollection();
}

function populateCollection() {

    var elCollection = document.querySelector('.meme-collection');
    var strHTML = '';

    gMemes.forEach(meme => {

        // <span class="delete-btn"><i class="fas fa-times-circle fa-2x del-book-button book-buttons" onclick="onDeleteBook('${book.id}', this)"></i></span>
        strHTML += `<span><img src="${meme.src}" class="card" data-id="${meme.id}" onclick="toggleMenu(this.dataset.id)"><i class="fas fa-times-circle fa-2x del-meme-button meme-buttons" onclick="deleteMemeFromCollection('${meme.id}', this)"></i></span>`;
    });

    if (elCollection.innerHTML) animateCollection('out', '.card');
    
    if(gMemes.length) elCollection.innerHTML = strHTML;
    else elCollection.innerHTML = '<h2>No Saved Memes</h2>';
    animateCollection('in', '.card');
}


// function changeCollectionSize(size = 0) {

//     var allElCollection = document.querySelectorAll('.card');
//     var newSize;

//     if(size >= 1) {

//         gCurrCollectionSize = newSize = size;

//     } else {

//         newSize = (gCurrCollectionSize === 1) ? 2 : (gCurrCollectionSize === 2) ? 3 : 1;
//         gCurrCollectionSize = newSize;
//     }
//     var setSize = (newSize === 1) ? 15 : (newSize === 2) ? 20 : 25;

//     allElCollection.forEach(card => {

//         card.style.width = `${setSize}rem`;
//         card.style.height = `auto`;
//     });
//     updateEnlargeIcon(gCurrCollectionSize);
//     animateCSS('.view-size-toggle', 'rubberBand');
// }

function openMeme(memeId) {

    event.stopPropagation();

    var elModal = document.querySelector('.modal-meme');
    document.querySelector('.del-button-span').innerHTML = `<button class="remove-btn btn" onclick="deleteMeme('${memeId}')">Remove</button>`;
    if (elModal.classList.contains('show-meme')) {

        elModal.classList.remove('show-meme');

        updateModal(elModal, memeId);
        setTimeout(() => {

            elModal.classList.add('show-meme');
        }, 200);
    } else {

        updateModal(elModal, memeId);
        elModal.classList.add('show-meme');
    }
}

function getMemeById(id) {

    var foundMeme = gMemes.findIndex(meme => {

        return meme.id === id;
    });

    return gMemes[foundMeme];
}

function updateModal(elModal, memeId) {

    var meme = getMemeById(memeId);
    console.log(meme);

    elModal.querySelector('img').src = meme.src;

}


function deleteMemeFromCollection(memeId, elDeleteButton) {
    if(event)   event.stopPropagation();

    if(elDeleteButton.classList.contains('fa-spin')) {
        elDeleteButton.style.color = 'black';
        
        deleteMeme(memeId);
        elDeleteButton.classList.remove('fa-spin');
    } else {
        
        elDeleteButton.classList.add('fa-spin');
        elDeleteButton.style.color = 'tomato';
        
        
        setTimeout(() => {
            elDeleteButton.classList.remove('fa-spin');
            elDeleteButton.style.color = 'black';
        }, 4000);
    }
}
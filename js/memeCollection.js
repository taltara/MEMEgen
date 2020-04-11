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

    updateNavBarCurrent('memes');
    getAllMemeCollection();
    populateCollection();
}

function populateCollection() {

    var elCollection = document.querySelector('.meme-collection');
    var htmlString = '';

    gMemes.forEach(meme => {

        htmlString += `<img src="${meme.src}" class="card" data-id="${meme.id}" onclick="toggleMenu(this.dataset.id)">`;
    });

    if (elCollection.innerHTML) animateCollection('out', '.card');
    
    if(gMemes.length) elCollection.innerHTML = htmlString;
    else elCollection.innerHTML = '<h2>No Saved Memes</h2>';
    animateCollection('in', '.card');
}


function changeCollectionSize(size = 0) {

    var allElCollection = document.querySelectorAll('.card');
    var newSize;

    if(size >= 1) {

        gCurrCollectionSize = newSize = size;

    } else {

        newSize = (gCurrCollectionSize === 1) ? 2 : (gCurrCollectionSize === 2) ? 3 : 1;
        gCurrCollectionSize = newSize;
    }
    var setSize = (newSize === 1) ? 15 : (newSize === 2) ? 20 : 25;

    allElCollection.forEach(card => {

        card.style.width = `${setSize}rem`;
        card.style.height = `auto`;
    });
    updateEnlargeIcon(gCurrCollectionSize);
    animateCSS('.view-size-toggle', 'rubberBand');
}

function openMeme(memeId) {

    event.stopPropagation();

    var elModal = document.querySelector('.modal-meme');

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

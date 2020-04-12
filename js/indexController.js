'use strict';

const KEYg = 'galleryCollection';
const KEYm = 'imgToMeme';
const KEY1 = 'MEMEgenFirstVisit';

var gGallery = [];
var gCurrGallerynSize = 1;
var tutorialAnimated = false;



function initMemeGallery() {

    updateNavBarCurrent('gallery');
    populateGGallery();
    populateFilters();
    populateGalleryContainer();

    if (!loadFromStorage(KEY1)) {
        saveToStorage(KEY1, true);
        startTutorial();
    }
}

function populateGGallery(type = false) {

    var allGallery = loadFromStorage(KEYg);
    if (allGallery) gGallery = allGallery;
    else {

        saveToStorage(KEYg, zGallery);
        gGallery = loadFromStorage(KEYg);
    }

    shuffle(gGallery);

    if (!type) saveToStorage(KEYm, null);
}

function startTutorial() {

    var elAbout = document.querySelector('.nav-link-about');

    setTimeout(() => {

        if (window.innerWidth <= 1297) {

            toggleMenu('menu');

            setTimeout(() => {

                elAbout.classList.add('about-press-tutorial');
                setTimeout(() => {

                    toggleMenu('about');
                    elAbout.classList.remove('about-press-tutorial');

                }, 400);

            }, 750);

        } else {

            toggleMenu('about');
        }

    }, 1000);
}


function populateGalleryContainer(filter = '') {
    // console.log(filter);

    var elGContainer = document.querySelector('.gallery-container');
    let imagesToShow = gGallery.slice();

    if (filter != '') {

        let newImagesToShow = imagesToShow.filter(image => {

            var words = image.keywords;
            // console.log(words.length);

            for (let i = 0; i < words.length; i++) {

                // console.log(words[i], ' : ', filter);

                if (words[i].includes(filter.toLowerCase())) return true;
            }
        });

        imagesToShow = newImagesToShow;
    }
    var htmlString = '';
    imagesToShow.forEach(image => {

        htmlString += `<img src="${image.src}" data-id="${image.id}" onclick="createMemeRedirect(this, 'internal')" class="img-card">`;
    });

    if (elGContainer.innerHTML) animateCollection('out', '.img-card');

    elGContainer.innerHTML = htmlString;
    animateCollection('in', '.img-card');
}

function externalMemeRedirector() {

    event.preventDefault();
    var memeUrl = document.querySelector('.external-input').value;

    createMemeRedirect(memeUrl, 'external')
}

function createMemeRedirect(elImgToMeme, type) {

    if (type === 'internal') saveToStorage(KEYm, { id: elImgToMeme.dataset.id, type });
    else if (type === 'external') saveToStorage(KEYm, { id: elImgToMeme, type });
    window.location.href = "creator.html";
}

function changeGallerySize(size = 0) {

    var allElCollection = document.querySelectorAll('.img-card');
    var newSize;

    if (size >= 1) {

        gCurrGallerynSize = newSize = size;

    } else {

        newSize = (gCurrGallerynSize === 1) ? 2 : (gCurrGallerynSize === 2) ? 3 : 1;
        gCurrGallerynSize = newSize;
    }
    var setSize = (newSize === 1) ? 15 : (newSize === 2) ? 20 : 25;

    allElCollection.forEach(card => {

        card.style.width = `${setSize}rem`;
        card.style.height = `auto`;
    });
    updateEnlargeIcon(gCurrGallerynSize);
    animateCSS('.view-size-toggle', 'rubberBand');
}

function memeGalleryStats(amount = 10) {

    var allGallery = gGallery.slice();
    var topKeywords = {};

    allGallery.forEach(img => {

        img.keywords.forEach(word => {

            if (topKeywords[`${word}`]) topKeywords[`${word}`] += 1;
            else topKeywords[`${word}`] = 1;
        });
    });

    // console.log(topKeywords);

    return getKeysWithHighestValue(topKeywords, amount);
}

function populateFilters(amount = 5) {

    var hotKeywords = memeGalleryStats();
    var hotKeywordsAuto = hotKeywords.slice(amount);
    hotKeywords = hotKeywords.slice(0, amount);
    // shuffle(hotKeywords);

    var elPopularFilters = document.querySelector('.popular-filters');
    var elPopularAutocomplete = document.querySelector('#popular-keywords');
    var htmlString = '';

    var hotKeywordsMap = hotKeywords.map((hotword, i) => {

        return `<span class="filter-item filter-size-${i + 1}" data-filter="${hotword}" onclick="populateGalleryContainer(this.dataset.filter)">${hotword}</span>`;
    });

    shuffle(hotKeywordsMap);

    elPopularFilters.innerHTML = hotKeywordsMap.join('');

    for (let i = 0; i < hotKeywordsAuto.length; i++) {

        htmlString += `<option value="${hotKeywordsAuto[i]}">`;
    }

    elPopularAutocomplete.innerHTML = htmlString;
}

function tutorialFromUrl() {

    var elMenu = document.querySelector('.nav-links');
    var elExternalSection = document.querySelector('.external-meme-section');
    var elExternalInput = document.querySelector('.external-input');

    setTimeout(() => {

        toggleMenu('exit');

        if (window.innerWidth <= 1297) elMenu.classList.remove('side-menu');

        document.querySelector('.main-nav').scrollIntoView();
        setTimeout(() => {

            document.body.classList.add('menu-open');

            setTimeout(() => {
                elExternalSection.style.zIndex = '6001';

                setTimeout(() => {
                    elExternalInput.focus();

                    setTimeout(() => {
                        if (window.innerWidth <= 1297) elMenu.classList.add('side-menu');

                        document.body.classList.remove('menu-open');
                        elExternalSection.style.zIndex = 'unset';
                        toggleMenu('about');
                    }, 1000);
                }, 200);
            }, 200);
        }, 300);
    }, 300);

}

function tutorialFilterSearch() {

    var elMenu = document.querySelector('.nav-links');
    var elFilterSection = document.querySelector('.search-filter-nav');
    var elFilterInput = document.querySelector('.search-gallery');
    var elImgContainer = document.querySelector('.gallery-container');

    setTimeout(() => {

        toggleMenu('exit');

        if (window.innerWidth <= 1297) elMenu.classList.remove('side-menu');
        document.querySelector('.main-header').scrollIntoView();
        setTimeout(() => {

            document.body.classList.add('menu-open');

            setTimeout(() => {
                elFilterSection.style.zIndex = '6001';

                setTimeout(() => {

                    elImgContainer.style.zIndex = '6001';

                    setTimeout(() => {
                        elFilterInput.focus();

                        setTimeout(() => {

                            elFilterInput.value = 'd';
                            populateGalleryContainer('d');

                            setTimeout(() => {
                                elFilterInput.value = 'do';
                                populateGalleryContainer('do');

                                setTimeout(() => {
                                    elFilterInput.value = 'dog';
                                    populateGalleryContainer('dog');

                                    setTimeout(() => {
                                        if (window.innerWidth <= 1297) elMenu.classList.add('side-menu');
                                        elFilterInput.value = '';
                                        elImgContainer.style.zIndex = 'unset';
                                        elFilterSection.style.zIndex = 'unset';
                                        document.body.classList.remove('menu-open');
                                        populateGalleryContainer('');
                                        setTimeout(() => {

                                            toggleMenu('about');
                                        }, 200);
                                    }, 1000);
                                }, 750);
                            }, 750);
                        }, 1000);
                    }, 300);
                }, 300);
            }, 200);
        }, 300);
    }, 300);
}
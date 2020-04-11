'use strict';

var gMemes = [];

function getAllMemeCollection() {

    var memeCollection = loadFromStorage(KEY);

    if(memeCollection) gMemes = memeCollection;
}

function animateCSS(element, animationName, callback) {
    var node = document.querySelector(element);
    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd);
}

function saveMemeToCollection(){

    prepareCanvasForShare('before');
    const data = gCanvas.toDataURL();
    prepareCanvasForShare('after');

    var newMeme = {id: makeId(), src: data, created: Date.now()};
    (gMemes.length) ? gMemes.push(newMeme) : gMemes = [newMeme];
    console.log('gMemes', gMemes);

    saveToStorage(KEY, gMemes);

    animateCSS('canvas', 'tada', () => {
    
        window.location.href = "memeCollection.html";
    });
}


function downloadCanvas(elLink, data = false) {

    if(!data) {

        prepareCanvasForShare('before');
        data = gCanvas.toDataURL();
        prepareCanvasForShare('after');

    } else {

        data = document.querySelector('.modal img').src;
    }
    console.log('data', data)
    elLink.href = data;
    elLink.download = 'MEMEgen.jpg';
}
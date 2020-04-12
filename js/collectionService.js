'use strict';

function deleteMeme(memeId) {
    var memeIdx = gMemes.findIndex(function (meme) {
        return memeId === meme.id;
    })
    gMemes.splice(memeIdx, 1);
    saveToStorage(KEY, gMemes);
    if(document.body.classList.contains('menu-open')) toggleMenu('exit');
    populateCollection();
}
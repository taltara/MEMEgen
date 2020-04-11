'use strict';

var gCanvas;
var gCtx;
var trollAnimating = false;

var gFontSize;
var gColorStroke = '#000';
var gColorFill = '#ffffff';
var gFontAlign = 'center';
var gFontColorType = 'stroke';
var gCount = 0;
var gTexts = [];

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRandomColor(change = 0) {

    var randomColor = [
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255)
    ];

    for (var i = 0; i < 3; i++) {

        if (randomColor[i] + change > 255) randomColor[i] = 255;
        else if (randomColor[i] + change < 0) randomColor[i] = 0;
    }

    return "#" + componentToHex(randomColor[0]) + componentToHex(randomColor[1]) + componentToHex(randomColor[2]);
}

function makeId(length = 10) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function animateCollection(direction, className) {

    var allItems = document.querySelectorAll(className);
    
    allItems.forEach((card, i) => {

            setTimeout(() => {

                if (direction === 'in') {
                    
                    card.style.opacity = '1';
                    // console.log(loadFromStorage('imgToMeme'));
                    
                    if(loadFromStorage('imgToMeme')) {
                        saveToStorage('imgToMeme', null);
                        if(i === allItems.length - 1) {

                            card.style.boxShadow = `0px 0px 15px 5px rgba(255, 215, 0, 1)`;
    
                            setTimeout(() => {
                                card.style.boxShadow = `0px 0px 10px 0px rgba(0, 0, 0, 0.75)`;
                            }, 1000);

                        }
                    }
                }
                
                else card.style.opacity = '0';

            }, Math.floor(Math.random() * 50 + 10));

    });
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function logoGoToGallery() {

    window.location.href = "index.html";
}

function updateEnlargeIcon(size) {

    var letter = (size === 1) ? 'M' : (size === 2) ? 'L' : 'X'; 

    document.querySelector('.enlarge-text').textContent = letter;
}

function animateCSS(element, animationName, callback) {
    var node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

function updateNavBarCurrent(type) {

    var elCurrNav = document.querySelector(`.nav-link-${type}`);
    elCurrNav.classList.add('current-nav');
}

function getKeysWithHighestValue(o, n) {
    var keys = Object.keys(o);
    keys.sort(function (a, b) {
        return o[b] - o[a];
    })
    // console.log(keys);
    return keys.slice(0, n);
}

function toggleMenu(path) {
    
    if(event != undefined) event.stopPropagation();
    var elSideMenu = document.querySelector('.nav-links');

    if(path === 'exit') {

        if(!document.body.className.includes('side-menu')) {

            if(document.querySelector('.modal-meme')) {

                var elMemeModal = document.querySelector('.modal-meme');
    
                if(elMemeModal.classList.contains('show-meme')) {
                    
                    elMemeModal.classList.remove('show-meme');
                    elSideMenu.classList.add('side-menu');
                    console.log(elMemeModal.classList);
                    document.body.classList.remove('menu-open');
    
                } else {
    
                    if(document.querySelector('.modal').classList.contains('show')) {
    
                        openModal();
                    }
                    document.body.classList.remove('menu-open');
                    elSideMenu.classList.add('side-menu');
                }

            } else {

                if(document.querySelector('.modal').classList.contains('show')) {
    
                    openModal();
                }
                document.body.classList.remove('menu-open');
                elSideMenu.classList.add('side-menu');
            }

        } 

    } else if(path === 'menu') {

        document.body.classList.add('menu-open');
    } else if(path === 'about') {

        if(document.body.classList.contains('menu-open')) {

            
            elSideMenu.classList.remove('side-menu');
            


        } else {
            elSideMenu.classList.remove('side-menu');
            document.body.classList.add('menu-open');
        }

        openModal();
    } else if(path != ''){

        elSideMenu.classList.remove('side-menu');
        document.body.classList.add('menu-open');
        openMeme(path);
    }

}

function trollAnimations(elTroll) {

    if(trollAnimating) return;

    trollAnimating = true;

    var animationsBank = ['rotate', 'rotateY', 'rotateX', 'rotateZ'];

    elTroll.style.transform = `${animationsBank[Math.floor(Math.random() * animationsBank.length)]}(${Math.floor(Math.random() * 180)}deg)`;

    setTimeout(() => {
        elTroll.style.transform = '';
        trollAnimating = false;
    }, 300);
}

function updateModalAbout(elModal) {

    var meme = getMemeById(memeId);
    console.log(meme);

    elModal.querySelector('img').src = meme.src;

}


function openModal() {
    
    if(event != undefined) event.stopPropagation();
    
    // document.body.classList.toggle('menu-open');
    var elModal = document.querySelector('.modal');
    
    if (elModal.classList.contains('show')) {

        elModal.classList.remove('show');

    } else {


        elModal.classList.add('show');
    }

}
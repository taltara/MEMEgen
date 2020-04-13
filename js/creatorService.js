'use strict';


var zStickerGallery = [

    {src: "img/stickers/deal-glasses.png"},
    {src: "img/stickers/grumpy-cat.png"},
    {src: "img/stickers/happy-birthday.png"},
    {src: "img/stickers/harambe.png"},
    {src: "img/stickers/joint.png"},
    {src: "img/stickers/mask.png"},
    {src: "img/stickers/salt-bae.png"},
    {src: "img/stickers/shia-la-bouffe.png"},
    {src: "img/stickers/snoop-dog.png"},
    {src: "img/stickers/thug-life-hat.png"},
    {src: "img/stickers/troll-face.png"},
    {src: "img/stickers/virus.png"},
    {src: "img/stickers/wanna-fuk.png"},
    {src: "img/stickers/nevo-i.png"},
    {src: "img/stickers/crown.png"},
    {src: "img/stickers/ronald-mcdonalds.png"},
    {src: "img/stickers/burger.png"},
    {src: "img/stickers/cookie.png"},
    {src: "img/stickers/kfc.png"},
    {src: "img/stickers/mario.png"},
    {src: "img/stickers/devil-wings.png"},
    {src: "img/stickers/angel-wings.png"},
    {src: "img/stickers/superman-logo.png"},
    {src: "img/stickers/spiderman.png"},
    {src: "img/stickers/ironman.png"},
    {src: "img/stickers/hulk.png"},
    {src: "img/stickers/goku1.png"},
    {src: "img/stickers/goku2.png"},
    {src: "img/stickers/batman-logo.png"},
    {src: "img/stickers/joker.png"},
    {src: "img/stickers/odd-parents.png"},
    {src: "img/stickers/woldo.png"},
    {src: "img/stickers/spongebob.png"},
    {src: "img/stickers/southpark.png"},
    {src: "img/stickers/scoobydoo.png"},
    {src: "img/stickers/rick.png"},
    {src: "img/stickers/dede.png"},
    {src: "img/stickers/doomguy.png"},
];

function populateStickers() {

    shuffle(zStickerGallery);
    var stickersEls = zStickerGallery.map(sticker => {

        return `<div class="siema-item" data-url="${sticker.src}" onclick="addStickerNode(this.dataset.url)"><img src="${sticker.src}"></div>`
    });

    document.querySelector('.stickers-section').innerHTML = stickersEls.join('');
}
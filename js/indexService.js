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
    
        window.location.href = "collection.html";
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

var zGallery = [

    {id: 0, src: `img/1.jpg`, keywords: ['happy', 'nature', 'woman', 'classic', 'all the fucks']},
    {id: 1, src: `img/2.jpg`, keywords: ['trump', 'angry', 'funny', 'man', 'idiot']},
    {id: 2, src: `img/3.jpg`, keywords: ['dog', 'puppy', 'cute', 'love', 'lick']},
    {id: 3, src: `img/4.jpg`, keywords: ['child baby', 'success', 'cute', 'beach', 'happy']},
    {id: 4, src: `img/5.jpg`, keywords: ['cat', 'sleeping', 'cute', 'computer', 'annoying']},
    {id: 5, src: `img/6.jpg`, keywords: ['wonka', 'please tell me', 'annoying', 'funny', 'smile']},
    {id: 6, src: `img/7.jpg`, keywords: ['child baby', 'planning', 'bad', 'happy', 'evil']},
    {id: 7, src: `img/8.jpg`, keywords: ['old', 'you', 'honest', 'testing', 'truth']},
    {id: 8, src: `img/9.jpg`, keywords: ['what the hell', 'angry', 'how', 'believe', 'annoying']},
    {id: 9, src: `img/10.jpg`, keywords: ['ancient aliens', 'professor', 'dr', 'science fiction', 'theory', 'smile']},
    {id: 10, src: `img/11.jpg`, keywords: ['dr evil', 'austin powers', 'hot magma', 'air quotes', 'sarcastic']},
    {id: 11, src: `img/12.jpg`, keywords: ['children', 'africa', 'happy', 'dancing', '3rd world problems']},
    {id: 12, src: `img/13.jpg`, keywords: ['trump', 'angry', 'funny', 'man', 'idiot']},
    {id: 13, src: `img/14.jpg`, keywords: ['child baby', 'funny', 'face', 'cute', 'curious']},
    {id: 14, src: `img/15.jpg`, keywords: ['dog', 'yoga', 'funny', 'cute', 'excercise']},
    {id: 15, src: `img/16.jpg`, keywords: ['obama', 'funny', 'laughing', 'cool', 'rofl', 'lol', 'haha']},
    {id: 16, src: `img/17.jpg`, keywords: ['basketball', 'fight', 'kiss', 'funny', 'mistake']},
    {id: 17, src: `img/18.jpg`, keywords: ['leonardo dicaprio', 'drinks', 'toast', 'cheers', 'fancy', `you're welcome`]},
    {id: 18, src: `img/19.jpg`, keywords: ['matrix', 'morpheus', 'what if i told you', 'fact', 'stupid']},
    {id: 19, src: `img/20.jpg`, keywords: ['one does not simply walk into mordor', 'the lord of the rings', 'soromir sean bean', 'explain', 'annoying']},
    {id: 20, src: `img/21.jpg`, keywords: ['oprah', 'you get a car', 'giveaway', 'generous', 'rich']},
    {id: 21, src: `img/22.jpg`, keywords: ['star trek', 'captain jean-luc picard', 'old', 'laughing', 'funny']},
    {id: 22, src: `img/23.jpg`, keywords: ['putin', 'russia', 'scary', 'serious', 'explaining']},
    {id: 23, src: `img/24.jpg`, keywords: ['toy story', 'everywhere', 'buzz lightyear', 'woody', 'friend']},
    {id: 24, src: `img/25.jpg`, keywords: ['confused', 'really high', 'guy', 'stupid', 'funny']},
    {id: 25, src: `img/26.jpg`, keywords: ['advice dog', 'classic']},
    {id: 26, src: `img/27.jpg`, keywords: ['advice god', 'classic']},
    {id: 27, src: `img/28.jpg`, keywords: ['advice yoda', 'classic']},
    {id: 28, src: `img/29.jpg`, keywords: ['angry', 'dark', 'star', 'evil']},
    {id: 29, src: `img/30.jpg`, keywords: ['annoying facebook girl', 'classic']},
    {id: 30, src: `img/31.jpg`, keywords: ['bad luck brian', 'ugly']},
    {id: 31, src: `img/32.jpg`, keywords: ['bear grylls', 'pee']},
    {id: 32, src: `img/33.jpg`, keywords: ['beyonce', 'ugly', 'stupid', 'strong']},
    {id: 33, src: `img/34.jpg`, keywords: ['business cat', 'classic']},
    {id: 34, src: `img/35.jpg`, keywords: ['butthurt dweller', 'classic', 'nerd', 'fact']},
    {id: 35, src: `img/36.jpg`, keywords: ['chemistry cat', 'confused', 'animal']},
    {id: 36, src: `img/37.jpg`, keywords: ['college liberal', 'feminist', 'stupid']},
    {id: 37, src: `img/38.jpg`, keywords: ['conspiracy keanu', 'reeves', 'young']},
    {id: 38, src: `img/39.jpg`, keywords: ['dat ash', 'classic']},
    {id: 39, src: `img/40.jpg`, keywords: ['disaster girl', 'fire', 'badass']},
    {id: 40, src: `img/41.jpg`, keywords: ['drunk baby', 'british', 'funny']},
    {id: 41, src: `img/42.jpg`, keywords: ['dwight schrute', 'the office', 'fact']},
    {id: 42, src: `img/43.jpg`, keywords: ['facepalm', 'picard']},
    {id: 43, src: `img/44.jpg`, keywords: ['fap', 'classic']},
    {id: 44, src: `img/45.jpg`, keywords: ['forever alone', 'classic']},
    {id: 45, src: `img/46.jpg`, keywords: ['foul bachelor frog', 'classic']},
    {id: 46, src: `img/47.jpg`, keywords: ['freddie mercury', 'win']},
    {id: 47, src: `img/48.jpg`, keywords: ['futurama', 'fry', 'stupid', 'not sure if']},
    {id: 48, src: `img/49.jpg`, keywords: ['futurama', 'why not zoidberg']},
    {id: 49, src: `img/50.jpg`, keywords: ['good guy greg']},
    {id: 50, src: `img/51.jpg`, keywords: ['got a badass over here', 'neil degrasse tyson', 'nerd', 'fact']},
    {id: 51, src: `img/52.jpg`, keywords: ['grandma finds the internet', 'confused', 'stupid', 'old']},
    {id: 52, src: `img/53.jpg`, keywords: ['hawkward', 'classic']},
    {id: 53, src: `img/54.jpg`, keywords: ['high expectations asian father', 'classic']},
    {id: 54, src: `img/55.jpg`, keywords: ['joseph ducreux', 'old']},
    {id: 55, src: `img/56.jpg`, keywords: ['lame pun coon', 'classic']},
    {id: 56, src: `img/57.jpg`, keywords: ['lazy college senior']},
    {id: 57, src: `img/58.png`, keywords: ['confused', 'wtf', 'what the hell']},
    {id: 58, src: `img/59.jpg`, keywords: ['me gusta']},
    {id: 59, src: `img/60.jpg`, keywords: ['net noob', 'idiot']},
    {id: 60, src: `img/61.jpg`, keywords: ['oh god why', 'horror']},
    {id: 61, src: `img/62.jpg`, keywords: ['ordinary muslim man', 'classic']},
    {id: 62, src: `img/63.jpg`, keywords: ['paranoid parrot', 'classic']},
    {id: 63, src: `img/64.jpg`, keywords: ['philosoraptor', 'mind blown', 'fact', 'why']},
    {id: 64, src: `img/65.jpg`, keywords: ['photogenic guy', 'handsome']},
    {id: 65, src: `img/66.jpg`, keywords: ['red rage extreme', 'angry']},
    {id: 66, src: `img/67.jpg`, keywords: ['redditors wife', 'jealous', 'nerd', 'computer']},
    {id: 67, src: `img/68.jpg`, keywords: ['scumbag girl', 'bitch', 'stupid', 'hot']},
    {id: 68, src: `img/69.jpg`, keywords: ['scumbag steve', 'stupid']},
    {id: 69, src: `img/70.jpg`, keywords: ['seriously', 'wtf', 'what the hell']},
    {id: 70, src: `img/71.jpg`, keywords: ['sheltering suburban mom', 'bitch']},
    {id: 71, src: `img/72.jpg`, keywords: ['slowpoke', 'classic', 'slow', 'stupid']},
    {id: 72, src: `img/73.png`, keywords: ['so good', 'feeling', 'dat']},
    {id: 73, src: `img/74.jpg`, keywords: ['socially awesome penguin', 'classic']},
    {id: 74, src: `img/75.jpg`, keywords: ['socially awkward penguin', 'classic']},
    {id: 75, src: `img/76.jpg`, keywords: ['socially awkward awesome penguin', 'classic']},
    {id: 76, src: `img/77.jpg`, keywords: ['surprised gasp', 'omg', 'oh my god']},
    {id: 77, src: `img/78.jpg`, keywords: ['surprised wait', 'spiderman']},
    {id: 78, src: `img/79.jpg`, keywords: ['tech impaired duck', 'classic']},
    {id: 79, src: `img/80.jpg`, keywords: ['the most interesting man in the world', 'i dont always', 'when i do']},
    {id: 80, src: `img/81.jpg`, keywords: ['troll face backgrounded', 'classic']},
    {id: 81, src: `img/82.jpg`, keywords: ['true story', 'barny', 'how i met your mother']},
    {id: 82, src: `img/83.jpg`, keywords: ['whyyy backgrounded', 'why', 'classic']},
    {id: 83, src: `img/84.jpg`, keywords: ['x all the y', 'excited', 'idea']},
    {id: 84, src: `img/85.jpg`, keywords: ['y u no', 'crying']},
    {id: 85, src: `img/86.jpg`, keywords: ['yes this is dog', 'funny', 'cute']},
    {id: 86, src: `img/87.jpg`, keywords: ['yo dawg', 'xzibit']},
];
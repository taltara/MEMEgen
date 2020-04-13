'use strict';

const KEY = 'memeCollection';

// KONVA
var stage, layer;
var gLastTouchedTextId = -1;
var gLastTouchedText = null;
var gLastTouchedStickerId = -1;
var gLastTouchedSticker = null;
var gLastStickerTransformer = null;
var gMemePhotoHeight;
var gDraggedngSticker = false;
var gStickersEl;

function init() {

    getBaseMemeSrc(false);
    updateNavBarCurrent('gallery');
    updateNavBarCurrent('memes');
    updateNavBarCurrent('about');
    populateStickers();
    initKonva();
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    drawImg();
    initStickers();

    getAllMemeCollection();
    setTimeout(() => {

        document.querySelector('.edit-meme-section').classList.remove('opacity');
        initMemeTexts();
    }, 300);

}

function setTextSizeByScreen(canvasWidth) {

    var elTextInput = document.querySelector('.slider-input');

    updateFontSize(elTextInput, 0, Math.floor(canvasWidth / 16));
}


function initKonva() {

    var divider = (window.innerWidth > 1100) ? (1 / 2.2) : 0.8;

    var elEditMeme = document.querySelector('.edit-meme-section');
    elEditMeme.style.width = `${window.innerWidth * divider}px`;
    elEditMeme.style.height = `${window.innerWidth * divider}px`;

    Konva.pixelRatio = 1;
    stage = new Konva.Stage({
        container: 'canvas-container',
        width: window.innerWidth * divider,
        height: window.innerWidth * divider
    });

    layer = new Konva.Layer({
        x: 0,
        y: 0,
        width: stage.bufferCanvas

    });
    stage.add(layer);
}


function deleteTextNode() {

    if (!gTexts.length) return;

    var elToDelete;

    if (gLastTouchedTextId === -1) {

        elToDelete = gTexts.pop();

    } else {

        var textToDelete = gTexts.findIndex(function (text) {

            return text.textNode.attrs.id === gLastTouchedTextId;
        });
        console.log(textToDelete);

        elToDelete = gTexts.splice(textToDelete, 1);
        elToDelete = elToDelete[0];

        gLastTouchedTextId = -1;
    }

    elToDelete.tr.destroy();
    elToDelete.textNode.destroy();

    layer.draw();
}

function deleteSticker() {

    if (!gStickers.length) return;

    var elToDelete;

    if (gLastTouchedStickerId === -1) {

        elToDelete = gStickers.pop();

    } else {

        var stickerToDelete = gStickers.findIndex(function (sticker) {

            return sticker.stickerNode.attrs.id === gLastTouchedStickerId;
        });
        console.log(stickerToDelete);

        elToDelete = gStickers.splice(stickerToDelete, 1);
        elToDelete = elToDelete[0];

        gLastTouchedStickerId = -1;
    }

    elToDelete.tr.destroy();
    elToDelete.stickerNode.destroy();

    layer.draw();
}

function initStickers() {

    gStickersEl = new Siema({
        selector: '.siema',
        duration: 100,
        easing: 'cubic-bezier(.11,.73,.57,1.53)',
        perPage: 8,
        startIndex: 0,
        draggable: true,
        multipleDrag: true,
        threshold: 20,
        loop: false,
        rtl: false,
        onInit: () => { },
        onChange: () => { gDraggedngSticker = true },
    });
}

function addTextNode(initY = '') {

    var stageBox = stage.container().getBoundingClientRect();
    if (initY === 'bottom') setTextSizeByScreen(stageBox.width);

    var setX = stageBox.width / 2 - (stageBox.width * 0.9) / 2;
    var setY = stageBox.width / 2 - gFontSize / 2;

    let margin = (stageBox.width - gMemePhotoHeight) / 2;
    let edgeCorrection = margin - gFontSize;
    edgeCorrection = (edgeCorrection < 0) ? Math.abs(edgeCorrection * 1.2) : 0;

    if (initY === 'top') setY = margin - gFontSize + edgeCorrection;
    else if (initY === 'bottom') setY = margin + gMemePhotoHeight - edgeCorrection;

    var textNode = new Konva.Text({
        text: 'Some text here',
        id: gCount++,
        x: setX,
        y: setY,
        fontSize: gFontSize,
        fontFamily: 'Impact',
        draggable: true,
        width: stageBox.width * 0.9,
        align: gFontAlign,
        fill: gColorFill,
        stroke: gColorStroke,
        strokeWidth: (stageBox.width <= 500) ? 1.5 : 2.5,
        shadowColor: getRandomColor()
    });

    layer.add(textNode);

    var tr = new Konva.Transformer({
        node: textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        // set minimum width of text
        boundBoxFunc: function (oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
        }
    });


    textNode.on('transform', function () {
        // reset scale, so only with is changing by transformer
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1
        });
    });

    textNode.on('mousedown touchstart', function () {

        if (gLastTouchedText) {

            gLastTouchedText.shadowBlur(0);
            let textEl = findTrByTextNodeId(gLastTouchedText.attrs.id);
            if (textEl != undefined) textEl.tr.hide();
        }
        if (gLastStickerTransformer) gLastStickerTransformer.hide();
        textNode.shadowBlur(10);
        let textEl = findTrByTextNodeId(textNode.attrs.id);
        textEl.tr.show();

        layer.draw();
        gLastTouchedText = textNode;

        gLastTouchedTextId = textNode.attrs.id;

    });

    if (gLastTouchedText) {

        gLastTouchedText.shadowBlur(0);
        let textEl = findTrByTextNodeId(gLastTouchedText.attrs.id);
        if (textEl) textEl.tr.hide();
    }
    if (gLastStickerTransformer) gLastStickerTransformer.hide();
    textNode.shadowBlur(10);

    textNodeOnDClick(textNode, tr);
    gLastTouchedTextId = textNode.attrs.id;
    gLastTouchedText = textNode;

    gTexts.push({ textNode, tr });
    layer.add(tr);
    layer.draw();
}

function findTrByTextNodeId(id) {

    let textNodeTr = gTexts.find(text => {

        return text.textNode.attrs.id === id;
    });
    console.log(textNodeTr);

    return textNodeTr;
}

function textNodeOnDClick(textNode, tr) {

    textNode.on('dblclick dbltap', () => {
        // hide text node and transformer:
        textNode.hide();
        // tr.hide();
        layer.draw();

        var textPosition = textNode.absolutePosition();

        var stageBox = stage.container().getBoundingClientRect();

        var areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y
        };

        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        styleTextAreaOnDbClick(textarea, textNode, areaPosition);

        rotateTextAreaOnDbClick(textarea, textNode);

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            textNode.show();
            // tr.show();
            // tr.forceUpdate();
            layer.draw();
        }

        function setTextareaWidth(newWidth) {
            if (!newWidth) {
                // set width for placeholder
                newWidth = textNode.placeholder.length * textNode.fontSize();
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            );
            var isFirefox =
                navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth);
            }

            var isEdge =
                document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
                textNode.text(textarea.value);
                removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeTextarea();
            }
        });

        textarea.addEventListener('keydown', function (e) {
            var scale = textNode.getAbsoluteScale().x;
            setTextareaWidth(textNode.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height =
                textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
            if (e.target !== textarea) {
                textNode.text(textarea.value);
                removeTextarea();
            }
        }
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    });
}


function rotateTextAreaOnDbClick(textarea, textNode) {

    var rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;

    var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;
}

function styleTextAreaOnDbClick(textarea, textNode, areaPosition) {

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = 'black';
}

function initMemeTexts() {

    addTextNode('bottom');
    addTextNode('top');
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCanvas.style.backgroundColor = 'black';
    clearing = true;

    setTimeout(() => {
        gCanvas.style.backgroundColor = 'unset';

        setTimeout(() => {
            clearing = false;
        }, 300);
    }, 300);
}

function drawBackgroundColor(color = 'white') {

    var base = new Konva.Rect({
        x: 0,
        y: 0,
        width: gCanvas.width,
        height: gCanvas.height,
        fill: color,

    });
    // add the shape to the layer
    layer.add(base);
    layer.draw();
}


function getBaseMemeSrc(type = true) {

    var imgId = loadFromStorage(KEYm);
    // console.log(imgId);
    if (imgId === undefined || imgId === null) {

        window.location.href = "index.html";
    }

    if (type) {

        populateGGallery(true);
        var memeToDraw = gGallery.find(img => {

            return img.id === +imgId.id;
        });

        return memeToDraw.src;
    }
}


// draw img from local
function drawImg() {

    var img = new Image();

    let imgId = loadFromStorage(KEYm);
    if (imgId.type === 'external') {

        img.src = imgId.id;
        img.crossOrigin = "anonymous";
    } else {

        img.src = getBaseMemeSrc();
    }

    drawBackgroundColor();

    img.onload = () => {

        var newImageHeight = img.height;
        var newImageWidth = gCanvas.width;

        if (img.height > img.width) {

            newImageHeight = gCanvas.height;
            newImageWidth = img.width * (gCanvas.width / img.height);
        } else {

            if (img.width > gCanvas.width || img.width < gCanvas.width) {

                newImageHeight = img.height * (gCanvas.width / img.width);
            }

        }

        gMemePhotoHeight = newImageHeight;
        var konvaImg = new Konva.Image({
            x: Math.abs((gCanvas.width - newImageWidth) / 2),
            y: Math.abs((gCanvas.height - newImageHeight) / 2),
            image: img,
            width: newImageWidth,
            height: newImageHeight
        });

        // add the shape to the layer
        layer.add(konvaImg);
        layer.batchDraw();
    }

}


function fontColorTypeHandler(elBtn, type) {

    if (gFontColorType === type) return;

    gFontColorType = type;
    var otherBtn = (type === 'stroke') ? 'fill' : 'stroke';

    document.querySelector(`.${otherBtn}-color`).classList.remove('selected-setting');

    elBtn.classList.add('selected-setting');

    gFontColorType = type;

}


function setCurrentColor(newColor) {

    if (gFontColorType === 'stroke') {

        gColorStroke = newColor;
        document.querySelector('.stroke-color').style.backgroundColor = newColor;

    } else {

        gColorFill = newColor;
        document.querySelector('.fill-color').style.backgroundColor = newColor;
    }
}


function fontSizeInputHandler(newSize) {
    gFontSize = +newSize;
    updateLastTextSize();
}

function fontSizeHandler(elBtn, sign) {

    if (!elBtn.classList.contains('selected-setting')) {

        elBtn.classList.add('selected-setting');

        setTimeout(() => {

            elBtn.classList.remove('selected-setting');
        }, 200);
    }

    var elTextInput = document.querySelector('.slider-input');
    var diff = 0;

    if (sign === '+') {

        if (gFontSize === 100) return;

        diff = 1;

    } else {

        if (!gFontSize) return;

        diff = -1;
    }

    updateFontSize(elTextInput, diff);

    if (gLastTouchedTextId >= 0) {

        updateLastTextSize();
    }

}

function updateFontSize(elTextInput, diff, newVal = null) {

    if (!newVal) gFontSize += diff;
    else gFontSize = newVal;

    elTextInput.value = gFontSize;
}

function updateLastTextSize() {

    var currTextToResizeIdx = gTexts.findIndex(function (text) {

        return text.textNode.attrs.id === gLastTouchedTextId;
    });
    gTexts[currTextToResizeIdx].textNode.fontSize(gFontSize)
    layer.draw();
}

function fontAlignHandler(elBtn, direction) {


    if (gFontAlign === direction) return;

    gFontAlign = direction;

    if (gLastTouchedTextId >= 0) {

        var currTextToAlignIdx = gTexts.findIndex(function (text) {

            return text.textNode.attrs.id === gLastTouchedTextId;
        });
        gTexts[currTextToAlignIdx].textNode.align(gFontAlign)
        layer.draw();

    }

    var elAlignBtns = document.querySelectorAll('.text-align');

    elAlignBtns.forEach(btn => {

        btn.classList.remove('selected-setting');
    });

    elBtn.classList.add('selected-setting');
}


function setColorType(type) {

    gCurrColorWhich = type;
    var otherType = (gCurrColorWhich === 'line') ? 'fill' : 'line';
    document.querySelector(`.current-${gCurrColorWhich}-color`).classList.add('selected-color-type');
    document.querySelector(`.current-${otherType}-color`).classList.remove('selected-color-type');
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}


function setShape(shape) {

    gCurrShape = shape;
    var elNameInput = document.querySelector('.text-input');
    var elAfterInserter = document.querySelector('.draw-management');
    var htmlNameInput = '<input type="text" class="text-input" placeholder="Anything"></input>';

    if (shape === 'text') {

        if (!elNameInput) {

            elAfterInserter.insertAdjacentHTML('afterend', htmlNameInput);
            setTimeout(() => {

                document.querySelector('.text-input').classList.add('show-input');
            }, 10);
        }

    } else {

        if (elNameInput) {

            elNameInput.classList.remove('show-input');
            setTimeout(() => {
                elNameInput.remove();
            }, 300);
        }
    }
}

function setColor(color, event) {

    let elToolsSection = document.querySelector('.tools-section');
    if (!color) {
        event.preventDefault();
        let colorPicker = document.querySelector('.color-picker-random');
        colorPicker.value = getRandomColor();

        if (gCurrColorWhich === 'line') {

            gCurrColorLine = colorPicker.value;
            document.querySelector('.current-line-color').style.backgroundColor = colorPicker.value;
        }
        else {

            gCurrColorFill = colorPicker.value;
            document.querySelector('.current-fill-color').style.backgroundColor = colorPicker.value;
        }

        elToolsSection.style.backgroundColor = colorPicker.value;

    } else {

        if (gCurrColorWhich === 'line') {

            gCurrColorLine = color;
            document.querySelector('.current-line-color').style.backgroundColor = color;
        } else {

            gCurrColorFill = color;
            document.querySelector('.current-fill-color').style.backgroundColor = color;
        }

        if (gCurrColorWhich === 'fill') {

            elToolsSection.style.backgroundColor = color;

        } else {


            elToolsSection.style.boxShadow = `0px 5px 10px 0px ${color}`;
        }
    }

}

function prepareCanvasForShare(beforeOrAfter) {

    var allElements = layer.getChildren(function (element) {

        return element.getClassName() === 'Transformer';
    });

    console.log(allElements);


    allElements.forEach((element, i) => {

        if (beforeOrAfter === 'before') {
            element.hide();
            if (gLastTouchedText) gLastTouchedText.shadowBlur(0);
        } else {
            // element.show();
            if (gLastTouchedText) gLastTouchedText.shadowBlur(10);
        }
    });

    layer.draw();
}


function addStickerNode(imgSrc) {

    if (gDraggedngSticker) {

        gDraggedngSticker = false;
        return;
    }

    var stageBox = stage.container().getBoundingClientRect();

    Konva.Image.fromURL(imgSrc, function (stickerNode) {
        stickerNode.setAttrs({
            id: gCount++,
            x: stageBox.width / 2 - (stageBox.width * 0.9) / 2,
            y: stageBox.width / 2 - gFontSize / 2,
            scaleX: 0.25,
            scaleY: 0.25,
            draggable: true,
        });
        layer.add(stickerNode);

        var tr = new Konva.Transformer({
            node: stickerNode,
            // set minimum width of text
            boundBoxFunc: function (oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            }
        });

        stickerNode.on('mousedown touchstart', function () {

            onStickerMouseDown(stickerNode);
        });

        if (gLastStickerTransformer) {

            gLastStickerTransformer.hide();
        }
        gLastStickerTransformer = tr;

        if (gLastTouchedText) {

            gLastTouchedText.shadowBlur(0);
            let textEl = findTrByTextNodeId(gLastTouchedText.attrs.id);
            if (textEl != undefined) textEl.tr.hide();
        }

        gLastTouchedStickerId = stickerNode.attrs.id;
        gLastTouchedSticker = stickerNode;
        gStickers.push({ stickerNode, tr });
        layer.add(tr);
        layer.batchDraw();

    });
}

function onStickerMouseDown(stickerNode) {

    if (gLastStickerTransformer) gLastStickerTransformer.hide();
    if (gLastTouchedText) {

        gLastTouchedText.shadowBlur(0);
        let textEl = findTrByTextNodeId(gLastTouchedText.attrs.id);
        if (textEl != undefined) textEl.tr.hide();
    }

    var imageTransformers = layer.children.filter(child => {

        return (child.__proto__.className === 'Transformer' && child._node._id === stickerNode._id);
    });
    imageTransformers = imageTransformers[0];

    imageTransformers.show();
    gLastStickerTransformer = imageTransformers;
    gLastTouchedSticker = stickerNode;
    gLastTouchedStickerId = stickerNode.attrs.id;
}

function tutorialMemeCreator() {

    var elText = document.querySelector('.text-edit');
    var elTextTop = document.querySelector('.text-edit-top');
    var elTextMiddle = document.querySelector('.text-edit-middle');
    var elTextBottom = document.querySelector('.text-edit-lower');
    var elStickers = document.querySelector('.stickers-section');
    var elExport = document.querySelector('.export-buttons');
    var elButtons = document.querySelectorAll('.btn');
    var elMenu = document.querySelector('.nav-links');
    gStickersEl;


    setTimeout(() => {

        toggleMenu('exit');

        if (window.innerWidth <= 1297) elMenu.classList.remove('side-menu');

        if(window.innerWidth > 1100) elMenu.scrollIntoView();
        else document.querySelector('canvas').scrollIntoView();

        setTimeout(() => {

            document.body.classList.add('menu-open');

            setTimeout(() => {
                elText.style.zIndex = '6001';

                setTimeout(() => {
                    elTextTop.style.background = 'white';

                    setTimeout(() => {
                        elTextMiddle.style.background = 'white';

                        setTimeout(() => {
                            elTextBottom.style.background = 'white';

                            setTimeout(() => {
                                elStickers.style.zIndex = '6001';

                                setTimeout(() => {

                                    elStickers.style.transform = 'scale(1.1)';

                                    setTimeout(() => {
                                        gStickersEl.goTo(Math.floor(Math.random() * zStickerGallery.length + 10));

                                        setTimeout(() => {

                                            elExport.style.zIndex = '6001';

                                            setTimeout(() => {

                                                elButtons[0].style.transform = 'scale(1.1)';

                                                setTimeout(() => {
                                                    elButtons[0].style.transform = 'uset';
                                                    elButtons[1].style.transform = 'scale(1.1)';

                                                    setTimeout(() => {
                                                        elButtons[1].style.transform = 'uset';
                                                        elButtons[2].style.transform = 'scale(1.1)';

                                                        setTimeout(() => {
                                                            elButtons[2].style.transform = 'uset';

                                                            setTimeout(() => {
                                                                if (window.innerWidth <= 1297) elMenu.classList.add('side-menu');

                                                                document.body.classList.remove('menu-open');
                                                                elText.style.zIndex = 'unset';
                                                                elTextTop.style.background = elTextMiddle.style.background = elTextBottom.style.background = 'unset';
                                                                elStickers.style.zIndex = 'unset';
                                                                elStickers.style.transform = 'unset';
                                                                gStickersEl.goTo(0);
                                                                elExport.style.zIndex = 'unset';
                                                                toggleMenu('about');
                                                            }, 1000);
                                                        }, 500);
                                                    }, 500);
                                                }, 500);

                                            }, 500);
                                        }, 500);
                                    }, 500);

                                }, 300);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 200);
        }, 300);
    }, 300);
}


// setTimeout(() => {
//     if (window.innerWidth <= 1297) elMenu.classList.add('side-menu');

//     document.body.classList.remove('menu-open');
//     elExternalSection.style.zIndex = 'unset';
//     toggleMenu('about');
// }, 1000);
templateSettings =
{
    "ctor": "ExampleDefault",
    "scriptSource": "example_default.js",
    "background":
 {
     "type": { "id": "Image", "value": "image" },
     "image": "bg.jpg",
     "gradiant_start": "#555354",
     "gradiant_end": "#000"
 },
    "content": {
        "show": "true",
        "image":"cat.png"
    },
    "header":
    {
        "show": "true",
        "logo": "logo.png"
    },
    "game": {
        "show": "true",
        "images": [
            './images/promo1.png',
            './images/promo2.png',
            './images/promo3.png',
            './images/promo4.png',
            './images/promo5.png',
            './images/promo6.png',  
            './images/promo7.png',
            './images/promo8.png',
           
        ]
    }


};



function ExternalTemplate(settings) {
    var settings = templateSettings,
        gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)'),
        basePath = spotgamesUtils.getScriptPath(),
        isMobile = spotgamesUtils.isMobile.any(),
        touchStartEvent = "mousedown",
        touchEndEvent = "mouseup",
        touchMoveEvent = "mousemove",
        imagesLoaded = false,
        styleLoaded = false,
        isEngaged = false,
        thisgame = this,
        detectStylesInterval, mainWrapper, btn,
        gameContainer = settings.container,
        stylesAmount, imagesForPreload = [],
        attemptsLeft = 5,
        meta = '<meta name="viewport" content="user-scalable=no, initial-scale=1, width=device-width" />',
        style = 'body {font-family: "PT Sans", sans-serif; } .header { height: 80px; width: 100%; background:linear-gradient(top, #FFFFFF 0%, #e8e8e8 100%); /*W3C*/ background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #FFFFFF), color-stop(100%, #e8e8e8)); /*Chrome,Safari4+*/ } .header img { height: 40px; padding: 20px; } .square { float: left; width: 60px; height: 60px; margin-left: 8px; margin-bottom: 8px; transform-style: preserve-3d; transition: all 0.5s linear; } .square.active{transform: rotateY(180deg);} .face.front {background-color: #e8e8e8; } .face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 5px;}.face.back { display: block; transform: rotateY(180deg); box-sizing: border-box; background-size: cover;}.game_box {background-color: #f59a35;margin: 14px 20px;float:left;width: 88%;border-radius: 5px;padding-top: 8px;}.header_text {font-size: 26px;margin-top: 14px;}.footer_text {font-size: 24px;}.highlight {color: #f59a35;}#main-container{width: 320px; height: 100%; position: absolute; text-align: center;}#main-container.hide{visibility: hidden;}#cont-box{display: table; height: 80%; width: 100%;}#logo{height: 15%;}',
        html = getHeaders() + setHeader(settings.header) + '<div id="cont-box"> <div class="header_text">WIN AWESOME <span class="highlight">PRIZES</span></div> <div class="game_box">' + setGameHtml(settings.game) + '</div> <div class="footer_text">FIND THE MATCHING TILES WITHIN <span class="attempt_count highlight">'+ attemptsLeft +'</span> ATTEMPTS</div></div>'
        
        
        

    if (isMobile) {
        touchStartEvent = "touchstart";
        touchEndEvent = "touchend";
        touchMoveEvent = "touchmove";
    }

    /*first function that is called to template*/
    thisgame.init = function (preload) {
        if (html) {
            stylesAmount = document.styleSheets.length;
            document.head.innerHTML += meta;
            mainWrapper = document.createElement('div');
            mainWrapper.innerHTML += '<style>' + style + '</style>' + html;
            mainWrapper.className = "hide";
            mainWrapper.id = "main-container";
            gameContainer.appendChild(mainWrapper);
        }
        //preload is something decided in the editor,
        //if you need to preload content no mather what ignore this if statement
        if (preload == 'true') {
            detectStylesInterval = setInterval(function () {
                if (document.styleSheets.length > stylesAmount) {
                    clearInterval(detectStylesInterval);
                    styleLoaded = true;
                    if (imagesLoaded) {
                        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
                    }
                }
            }, 10);

            preloadImages(settings.game.images);

        }
        else {
            spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
        }
    };


    /*this function changes frames regarding what frame was requested*/
    thisgame.changeFrame = function (frame) {
        switch (frame) {
            case spotgames.frame_state.START_FRAME:
                return false;
            case spotgames.frame_state.PLAY_FRAME:
                break;
            case spotgames.frame_state.WIN_FRAME:
                return false;
            case spotgames.frame_state.LOSE_FRAME:
                return false;
        }
        spotgamesEventManager.dispatchEvent(spotgames.event_type.FRAME_CHANGED, thisgame.constructor.name);
    };

    thisgame.play = function () {
        mainWrapper.className = "";
        gameContainer.addEventListener(touchStartEvent, sendEngage, false);
        // btn = gameContainer.querySelector('#btn');
        // btn.addEventListener(touchEndEvent, requestRedirect, false);
        $(document).ready(function(){
        
        $(".square").click(function(){
                if($('.active').length < 2) {
                $(this).addClass('active')
                    
                        if($('.active').length >= 2) {
                            if($('.active').eq(0).data('id') == $('.active').eq(1).data('id')){
                                setTimeout(requestRedirect, 500)
                            } else {
                                setTimeout(function(){
                                    $('.active').removeClass('active')
                                    $('.attempt_count').html(--attemptsLeft)
                                    if(attemptsLeft == 0) {
                                        requestRedirect()
                                    }
                                }, 2000);

                            }
                        }
                
                }
            });
        });
    }

    function preloadBigImages() {
        var distinct = {};
        for (var i = 0; i < wheelItems.length; i++) {
            if (!distinct[wheelItems[i].win_item.image]) {
                var img = new Image();
                img.src = basePath + 'images/' + wheelItems[i].win_item.image;
                distinct[wheelItems[i].win_item.image] = true;
            }
        }
    }

    /*the usual image preloader function*/
    function preloadImages(images) {
        imagesAmount = images.length;
        for (var i = 0; i < images.length; i++) {
            var img = new Image();
            img.addEventListener('load', imageLoadedCallback, false);
            img.src = images[i];
        }
    }

    /*the usual style preload function*/
    function imageLoadedCallback() {
        if (++imagesAmount >= imagesForPreload.length) {
            imagesLoaded = true;
            if (styleLoaded) {
                spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
            }

        }
    }

    /*requests to change current frame */
    function requestPlayFrame() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.PLAY_FRAME_REQUESTED, thisgame.constructor.name);
    }

    /*requests to change current frame*/
    function requestWinFrame(link) {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_WIN, thisgame.constructor.name, { redirectUrl: link });
    }

    /*requests to change current frame*/
    function requestLoseFrame() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_LOSE, thisgame.constructor.name);
    }

    function requestRedirect() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.REDIRECT, thisgame.constructor.name);
    }

    function sendEngage() {
        gameContainer.addEventListener(touchStartEvent, sendEngage, false);
        console.log('is engaged');
        if (!isEngaged) {
            isEngaged = true;
            spotgamesEventManager.dispatchEvent(spotgames.event_type.ENGAGE_START, thisgame.constructor.name);
        }
    }

    function getCssValuePrefix(name, value) {
        var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
        var dom = document.createElement('div');
        for (var i = 0; i < prefixes.length; i++) {
            dom.style[name] = prefixes[i] + value;
            if (dom.style[name]) {
                return prefixes[i];
            }
            dom.style[name] = '';
        }
    }

    //add header content depending on settings
    function setHeader(stats) {
        var head = '';
        if (stats.show == 'true') {
            var img = basePath + 'images/' + stats.logo;
            head = '<div class="header"><img src="' +img+ '"/></div>';
        }
        return head;
    }
    
    //calculates marging from avaliable space
    function calculateMarginFromFreeSpace(boxHeightInPrecent,contentMaxHeight) {
        var allAviHeight = gameContainer.offsetHeight;
        var boxHeight = allAviHeight * boxHeightInPrecent;
        var contentHeight = boxHeight * contentMaxHeight;
        var freeSpace = boxHeight - contentHeight;
        return Math.floor(freeSpace/2) ;
    }

    function getHeaders() {
        return '<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic,700italic" rel="stylesheet" type="text/css">'
    }

function setGameHtml(stats) {
        var html = ''
        var images = stats.images.concat(stats.images)
        if (stats.show == 'true') {
            for(var i in images) {
                html += getSquare(basePath + images[i])
            }
        }
        return html;
    }

    function getSquare(image) {
        return '<div class="square" data-id="' + image + '"><div class="face front"></div><div class="face back" style="background-image:url(\'' + image + '\')"></div></div>'
    }
}
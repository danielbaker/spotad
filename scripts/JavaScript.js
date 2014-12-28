
//All variables and functions should be placed in one 'General' . It should start with a big letter(and be camel case) and receive settings as parameter.
function TemplateName(settings) { };

//You can get path to folder the script is stored in - by using
var basePath = spotgamesUtils.getScriptPath();

//All info you will need for template that comes from the user choice will be stored in settings parameter.
//for example if user chooses to set background image instead of color .You should check what type of background is chosen and set css accordingly 
//here is a short code examle
function myfunction(stats) {
    var bg = '';
    if (stats.type.value == "image") {
        bg = '#main-container{background-image:' + 'url(' + basePath + 'images/' + stats.image + ');}';
    }
    else {
        bg = '#main-container{background:' + gradientPrefix + 'linear-gradient(' + stats.gradiant_start + ', ' + stats.gradiant_end + ');}';
    }
    /*I'm returning result as string ,and later will atach it to style before appending*/
    return bg;
}
/*function would be called this way,passing the object of background settings for easier use*/
var bg = myfunction(settings.background);


//And check from what device (mobile/desktop)  user is viewing ad.
var isMobile = spotgamesUtils.isMobile.any();
var isIPhone = spotgamesUtils.isMobile.iOS();
var isAndroid = spotgamesUtils.isMobile.Android();
var isWindows = spotgamesUtils.isMobile.Windows();
var isOpera = spotgamesUtils.isMobile.Opera();
var isBlackbery = spotgamesUtils.isMobile.BlackBerry();


//Your Template should start from declaring necessary variables
var thisGame = this,
    style = 'insert your css here' + bg,
    html = 'insert your html here';


//Take in matter that you must also add basePath to path of your images,be it in css or html otherwise they wont load properly.
style = '#some-box{background-image:url(' + basePath + 'images/image.png);}';
html = '<img src="' + basePath + 'images/image.png"/>';



//All html and css should be appended to settings.container in thisGame.init function .Unless preload is a must you should check preload stored in setting .
var gameContainer = settings.container;
/*preload comes from settings choosed by the user */
thisGame.init = function (preload) {
    var mainWrapper = document.createElement('div');
    mainWrapper.innerHTML += '<style>' + style + '</style>' + html;
    mainWrapper.id = "some-id";
    gameContainer.appendChild(mainWrapper);
    if (preload == "true") {
        /*load game and styles*/
        //  ...
        /*wait when there loaded and dispatch init to framework*/
        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
    }
};


// Place this line of code on first user interaction
spotgamesEventManager.dispatchEvent(spotgames.event_type.ENGAGE_START, that.constructor.name);

// thisgame.changeFrame is designed to keep consistence . START_FRAME for displaying any popup messages,start signs etc., PLAY_FRAME for game itself ,WIN_FRAME/LOSE_FRAME
// for the functionality you want to place after PLAY_FRAME be it display of an product,image,text form etc. 

thisgame.changeFrame = function (frame) {
    /*this function changes frames regarding what frame was requested*/
    switch (frame) {
        case spotgames.frame_state.START_FRAME:
            return false;/*if you don't need  a frame place this line*/
        case spotgames.frame_state.PLAY_FRAME:
            someFunction();
            break;
        case spotgames.frame_state.WIN_FRAME:
            someFunction();
            break;
        case spotgames.frame_state.LOSE_FRAME:
            return false;
    }
    /*this line of code makes framework notice that frame has been changed*/
    spotgamesEventManager.dispatchEvent(spotgames.event_type.FRAME_CHANGED, thisgame.constructor.name);
};


// START_FRAME is the first frame to show after dispatching AD_INIT, so you don't need to call it manualy. But that is the only exception. For the current frame to change you need to request framework to do so. Frames are changed with the help of the code below . We also highly recommend to place these calls in functions, as shown in example, for easier use.
//example
/*requests to change current frame to PLAY_FRAME*/ 
function requestPlayFrame() { 
    spotgamesEventManager.dispatchEvent( spotgames.event_type.PLAY_FRAME_REQUESTED, thisgame.constructor.name); 
}; 
/*requests to change current frame to WIN_FRAME*/ 
function requestWinFrame() { 
    spotgamesEventManager.dispatchEvent( spotgames.event_type.AD_WIN, thisgame.constructor.name); 
}; 
/*requests to change current frame to LOSE_FRAME*/ 
function requestLoseFrame() { 
    spotgamesEventManager.dispatchEvent( spotgames.event_type.AD_LOSE, thisgame.constructor.name); 
}; 



//if you need to add redirecting after certain events (click on button/image  ,or after timeout etc.) use this
//the link is provided by framework so you don't need to vorry about it
spotgamesEventManager.dispatchEvent(spotgames.event_type.REDIRECT, thisgame.constructor.name);





/*--------------------Settings object---------------------------done*/


//Eile that contains settings is stored in ../temporary/settings folder and is called templateSettings.js
//Except for couple rules ,developer of template is the one that has control over setting content.
// for example 
/*settings are always placed in object named templateSettings*/
templateSettings =
{
    /* "ctor" is requiered and it's value must be the same name as 'General' function */
    "ctor": "TemplateName",
    /* "scriptSource" is also requiered and it's value must be the same name as javaScript file which contains all your functions */
    "scriptSource": "example_default.js",
    /*  ...more fields...*/
};

//you can store group of settings in subobjects as you please 
//example
templateSettings =
{
    "ctor": "TemplateName",
    "scriptSource": "example_default.js",
    "background":
    {
        /*background settings*/
    },
    "header":
    {
        /*header settings*/
    },
    "footer":
     {
         /*footer settings*/
     }
    /*etc*/
};


//all values are recived as strings ,so if you need to get number you must parse it
//example
templateSettings = {
    /* you recived timeout value as string*/
    "timeout":"2000",
}
/* later in your template file you take the value and parse it*/
var myVar = parseInt(settings.auto_start.timeout);


//boolean values also come as string so if you want to check ,for exapmle, if the logo needs to be hidden or not 
//example 
templateSettings =
{
    "ctor": "TemplateName",
    "scriptSource": "example_default.js",
    "header":
    {
        /*you can create subobject with the name of logo and place settings you will use */
        "logo": {
            "show": "true"
        }
        /*more fields*/
    }
};
/*and later in js file chech in code if you need to show it and react accordingly*/
if (settings.header.logo.show == 'true') {
    /*do something*/
}
else {
    /*do somthing else*/
}

//Value as object can be used to verify type of event/element/align/etc
//example.

/*In this example we are checking type of background . It can be image or color. You can later check what value was chosen and write your code accordingly.*/
"type": { "id": "Image", "value": "image" },
"type": { "id": "Color", "value": "color" },
/*In this example we are checking align for element . Later in your template file you can place it in elements style.*/
"type": { "id": "Left","value": "left" }, 
"type": { "id": "Center","value": "center" }, 
"type": { "id": "Right","value": "right" },


//Although most values are received as strings there are some tricks to them

/*color is received in Hex format*/
"color": "#555354"


/*image is always received as string with file name and is uploaded to images folder*/
/*note that there is no folder name before file name ,you must add that on your own*/
"logo": "logo.png"

/*text also is sent as string but is wrapped in span element and has some style atributes. If you need to style it diferently you will have to add "!important" after your style value. Otherwise it might be overridden*/ 
"text": " <span style='font-family: Ubuntu, sans-serif;color: #e10060;'>TEXT</span>",

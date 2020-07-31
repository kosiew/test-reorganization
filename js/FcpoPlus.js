// ==UserScript==
// @name         Bursa enhancements
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool for enhancing Blog RC
// @author       Siew "@xizun"
// @match        https://www.bursamalaysia.com/market_information/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const MONTH_INDEX = 5,
        WAIT_MILISECONDS = 600000,
        CHANGE_THRESHOLD = 40,
        NOTIFICATION_TITLE = 'FCPO Alert';

    const options = {
        DEBUG: true,
    };

    function dlog(message){
        if (options.DEBUG) {
            console.log(message);
        }
    }


    function jQueryIsLoaded() {
        return (typeof $== 'function');
    }

    function isJquery(elem) {
        return elem instanceof jQuery && elem.length > 0;
    }

    function addBorder(elem) {
        elem.css('border', '2px solid red');
    }

    //private scope and using $ without worry of conflict
    dlog('loading Bursa Plus');

function askNotificationPermission() {
    dlog('askNotificationPermission+');
    // function to actually ask the permissions
    function handlePermission(permission) {
      // Whatever the user answers, we make sure Chrome stores the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
}

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log("This browser does not support notifications.");
    } else {
      if(checkNotificationPromise()) {
        Notification.requestPermission()
        .then((permission) => {
          handlePermission(permission);
        })
      } else {
        Notification.requestPermission(function(permission) {
          handlePermission(permission);
        });
      }
    }
}
function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
}

function notify(message, title=NOTIFICATION_TITLE) {
    const notification = new Notification(title, {body: message});
}


    function monitorFcpo() {
        const selector = '.stock_change';
        const $e = $(selector).eq(MONTH_INDEX);
        const change = parseInt($e.text());
        const abs_change = Math.abs(change);
        if (abs_change > CHANGE_THRESHOLD) {
            const message = 'FCPO change is '.concat(change);
            notify(message);
        }
    }

    function testNotification() {
        const title = 'test';
        const text = 'HEY! Your task "' + title + '" is now overdue.';
        const notification = new Notification('To do list', {body: text});

    }
    
    
    $(function() {
        askNotificationPermission();
        monitorFcpo();
        setTimeout(
            () => {
                location.reload();
            },
            WAIT_MILISECONDS
        );
        // do something on document ready
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object



// store object
GM_setValue("MY_OBJECT_KEY", JSON.stringify(myObject));
// retrieve object
var myObject = JSON.parse(GM_getValue("MY_OBJECT_KEY", "{}"));

// redirect to new url
var link = document.URL.replace("domain.fr", "domain.com");
window.location.href = link;

// add button to execute function on page
var btn = document.createElement("button");
btn.innerHTML = "My button";
btn.onclick = () => {
    alert("My button clicked !");
    return false;
};
document.querySelector("btn_predecessor_selector").after(btn);

// append style to page
var css = "h1 { background: red; }"
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// fetch and parse external page
fetch("http://example.com/path-name")
.then(response => response.text())
.then(text => {
    var parser = new DOMParser();
    var htmlDocument = parser.parseFromString(text, "text/html");
    var content = htmlDocument.documentElement.querySelector("element_selector");
    alert("My fetched element content: " + content.textContent);
});






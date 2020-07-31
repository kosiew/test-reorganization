// ==UserScript==
// @name         Payment Admin Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool for enhancing Payment Admin
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/payments-admin/view-receipt.php?id=*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        WAIT_MILISECONDS:1000
    };
    
    function dlog(message){
        if (options.DEBUG) {
            console.log(message);
        }
    }
    
    function flashBorder(elem) {
        let style = {border: '3px solid blue'};
        elem.css(style);
    
        style = {border: ''};
        setTimeout(() => elem.css(style), options.WAIT_MILISECONDS);
    }

    function copyItemsToClipboard(items) {
        const WAIT_MILISECONDS_BETWEEN_COPY = 1000;
    
        $.each(items, function (indexInArray, valueOfElement) {
            setTimeout(
                () => {
                    dlog('copying '.concat(valueOfElement));
                    GM_setClipboard(valueOfElement);
                },
                WAIT_MILISECONDS_BETWEEN_COPY * (indexInArray + 1)
            );
        });
    }
    

    function flashBackground(s) {
        let originalColor = s.css('background-color');
        let style = {
            backgroundColor: 'yellow'
        };
        s.css(style);
    
        
        setTimeout(function () {
            s.css('background-color', originalColor);
        }, options.WAIT_MILISECONDS);
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
    dlog('loading Payment Admin Plus');
    
    const selector = '.user_detail';

    waitForKeyElements(
        selector, enableEasyCopy
    );

    function enableEasyCopy() {
        dlog('enableEasyCopy+');

        const $userDetail = $(selector);
        $userDetail.on('click', 
            () => {
                flashBorder($userDetail);
                const pattern = /(\S+)\s+\|\s+(\S+)/gm
                const text = $userDetail.text();

                const match = pattern.exec(text);
                const email = match[1];
                const site = match[2];

                copyItemsToClipboard([site, email]);
                dlog('copied '.concat(email));
            }
        );

    }

})(jQuery); //invoke nameless function and pass it the jQuery object


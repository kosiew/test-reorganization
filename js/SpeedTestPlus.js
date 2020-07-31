// ==UserScript==
// @name         Speedtest Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool for enhancing Speedtest 
// @author       Siew "@xizun"
// @match        http://speedtest.tm.com.my/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
    };
    const WAIT_INTERVAL = 1 * 60 * 1000;
    
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
    dlog('loading Speedtest Plus');

    const selector = '.speedtest-logo';
    // waitForKeyElements(
    //     selector, plus
    // );

    $(function() {
        dlog('setTimeout for pulse');
        setTimeout(
            pulse,
            WAIT_INTERVAL * .5
        );
        // do something on document ready
    }); // end ready

    function pulse(){
        dlog('pulse+');
        const $button = $('.button');
        dlog($button.length);
        $button.click();
        setTimeout(
            () => {
                location.reload();
            },
            WAIT_INTERVAL
        )
    }
    function _pulse() {
        dlog('pulse+');
        const loop = setInterval(
            () => {
                dlog('clicking Again');
                const $againButton = $('.share-button');
                $againButton.click();
            },
            WAIT_INTERVAL
        );
    }
    

    function plus() {
        dlog('plus+');

        const $button = $('<button>Pulse</button>');
        const $logo = $('.speedtest-logo');

        $logo.after($button);

        $button.on('click',
            () => {
                pulse();
            }
        )
    }

})(jQuery); //invoke nameless function and pass it the jQuery object





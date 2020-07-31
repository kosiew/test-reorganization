// ==UserScript==
// @name         HUD Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool for enhancing HUD
// @author       Siew "@xizun"
// @match        https://hud.happychat.io/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
    }
    
    function dlog(message){
        if (options.DEBUG) {
            console.log(message);
        }
    }
    
    function isJquery(elem) {
        return elem instanceof jQuery && elem.length > 0;
    }
    
    function addBorder(elem) {
        elem.css('border', '2px solid red');
    }
    
    //private scope and using $ without worry of conflict
    dlog('loading HUD Plus');
    
    let selector = '#app > div > div.chat > div.chat__chat-queue > div.action-bar > div';

    waitForKeyElements(
        selector, moveChat
    );

    function moveChat() {
        dlog('moveChat+');
        let $chat = $(selector);
                                  
        let recentChatSelector = '#app > div > div.chat > div.chat__chat-queue > div.chat-list > div:nth-child(2)';
        let $recentChat = $(recentChatSelector);

        dlog('check $chat '.concat(isJquery($chat), $chat.length));
        dlog('check $recentChat '.concat(isJquery($recentChat), $recentChat.length));
        $recentChat.before($chat);
    }

})(jQuery); //invoke nameless function and pass it the jQuery object

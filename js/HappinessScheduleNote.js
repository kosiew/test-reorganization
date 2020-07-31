// ==UserScript==
// @name         Happiness Schedule Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.0
// @description  Tool for enhancing Happiness Schedule
// @author       Siew "@xizun"
// @match        https://schedule.happy.tools/schedule
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_setValue
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        LOCAL_STORAGE_KEY: 'HSN-',
        NS: 'HSN-'
        STYLE: {
            NOTE_BACKGROUND_COLOR: '#fff59d',
            NOTE_TEXT_COLOR: '#2e4453',
            NOTE_WIDTH: '340px',
            NOTE_FONT_SIZE: '16px'
        },
    };

    const floatingNoteHtml = `
        <div class="${options.NS}note">
            <span id="${options.NS}message">..</span>
            <div class="${options.NS}note__container-inner">
                <textarea class="${options.NS}note__input" data-enable-grammarly="${options.USE_GRAMMARLY}"></textarea>
            </div>
        </div>
        `;
            
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
    dlog('loading Happiness Schedule Note');
    
    // Saves note data to browser's local storage
    function handleNoteSave(endDate, noteData) {
        const storedNoteIds = JSON.parse(localStorage.getItem(`${options.LOCAL_STORAGE_KEY}NOTES`));

        if (!storedNoteIds.hasOwnProperty(endDate)) {
            storedNoteIds[endDate] = noteData;
        } else {
            storedNoteIds[endDate].note = state.noteInputRef.value;
        }

    localStorage.setItem(`${options.LOCAL_STORAGE_KEY}chatIds`, JSON.stringify(storedNoteIds));
}
    
    let selector = '#app > div > div.chat > div.chat__chat-queue > div.action-bar > div';

    waitForKeyElements(
        selector, moveChat
    );

    function moveChat() {
        dlog('moveChat+');
    }

    const css = `
        <style type="text/css">

        .${options.NS}note {
            position: fixed;
            z-index: 9999;
            top: 0;
            right: -${options.STYLE.NOTE_WIDTH};
            height: 100%;
            width: ${options.STYLE.NOTE_WIDTH};
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: right .5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .${options.NS}note--is-visible {
            right: 0;
        }

        .${options.NS}note__container-inner {
            height: 95%;
            display: flex;
            flex-direction: column;
            box-shadow: 0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149);
        }

        .${options.NS}note__input {
            flex: 1;
            background: ${options.STYLE.NOTE_BACKGROUND_COLOR};
            color: ${options.STYLE.NOTE_TEXT_COLOR};
            font-size: ${options.STYLE.NOTE_FONT_SIZE};
            padding: 12px;
            resize: none;
            border: none;
            outline: none;
        }

        .${options.NS}note__controls {
            display: flex;
            background: ${options.STYLE.NOTE_BACKGROUND_COLOR};
        }

        .${options.NS}note__controls__control-container {
            width: 50%;
            padding: 8px 16px;
        }

        .${options.NS}note__controls__control {
            width: 100%;
            height: 100%;
        }
        </style>
        `;

GM_addStyle(css)

})(jQuery); //invoke nameless function and pass it the jQuery object



// ==UserScript==
// @name         Happiness Schedule Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.3
// @description  Tool for enhancing Happiness Schedule
// @author       Siew "@xizun"
// @match        https://schedule.happy.tools/schedule
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        PURGE_MINUTES: 1,
        USE_NOTES: true,
        PURGE_DAYS_AGO: 180,
        NS: 'ZSCHEDULE-',
        NOTE_KEY: 'HSN-NOTES',
        STYLE: {
            NOTE_BACKGROUND_COLOR: '#fff59d',
            NOTE_TEXT_COLOR: '#2e4453',
            NOTE_WIDTH: '340px',
            NOTE_FONT_SIZE: '16px'
        },
    };
    const noteHtml = `
        <div id = "${options.NS}container" class="${options.NS}container">
            <div id="${options.NS}textbox" class="${options.NS}textbox">
                <div id="${options.NS}message">..</div>
                <textarea id="${options.NS}note" class="${options.NS}note"></textarea>
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
    dlog('loading Happiness Schedule Plus');

    var previousEndDateString = '';
    var notes;
    var yearElem;
    var $weekNumberElem;
    var $message;
    var $note;
    var $noteContainer;
    var previousNote = '';
    const INTERVAL = 2000;
    const SCHEDULE_HREF = 'https://schedule.happy.tools/schedule';

    function getWeekNumber(dateString) {
        dlog('getWeekNumber '.concat(dateString));
        let d = new Date(dateString);
        d.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        // January 4 is always in week 1.
        let week1 = new Date(d.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        result = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000
                            - 3 + (week1.getDay() + 6) % 7) / 7);
        dlog(result);

        return result;
    }

    function getEndDateString() {
        let endDateElem = $('span', '.date-navigator__date').eq(1);
        let endDateString = endDateElem.text().slice(0, -2);
        let yearString = yearElem.text();
        endDateString = endDateString.concat(yearString);
        return endDateString;
    }

    function appendWeekNumber() {
        dlog('appendWeekNumber+');
        let endDateString = getEndDateString();
        dlog('previousEndDateString '.concat(previousEndDateString, " and endDateString ", endDateString));
        if (previousEndDateString != endDateString) {
            changeDate(endDateString);
        }
    }

    function changeDate(endDateString) {
        let weekNumber = getWeekNumber(endDateString);

        $weekNumberElem.text(" week ".concat(weekNumber));
        changeNote(endDateString);
        saveNotes();
        previousEndDateString = endDateString;

    }
    function changeNote(endDateString) {
        if (options.USE_NOTES) {
            dlog('changeNote+'.concat(endDateString));
            let dateNote = getNote(endDateString);
            $note.val(dateNote);
        }
    }

    function getNote(endDateString) {
        let dateNote = notes[endDateString];

        if (dateNote != undefined && dateNote.length > 0) {
            notes[endDateString] = dateNote;
        }
        return dateNote;
    }


    function getNotes() {
        dlog('getNotes+');
        let d = GM_getValue(options.NOTE_KEY);
        if (d == undefined) {
            d = {};
        }
        dlog(d);

        return d;
    }

    function saveNotes() {
        if (options.USE_NOTES) {
            dlog('saveNotes+')
            let endDateString = getEndDateString();
            let note = $note.val();
            if (endDateString == previousEndDateString) {
                if (note != previousNote) {
                    notes[endDateString] = note;
                    GM_setValue(options.NOTE_KEY, notes);
                }
                $message.text('Saved');
            }
            previousNote = note;
            dlog('note = '.concat(note));
        }
    }

    function purgeOldNotes() {
        if (options.USE_NOTES) {
            dlog('purgeOldNotes+');
            const daySeconds = 86400000;
            let today = new Date();
            $.each(notes, function (dateString, valueOfElement) {
                let d = Date.parse(dateString);
                dlog('checking '.concat(dateString, ' ', valueOfElement));
                let daysAgo = today - d;
                if (valueOfElement.length == 0 || daysAgo > options.PURGE_DAYS_AGO * daySeconds) {
                    delete notes[dateString];
                    dlog('deleted '.concat(dateString));
                }
            });
            GM_setValue(options.NOTE_KEY, notes);
            $message.text('Purged old notes');
        }
    }

    function checkHref() {
        dlog('checkHref+');
        let href = window.location.href;
        if (href != SCHEDULE_HREF) {
            $noteContainer.hide();
            $weekNumberElem.hide('slow');
        } else {
            $noteContainer.show();
            $weekNumberElem.show();
        }
    }

    function initialChange() {
        dlog('initialChange+');

        dlog('jQuery version:'.concat($().jquery));
        yearElem = $('.date-navigator__year').eq(0);
        $weekNumberElem = $('<span> week .. </span>');

        dlog('weekNumberElem isJquery:'.concat(isJquery($weekNumberElem)));
        dlog('yearElem isJquery:'.concat(isJquery(yearElem)));
        yearElem.after($weekNumberElem);

        setInterval(appendWeekNumber, INTERVAL);
        notes = getNotes();

        showNote();

        const messageId = `#${options.NS}message`;
        $message = $(messageId);
        const noteId = `#${options.NS}note`;
        $note = $(noteId);
        const noteContainerId = `#${options.NS}container`;
        $noteContainer = $(noteContainerId);

        $note.on('change paste keyup', function() {
            $message.text('.....');
            setTimeout(saveNotes, INTERVAL);
        });

        // setInterval(checkHref, INTERVAL);
        setTimeout(purgeOldNotes, options.PURGE_MINUTES * 60 * 1000);
        dlog('initialChange-');
    }

    waitForKeyElements(
        ".date-navigator__year", initialChange
    );

    const css = `
        <style type="text/css">

        .${options.NS}container {
            position: relative;
            top: 10px;
            width: 500px;
            height: 500px;
            background: black;
            color: white;
        }
        .${options.NS}textbox {
            position: absolute;
            z-index: 9;
            top: 500px;
            left: 275px;
            opacity: 0.9;
            height: 180px;
            width: 800px;
            color: blue;
        }

        .${options.NS}note {
            background: ${options.STYLE.NOTE_BACKGROUND_COLOR};
            color: ${options.STYLE.NOTE_TEXT_COLOR};
            font-size: ${options.STYLE.NOTE_FONT_SIZE};
            padding: 12px;
            height: 180px;
            resize: none;
            border: none;
            outline: none;
            box-shadow: 5px 5px 7px rgba(33, 33, 33, .7);
        }

        </style>
        `;

    GM_addStyle(css)

    function showNote() {
        if (options.USE_NOTES) {
            dlog('showNote+');
            let $b = $('body');
            $b.append(noteHtml);
        }
    }

})(jQuery); //invoke nameless function and pass it the jQuery object



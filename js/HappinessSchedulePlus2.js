// ==UserScript==
// @name         Happiness Schedule Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.0
// @description  Tool for enhancing Happiness Schedule
// @author       Siew "@xizun"
// @match        https://schedule.happy.tools/schedule
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
    }
    
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
    
    var previousFirstMondayString = '';
    var yearElem;
    var weekNumberElem;
    const interval = 2000;
    
    
    
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
    
    
    function appendWeekNumber() {
    
            
        dlog('appendWeekNumber+');
        let startDateElem = $('span', '.date-navigator__date').eq(0);
        let startDateString = startDateElem.text().slice(0, -2);
        dlog('previousFirstMondayString '.concat(previousFirstMondayString, " and startDateString ", startDateString));
        if (previousFirstMondayString != startDateString) {
    
            let yearString = yearElem.text();
    
            let dateString = startDateString.concat(yearString);
            let weekNumber = getWeekNumber(dateString);
    
            weekNumberElem.text(" week ".concat(weekNumber));
            previousFirstMondayString = startDateString;
        }
    }
    
    
    
    
    
    
    function initialChange() {
        dlog('initialChange+');

        dlog('jQuery version:'.concat($().jquery));
        yearElem = $('.date-navigator__year').eq(0);
        weekNumberElem = $('<span> week .. </span>');

        dlog('weekNumberElem isJquery:'.concat(isJquery(weekNumberElem)));
        dlog('yearElem isJquery:'.concat(isJquery(yearElem)));
        yearElem.after(weekNumberElem);
        
        setInterval(appendWeekNumber, interval);
        dlog('initialChange-');
    }
    
    waitForKeyElements(
        ".date-navigator__year", initialChange
    );
    
    
})(jQuery); //invoke nameless function and pass it the jQuery object
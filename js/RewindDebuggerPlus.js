// ==UserScript==
// @name         Rewind Debugger Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool for enhancing Rewind Debugger
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/rewind/debugger.php*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        OFFSET: 30,
        WAIT_MILISECONDS: 2000
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
    dlog('loading Rewind Debugger Plus');
    
    const SECTIONS = [
        'health',
        'credentials',
        'backups',
        'live-backup-events',
        'restores',
        'threats',
        'errors'
      ]
      
      
    let selector = '#fixed-nav > p:nth-child(3) > strong:nth-child(1)';
      

    $(function() {
        // addJumps();
        addAnimatedMenu(SECTIONS);
    }); // end ready

    function flashBorder(elem) {
        let style = {border: '3px solid blue'};
        elem.css(style);

        style = {border: ''};
        setTimeout(() => elem.css(style), options.WAIT_MILISECONDS);
    }

    function addJumps() {
        dlog('addJumps+');

        let aElems = [];
    
        $.each(SECTIONS, function (index, value) { 
            let aString = '<a href="#'.concat(value, '">', value, '</a>');
            aElems.push(aString);
        });
    
        let aElemsString = aElems.join(' | ');
    
        let html = '<strong>Sections: </strong>'.concat(aElemsString, '<br>');
          
        let $wpcomToolsLabel = $(selector);
        $wpcomToolsLabel.before(html);  
    }

    function scrollToAnchor(aid){
        var aTag = $("#"+ aid);
        $('html,body').animate({scrollTop: aTag.offset().top - options.OFFSET},'slow');
        flashBorder(aTag);
    }
    
    function addAnimatedMenu(sections){
        dlog('addAnimatedMenu+');
        let aElems = [];
        $.each(sections, function (index, value) { 
            // if (!isJquery($target)) {
            //     return false;
            // }
            let aString = '<a href="#'.concat(value, '">', value, '</a>');
            let $aElem = $(aString);
            $aElem.click(function() {
                scrollToAnchor(value);
            })
            aElems.push($aElem);
        });

        let html;
        html = '<div><strong>Sections: </strong></div>';
        let $sections = $(html);
        let firstTime = true;
        let separator = ' | ';
        dlog('aElems.length = '.concat(aElems.length));
        $.each(aElems, function (index, value) { 
            if (!firstTime) {
                $sections.append(separator);
            } else {
                firstTime = false;
            }
            $sections.append(value);
        });
        // $sections.append('<br>')
        let $wpcomToolsLabel = $(selector);
        $wpcomToolsLabel.before($sections);  

    }


})(jQuery); //invoke nameless function and pass it the jQuery object


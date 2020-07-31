// ==UserScript==
// @name         Zendesk Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.1
// @description  Tool for enhancing Zendesk
// @author       Siew "@xizun"
// @match        https://woothemes.zendesk.com/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        STAY_ON_TICKET: true,
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

    function flashBackground(s) {
        let style = {
            backgroundColor: 'yellow'
        };
        s.css(style);
    
        let revertStyle = {
            backgroundColor: 'initial'
        };
        
        setTimeout(function () {
            s.css(revertStyle);
        }, options.WAIT_MILISECONDS);
    }
    
    function css(s, style){
        s.css(style);
    }

    function select(s) {
        s.select();
        s.get(0).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        flashBackground(s);
    }

    function stayOnTicket() {
        dlog('stayOnTicket');
        const $stay = $('.post-save-actions .dropdown-container ul.dropdown-menu a:contains(Stay on ticket)');
        addBorder($stay);
        dlog(`stay.length = ${$stay.length}`);
        $stay.click();
    }


    //private scope and using $ without worry of conflict
    dlog('loading Zendesk Plus');
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'z') {
          const $v  = $("label:contains('Private Note')");
          const $s = $v.next();
          select($s)
        } else if (event.ctrlKey && event.key === 'x') {
            const $f = $('.comment_input_wrapper .content .ember-view.body textarea.ember-view');
            const $mf = $f.eq(0);
            select($mf);
        }
      });

    $(function() {
        setTimeout(
            stayOnTicket,
            5000
        )
        // do something on document ready
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object



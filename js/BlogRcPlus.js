// ==UserScript==
// @name         Blog RC Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.01
// @description  Tool for enhancing Blog RC
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/tools/reportcard/blog/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        OFFSET: 200,
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

    function copyUrl() {
        const url = window.location.href;
        GM_setClipboard(url);
    }
    
    //private scope and using $ without worry of conflict
    dlog('loading Blog RC Plus');
    
    const SIMPLE_SITE_SECTIONS = {
        'top': 'h3:contains(Blog Info)',
        'statistics': 'h4:contains(Statistics)',
        'internal_notes': 'span:contains(Internal Notes)',
        'blog_users': 'h3:contains(Blog Users)',
        'atomic_site_info': 'h3:contains(Atomic Site Info)',
        'blog_stickers': 'h3:contains(Blog Stickers)',
        'headstart': 'h3:contains(Headstart Site)',
        'importer_settings': 'h3:contains(Importer settings)',
        'audit_trail': 'h3:contains(Audit Trail)',
        'publicize': 'h3:contains(Publicize)',
        'links': 'h3:contains(Links)',
        'subscription_cache_check': 'h3:contains(Subscription Cache Check)',
        'blocked_referrers': 'h3:contains(Blocked Referrers)'
    };
    const ATOMIC_SECTIONS = {
        'themes': 'h4:contains(Themes)',
        'gutenframe': 'h3:contains(Gutenframe)',
        'site-info__tools-list': '#site-info__tools-list',
        'plugins': 'h4:contains(Plugins)',
        'modules': 'h4:contains(Modules)'
    }



    function plus(){
        addStyle();
        let isAtomic = checkIsAtomic();
        copyNodes(isAtomic);
        addJumps(isAtomic);
        addCopySiteNameButton();
    }

    function addStyle() {
        let css = `.reportcard__sticky-head {
            height: 140px;
            }
            `;
        let style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);        

    }

    function checkIsAtomic() {
        let selector = ATOMIC_SECTIONS['plugins'];
        let $s = $(selector);

        if ($s.length > 0) {
            return true;
        }
        return false;
    }

    function copyNodes(isAtomic) {
        if (!isAtomic) {return false}

        const id = "site-info__tools-list";
        let tools = document.getElementById(id);

        if (typeof tools !== 'undefined') {
            let toolsClone = tools.cloneNode(true);
            toolsClone.id = "sitei-info__tools-list-clone";

            let reportCardbox = document.getElementsByClassName("reportcard-box-inside")[0];
            let reportCardboxFirstItem = reportCardbox.firstElementChild;

            reportCardbox.insertBefore(toolsClone, reportCardboxFirstItem);
        }

    };

    function addJumps(isAtomic) {
        addIds(SIMPLE_SITE_SECTIONS);
        addAnimatedMenu(SIMPLE_SITE_SECTIONS, 'Sections');
        if (isAtomic) {
            addIds(ATOMIC_SECTIONS);
            addAnimatedMenu(ATOMIC_SECTIONS, 'AT');
        }
    }

    function addIds(sections){
        let $item;
        $.each(sections, function (index, value) { 
            dlog('addId-'.concat(value));
            $item = $(value);
            if (isJquery($item)) {
                let id = $item.attr('id');
                if (id == undefined) {
                    dlog('setting '.concat(value, ' id to ', index));
                    $item.attr('id', index);
                }
            } else {
                dlog(value.concat(' not found'));
            }
        });
    }
    
    function addMenu(sections){
        dlog('addMenu+');
        let aElems = [];
        $.each(sections, function (index, value) { 
            let aString = '<a href="#'.concat(index, '">', index, '</a>');
            aElems.push(aString);
        });
        let aElemsString = aElems.join(' | ');

        let html;
        html = '<div class="navbar"><span>Sections: </span>'.concat(aElemsString, '</div>');
        // html = '<strong>Sections: </strong>'.concat(aElemsString, '<br>');

        let $selector;
        // const SELECTORS = [
        //     '#junk > div.mc-postbox.results-box',
        //     '#reportcard__sticky-head > h3 > span.reportcard__sticky-head_blog-id'
        // ]
        const SELECTORS = [
             '#reportcard__sticky-head > h3 > span.reportcard__sticky-head_blog-id'
        ]
        $.each(SELECTORS, function (index, value) { 
            $selector = $(value);    
            $selector.before(html);
        });
    }

    function flashBorder(elem) {
        let style = {border: '3px solid blue'};
        elem.css(style);

        style = {border: ''};
        setTimeout(() => elem.css(style), options.WAIT_MILISECONDS);
    }

    function scrollToAnchor(aid){
        let aTag = $("#"+ aid);
        let top = aTag.offset().top - options.OFFSET;
        $('html,body').animate({scrollTop: top}, 'slow', flashBorder(aTag));

        // flashBorder(aTag);
    }
    
    function addAnimatedMenu(sections, label){
        dlog('addAnimatedMenu+');
        let aElems = [];
        $.each(sections, function (index, value) { 
            let id = '#'.concat(index);
            let $target = $(id);
            if (isJquery($target)) {
                let aString = '<a href="#'.concat(index, '">', index, '</a>');
                let $aElem = $(aString);
                $aElem.click(function() {
                    scrollToAnchor(index);
                })
                aElems.push($aElem);
            }
        });

        let html;
        html = '<div class="navbar"><span>'.concat(label, ': ', '</span></div>');
        let $sections = $(html);
        let firstTime = true;
        let separator = ' | ';
        $.each(aElems, function (index, value) { 
            if (!firstTime) {
                $sections.append(separator);
            } else {
                firstTime = false;
            }
            $sections.append(value);
        });

        let $selector;
        const SELECTORS = [
             '#reportcard__sticky-head > h3 > span.reportcard__sticky-head_blog-id'
        ]
        $.each(SELECTORS, function (index, value) { 
            $selector = $(value);    
            $selector.before($sections);
        });
    }

    function addCopySiteNameButton() {
        dlog('addCopySiteNameButton+');

        let $domain = $('#reportcard__sticky-head > h3 > a'); 

        let $copyButton = $('<button>Copy Site Name</button>');

        $domain.after($copyButton);

        $copyButton.on('click', () => {
            GM_setClipboard($domain.text());
            flashBorder($domain);
        }
        );
    }

    waitForKeyElements(
        "div.stickers_widget", plus
    );

    $(function() {
        copyUrl();
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object


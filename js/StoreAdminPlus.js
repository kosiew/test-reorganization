// ==UserScript==
// @name         Store Admin Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.1
// @description  Tool for enhancing Store Admin
// @author       Siew "@xizun"
// @match        https://wordpress.com/wp-admin/network/admin.php?page=store-admin*
// @grant        GM_setClipboard
// @grant        GM_log
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const WAIT_MILISECONDS = 2000,
        EASY_COPY = true,
        DEBUG = true,
        WAIT_MILISECONDS_BETWEEN_COPY = 500,
        ATOMIC_DIV = '#wpbody-content > div.wrap > div.site.atomic',
        SITE_DIV = '#wpbody-content > div.wrap > div.site',
        MONTHS = [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September',
            'October', 'November', 'December'
            ];



    function dlog(message){
        if (DEBUG) {
            GM_log(message);
        }
    }

    function isJquery(elem) {
        return elem instanceof jQuery;
    }

    function flashBackground(s) {
        let originalColor = s.css('background-color');
        let style = {
            backgroundColor: 'yellow'
        };
        s.css(style);


        setTimeout(function () {
            s.css('background-color', originalColor);
        }, WAIT_MILISECONDS);
    }





    function getBlogId(href){
        let values = href.split('=');
        let blogId = values[1]
        return blogId;

    }

    function _changeButtonsOpenNewTab(elem) {
        dlog('_changeButtonsOpenNewTab+');
        let linksElem = elem.find('a');
        linksElem.each( function(index) {
            $(this).attr('target', '_blank');
        });
    }

    function changeButtonsOpenNewTab() {
        dlog('changeButtonsOpenNewTab+');
        let siteDivs = $(SITE_DIV);

        let elems = []
        siteDivs.each( function(index) {
            let siteInfoElem = $(this).find('div:nth-child(1)');
            let domainInfoElem = $(this).find('.domain-info');

            elems.push(siteInfoElem);
            elems.push(domainInfoElem);

        });
        let otherUsersSubscriptions = $('.site.other-users-subscriptions');
        elems.push(otherUsersSubscriptions);

        $.each(elems, function (index, elem) {
            _changeButtonsOpenNewTab(elem);
        });
    }

    function addBlogIdButtons(label, url_prefix) {
        dlog('addBlogIdButtons+');
        let atomicDivs = $(ATOMIC_DIV);

        atomicDivs.each( function (index) {
            let blogRcButton = $(this).find('span:nth-child(2) > a:nth-child(3)');
            let button = blogRcButton.clone();
            button.text(label);
            let href = blogRcButton.attr('href');
            let blogId = getBlogId(href);

            button.attr('href', url_prefix.concat(blogId));
            button.css('color', 'red');
            blogRcButton.after(button);
        });
    }



    function addRevertButtons() {
        dlog('addRevertButtons+');
        addBlogIdButtons('Revert site',
            'https://mc.a8c.com/automated-transfer/revert.php?blog_id=');
    }

    function addRewindDebuggerButtons() {
        dlog('addRewindDebuggerButtons+');
        addBlogIdButtons('Rewind Debugger',
            'https://mc.a8c.com/rewind/debugger.php?site=');

    }
    function _addClickCopy(collection, maxWords) {
        $.each(collection, function (indexInArray, valueOfElement) {
            let $this = $(this);
            $this.on('click', function() {
                dlog('click username');
                flashBackground($this);
                let val = $this.text();

                if (val.length > 0) {
                    let words = val.match(/\w+/g);
                    if (words.length > 0) {
                        let _words = words.slice(0, maxWords);
                        $.each(_words, function (indexInArray, valueOfElement) {
                            dlog('word '.concat(indexInArray, ' ', valueOfElement));
                            setTimeout(() =>
                                _GM_setClipboard(valueOfElement),
                                WAIT_MILISECONDS_BETWEEN_COPY*indexInArray);
                        });
                    }
                }
            });
        });
    }


    function _addFocusCopy(collection, copyDate) {
        $.each(collection, function (indexInArray, valueOfElement) {
            let $this = $(this);
            $this.on('focus', function() {
                flashBackground($this);
                let val = $this.val();
                if (val.length > 0) {
                    _GM_setClipboard(val);
                    if (copyDate) {
                        let dateString = formatToDateString(val);
                        // wait between copying to clipboard so that it registers in clipboard history
                        setTimeout(() => _GM_setClipboard(dateString), WAIT_MILISECONDS_BETWEEN_COPY);
                    }
                }
            });
        });
    }


    function strip(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function monthNumToName(monthnum) {
        return MONTHS[monthnum - 1] || '';
    }

    function formatToDateString(argument) {
        let items = argument.split('-');
        let yearNumber = items[0];
        let monthNumber = items[1];
        let dayNumber = items[2];

        let monthString = monthNumToName(parseInt(monthNumber));

        let result = dayNumber + ' ' + monthString + ', ';
        result += yearNumber;
        return result;
    }

    function _GM_setClipboard(val) {
        dlog('_GM_setClipboard '.concat(val));
        GM_setClipboard(val);
    }

    function copyUrl() {
        const url = window.location.href;
        GM_setClipboard(url);
    }

    function addAutoCopy() {
        if (EASY_COPY) {
            const selectors = ['input.selectable-text__input', 'input[name="expires_date"]', 
                'input[name="subscribe_date"]', 'input[name="domain"]'];
            const dateSelectors = ['input[name="expires_date"]'];

            $.each(selectors, function (indexInArray, valueOfElement) {
                dlog('_addAutoCopy '.concat(valueOfElement));
                 let $e = $(valueOfElement);
                 let copyDate = false;
                 if (dateSelectors.includes(valueOfElement)) {
                     copyDate = true;
                 }
                 _addFocusCopy($e, copyDate);
            });

            const click_selectors = ['.user-details-header'];
            $.each(click_selectors, function (indexInArray, valueOfElement) {
                dlog('_addClickCopy '.concat(valueOfElement));
                let $e = $(valueOfElement);
                _addClickCopy($e, 3);

            });

        }
    }

    
    // Ready
    $(function() {
        changeButtonsOpenNewTab();
        addRevertButtons();
        addRewindDebuggerButtons();
        addAutoCopy();
        copyUrl();
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object
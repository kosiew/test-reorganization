// ==UserScript==
// @name         DARC Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.0
// @description  Tool for enhancing DARC
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/tools/reportcard/domain/?domain=*
// @grant        GM_setClipboard
// @grant        GM_log
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const WAIT_MILISECONDS = 2000,
        EASY_COPY = true,
        VAL = 'VAL',
        TEXT = 'TEXT',
        DEBUG = true,
        WAIT_MILISECONDS_BETWEEN_COPY = 500,
        MONTHS = [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September',
            'October', 'November', 'December'
            ];
    
    let lastFlashElement;
    let addedAutoCopy = false;


    function dlog(message){
        if (DEBUG) {
            GM_log(message);
        }
    }

    function isJquery(elem) {
        return elem instanceof jQuery;
    }

    function flashBackground(s) {
        dlog('flashBackround+');
        if (s === lastFlashElement) {
            return false;
        }
        lastFlashElement = s;

        const originalColor = s.css('background-color');
        const style = {
            backgroundColor: 'yellow'
        };
        s.css(style);

        setTimeout(function () {
            dlog('resetting background color to '.concat(originalColor));
            s.css('background-color', originalColor);
        }, WAIT_MILISECONDS);
        
    }

    function copyUrl() {
        const url = window.location.href;
        GM_setClipboard(url);
    }

    function _addCopy(collection, selector_type) {
        dlog('_addFocusCopy+');
        dlog('collection.length = '.concat(collection.length));
        $.each(collection, function (indexInArray, valueOfElement) {
            dlog('_addFocusCopy '.concat(indexInArray));
            const $this = $(this);
            const val = [];
            let e = 'focus';

            if (selector_type == TEXT) {
                e = 'click';
            }

            $this.on(e, function() {
                dlog('on '.concat(' ', e, ' copying to clipboard ..'));
                dlog('selector_type '.concat(' ', selector_type));
                dlog(e.concat(' flashBackground'));
                flashBackground($this);
                event.stopPropagation();

                const children = $this.find('*');
                dlog('children.length = '.concat(children.length));
                switch (selector_type) {
                    case VAL:
                        const _val = $this.val();
                        val.push(_val);
                        dlog(`copying ${selector_type} ${_val}`);
                        break;
                    case TEXT:
                        if (children.length > 0) {
                            $.each(children, function (indexInArray, valueOfElement) { 
                                const $elem = $(valueOfElement);
                                const _val = $elem.text();
                                dlog(`copying ${selector_type} ${_val}`);
                                val.push(_val);     
                            }); 
                        } else {
                            const _val = $this.text();
                            val.push(_val);
                        }
                        break;
                    default:
                        break;
                }
    
                let vals = val.join(' ');

                dlog('vals = '.concat(vals));

                if (vals.length > 0) {
                    _GM_setClipboard(vals);
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
        const items = argument.split('-');
        const yearNumber = items[0];
        const monthNumber = items[1];
        const dayNumber = items[2];

        const monthString = monthNumToName(parseInt(monthNumber));

        let result = dayNumber + ' ' + monthString + ', ';
        result += yearNumber;
        return result;
    }

    function _GM_setClipboard(val) {
        dlog('_GM_setClipboard '.concat(val));
        GM_setClipboard(val);
    }

    function addAutoCopy() {
        if (EASY_COPY) {
            if (addedAutoCopy) {
                return false;
            }
            const val_selectors = ['.selectable-link input'];
            const text_selectors = ['.flex-table__item.dns__nameservers',
                '.dns__table .flex-table__row',
                '.debug-info__links'];

            function addFocusCopyToSelectors(selectors, selector_type) {

                $.each(selectors, function (indexInArray, valueOfElement) {
                    dlog('_addAutoCopy '.concat(valueOfElement));
                    let $e = $(valueOfElement);
                    dlog(isJquery($e));
                    dlog('selector = '.concat(valueOfElement));
                    _addCopy($e, selector_type);
                });
            }

            addFocusCopyToSelectors(text_selectors, TEXT);
            addFocusCopyToSelectors(val_selectors, VAL);
            addedAutoCopy = true;
        }
    }

    waitForKeyElements(
        '.dns__table .flex-table__row', addAutoCopy
        );

    $(function() {
        copyUrl();
    }); // end ready
    
})(jQuery); //invoke nameless function and pass it the jQuery object
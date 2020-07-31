// ==UserScript==
// @name         Papa Cambridge enhancements
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @description  Tool to facilitate downloding of papers from papacambridge
// @author       Siew "@xizun"
// @match        https://pastpapers.papacambridge.com/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const KEY            = 'PAPA-CAMBRIDGE';
    const START          = 'START';
    const END            = 'END';
    const OPENED_YEAR    = 'OPENED_YEAR';
    const DOWNLOAD_START = 'Download Start';
    const DOWNLOAD_END   = 'Download End';
    const FAILSTOP       = 900;
    const ROOTURL        = 'https://pastpapers.papacambridge.com/';
    const NOTIFICATION_TITLE = 'Cambridge download';

    const options = {
        DEBUG: true,
    };
    const WAIT_MILISECONDS = 5000;

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

    function downloadFiles() {
        askNotificationPermission();
        let $links = $('a:contains("Download")');
        const waitMiliseconds = 3000;
        const links = Array();

        for(const link of $links) {
            const wnd = "_wnd";
            const url = $(link).attr('href');
            links.push(link);
        }
        if (links.length > 0 && GM_getValue(KEY) == OPENED_YEAR) {
            GM_setValue(KEY, DOWNLOAD_START);
            let i = 0;
            const loop = setInterval(
                () => {
                    dlog('There are '.concat(links.length, ' download links to go'));
                    const link = links.shift();
                    link.click();
                    if (links.length == 0 || i > FAILSTOP) {
                        dlog('terminating download loop with '.concat(links.length, ' downloads pending and i=', i));
                        setTimeout(
                            () => {
                                GM_setValue(KEY, DOWNLOAD_END);
                                clearInterval(loop);
                                notifyEnd();
                            },
                            waitMiliseconds
                        );
                    }
                    i++;
                }, waitMiliseconds 
            );
        }
    }

    function askNotificationPermission() {
        dlog('askNotificationPermission+');
        // function to actually ask the permissions
        function handlePermission(permission) {
          // Whatever the user answers, we make sure Chrome stores the information
          if(!('permission' in Notification)) {
            Notification.permission = permission;
          }
    }
    
        // Let's check if the browser supports notifications
        if (!('Notification' in window)) {
          console.log("This browser does not support notifications.");
        } else {
          if(checkNotificationPromise()) {
            Notification.requestPermission()
            .then((permission) => {
              handlePermission(permission);
            })
          } else {
            Notification.requestPermission(function(permission) {
              handlePermission(permission);
            });
          }
        }
    }
    function checkNotificationPromise() {
        try {
          Notification.requestPermission().then();
        } catch(e) {
          return false;
        }
    
        return true;
    }
    
    function notify(message, title=NOTIFICATION_TITLE) {
        const notification = new Notification(title, {body: message});
    }

    function notifyEnd() {
        dlog('notifyEnd');
        notify('Download done');
    }

    function addOpenYearButton($link, $button) {
        dlog('addOpenYearButton+');

        const $br = $('<br>');
        $button.after($br);
        const $newButton = $('<button>Open '.concat($link.attr('data-name'),'</button>'));
        $br.after($newButton);
        const url = $link.attr('href');
        const fullUrl = ROOTURL.concat(url);
        const urls = [fullUrl];
        $newButton.on('click',
            () => {
                event.preventDefault();
                event.stopPropagation();
                openUrls(urls);
            }
        );
    }

    function addOpenYearButtons($button) {
        dlog('addOpenYearButtons+');        
        let i = 0;
        for(const $link of yearLinks()) {
            i++;
            dlog('adding button '.concat(i));
            addOpenYearButton($link, $button);
        }
    }
    function* yearLinks() {;
        const $s = $('a.clearfix');
        const yearRegExp = /2\d{3}\D{3,}/;

        for(const link of $s) {
            const $link = $(link);
            if (isJquery($link)) {
                const data_name = $link.attr('data-name');
                dlog(data_name);
                if (yearRegExp.test(data_name)) {
                    yield $link;
                }
            }
        }
    }

    function openAllYears() {
        dlog('openAllYears+');
        event.preventDefault();
        event.stopPropagation();
        
        const fullUrls = Array();

        for(const $link of yearLinks()) {
            const url = $link.attr('href');
            const fullUrl = ROOTURL.concat(url);
            fullUrls.push(fullUrl); 
        }

        openUrls(fullUrls);
    }
    
    function openUrls(urls) {
        const wnd = '_wnd0';
        let i = 0;
        const loop = setInterval(() => {
            dlog('loop - '.concat(urls.length, ' urls to go'));
            if (GM_getValue(KEY) != DOWNLOAD_START) {
                GM_setValue(KEY, OPENED_YEAR);
                const fullUrl = urls.shift();
                window.open(fullUrl, wnd);
            }
            if (urls.length == 0 || i > FAILSTOP) {
                dlog('terminating loop with i='.concat(i, ' and ', urls.length), ' urls to go');
                clearInterval(loop);
                setTimeout(() => {
                    GM_setValue(KEY, END);
                }, WAIT_MILISECONDS);
            }
            i++;
        }, WAIT_MILISECONDS);
    }
    

    function addOpenAllYearsButton() {
        dlog('addButtonToOpenYears+');
        const $logo = $('.logo');


        const $newButton = $('<button>Open Years</button>');

        $newButton.on('click', openAllYears);
        $logo.after($newButton);
        addOpenYearButtons($newButton);
    }

    function testYearLinks() {
        for(const $link of yearLinks()) {
            dlog('href = '.concat($link.attr('href')));
        }


    }

    $(function() {
        // do something on document ready
        const key = GM_getValue(KEY);
        
        if (key == undefined) {
            GM_setValue(KEY, START);
        }
        addOpenAllYearsButton();
        
        downloadFiles();

    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object
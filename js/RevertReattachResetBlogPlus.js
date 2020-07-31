// ==UserScript==
// @name         Revert, Reattach, Reset Blog Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.3
// @description  Tool for enhancing Revert Blog RC. Rewrote to use Promise
// @author       Siew "@xizun"
// @grant        GM_setClipboard
// @match        https://mc.a8c.com/automated-transfer/revert.php?blog_id=*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        WAIT_MILISECONDS: 2000,
        FAIL_STOP: 300
    };
    
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

    function flashBorder(elem) {
        let style = {border: '3px solid blue'};
        elem.css(style);

        style = {border: ''};
        setTimeout(() => elem.css(style), options.WAIT_MILISECONDS);
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
    
    function notify(message, title) {
        const notification = new Notification(title, {body: message});
    }

    function getSiteName() {
        const $s = $('strong', 'li:contains(Blog domain)');
        const siteName = $s.text().trim();
        return siteName;
    }



    function _monitorButton(indexInArray, valueOfElement) {
        return new Promise(
            (resolve, reject) => {
                let i = 0;
                const loop = setInterval(() => {
                    const message = $(valueOfElement);
                    if (message.length > 0) {
                        const _message = message.text().trim();
                        if (_message.length > 0 || i > options.FAIL_STOP) {
                            clearInterval(loop);
                            if (_message.length > 0) {
                                resolve(_message);
                            } else {
                                reject(`loop-out:${i}`);
                            }
                        }
                    }
                    i++;
                }, options.WAIT_MILISECONDS);
            }
        );
    }

    function extractTempUrlTokens(arg) {
    
        const pattern = /Created temporary URL: ([-.\w]+).+Temporary admin user: (\w+).+pass: (\w+)/gm;
    
        const match = pattern.exec(arg);
        const site = match[1];
        const user = match[2];
        const pass = match[3];
        return [site, user, pass]
    }

    function copyItemsToClipboard(items) {
        const WAIT_MILISECONDS_BETWEEN_COPY = 1000;

        $.each(items, function (indexInArray, valueOfElement) {
            setTimeout(
                () => {
                    GM_setClipboard(valueOfElement);
                },
                WAIT_MILISECONDS_BETWEEN_COPY * (indexInArray + 1)
            );
        });
    }

    function copyTemporaryUrlTokensToClipboard(message) {
        const [site, user, pass] = extractTempUrlTokens(message);
        const url = 'https://'.concat(site, '/wp-admin/export.php');
        const itemsToCopy = [
            message,
            url,
            pass,
            user
        ];

        copyItemsToClipboard(itemsToCopy);
        window.open(url);
    }

    function monitorButtons() {
        const siteName = getSiteName();
        
        const buttons = {
            '#at-hard-revert__submit': '#at-hard-revert__response',
            '#at-reattach_revert__submit': '#at-reattach-revert__response > span',
            '#at-reset-site__submit':'#at-reset-site__response > span',
            "input[value='Create temporary URL']": '#at-temporary-serve__response',
            "input[value='Restore URL']": '#at-temporary-serve__response'
        }

        $.each(buttons, 
            function (indexInArray, valueOfElement) {
                waitForKeyElements(
                    indexInArray, 
                    () => {
                        const button = $(indexInArray);
                        button.on('click',
                            () => {
                                dlog(`click ${indexInArray}`);
                                _monitorButton(indexInArray, valueOfElement)
                                    .then(
                                        completionMessage => {
                                            notify(`Success: ${completionMessage}`, siteName);
                                            if (indexInArray == "input[value='Create temporary URL']") {
                                                copyTemporaryUrlTokensToClipboard(completionMessage);
                                            }
                                        }
                                    )
                                    .catch(
                                        errorMessage => notify(`Error: ${errorMessage}`, siteName)
                                    )
                            }
                        );
                    }
                );
            }
        );


    }

    //private scope and using $ without worry of conflict
    dlog('loading Revert Reattach Reset Plus');
    
    $(function() {
        askNotificationPermission();
        monitorButtons();
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object

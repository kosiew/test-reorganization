// ==UserScript==
// @name         Revert, Reattach, Reset Blog Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.1
// @description  Tool for enhancing Revert Blog RC. Rewrote to use Promise
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/automated-transfer/revert.php?blog_id=*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function($){ //function to create private scope with $ parameter
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

    function monitorButtons() {
        const $s = $('strong', 'li:contains(Blog domain)');
        const siteName = $s.text().trim();

        const buttons = {
            '#at-hard-revert__submit': '#at-hard-revert__response',
            '#at-reattach_revert__submit': '#at-reattach-revert__response > span',
            '#at-reset-site__submit':'#at-reset-site__response > span'
        }

        $.each(buttons,
            function (indexInArray, valueOfElement) {
                waitForKeyElements(
                    indexInArray,
                    () => {
                        const button = $(indexInArray);
                        button.on('click',
                            () => {
                                dlog('click '.concat(indexInArray));
                                let i = 0;
                                const loop = setInterval(
                                    () => {
                                        const message = $(valueOfElement);
                                        if (message.length > 0) {
                                            const _message = message.text().trim();
                                            if (_message.length > 0 || i > options.FAIL_STOP) {
                                                if (_message.length > 0) {
                                                    notify(_message, siteName);
                                                }
                                                dlog('terminating loop, i='.concat(i));
                                                clearInterval(loop);
                                            }
                                        }
                                        i++;
                                    },
                                    options.WAIT_MILISECONDS
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    function monitorButtons2() {
        const $s = $('strong', 'li:contains(Blog domain)');
        const siteName = $s.text().trim();

        const buttons = {
            '#at-hard-revert__submit': '#at-hard-revert__response',
            '#at-reattach_revert__submit': '#at-reattach-revert__response > span',
            '#at-reset-site__submit':'#at-reset-site__response > span'
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
                                        completionMessage => notify(`Success: ${completionMessage}`, siteName)
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
    }

    //private scope and using $ without worry of conflict
    dlog('loading Revert Reattach Reset Plus');

    $(function() {
        askNotificationPermission();
        monitorButtons2();
    }); // end ready

})(jQuery); //invoke nameless function and pass it the jQuery object


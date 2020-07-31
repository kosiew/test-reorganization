// ==UserScript==
// @name         HappyChat Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @icon         https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.3
// @description  Tool for enhancing HappyChat
// @author       Siew "@xizun"
// @match        https://hud.happychat.io/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

;(function($){ //function to create private scope with $ parameter
    const options = {
        DEBUG: true,
        WAIT_MILISECONDS: 1000,
        NOTIFY_LONG_WAIT: true,
        NOTIFY_INTERVAL_MINUTES: 3,
        NOTIFY_MAX_MINUTES: 30,
        MAX_WAIT: 60
    };
    const NOTIFICATION_TITLE = 'HappyChat alert';
    const ENDED_CHAT_MESSAGES = ['You ended the chat.', 'You have left the chat.', 'Chat ended.'];

    let $autoTranslateButton = $('.autotranslate-buttion');
    let lastNowMinute = 0;
    let lastTimeString = '';
    let lastElapsedMinutes = 0;

    const WAIT_INTERVAL_MILISECONDS = 1000,
        WAIT_MILISECONDS_BETWEEN_COPY = 500,
        FAIL_SAFE = 1000*60*60;

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

    function flashBackground(s) {
        let originalColor = s.css('background-color');
        let style = {
            backgroundColor: 'yellow'
        };
        s.css(style);


        setTimeout(function () {
            s.css('background-color', originalColor);
        }, options.WAIT_MILISECONDS);
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


    dlog('loading HappyChat Plus');

    function addCopy() {
        const selector = '.chat__message';

        const $messages = $(selector);

        let i = 0;
        $.each($messages, function (indexInArray, valueOfElement) {
            i++;
            const $this = $(this);
            const enhanced = $this.enhanced;
            if (enhanced == undefined) {
                $this.off('click');
                $this.on('click',
                    () => {
                        const texts = $this.find('.chat__message__text');
                        $.each(texts, function (indexInArray, valueOfElement) {
                            const $text = $(valueOfElement);
                            let text = $text.text();
                            const metaText = $this.find('.chat__message__meta').text();
                            text = text.replace(metaText, '');
                            setTimeout(
                                () => {
                                    GM_setClipboard(text);
                                },
                                WAIT_MILISECONDS_BETWEEN_COPY * indexInArray
                            );
                        });

                        flashBorder($this);
                    }
                )
                $this.enhanced = true;
            } else {
                dlog(`message ${i} already enhanced`);
            }

        });
    }

    function getTwentyFourHourTime(amPmString) {
        var d = new Date("1/1/2013 " + amPmString);
        return d.getHours() + ':' + d.getMinutes();
    }

    function getSpacedTimeString(timeString) {
        const len = timeString.length;
        const alphabetStart = len - 2;

        const time = timeString.slice(0, alphabetStart);
        const alphabets = timeString.slice(alphabetStart, len);

        return time.concat(' ', alphabets);
    }

    function getElapsedMinutes(timeString) {
        dlog('getElapsedMinutes '.concat(timeString));
        const d = new Date();
        const nowHour = d.getHours();
        const nowMinute = d.getMinutes();
        let elapsedMinutes;

        if (nowMinute != lastNowMinute || timeString != lastTimeString) {
            const spacedTimeString = getSpacedTimeString(timeString);
            const spacedDateTimeString = '1/1/2020 '.concat(spacedTimeString);
            const tempDate = new Date(spacedDateTimeString);
            const startHour = tempDate.getHours();
            const startMinute = tempDate.getMinutes();

            dlog('nowHour '.concat(nowHour, ' nowMinute ', nowMinute, ' startHour ', startHour, ' startMinute ',
                startMinute, ' spacedDateTimeString ', spacedDateTimeString));

            let elapsedHour = nowHour - startHour;
            if (elapsedHour < 0) {
                elapsedHour += 24;
            }

            elapsedMinutes = elapsedHour * 60 + nowMinute - startMinute;
            lastNowMinute = nowMinute;
            lastTimeString = timeString;
        } else {
            elapsedMinutes = lastElapsedMinutes;
        }
        dlog('elapsedMinutes = '.concat(elapsedMinutes));
        return elapsedMinutes;
    }

    function initWaitTime() {
        if ($autoTranslateButton.length == 0) {
            const $waitMinutesElem = $('<b>waited ... minutes</b>');
            $autoTranslateButton = $('.autotranslate-button')
            $autoTranslateButton.after($waitMinutesElem);
        }
    }

    function checkActive() {
        const operatorSelector = '.chat__message__meta-operator';
        const $operators = $(operatorSelector);
        const activeTexts = ['Note by you', 'Sent by you'];

        const lastOperator = $operators.eq($operators.length - 1);
        if (activeTexts.includes(lastOperator.text())) {
            return true;
        }
        return false;
    }

    function checkChatEnded() {
        dlog('checkChatEndied+');
        const chatMessageSelector = '.chat__message__text';
        const $chatMessages = $(chatMessageSelector);
      
        let _endedChat = false;
        if (lastElapsedMinutes < options.MAX_WAIT) {
            const iAmActive = checkActive();

            if (iAmActive) {
                const messagesToCheck = 3;
                for (let index = $chatMessages.length - messagesToCheck - 1; index < $chatMessages.length; index++) {
                    const $message = $chatMessages.eq(index);
                    const messageText = $message.text()
                    dlog('checking '.concat(messageText));
                    _endedChat = ENDED_CHAT_MESSAGES.includes(messageText);
                    if (_endedChat) {
                        dlog('iAmActive '.concat(iAmActive, ' message ', messageText));
                        break;
                    }
                }      
            } else {
                _endedChat = true;
            }
        } else {
            _endedChat = true;
        }
        dlog(' _endedChat '.concat(_endedChat));

        return _endedChat;
    }

    function _getElapsedMinutes() {
        const selector = '.chat__message:not(.chat__message__type-note) .chat__message__meta-timestamp';
        const timeStamps = $(selector);

        const messages_length = timeStamps.length;
        const $timeStamp = timeStamps.eq(messages_length - 1);

        const timeString = $timeStamp.text();
        return getElapsedMinutes(timeString);
    }

    function showWaitTime() {
        dlog('showWaitTime+');
        if (options.NOTIFY_LONG_WAIT) {
            checkNotificationPromise();
        }

        initWaitTime();
        
        const endedChat = checkChatEnded();

        const selector = '.chat__message:not(.chat__message__type-note) .chat__message__meta-timestamp';
        const timeStamps = $(selector);

        const messages_length = timeStamps.length;
        const $timeStamp = timeStamps.eq(messages_length - 1);

        const timeString = $timeStamp.text();

        const elapsedMinutes = getElapsedMinutes(timeString);

        if (elapsedMinutes != lastElapsedMinutes) {
            const $waitedMinutesElem = $('b:contains(waited)');
            const suffix = elapsedMinutes > 1 ? ' minutes' : ' minute';
            $waitedMinutesElem.text('waited '.concat(elapsedMinutes, suffix));
            flashBorder($timeStamp);
            lastElapsedMinutes = elapsedMinutes;

            if (options.NOTIFY_LONG_WAIT && 
                    !endedChat && 
                    elapsedMinutes > 0 &&
                    elapsedMinutes % options.NOTIFY_INTERVAL_MINUTES == 0 && 
                    elapsedMinutes <= options.NOTIFY_MAX_MINUTES) {
                dlog('endedChat '.concat(endedChat));
                const $chatUser = $('h4.user-data-panel__display-name');
                notify($chatUser.text().concat(' has waited ', elapsedMinutes, ' minutes'));
            }
        }
    }

    $(function() {
        let i = 0;
        const loop = setInterval(
            () => {
                if (i < FAIL_SAFE) {
                    addCopy();
                    showWaitTime();
                } else {
                    clearInterval(loop);
                    dlog('stopping loop');
                }
                i++;
            },
            WAIT_INTERVAL_MILISECONDS
        )
        // do something on document ready
    }); // end ready


})(jQuery); //invoke nameless function and pass it the jQuery object
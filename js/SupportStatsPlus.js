
// ==UserScript==
// @name         Support Stats Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.0
// @description  Tool for enhancing Support Stats
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/support-stats/person.php*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

// add jquery-ui css
$("head").append (
    '<link '
  + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css" '
  + 'rel="stylesheet" type="text/css">'
);


const options = {
    DEBUG: true,
    DELAY_MILISECONDS: 5000,
    SPEAK: true,
    VOICE: 2,
    VOICE_RATE: .5,
    VOICE_PITCH: 1,
    COPY_MESSAGES: ['Great job!', 'You are doing great!', 'To infinity and beyond!', 'Up up and away!']
}

const _STATS_LABELS = [
    'tickets',
    '1:1s',
    'forums',
    'Happychats'
    ];

const STATS_LABELS = [
    'tickets',
    '1:1s',
    'Happychats'
    ];

const TOTAL_STATS_LABELS = [
    'tickets',
    ' 1:1s',
    'chats'
]    


function dlog(message){
    if (options.DEBUG) {
        console.log(message);
    }
}

function isJquery(elem) {
    return elem instanceof jQuery;
}

class _Stat {
    constructor(td) {
        this.td = td;
        this.stats = [];
        this.text = td.text();
    }

    parseInteraction(text) {
        for (var i = 0; i < this.labels.length; i++) {
            let label = this.labels[i];
            let stat = this.extract(text, label);
            this.stats.push(stat);
        }
    }

    extract(text, interaction) {
        let regex = '(\\d+) '.concat(interaction);
        let rx = new RegExp(regex);

        let match = rx.exec(text);
        let result = '';
        if (match) {
            result = match[1];
        }
        return result;
    }

}

class _DayStat extends _Stat{
    constructor(td) {
        super(td);
        this.day = this.getDay();
        this.labels = STATS_LABELS;

    }
    getDay() {
        this.aElem = this.td.find('a');
        let dayString;
        dlog('aElem.length = '.concat(this.aElem.length));
        if (this.aElem.length > 0) {
            dayString = this.aElem.text();
        }
        dlog('dayString = '.concat(dayString));
        return dayString;
    }
}

class DayStat extends _DayStat {
    constructor(td) {
        super(td);
        this.parseText();
    }

    parseText() {
        let text = this.text.replace(this.day, '');
        this.parseInteraction(text);
    }
}


function getStatsTrs() {
    let tb = $('tbody');
    let _trs = tb.find('tr');
    let trs = [];
    _trs.each(function (index) {
        let text = $(this).text();
        dlog('tr '.concat(index, ' - ', text));
        if (text.includes('Overall')) {
            trs.push($(this));
        }
    });

    return trs;
}

function changeaElemBorder(elems, borderCode) {
    $.each(elems, function(index, elem){
        elem.aElem.css("border", borderCode);
    });
}

function textToSpeech(message) {
    // get all voices that browser offers
    var available_voices = window.speechSynthesis.getVoices();

    // this will hold an english voice
    var english_voice = '';

    // find voice by language locale "en-US"
    // if not then select the first voice
    let english_voices = [];
    for(var i=0; i<available_voices.length; i++) {
        let voice = available_voices[i];
        if(voice.lang === 'en-US') {
            english_voices.push(voice)
        }
    }
    dlog('there are '.concat(english_voices.length, ' voices'));
    if(english_voice === ''){
        english_voice = available_voices[options.VOICE];
    }
    // new SpeechSynthesisUtterance object
    var utter = new SpeechSynthesisUtterance();
    utter.rate = options.VOICE_RATE;
    utter.pitch = options.VOICE_PITCH;
    utter.text = message;

    utter.voice = english_voices[options.VOICE];

    // $.each(english_voices, function (index, voice) {
    //     utter.voice = voice;
    //     let _message = 'Voice '.concat(index, ' ', message);
    //     dlog(_message);
    //     utter.text = _message;
    //     window.speechSynthesis.speak(utter);
    // });

    // event after text has been spoken
    utter.onend = function() {
        dlog('Speech has finished');
    }

    // speak
    window.speechSynthesis.speak(utter);
}


function speak(message) {
    if (options.SPEAK) {
        // list of languages is probably not loaded, wait for it
        if(window.speechSynthesis.getVoices().length == 0) {
            window.speechSynthesis.addEventListener('voiceschanged', function() {
                textToSpeech(message);
            });
        }
        else {
            // languages list available, no need to wait
            textToSpeech(message)
        }
    }
 
}

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function addCopyStatButtons() {
    let trs = getStatsTrs();
    dlog('trs.length = '.concat(trs.length));
    for (var i = 0; i < trs.length; i++) {
        let tr = $(trs[i]);
        let lastColumn = tr.find('td.td-separated');
        let button = $('<button>Copy</button>');
        button.attr('id',  'button-'.concat(i));

        //button.css('border', '2px solid red');

        let clickFunction = function(event) {
            let tr = event.data.tr;
            let tds = tr.find('td');
            let dayStats = []
            tds.each(function (index) {
                let _dayStat = new _DayStat($(this));
                dlog('td.text = '.concat(_dayStat.td.text()));
                if (_dayStat.day) {
                    let dayStat = new DayStat($(this));
                    dayStats.push(dayStat);
                }
            });

            changeaElemBorder(dayStats, "2px blue solid");
            setTimeout(changeaElemBorder, options.DELAY_MILISECONDS, dayStats, "none");
            dlog(dayStats);
            let weekStats = []
            $.each(dayStats, function(index, dayStat) {
                $.merge(weekStats, dayStat.stats);
            });

            dlog(weekStats);
            let output = weekStats.join('\t');
            dlog(output);
            GM_setClipboard(output);
            let message = randomItem(options.COPY_MESSAGES);
            speak(message);
        }
        button.on("click", { tr: tr }, clickFunction);
        lastColumn.after(button);

        $('button').button();

    }
}

function copyStats(totalStats) {
    let $stats = $('#person-feedbacks');
    $stats.append(totalStats);
    let $feedback = $stats.clone();
    let $header = $('#hapdash-content > div:nth-child(4) > div.hapdash-card-header');

    $header.before($feedback);
    $feedback.css('border', "2px solid blue");
}

function getTotalStats(){
    let selector = '.td-separated';
    let $totals = $(selector);

    let _totals = [];
    $.each($totals, function (index, value) {
        let $total = new _Stat($(value));
        $total.labels = TOTAL_STATS_LABELS;
        $total.parseInteraction($total.text);
        _totals.push($total);
    });

    let html = '';
    $.each(STATS_LABELS, function (index, interaction) {
        let interactionTotal = 0;
        dlog('totals.length = '.concat(_totals.length))
        $.each(_totals, function (_index, _total) {
            let stat = _total.stats[index];
            stat = stat == "" ? 0 : stat;
            dlog('stats '.concat(_index, ' = ', stat, ' ', interaction));
            let thisTotal = parseInt(stat);
            interactionTotal += thisTotal;
        });
        if (interactionTotal > 0) {
            html = html.concat(interactionTotal, ' ', interaction, ' ');
        }
    });
    dlog('total stats = '.concat(html));
    return html

}
$(function() {
    // do something on document ready
    addCopyStatButtons();
    totalStats = getTotalStats();
    copyStats(totalStats);
}); // end ready




// ==UserScript==
// @name         Blog RC enhancements
// @namespace    https://wpcomhappy.wordpress.com/
// @icon        https://raw.githubusercontent.com/soufianesakhi/feedly-filtering-and-sorting/master/web-ext/icons/128.png
// @version      1.0
// @downloadUrl  https://gist.github.com/arcangelini/c6f09d9651f94994009c9119f9497ce5/raw/copy-hc.user.js
// @description  Tool for enhancing Blog RC
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/tools/reportcard/blog/*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==


const options {
    DEBUG: true,
}

function dlog(message){
    if (options.DEBUG) {
        console.log(message);
    }
}

function isJquery(elem) {
    return elem instanceof jQuery;
}

function addBorder(elem) {
    elem.css('border', '2px solid red');
}

// store object
GM_setValue("MY_OBJECT_KEY", JSON.stringify(myObject));
// retrieve object
var myObject = JSON.parse(GM_getValue("MY_OBJECT_KEY", "{}"));

// redirect to new url
var link = document.URL.replace("domain.fr", "domain.com");
window.location.href = link;

// add button to execute function on page
var btn = document.createElement("button");
btn.innerHTML = "My button";
btn.onclick = () => {
    alert("My button clicked !");
    return false;
};
document.querySelector("btn_predecessor_selector").after(btn);

// append style to page
var css = "h1 { background: red; }"
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// fetch and parse external page
fetch("http://example.com/path-name")
.then(response => response.text())
.then(text => {
    var parser = new DOMParser();
    var htmlDocument = parser.parseFromString(text, "text/html");
    var content = htmlDocument.documentElement.querySelector("element_selector");
    alert("My fetched element content: " + content.textContent);
});





waitForKeyElements(
    "div.stickers_widget", copyNodes
);

function copyNodes() {
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


// ==UserScript==
// @name         Blog RC Revert Plus
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.0
// @description  Tool for enhancing Blog RC Revert, automatic check inputs
// @author       Siew "@xizun"
// @match        https://mc.a8c.com/automated-transfer/revert.php?blog_id=*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==


const id = 'at-hard-revert__prerequisites';

console.log('loading Blog RC Revert enhancements');

waitForKeyElements(
    '#at-hard-revert__prerequisites', checkInputs
);

function checkInputs() {
    console.log('checkInputs+');
    let checkBoxContainer = document.getElementById(id);
    let inputs = checkBoxContainer.getElementsByTagName('input');

    for(var i = 0; i < inputs.length-1; i++) {
        if(inputs[i].type == "checkbox") {
            inputs[i].checked = true;
        }
    }
};



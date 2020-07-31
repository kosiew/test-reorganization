// ==UserScript==
// @name         Blog RC Revert Plus 
// @namespace    https://wpcomhappy.wordpress.com/
// @version      1.1
// @description  Tool for enhancing Blog RC Revert
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
    let checkBoxContainer = $('#'.concat(id));
    let inputs = checkBoxContainer.find('input');

    inputs.each(function (index) {
        $(this).click();
    });
};



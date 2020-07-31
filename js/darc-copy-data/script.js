// ==UserScript==
// @name         Happiness Copy Tool
// @namespace    https://wpcomhappy.wordpress.com/
// @version      4.0
// @downloadUrl  https://gist.github.com/arcangelini/c6f09d9651f94994009c9119f9497ce5/raw/copy-hc.user.js
// @description  Tool for copying user data in HappyChat
// @author       Tony "@arcangelinis"
// @match        https://hud.happychat.io/*
// @match        https://mc.a8c.com/tools/reportcard/domain/?domain=*
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

var site = window.location.href;

// HappyChat Button
if (site.includes("https://hud.happychat.io")) {
    waitForKeyElements(
        "div.user-data-panel", buttonAdder
    );

    function buttonAdder() {
        $("<button style='font-size: 40px;color: #2E4453;padding: 0px;position: absolute;top: 10px;right: 10px;' id='copyData'>☃</button>").insertAfter("body");

        document.getElementById("copyData").addEventListener("click", function(event) {
            // Chat URL
            var pathArray = window.location.pathname.split('/')
            var transcriptID = pathArray[2]
            var chatClip = "https://mc.a8c.com/support-stats/happychat/transcript.php?id=" + transcriptID + "\n"

            // Username
            var userName = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-data-panel > div.user-data-panel__login > input").value
            var usernameClip = userName + "\n"
            var storeAdmin = "https://wordpress.com/wp-admin/network/wpcom-paid-upgrades.php?action=search&username=" + userName + "\n"

            // User ID
            var userID = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-data-panel > section.user-data-panel__items > div > div:nth-child(1) > div.user-panel-items__item-content").innerHTML;
            var userRC = "https://mc.a8c.com/tools/reportcard/user/?id=" + userID + "\n"

            // Domain
            var domUrl = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > div.user-blog-panel__url > a").href;
            var domStrip = domUrl.replace(/http.*\//, '');
            var domainClip = domStrip + "\n"

            // Blog ID
            var blogCount = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(1) > div.user-panel-items__item-label").innerText;
            if (blogCount == "Blogs") {
                var churnRisk = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(2) > div.user-panel-items__item-label").innerText;
                if (churnRisk == "Churn risk") {
                    var blogID = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(3) > div.user-panel-items__item-content").innerText;
                } else {
                    var blogID = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(2) > div.user-panel-items__item-content").innerText;
                }
            } else {
                var churnRisk = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(2) > div.user-panel-items__item-label").innerText;
                if (churnRisk == "Churn risk") {
                    var blogID = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(3) > div.user-panel-items__item-content").innerText;
                } else {
                    var blogID = document.querySelector("#app > div > div.chat > div.chat__chat-panels > div.chat__current-chat-meta.chat__chat-panel > div.user-blog-panel > section > div > div:nth-child(1) > div.user-panel-items__item-content").innerText;
                }
            }
            var blogClip = "https://mc.a8c.com/tools/reportcard/blog/?blog_id=" + blogID + "\n"

            // Look for follow ups and copy
            if (event.shiftKey) {
                // HTML
                var chatText = document.getElementsByClassName("chat")[0].innerText;
                var followUps = chatText.match(/https:\/\/woothemes.+\d/g);
                if (followUps) {
                    var followupClip = followUps[followUps.length - 1];
                    var clipboardFormatted = "<strong>Chat</strong> ⇢ " + chatClip + "<strong>Follow-up</strong> ⇢ " + followupClip + "<strong>SA</strong> ⇢ " + storeAdmin + "<strong>Domain</strong> ⇢ " + domainClip + "<strong>BlogRC</strong> ⇢ " + blogClip + "<strong>Username</strong> ⇢ <a href='" + userRC + "'>" + usernameClip + "</a>"
                    GM_setClipboard(clipboardFormatted);
                } else {
                    var clipboardFormatted = "<strong>Chat</strong> ⇢ " + chatClip + "<strong>SA</strong> ⇢ " + storeAdmin + "<strong>Domain</strong> ⇢ " + domainClip + "<strong>BlogRC</strong> ⇢ " + blogClip + "<strong>Username</strong> ⇢ <a href='" + userRC + "'>" + usernameClip + "</a>"
                    GM_setClipboard(clipboardFormatted);
                }
            } else {
                // Without HTML
                var chatText = document.getElementsByClassName("chat")[0].innerText;
                var followUps = chatText.match(/https:\/\/woothemes.+\d/g);
                if (followUps) {
                    var followupClip = followUps[followUps.length - 1];
                    var clipboardFormatted = "Chat: " + chatClip + "Follow-up: " + followupClip + "SA: " + storeAdmin + "Domain: " + domainClip + "BlogRC: " + blogClip + "Username: " + usernameClip + "UserRC: " + userRC
                    GM_setClipboard(clipboardFormatted);
                } else {
                    var clipboardFormatted = "Chat: " + chatClip + "SA: " + storeAdmin + "Domain: " + domainClip + "BlogRC: " + blogClip + "Username: " + usernameClip + "UserRC: " + userRC
                    GM_setClipboard(clipboardFormatted);
                }
            }
        });

    };

    // DARC Button
} else if (site.includes("https://mc.a8c.com/tools/reportcard/domain")) {
    waitForKeyElements(
        "a.domain-admin-domain-link", buttonAdder
    );

    function buttonAdder() {
        $("<button style=\"display: inline-block;font-size: 30px;color: #2E4453;text-align: center;padding: 2px;height: auto;width: auto;margin: 0 auto;background-color: #F4F6F8;\" id=\"copyData\">☃</button>").insertAfter(".domain-admin-domain-link");

        document.getElementById("copyData").addEventListener("click", function(event) {
            // DARC
            var darc = window.location.href;
            var darcClip = darc + "\n"

            // Username
            var domUser = document.querySelector("#domain-admin-root > div > div.darc__overviews > div.overview-box.owner .selectable-link input[type=text]").value;
            var usernameClip = domUser + "\n"
            var userRC = "https://mc.a8c.com/tools/reportcard/user/?username=" + domUser

            // SA Link
            var storeAdmin = "https://wordpress.com/wp-admin/network/admin.php?page=store-admin&action=search&username=" + domUser + "\n"

            // BlogID
            var blogId = document.querySelector("#domain-admin-root > div > div.darc__overviews > div.overview-box.blog > div > ul > li:nth-child(2) > div > input[type=text]").value;
            var blogClip = "https://mc.a8c.com/tools/reportcard/blog/?blog_id=" + blogId + "\n"

            // Domain
            var dom = document.querySelector("#domain").value;
            var domainClip = dom + "\n\n"

            // WordPress.com Site
            var wpcomDom = document.querySelector("#domain-admin-root > div > div.darc__overviews > div.overview-box.blog > div > ul > li:nth-child(1) > div > input[type=text]").value;

            // Copy to Clipboard
            if (event.shiftKey) {
                // HTML
                var clipboardFormatted = "<strong>Username</strong>: <a href='" + userRC + "'>" + usernameClip + "</a><strong>Domain</strong>: " + domainClip + "<strong>DARC</strong>: " + darcClip + "<strong>SA</strong>: " + storeAdmin + "<strong>BlogRC</strong>: " + blogClip
                GM_setClipboard(clipboardFormatted);
            } else {
                // Without HTML
                var clipboardFormatted = "Username: " + usernameClip + "Domain: " + domainClip + "DARC: " + darcClip + "SA: " + storeAdmin + "BlogRC: " + blogClip + "UserRC: " + userRC + "\n"
                GM_setClipboard(clipboardFormatted);
            }

        });
    }
}

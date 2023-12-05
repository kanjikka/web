// ==UserScript==
// @name         Send to Kanji Writing App
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       eh-am
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";
  GM.registerMenuCommand("Send selection", () => {
    const word = window.getSelection().toString();
    fetch(
      "http://localhost:3000/change-route?" +
        new URLSearchParams({
          kanji: word,
        })
    );
  });
})();

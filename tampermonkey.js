// ==UserScript==
// @name         Kanji Writing App
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       eh-am
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// ==/UserScript==
// Docs:
// I tried using
//         window.wkItemInfo
//           .on('lessonQuiz, review,itemPage, extraStudy')
//            .forType('kanji')
//            .spoiling('nothing')
//            .notify((args) => {
// from https://community.wanikani.com/t/for-userscript-authors-wk-item-info-injector/53823/9
// but it didn't notify when changing to a new item

// This is to handle when it's reordered
(function () {
  "use strict";
  window.wkItemInfo.notify((e) => {
    // yes kanji lowercase
    if (e.type === "kanji" || e.type === "radical") {
      console.log("changed kanji", e.characters);
      fetch(
        "http://localhost:3000/change-route?" +
          new URLSearchParams({
            kanji: e.characters,
          })
      );
    }
  });

  window.addEventListener("willShowNextQuestion", (e) => {
    if (e.detail.subject.type == "Kanji") {
      console.log("changed kanji", e.detail.subject.characters);
      fetch(
        "http://localhost:3000/change-route?" +
          new URLSearchParams({
            kanji: e.detail.subject.characters,
          })
      );
    }
  });
})();

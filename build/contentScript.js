/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/contentScript.js ***!
  \******************************/


// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Обработчик сообщений от фонового скрипта
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "getSelectedText") {
    // Получаем выделенный текст и отправляем его в фоновый скрипт
    const selectedText = window.getSelection().toString().trim();
    chrome.runtime.sendMessage({
      command: "saveItem",
      selectedText: selectedText,
    });
  }
});

/******/ })()
;
//# sourceMappingURL=contentScript.js.map
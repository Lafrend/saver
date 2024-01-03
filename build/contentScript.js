/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/contentScript.js ***!
  \******************************/


// Обработчик сообщений от фонового скрипта
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "getSelectedText") {
    // Получаем выделенный текст и отправляем его в фоновый скрипт
    const selectedText = window.getSelection().toString().trim();
    chrome.runtime.sendMessage({
      command: "saveItem",
      selectedText: selectedText,
    });
  } else if (request.command === "processImage" && request.imageUrl) {
    // Выполняем запрос на изображение
    fetch(request.imageUrl)
      .then((response) => response.blob()) // Получаем Blob из ответа
      .then((blob) => {
        // Теперь у вас есть объект Blob, который представляет изображение
        // Можете использовать его, например, для преобразования в Data URL
        const reader = new FileReader();
        reader.onloadend = function () {
          const imageDataUrl = reader.result;
          // Дальнейшая обработка данных изображения
          console.log("data:", imageDataUrl);
          // Отправляем текст в background.js
          chrome.runtime.sendMessage({
            command: "imageProcessed",
            formattedText: imageDataUrl,
          });
        };
        reader.readAsDataURL(blob); // Преобразование Blob в Data URL
      })
      .catch((error) =>
        console.error("Ошибка при получении изображения:", error)
      );
  }
});
/******/ })()
;
//# sourceMappingURL=contentScript.js.map
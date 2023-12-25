"use strict";

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
    // console.log("got command in content.js. ", request.imageUrl);
    // const imageUrl = request.imageUrl;
    // console.log("url:", request.imageUrl);

    // // Получаем изображение со страницы
    // const image = new Image();
    // image.crossOrigin = "anonymous";
    // image.src = imageUrl;

    // image.onload = function () {
    //   // Создаем элемент для вставки изображения
    //   const imgElement = document.createElement("img");
    //   imgElement.src = imageUrl;
    //   console.log("url:", imageUrl);

    //   // Создаем контейнер для вставки изображения
    //   const container = document.createElement("div");
    //   container.appendChild(imgElement);

    //   // Используем dom-to-image для создания снимка контейнера
    //   domtoimage.toPng(container)
    //     .then(function (dataUrl) {
    //       // Отправляем текст в background.js
    //       chrome.runtime.sendMessage({ command: "imageProcessed", formattedText: dataUrl });
    //       console.log("Nice:", dataUrl);
    //     })
    //     .catch(function (error) {
    //       console.error("Ошибка при форматировании изображения:", error);
    //     });
    // };

    // const image = new Image();
    // image.crossOrigin = "anonymous";
    // image.src = request.imageUrl;

    // const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");
    // canvas.width = image.width;
    // canvas.height = image.height;

    // ctx.drawImage(image, 0, 0);

    // canvas.toBlob((blob) => {
    //   const reader = new FileReader();
    //   reader.onloadend = function () {
    //     const base64data = reader.result;
    //     console.log(base64data);
    //     // Теперь у вас есть изображение в формате base64data
    //   };
    //   reader.readAsDataURL(blob);
    // }, "image/png");

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

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.command === "imageProcessed" && request.formattedText) {
//     // Теперь вы можете использовать request.formattedText в вашем контенте
//     console.log("Image processed:", request.formattedText);
//   }
// });

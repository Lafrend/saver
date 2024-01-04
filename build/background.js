/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/


chrome.runtime.onInstalled.addListener(function () {
  // Add a context menu item for selected text
  chrome.contextMenus.create({
    title: "Сохранить",
    id: "save",
    contexts: ["selection", "image", "video", "link"],
  });
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "save") {
    const selected =
      info.selectionText || info.srcUrl || info.linkUrl || info.videoUrl || "";
    if (isImage(selected)) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          command: "processImage",
          imageUrl: selected,
        });
        console.log("Send message to content with imgurl:", selected);
      });
    } else {
      saveItem(info);
    }
  }
});
chrome.commands.onCommand.addListener(function (command) {
  if (command === "saveItemCommand") {
    // Отправляем сообщение контент-скрипту с запросом выделенного текста
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { command: "getSelectedText" });
    });
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "saveItem" && request.selectedText) {
    // Создаем новый элемент с выделенным текстом
    const newItem = {
      selectionText: request.selectedText,
      createdAt: "",
    };
    // Сохраняем новый элемент с использованием существующей функции
    saveItem(newItem);
  } else if (request.command === "imageProcessed" && request.formattedText) {
    console.log("got formatted text");
    const newItem = {
      createdAt: new Date().getTime(),
      title: "",
      itemData: request.formattedText,
      pinned: false,
      hide: false,
      fav: false,
      color: "",
      tab: "",
      list: "",
    };

    // Сохраняем новый элемент
    saveNewItem(newItem);
  }
});
function saveItem(info) {
  const selected =
    info.selectionText || info.srcUrl || info.linkUrl || info.videoUrl || "";

  let itemData;
  itemData = selected;

  const newItem = {
    createdAt: new Date().getTime(),
    title: "",
    itemData: itemData,
    pinned: false,
    hide: false,
    fav: false,
    color: "",
    tab: "",
    list: "",
  };

  saveNewItem(newItem);
}
function formatImageAsText(imageUrl) {
  return new Promise((resolve, reject) => {
    // Создаем изображение
    const img = document.createElement("img");
    // Обработчик, вызываемый после загрузки изображения
    img.onload = function () {
      // Создаем элемент canvas для рисования изображения
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      // Получаем контекст для рисования
      const context = canvas.getContext("2d");
      // Рисуем изображение на canvas
      context.drawImage(img, 0, 0);
      // Получаем Base64-код изображения
      const imageBase64 = canvas.toDataURL("image/png");
      // Разрешаем обещание с Base64-кодом
      resolve(imageBase64);
    };
    // Обработчик ошибки загрузки изображения
    img.onerror = function () {
      reject(new Error("Ошибка загрузки изображения"));
    };
    // Устанавливаем URL изображения
    img.crossOrigin = "anonymous"; // Разрешаем использование изображений с другого домена
    img.src = imageUrl;
  });
}

function isImage(url) {
  // Простая проверка расширения URL на изображение
  return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
}

function sendToServer(data) {
  const serverEndpoint = "http://localhost:3000/sendToTelegram";

  try {
    // Проверяем, что data - это строка
    if (typeof data !== 'string') {
      throw new Error('Invalid data format. It should be a string.');
    }

    // Отправляем строку на сервер
    fetch(serverEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Используем text/plain для строки
      },
      body: data,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      if (responseData) {
        console.log('Данные успешно отправлены:', responseData);
      } else {
        console.error('Ответ сервера не содержит данных:', responseData);
      }
    })
    .catch(error => {
      console.error('Ошибка отправки данных на сервер:', error.message);
    });
  } catch (error) {
    console.error('Ошибка форматирования данных:', error.message);
  }
}

function saveNewItem(item) {
  // Add your logic to save the item to your list using chrome.storage.local
  // Modify this function according to your storage requirements

  sendToServer(item.itemData);

  console.log("Saving new item:", item);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];
    storedList.push(item);

    chrome.storage.local.set({ yourItemList: storedList }, function () {
      console.log("Item saved successfully:", item);
    });
  });
}

// function saveNewItemWithImage(item, imageUrl) {
//   // ... ваш текущий код сохранения ...

//   // Форматируем изображение и отправляем данные на сервер
//   formatImageAsText(imageUrl)
//     .then((imageBase64) => sendToServer(null, imageBase64))
//     .catch((error) => console.error("Error formatting image:", error));
// }

/******/ })()
;
//# sourceMappingURL=background.js.map
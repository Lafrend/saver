/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/


// Load stored data on extension open
chrome.runtime.onInstalled.addListener(function () {
  loadItems();
});

function loadItems() {
  // Load stored data on extension open
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];
    console.log("Loaded items:", storedList);
  });
}

chrome.runtime.onInstalled.addListener(function () {
  // Add a context menu item for selected text
  chrome.contextMenus.create({
    title: "Сохранить текст",
    id: "save-selected-text",
    contexts: ["selection"],
  });

  // Add a context menu item for images
  chrome.contextMenus.create({
    title: "Сохранить изображение",
    id: "save-image",
    contexts: ["image"],
  });

  // Add a context menu item for clickable links
  chrome.contextMenus.create({
    title: "Сохранить ссылку",
    id: "save-link",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "save-selected-text") {
    saveItem(info);
  } else if (info.menuItemId == "save-image") {
    saveItem(info);
  } else if (info.menuItemId == "save-link") {
    saveItem(info);
  }
});

// Используем chrome.commands.onCommand для обработки горячих клавиш
chrome.commands.onCommand.addListener(function (command) {
  if (command === "saveItemCommand") {
    // Отправляем сообщение контент-скрипту с запросом выделенного текста
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { command: "getSelectedText" });
    });
  }
});

// Обработчик сообщений от контент-скрипта
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "saveItem" && request.selectedText) {
    // Создаем новый элемент с выделенным текстом
    const newItem = {
      selectionText: request.selectedText,
      createdAt: "",
    };

    // Сохраняем новый элемент с использованием существующей функции
    saveItem(newItem);
  }
});

function saveItem(info) {
  const selectedText = info.selectionText || "";
  const imageUrl = info.srcUrl || "";
  const linkUrl = info.linkUrl || "";

  let itemData;

  if (selectedText) {
    itemData = selectedText;
  } else if (imageUrl) {
    itemData = `(imgUrl:${imageUrl})`;
  } else if (linkUrl) {
    itemData = `(linkUrl:${linkUrl})`;
  }
  // Add the new item to your list (modify this according to your list structure)
  const newItem = {
    itemData: itemData,
    createdAt: "",
  };

  // Save the new item to local storage or wherever you store your list
  saveNewItem(newItem);
}

function saveNewItem(item) {
  // Add your logic to save the item to your list using chrome.storage.local
  // Modify this function according to your storage requirements
  console.log("Saving new item:", item);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    // Assign a unique index to the new item
    item.createdAt = new Date().getTime();

    // Check if the item with the same createdAt already exists
    const existingItemIndex = storedList.findIndex(
      (existingItem) => existingItem.createdAt === item.createdAt
    );

    if (existingItemIndex !== -1) {
      // If the item with the same createdAt exists, remove it from the list
      storedList.splice(existingItemIndex, 1);
    }

    // Add the new item to the beginning of the list
    storedList.push(item);

    chrome.storage.local.set({ yourItemList: storedList }, function () {
      console.log("Item saved successfully:", item);
    });
  });
}
/******/ })()
;
//# sourceMappingURL=background.js.map
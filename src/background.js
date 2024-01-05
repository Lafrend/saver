"use strict";

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
      createdAt: new Date().getTime(),
      title: "",
      itemData: request.selectedText,
      pinned: false,
      hide: false,
      fav: false,
      color: "",
      tab: "",
      list: "",
    };
    // Сохраняем новый элемент с использованием существующей функции
    saveItem(newItem);
  } else if (request.command === "imageProcessed" && request.formattedText) {
    console.log("got formatted text");
    const newItem = {
      itemData: request.formattedText,
    };

    // Сохраняем новый элемент
    saveNewItem(newItem);
  }
});
function saveItem(info) {
  const selected =
    info.selectionText || info.srcUrl || info.linkUrl || info.videoUrl || info.itemData || "";

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
    link: "",
  };

  saveNewItem(newItem);
}

function isImage(url) {
  return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
}

function sendFileToBridge(item) {
  const serverEndpoint = "http://localhost:3000/sendToTelegram";

  try {
    if (item.itemData.startsWith("data:image")) {
      const blob = dataURItoBlob(item.itemData);
      const formData = new FormData();
      formData.append('file', blob, 'file.png');
      formData.append('createdAt', item.createdAt);

      fetch(serverEndpoint, { method: 'POST', body: formData })
        .then(handleResponse)
        .catch(handleError);
    } else {
      fetch(serverEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: item.itemData,
      })
      .then(handleResponse)
      .catch(handleError);
    }
  } catch (error) {
    console.error('Error formatting data:', error.message);
  }
}
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

function handleError(error) {
  console.error('Error sending data to server:', error.message);
  handleNetworkError(error);
}

function handleNetworkError(error) {
  if (error.message.includes('ENOTFOUND')) {
    console.error('Ошибка: Не удалось разрешить DNS. Возможно, проблемы с интернет-соединением.');
  } else {
    console.error('Другая ошибка сети:', error.message);
  }
}

function saveNewItem(item) {
  // sendToServer(item.itemData);

  sendFileToBridge(item);

  console.log("Saving new item:", item);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];
    storedList.push(item);

    chrome.storage.local.set({ yourItemList: storedList }, function () {
      console.log("Item saved successfully:", item);
    });
  });
}

"use strict";

chrome.runtime.onInstalled.addListener(function () {
  // Add a context menu item for selected text
  chrome.contextMenus.create({
    title: "Сохранить к себе",
    id: "save-selected-text",
    contexts: ["selection"],
  });

  // Add a context menu item for images
  chrome.contextMenus.create({
    title: "Сохранить к себе",
    id: "save-image",
    contexts: ["image"],
  });

  // Add a context menu item for clickable links
  chrome.contextMenus.create({
    title: "Сохранить к себе",
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

function saveItem(info) {
  const selectedText = info.selectionText || "";
  const imageUrl = info.srcUrl || "";
  const linkUrl = info.linkUrl || "";

  // Add the new item to your list (modify this according to your list structure)
  const newItem = {
    text: selectedText,
    imageUrl: imageUrl,
    linkUrl: linkUrl,
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

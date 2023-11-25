"use strict";

import "./popup.css";

console.log("This is a popup!");

const listOfItems = document.getElementById("listOfItems");
const clearAllButton = document.getElementById("clearAllButton");
const createItemButton = document.getElementById("createItemButton");
const refreshButton = document.getElementById("refreshButton");
const sendMessage = document.getElementById("sendMessage");
const infoButton = document.getElementById("infoButton");

const pinItemsDiv = document.createElement("div");
const notPinItemsDiv = document.createElement("div");
pinItemsDiv.className = "pin-items-div";
notPinItemsDiv.className = "not-pin-items-div";

const loadingDiv = document.createElement("div");
const loadingSpan = document.createElement("span");
loadingDiv.className = "loading-div";
loadingSpan.textContent = "Loading...";
loadingDiv.appendChild(loadingSpan);
console.log("show loading items");
document.body.appendChild(loadingDiv);

// Load stored data on extension open
loadInterface();

function loadInterface() {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    displayItems(storedItemList);
    console.log("Loaded items:", storedItemList);
  });
}
function getLocalSize() {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse("yourItemList", function (bytesInUse) {
      const size = getCorrectSize(bytesInUse);
      resolve(size);
    });
  });
}
function getNumberOfItems() {
  return new Promise((resolve) => {
    // Получение данных из локального хранилища
    chrome.storage.local.get("yourItemList", function (result) {
      let numberOfItems;
      // Проверка наличия ключа в хранилище
      if ("yourItemList" in result) {
        const itemList = result.yourItemList;
        numberOfItems = itemList.length; // Получение количества элементов
      } else {
        numberOfItems = 0;
      }
      resolve(numberOfItems);
    });
  });
}
function getCorrectSize(bytes) {
  let sizeString, sizeValue;
  if (bytes < 1024) {
    sizeString = "B";
    sizeValue = bytes;
  } else if (bytes < 1024 * 1024) {
    sizeString = "KB";
    sizeValue = bytes / 1024;
  } else {
    sizeString = "MB";
    sizeValue = bytes / (1024 * 1024);
  }
  const size = sizeValue.toFixed(2) + sizeString;
  return size;
}
window.addEventListener("load", (event) => {
  console.log("removing loading items");
  loadingDiv.remove();
});
function displayItems(itemListData) {
  console.log("displaying loaded items");
  pinItemsDiv.innerHTML = "";
  notPinItemsDiv.innerHTML = "";
  itemListData.forEach(function (item) {
    addNewItem(item);
  });
}
function addNewItem(item) {
  const notPinnedItem = document.createElement("div");
  const pinnedItem = document.createElement("div");
  notPinnedItem.className = "item";
  pinnedItem.className = "pin item";

  let itemContent;

  item.hide
    ? item.hide === false || ""
      ? (itemContent = recognitionItems(item))
      : (itemContent = "")
    : (itemContent = recognitionItems(item));

  const editButton = createButtons("Edit", "edit-button", () => editItem(item));
  const deleteButton = createButtons("Delete", "delete-button", () =>
    deleteItem(item.createdAt)
  );

  const pinButton = createButtons(
    item.pinned ? "Unpin" : "Pin",
    "pin-unpin-button",
    () => pinItem(item)
  );
  const hideButton = createButtons(
    item.hide ? "Show" : "Hide",
    "hide-n-show-button",
    () => hideNshowItem(item)
  );

  // Set data-createdAt attribute to the createdAt value
  pinnedItem.dataset.createdAt = item.createdAt;
  notPinnedItem.dataset.createdAt = item.createdAt;

  const targetDiv = item.pinned === true ? pinItemsDiv : notPinItemsDiv;
  const targetItem = item.pinned === true ? pinnedItem : notPinnedItem;

  targetItem.append(
    itemContent,
    editButton,
    deleteButton,
    pinButton,
    hideButton
  );

  targetDiv.insertBefore(targetItem, targetDiv.firstChild);

  listOfItems.append(pinItemsDiv, notPinItemsDiv);
}
function createButtons(label, className, clickHandler) {
  const button = document.createElement("button");
  button.className = className;
  button.innerText = label;
  button.type = "button";
  button.addEventListener("click", clickHandler);
  return button;
}
function deleteItem(createdAt) {
  console.log("Preparing to delete item with createdAt:", createdAt);
  // Вызываем обе функции
  removeItemFromUI(createdAt);
  removeItemFromLocalStorage(createdAt);
}
function removeItemFromUI(createdAt) {
  const itemToRemove = document.querySelector(
    `[data-created-at="${createdAt}"]`
  );

  if (itemToRemove) {
    itemToRemove.remove();
    createAnimatedElement("Item deleted from UI successfully", "#71e997");
  } else {
    createAnimatedElement("Something went wrong during deleting item from UI");
    console.error(
      "Something went wrong during deleting item from UI with createdAt:",
      createdAt
    );
  }
}
function removeItemFromLocalStorage(createdAt) {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];
    const indexToRemove = storedList.findIndex(
      (item) => item.createdAt === createdAt
    );

    if (indexToRemove !== -1) {
      storedList.splice(indexToRemove, 1);

      chrome.storage.local.set({ yourItemList: storedList }, function () {
        createAnimatedElement(
          "Item deleted from local storage successfully",
          "#71e997"
        );
      });
    } else {
      createAnimatedElement("Item not found in local storage");
      console.error(
        "Item not found in local storage with createdAt:",
        createdAt
      );
    }
  });
}
function editItem(item) {
  const textarea = createTextArea(item.itemData);
  const confirmButton = createButtons("Confirm", "confirm-button", () =>
    confirmEdit(item, textarea)
  );
  const cancelButton = createButtons("Cancel", "cancel-button", () =>
    cancelEdit(item)
  );
  const content = document.querySelector(
    `[data-created-at="${item.createdAt}"]`
  );

  content.innerHTML = "";
  content.append(textarea, confirmButton, cancelButton);

  textarea.focus();
}
function pinItem(item) {
  item.pinned = !item.pinned;
  updateItemInLocalStorage(item);
}
function hideNshowItem(item) {
  item.hide = !item.hide;
  const itemToHide = document.querySelector(
    `[data-created-at="${item.createdAt}"]`
  );
  item.hide === true
    ? (itemToHide.removeChild(itemToHide.firstChild),
      updateItemInLocalStorage(item))
    : updateItemInLocalStorage(item);
}
function createTextArea(content) {
  const textarea = document.createElement("textarea");
  textarea.value = content;

  // Используем событие 'input' для динамического изменения высоты при вводе
  textarea.addEventListener("input", function () {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
  // Используем событие 'focus' для корректного изменения высоты при редактировании
  textarea.addEventListener("focus", function () {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  return textarea;
}
function confirmEdit(item, textarea) {
  item.itemData = textarea.value;

  // Update content in local storage
  updateItemInLocalStorage(item);
}
function recognitionItems(item) {
  // Create a new element based on the item type
  let newElement = document.createElement("div");

  if (item.itemData) {
    createTextWithImageElement(newElement, item.itemData);
  } else {
    createEmptyElement(newElement);
  }

  return newElement;
}
function createTextWithImageElement(parent, text) {
  let remainingText = text;

  while (remainingText) {
    const urlMatch = remainingText.match(/https?:\/\/[^ ]+/i);

    if (urlMatch) {
      const textBefore = remainingText.substring(0, urlMatch.index);
      if (textBefore) {
        const textElement = document.createElement("span");
        textElement.appendChild(document.createTextNode(textBefore));
        parent.appendChild(textElement);
      }

      const element = urlMatch[0].match(/\.(png|jpeg|jpg|webp)$/i)
        ? createImageElement(urlMatch[0])
        : createLinkElement(urlMatch[0]);

      parent.appendChild(element);

      remainingText = remainingText.substring(
        urlMatch.index + urlMatch[0].length
      );
    } else {
      const textElement = document.createElement("span");
      textElement.appendChild(document.createTextNode(remainingText));
      parent.appendChild(textElement);
      remainingText = "";
    }
  }
}
function createImageElement(imageUrl) {
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  // // Получение изображения по URL в виде Blob
  // async function getImageBlob(url) {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return blob;
  // }
  // // Преобразование Blob в строку base64
  // function blobToBase64(blob) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = function () {
  //       resolve(reader.result.split(",")[1]);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }
  // // Получение Blob изображения по URL
  // getImageBlob(imageUrl)
  //   .then((blob) => {
  //     // Преобразование Blob в строку base64
  //     return blobToBase64(blob);
  //   })
  //   .then((base64String) => {
  //     // Вывод строки base64 в консоль (можно использовать как нужно)
  //     imgElement.src = `data:image/png;base64,${base64String}`;

  //     const byteSize = base64String.length;
  //     let sizeString, sizeValue;

  //     if (byteSize < 1024) {
  //       sizeString = "B";
  //       sizeValue = byteSize;
  //     } else if (byteSize < 1024 * 1024) {
  //       sizeString = "KB";
  //       sizeValue = byteSize / 1024;
  //     } else {
  //       sizeString = "MB";
  //       sizeValue = byteSize / (1024 * 1024);
  //     }

  //     // Вывод размера в консоль
  //     console.log(`Размер: ${sizeValue.toFixed(2)} ${sizeString}`);
  //   })
  //   .catch((error) => {
  //     console.error("Ошибка:", error);
  //   });
  imgElement.addEventListener("click", function () {
    window.open(imageUrl, "_blank");
  });
  imgElement.style.cursor = "pointer";
  return imgElement;
}
function createLinkElement(linkUrl) {
  const linkElement = document.createElement("a");
  linkElement.href = linkUrl;
  linkElement.target = "_blank";
  linkElement.textContent = linkUrl;
  return linkElement;
}
function createEmptyElement(parentElement) {
  createAnimatedElement("Invalid item type");
  console.error("Invalid item type");
  const empty = document.createElement("span");
  empty.appendChild(document.createTextNode("Empty."));
  parentElement.appendChild(empty);
}
function cancelEdit(item) {
  updateItemInLocalStorage(item);
}
function updateItemInLocalStorage(item) {
  console.log("prepare to update local storage with item:", item);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    // Find the index of the item in local storage
    const index = storedList.findIndex(
      (storedItem) => storedItem.createdAt === item.createdAt
    );

    if (index !== -1) {
      // Update the item's content
      storedList[index] = item;
      console.log(
        "item in stored storage replaced with new item content",
        item
      );

      // Save the updated list to local storage
      chrome.storage.local.set({ yourItemList: storedList }, function () {
        console.log(
          "item in local storage replaced with new item content",
          item
        );
        loadInterface();
      });
    } else {
      createAnimatedElement(
        "something went wrong during updating local storage"
      );
      console.error("something went wrong during updating local storage");
    }
  });
}
let activeItem = null;
function createNewItemWithInput() {
  // Если уже есть активный элемент, удаляем его
  if (activeItem) {
    activeItem.remove();
  }

  const textArea = createTextArea("");
  textArea.placeholder = "Введите текст...";

  const div = document.createElement("div");
  div.className = "item";

  const confirmButton = createButtons("Confirm", "confirm-button", function () {
    const text = textArea.value;
    if (text !== "") {
      const newItem = {
        createdAt: new Date().getTime(),
        title: "",
        itemData: text,
        pinned: false,
        hide: false,
        fav: false,
        color: "",
        tab: "",
        list: "",
      };
      if (newItem) {
        saveNewItem(newItem);
        addNewItem(newItem);
      } else {
        createAnimatedElement(
          "something went wrong during saving new custom item"
        );
        console.error("something went wrong during saving new custom item");
      }
      div.remove();
    } else {
      createAnimatedElement("Новый элемент не может быть пустым!");
    }
  });

  const cancelButton = createButtons("Cancel", "cancel-button", function () {
    div.remove();
  });
  div.append(textArea, confirmButton, cancelButton);

  textArea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      confirmButton.click();
    }
  });
  listOfItems.insertBefore(div, listOfItems.firstChild);

  activeItem = div;
  textArea.focus();
}
function createAnimatedElement(text, bgColor) {
  const existingElements = document.querySelectorAll(".animated-element");

  existingElements.forEach((existingElement) => {
    const currentBottom = parseFloat(existingElement.style.bottom);
    existingElement.style.bottom = `${currentBottom + 45}px`;
    existingElement.animate(
      [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
      { duration: 150, easing: "ease-out", fill: "forwards" }
    );
  });

  const element = document.createElement("div");
  element.className = "animated-element";
  element.style.backgroundColor = bgColor || "#db3232";
  element.style.bottom = "45px";

  const span = document.createElement("span");
  span.textContent = text || "UwU";
  span.style.cssText =
    "display: flex; align-items: center; justify-content: center; width: 100%;";

  element.appendChild(span);
  document.body.appendChild(element);

  const textWidth = span.offsetWidth;
  element.style.width =
    textWidth > parseInt(element.style.width)
      ? textWidth + "px"
      : element.style.width;

  element.animate(
    [
      { transform: "translateY(100%)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 150, easing: "ease-out", fill: "forwards" }
  );

  // Удаляем элемент через 2.5 секунды
  setTimeout(() => element.remove(), 2500);
}
function saveNewItem(item) {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    storedList.push(item);

    chrome.storage.local.set({ yourItemList: storedList }, function () {
      console.log("Item saved successfully:", item);
    });
  });
}
const popupInfo = document.getElementById("popup-info");
async function showInfo() {
  const itemsNumber = document.getElementById("items-number");
  const itemsSize = document.getElementById("items-size");

  const a = await getNumberOfItems();
  const b = await getLocalSize();

  itemsNumber.textContent = a;
  itemsSize.textContent = b;

  popupInfo.style.display = "flex";
}
function hideInfo() {
  const itemsNumber = document.getElementById("items-number");
  const itemsSize = document.getElementById("items-size");

  itemsNumber.textContent = "";
  itemsSize.textContent = "";

  popupInfo.style.display = "none";
}
function clearItemList() {
  pinItemsDiv.innerHTML = "";
  notPinItemsDiv.innerHTML = "";
  createAnimatedElement("all items deleted from interface", "#71e997");

  chrome.storage.local.remove("yourItemList");
  createAnimatedElement("all items deleted from local storage", "#71e997");

  loadInterface();
}
infoButton.addEventListener("mouseenter", showInfo);
infoButton.addEventListener("mouseleave", hideInfo);
clearAllButton.addEventListener("click", clearItemList);
createItemButton.addEventListener("click", createNewItemWithInput);
refreshButton.addEventListener("click", loadInterface);
sendMessage.addEventListener("click", () =>
  createAnimatedElement("Проверка-проверка!!")
);

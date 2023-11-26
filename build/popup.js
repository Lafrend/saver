/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.css":
/*!***********************!*\
  !*** ./src/popup.css ***!
  \***********************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup.css */ "./src/popup.css");
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_0__);




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

// document.getElementById("list").addEventListener("contextmenu", function (event) {
//   event.preventDefault();

//   const contextMenu = document.getElementById("customContextMenu");
//   contextMenu.style.left = event.pageX + "px";
//   contextMenu.style.top = event.pageY + "px";
//   contextMenu.classList.remove("hidden");

//   // Добавьте обработчики для пунктов меню
//   document.getElementById("menuItem1").addEventListener("click", function () {
//     alert("Menu Item 1 clicked!");
//     contextMenu.classList.add("hidden");
//   });

//   document.getElementById("menuItem2").addEventListener("click", function () {
//     alert("Menu Item 2 clicked!");
//     contextMenu.classList.add("hidden");
//   });

//   document.getElementById("menuItem3").addEventListener("click", function () {
//     alert("Menu Item 3 clicked!");
//     contextMenu.classList.add("hidden");
//   });
// });
// // Скрыть контекстное меню при клике вне его
// document.addEventListener("click", function () {
//   const contextMenu = document.getElementById("customContextMenu");
//   contextMenu.classList.add("hidden");
// });
createTabsInHeader();
loadInterface();

function loadInterface(tab) {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    console.log("items in local:", storedItemList);
    const tabToDisplay = tab ?? "";
    console.log("displaying", tabToDisplay);
    displayItems(filterItemsByTab(storedItemList, tabToDisplay));
  });
}
function filterItemsByTab(itemList, tabToDisplay) {
  return (tabToDisplay === "" || tabToDisplay === "Main")
    ? itemList
    : itemList.filter((item) => item.tab === tabToDisplay);
}
async function getLocalSize() {
  const bytesInUse = await new Promise((resolve) => {
    chrome.storage.local.getBytesInUse("yourItemList", resolve);
  });
  return getCorrectSize(bytesInUse);
}
async function getNumberOfItems() {
  try {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get("yourItemList", resolve);
    });
    const itemList = result.yourItemList || [];
    const numberOfItems = itemList.length;
    return numberOfItems;
  } catch (error) {
    return 0;
  }
}
function getCorrectSize(bytes) {
  const sizeUnits = ["B", "KB", "MB"];
  let unitIndex = 0;
  while (bytes >= 1024 && unitIndex < sizeUnits.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }
  return bytes.toFixed(2) + sizeUnits[unitIndex];
}
window.addEventListener("load", (event) => {
  console.log("removing loading items");
  loadingDiv.remove();
});
function displayItems(itemListData) {
  console.log("displaying loaded items", itemListData);
  pinItemsDiv.innerHTML = "";
  notPinItemsDiv.innerHTML = "";
  itemListData.forEach(function (item) {
    addNewItem(item);
  });
}
function createTabsInHeader() {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    const uniqueTabs = Array.from(
      new Set(storedItemList.map((item) => item.tab))
    );
    const tabsToDisplay = [
      "Main",
      "Fav",
      ...uniqueTabs.filter((tab) => tab && !["Main", "Fav"].includes(tab)),
    ];
    const tabList = document.getElementById("tab-list");
    tabList.innerHTML = "";

    tabsToDisplay.forEach((tabName) => {
      const tabElement = createTabElement(tabName);
      tabList.appendChild(tabElement);
    });
    highlightActiveTab("Main");
  });
}
function createTabElement(tabName) {
  const tabElement = document.createElement("div");
  tabElement.innerText = tabName;
  tabElement.id = tabName;
  tabElement.className = "tab other-tab";
  tabElement.addEventListener("click", () => {
    highlightActiveTab(tabName);
    tabName === "Main" ? loadInterface() : loadInterface(tabName);
  });
  return tabElement;
}
function highlightActiveTab(activeTab) {
  const tabList = document.getElementById("tab-list");
  tabList.childNodes.forEach((tab) => {
    tab.className = tab.id === activeTab ? "tab active-tab" : "tab other-tab";
  });
}
function addNewItem(item) {
  const notPinnedItem = createItemElement("item");
  const pinnedItem = createItemElement("pin item");

  const itemContent = item.hide
    ? item.hide === false
      ? recognitionItems(item)
      : ""
    : recognitionItems(item);

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
  const moveButton = createButtons("Move", "move-button", () => {
    moveButton.appendChild(buildDropdownMenu(item));
  });

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
    hideButton,
    moveButton
  );

  targetDiv.insertBefore(targetItem, targetDiv.firstChild);

  listOfItems.append(pinItemsDiv, notPinItemsDiv);
}
function createItemElement(className) {
  const itemElement = document.createElement("div");
  itemElement.className = className;
  return itemElement;
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
function buildDropdownMenu(item) {
  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu";

  const tabList = document.getElementById("tab-list");
  tabList.childNodes.forEach((tab) => {
    const tabElement = document.createElement("div");
    tabElement.innerText = tab.innerText;
    tabElement.addEventListener("click", () => {
      moveItemToTab(item, tabElement.innerText);
    });
    dropdownMenu.appendChild(tabElement);
  });

  return dropdownMenu;
}
function moveItemToTab(item, tabToMove) {
  item.tab = tabToMove;
  updateItemInLocalStorage(item);
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
        loadInterface(getCurrentTab());
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

  const activeTab = getCurrentTab();

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
        tab: activeTab,
        list: "",
      };
      saveNewItem(newItem)
        .then(() => loadInterface(activeTab))
        .catch((error) => {
          createAnimatedElement(
            "something went wrong during saving new custom item"
          );
          console.error("Error during saving new item:", error);
          // Обработка ошибок при сохранении
        });
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
function getCurrentTab() {
  const activeTabElement = document.querySelector(".active-tab");
  let activeTab = "";
  if (activeTabElement) {
    activeTab = activeTabElement.innerText;
    return activeTab;
  }
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
  console.log("saving item");
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("yourItemList", function (data) {
      const storedList = data.yourItemList || [];

      storedList.push(item);

      chrome.storage.local.set({ yourItemList: storedList }, function () {
        console.log("Item saved successfully:", item);
        resolve();
      });
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

  loadInterface(getCurrentTab());
}
infoButton.addEventListener("mouseenter", showInfo);
infoButton.addEventListener("mouseleave", hideInfo);
clearAllButton.addEventListener("click", clearItemList);
createItemButton.addEventListener("click", createNewItemWithInput);
refreshButton.addEventListener("click", () => loadInterface(getCurrentTab()));
sendMessage.addEventListener("click", () =>
  createAnimatedElement("Проверка-проверка!!")
);

})();

/******/ })()
;
//# sourceMappingURL=popup.js.map
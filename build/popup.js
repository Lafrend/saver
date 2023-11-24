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

const pinItemsDiv = document.createElement("div");
const notPinItemsDiv = document.createElement("div");
pinItemsDiv.className = "pin-items-div";
notPinItemsDiv.className = "not-pin-items-div";

const loadingDiv = document.createElement("div");
const loadingSpan = document.createElement("span");
const backgroundDiv = document.createElement("div");
backgroundDiv.className = "background-div";
loadingDiv.className = "loading-div";
loadingSpan.textContent = "Loading...";
loadingDiv.appendChild(loadingSpan);
console.log("show loading items");
document.body.appendChild(loadingDiv);
document.body.appendChild(backgroundDiv);

// Load stored data on extension open
chrome.storage.local.get("yourItemList", function (data) {
  console.log("loading stoared items");
  const storedItemList = data.yourItemList || [];
  displayItems(storedItemList);
  console.log("This code runs after loading stored items.");
});

window.addEventListener("load", (event) => {
  console.log("removing loading items");
  loadingDiv.remove();
  backgroundDiv.remove();
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
  console.log("prepare to adding item to interface...", item);
  const notPinnedItem = document.createElement("div");
  const pinnedItem = document.createElement("div");
  notPinnedItem.className = "item";
  pinnedItem.className = "pin item";

  let itemContent = recognitionItems(item);

  const editButton = createButtons("Edit", "edit-button", () =>
    editItem(item, itemContent)
  );
  const deleteButton = createButtons("Delete", "delete-button", () =>
    deleteItem(item.createdAt)
  );

  const pinButton =
    item.pinned === "true"
      ? createButtons("Unpin", "unpin-button", () => pinItem(item))
      : createButtons("Pin", "pin-button", () => pinItem(item));

  // Set data-createdAt attribute to the createdAt value
  pinnedItem.dataset.createdAt = item.createdAt;
  notPinnedItem.dataset.createdAt = item.createdAt;

  const targetDiv = item.pinned === "true" ? pinItemsDiv : notPinItemsDiv;
  const targetItem = item.pinned === "true" ? pinnedItem : notPinnedItem;

  targetItem.append(itemContent, editButton, deleteButton, pinButton);

  targetDiv.insertBefore(targetItem, targetDiv.firstChild);

  listOfItems.append(pinItemsDiv, notPinItemsDiv);
}

// Function to create a button with a specific label and click handler
function createButtons(label, className, clickHandler) {
  const button = document.createElement("button");
  button.className = className;
  button.innerText = label;
  button.type = "button";
  button.addEventListener("click", clickHandler);
  return button;
}

function deleteItem(createdAt) {
  console.log("prepare to delete item with createdAt:", createdAt);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    const indexToRemove = storedList.findIndex(
      (item) => item.createdAt === createdAt
    );

    if (indexToRemove !== -1) {
      const itemToRemove = document.querySelector(
        `[data-created-at="${createdAt}"]`
      );

      if (itemToRemove) {
        // Добавляем класс с анимацией перед удалением
        itemToRemove.classList.add("slide-out");

        // Ждем завершения анимации, затем удаляем из интерфейса и обновляем хранилище
        setTimeout(() => {
          itemToRemove.remove();

          storedList.splice(indexToRemove, 1);
          chrome.storage.local.set({ yourItemList: storedList }, function () {
            createAnimatedElement("Item deleted successfully");
            console.log("Item deleted successfully with createdAt:", createdAt);
          });
        }, 500); // 500 миллисекунд – время анимации
      } else {
        createAnimatedElement("something went wrong during deleting item");
        console.error(
          "something went wrong during deleting item with createdAt:",
          createdAt
        );
      }
    }
  });
}

// Function to handle item editing
function editItem(item, content) {
  console.log("prepare to edit item:", item);
  const textarea = createTextArea(item.itemData);
  const confirmButton = createButtons("Confirm", "confirm-button", () =>
    confirmEdit(item, content, textarea)
  );
  const cancelButton = createButtons("Cancel", "cancel-button", () =>
    cancelEdit(item, content, textarea)
  );

  // Remove the existing buttons
  const div = content.parentElement;
  const editButton = div.querySelector(".edit-button");
  const deleteButton = div.querySelector(".delete-button");
  const pinButton =
    item.pinned == "true"
      ? div.querySelector(".unpin-button")
      : div.querySelector(".pin-button");
  editButton?.remove();
  deleteButton?.remove();
  pinButton?.remove();

  content.replaceWith(textarea);

  // Append buttons to the list item
  div.appendChild(confirmButton);
  div.appendChild(cancelButton);

  textarea.focus();

  console.log("editing item....", item);
}

function pinItem(item) {
  item.pinned = String(!(item.pinned === "true"));

  updateLocalStorage(item);
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

function confirmEdit(item, content, textarea) {
  console.log("prepare to confirm editing item:", item);
  item.itemData = textarea.value;

  // Update content in local storage
  updateLocalStorage(item);

  let newElement = recognitionItems(item);

  // Replace the textarea with the new element
  const div = textarea.parentElement;

  if (div) {
    const index = Array.from(div.parentElement.children).indexOf(div);

    if (index !== -1) {
      div.replaceChild(newElement, textarea);
      console.log("editing blank replaced with new element");

      // Remove confirm and cancel buttons
      const confirmButton = div.querySelector(".confirm-button");
      const cancelButton = div.querySelector(".cancel-button");
      confirmButton?.remove();
      cancelButton?.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () =>
        editItem(item, newElement)
      );
      const deleteButton = createButtons("Delete", "delete-button", () =>
        deleteItem(item.createdAt)
      );
      const pinButton =
        item.pinned === "true"
          ? createButtons("Unpin", "unpin-button", () => pinItem(item))
          : createButtons("Pin", "pin-button", () => pinItem(item));
      div.appendChild(editButton);
      div.appendChild(deleteButton);
      div.appendChild(pinButton);
    }
  }
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
  console.log("replacing editing blank with custom...", text);
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

function cancelEdit(item, content, textarea) {
  console.log("prepare to cancel editing item:", item);
  // Replace the textarea with the original span
  const div = textarea.parentElement;

  if (div) {
    const index = Array.from(div.parentElement.children).indexOf(div);

    if (index !== -1) {
      div.replaceChild(content, textarea);
      console.log("editing canceled");

      // Remove confirm and cancel buttons
      const confirmButton = div.querySelector(".confirm-button");
      const cancelButton = div.querySelector(".cancel-button");
      confirmButton?.remove();
      cancelButton?.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () =>
        editItem(item, content)
      );
      const deleteButton = createButtons("Delete", "delete-button", () =>
        deleteItem(item.createdAt)
      );
      const pinButton =
        item.pinned === "true"
          ? createButtons("Unpin", "unpin-button", () => pinItem(item))
          : createButtons("Pin", "pin-button", () => pinItem(item));
      div.appendChild(editButton);
      div.appendChild(deleteButton);
      div.appendChild(pinButton);
    } else {
      createAnimatedElement("something went wrong during canceling editing");
      console.error("something went wrong during canceling editing", item);
    }
  }
}

function updateLocalStorage(item) {
  console.log("prepare to update local storage with item:", item);
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    // Find the index of the item in local storage
    const index = storedList.findIndex(
      (storedItem) => storedItem.createdAt === item.createdAt
    );

    if (index !== -1) {
      // Update the item's content
      storedList[index].itemData = item.itemData;
      storedList[index].pinned = item.pinned;
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
      });
    } else {
      createAnimatedElement(
        "something went wrong during updating local storage"
      );
      console.error("something went wrong during updating local storage");
    }
    displayItems(storedList);
  });
}

let activeItem = null;

function createNewItemWithInput() {
  console.log("creating new custom item");
  // Если уже есть активный элемент, удаляем его
  if (activeItem) {
    activeItem.remove();
    activeItem = null;
  }

  const textArea = createTextArea("");

  const div = document.createElement("div");
  div.className = "item";

  textArea.placeholder = "Введите текст...";
  div.appendChild(textArea);

  const confirmButton = createButtons("Confirm", "confirm-button", function () {
    console.log("confirmin creating new custom item...");
    const text = textArea.value.trim();
    if (text !== "") {
      // Обработка текста и фрагментов изображений
      const newItem = {
        itemData: text,
        createdAt: new Date().getTime(),
      };
      if (newItem) {
        console.log("saving new custom item...");
        saveNewItem(newItem);
      } else {
        createAnimatedElement(
          "something went wrong during saving new custom item"
        );
        console.error("something went wrong during saving new custom item");
      }
      div.remove();
      // Add the new item to the interface
      if (newItem) {
        console.log("adding new custom item to the interface...");
        addNewItem(newItem);
      } else {
        createAnimatedElement(
          "something went wrong during adding new custom item to interface"
        );
        console.error(
          "something went wrong during adding new custom item to interface"
        );
      }
    } else {
      createAnimatedElement("Новый элемент не может быть пустым!");
    }
  });
  div.appendChild(confirmButton);

  const cancelButton = createButtons("Cancel", "cancel-button", function () {
    div.remove();
  });
  div.appendChild(cancelButton);

  textArea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Нажата клавиша Enter, вызываем click на кнопке
      confirmButton.click();
    }
  });

  // Add the new item to the interface
  listOfItems.insertBefore(div, listOfItems.firstChild);

  // Set the new active item
  activeItem = div;

  // Set focus on the input field when creating a new item
  textArea.focus();
}

function createAnimatedElement(text, bgColor) {
  const existingElements = document.querySelectorAll(".animated-element");

  existingElements.forEach((existingElement) => {
    const currentBottom = parseFloat(existingElement.style.bottom);
    existingElement.style.bottom = `${currentBottom + 45}px`; // Увеличиваем расстояние между элементами
    existingElement.animate(
      [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
      {
        duration: 150,
        easing: "ease-out",
        fill: "forwards",
      }
    );
  });

  // Создаем новый элемент
  const element = document.createElement("div");
  element.className = "animated-element";
  element.style.background = bgColor || "#db3232";
  element.style.bottom = "45px";

  const span = document.createElement("span");
  span.textContent = text || "UwU";
  span.style.display = "flex";
  span.style.alignItems = "center";
  span.style.justifyContent = "center";
  span.style.width = "100%"; // Заполняем всю ширину span для выравнивания текста

  element.appendChild(span);
  document.body.appendChild(element);

  const textWidth = span.offsetWidth;

  if (textWidth > parseInt(element.style.width)) {
    // Если ширина текста больше ширины элемента, увеличиваем ширину элемента
    element.style.width = textWidth + "px";
  }

  /// Добавляем анимацию
  element.animate(
    [
      { transform: "translateY(100%)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    {
      duration: 150,
      easing: "ease-out",
      fill: "forwards",
    }
  );

  // Удаляем элемент через 2.5 секунды
  setTimeout(() => {
    element.remove();
  }, 2500);
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

clearAllButton.addEventListener("click", clearItemList);
createItemButton.addEventListener("click", createNewItemWithInput);
sendMessage.addEventListener("click", () =>
  createAnimatedElement("Проверка-проверка!!")
);

function clearItemList() {
  console.log("prepare to delete all items");
  pinItemsDiv.innerHTML = "";
  notPinItemsDiv.innerHTML = "";
  console.log("items deleted from interface");
  chrome.storage.local.remove("yourItemList");
  console.log("items deleted from local storage");

  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    displayItems(storedItemList);
  });
}

refreshButton.addEventListener("click", function () {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    displayItems(storedItemList);
  });
});

})();

/******/ })()
;
//# sourceMappingURL=popup.js.map
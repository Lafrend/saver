/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.css":
/*!***********************!*\
  !*** ./src/popup.css ***!
  \***********************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/popup.js":
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup.css */ "./src/popup.css");
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_0__);




const getLocalStorage = async (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, resolve);
  });
};

let dLStorage = await getLocalStorage("yourItemList");
let storedItemList = dLStorage.yourItemList || [];
console.log("Loaded items:", storedItemList);
dLStorage = null;

// import "./loadnshowelements";
// import "./mainModule";
// import "./mainfunctional";
// import "./storageModule";

console.log("This is a popup!");

const getById = (id) => document.getElementById(id);

const listOfItems = getById("listOfItems"),
  clearAllButton = getById("clearAllButton"),
  createItemButton = getById("createItemButton"),
  refreshButton = getById("refreshButton"),
  sendMessage = getById("sendMessage"),
  infoButton = getById("infoButton"),
  create1000 = getById("create1000"),
  conMenu = getById("customContextMenu"),
  pinItemsDiv = createElements("div"),
  notPinItemsDiv = createElements("div"),
  loadingDiv = createElements("div"),
  loadingSpan = createElements("span");

pinItemsDiv.className = "pin-items-div";
notPinItemsDiv.className = "not-pin-items-div";
loadingDiv.className = "loading-div";
loadingSpan.textContent = "Loading...";

loadingDiv.appendChild(loadingSpan);
console.log("show loading items");
document.body.appendChild(loadingDiv);

// listOfItems.addEventListener("contextmenu", function (event) {
//   const target = event.target;
//   const itemElement = findParentWithClass(target, "item");
//   if (itemElement) {
//     event.preventDefault();

//     const contextMenu = document.getElementById("customContextMenu");

//     // Задаем ширину и высоту контекстного меню
//     const menuWidth = contextMenu.offsetWidth;
//     const menuHeight = contextMenu.offsetHeight;

//     // Задаем максимальное расстояние от края страницы, при котором меню будет открываться слева или справа
//     const maxDistanceX = 20;

//     // Получаем размеры окна браузера
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;

//     // Вычисляем доступное пространство справа и слева от курсора
//     const spaceRight = windowWidth - event.pageX;
//     const spaceLeft = event.pageX;

//     // Определяем, где открывать контекстное меню: справа или слева
//     const openRight = spaceRight >= menuWidth || spaceRight >= spaceLeft;

//     // Устанавливаем положение контекстного меню
//     if (openRight) {
//       contextMenu.style.left =
//         Math.min(event.pageX, windowWidth - menuWidth - maxDistanceX) + "px";
//     } else {
//       contextMenu.style.left =
//         Math.max(event.pageX - menuWidth, maxDistanceX) + "px";
//     }

//     contextMenu.style.top =
//       Math.min(event.pageY, windowHeight - menuHeight) + "px";
//     contextMenu.classList.remove("hidden");

//     // // Добавьте обработчики для пунктов меню
//     // document.getElementById("menuItem1").addEventListener("click", function () {
//     //   alert("Menu Item 1 clicked!");
//     //   contextMenu.classList.add("hidden");
//     // });

//     // document.getElementById("menuItem2").addEventListener("click", function () {
//     //   alert("Menu Item 2 clicked!");
//     //   contextMenu.classList.add("hidden");
//     // });

//     // document.getElementById("menuItem3").addEventListener("click", function () {
//     //   alert("Menu Item 3 clicked!");
//     //   contextMenu.classList.add("hidden");
//     // });
//   }
// });
// function findParentWithClass(element, className) {
//   // Функция ищет родительский элемент с заданным классом
//   while (element && !element.classList.contains(className)) {
//     element = element.parentElement;
//   }
//   return element;
// }
// // Скрыть контекстное меню при клике вне его
// document.addEventListener("click", function () {
//   const contextMenu = document.getElementById("customContextMenu");
//   contextMenu.classList.add("hidden");
// });

async function loadInterface(tab) {
  try {
    const tabToDisplay = tab || "";
    console.log("displaying", tabToDisplay);
    displayItems(filterItemsByTab(storedItemList, tabToDisplay));
  } catch (error) {
    console.error(`Error in loadInterface: ${error}`);
  }
}
createTabsInHeader();
loadInterface();

// listOfItems.addEventListener("click", (event) => {
//   const target = event.target;
//   if (target.classList.contains("delete-button")) {
//     const createdAt = target.closest(".item").dataset.createdAt;
//     deleteItem(createdAt);
//   } else if (target.classList.contains("edit-button")) {
//     editItem(item);
//   }
//   // ... add similar checks for other dynamic buttons
// });

function filterItemsByTab(itemList, tabToDisplay) {
  return tabToDisplay === "" || tabToDisplay === "Main"
    ? itemList
    : itemList.filter((item) => item.tab === tabToDisplay);
}
const getLocalSize = async () => {
  const bytesInUse = await new Promise((resolve) => {
    chrome.storage.local.getBytesInUse("yourItemList", resolve);
  });
  return await getCorrectSize(bytesInUse);
};
const getNumberOfItems = async () => {
  try {
    const numberOfItems = storedItemList.length;
    return numberOfItems;
  } catch (error) {
    console.error(`Ошибка в getNumberOfItems: ${error}`);
    return 0;
  }
};
const getCorrectSize = async (bytes) => {
  const sizeUnits = ["B", "KB", "MB"];
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < sizeUnits.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toFixed(2)} ${sizeUnits[unitIndex]}`;
};
window.addEventListener("load", (event) => {
  console.log("removing loading items");
  loadingDiv.remove();
});
function displayItems(itemListData) {
  console.log("displaying loaded items", itemListData);
  pinItemsDiv.innerHTML = "";
  notPinItemsDiv.innerHTML = "";
  itemListData.map((item) => addNewItem(item));
}
function highlightActiveTab(activeTab) {
  const tabList = document.getElementById("tab-list");
  tabList.childNodes.forEach((tab) => {
    tab.className = tab.id === activeTab ? "tab active-tab" : "tab other-tab";
  });
}
function addNewItem(item) {
  const notPinnedItem = createElements("div", "item");
  const pinnedItem = createElements("div", "pin item");

  const itemContent = item.hide
    ? item.hide === false
      ? recognitionItems(item)
      : ""
    : recognitionItems(item);

  const editButton = createButton("Edit", "edit-button", () => editItem(item));
  const deleteButton = createButton("Delete", "delete-button", () =>
    deleteItem(item.createdAt)
  );
  const pinButton = createButton(
    item.pinned ? "Unpin" : "Pin",
    "pin-unpin-button",
    () => pinItem(item)
  );
  const hideButton = createButton(
    item.hide ? "Show" : "Hide",
    "hide-n-show-button",
    () => hideNshowItem(item)
  );

  // const moveDropdownList = createDropdownList(item);
  // moveDropdownList.className = "move-dropdown-list";
  const moveButton = createButton("Move", "move-button", () => {
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
    //moveDropdownList,
  );

  targetDiv.insertBefore(targetItem, targetDiv.firstChild);

  listOfItems.append(pinItemsDiv, notPinItemsDiv);
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
    createMessage("Item deleted from UI successfully", "#71e997");
  } else {
    createMessage("Something went wrong during deleting item from UI");
    console.error(
      "Something went wrong during deleting item from UI with createdAt:",
      createdAt
    );
  }
}
function removeItemFromLocalStorage(createdAt) {
  const indexToRemove = storedItemList.findIndex(
    (item) => item.createdAt === createdAt
  );

  if (indexToRemove !== -1) {
    storedItemList.splice(indexToRemove, 1);

    chrome.storage.local.set({ yourItemList: storedItemList }, function () {
      createMessage("Item deleted from local storage successfully", "#71e997");
    });
  } else {
    createMessage("Item not found in local storage");
    console.error("Item not found in local storage with createdAt:", createdAt);
  }
}
function editItem(item) {
  const textarea = createTextArea(item.itemData);
  const confirmButton = createButton("Confirm", "confirm-button", () =>
    confirmEdit(item, textarea)
  );
  const cancelButton = createButton("Cancel", "cancel-button", () =>
    cancelEdit()
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

// function hideNshowItem(item) {
//   const itemToHide = getById("listOfItems").querySelector(
//     `[data-created-at="${item.createdAt}"]`
//   );

//   if (itemToHide) {
//     item.hide === true
//       ? itemToHide.removeChild(itemToHide.firstChild)
//       : updateItemInLocalStorage(item);
//   } else {
//     // ... handle error
//   }
// }

function buildDropdownMenu(item) {
  const dropdownMenu = createElements("div", "dropdown-menu");

  const tabList = document.getElementById("tab-list");
  tabList.childNodes.forEach((tab) => {
    const tabElement = createElements("div");
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

function confirmEdit(item, textarea) {
  item.itemData = textarea.value;
  updateItemInLocalStorage(item);
}
function cancelEdit() {
  loadInterface(getCurrentTab());
}
function recognitionItems(item) {
  // Create a new element based on the item type
  let newElement = document.createElement("div");

  if (typeof item.itemData === 'string' && item.itemData.trim() !== '') {
    createTextWithImageElement(newElement, item.itemData);
  } else {
    createEmptyElement(newElement);
  }

  return newElement;
}

function updateItemInLocalStorage(item) {
  console.log("prepare to update local storage with item:", item);

  // Find the index of the item in local storage
  const index = storedItemList.findIndex(
    (storedItem) => storedItem.createdAt === item.createdAt
  );

  if (index !== -1) {
    // Update the item's content
    storedItemList[index] = item;
    console.log("item in stored storage replaced with new item content", item);

    // Save the updated list to local storage
    chrome.storage.local.set({ yourItemList: storedItemList }, function () {
      console.log("item in local storage replaced with new item content", item);
      loadInterface(getCurrentTab());
    });
  } else {
    createMessage("something went wrong during updating local storage");
    console.error("something went wrong during updating local storage");
  }
}
let activeItem = null;

function getCurrentTab() {
  const activeTabElement = document.querySelector(".active-tab");
  let activeTab = "";
  if (activeTabElement) {
    activeTab = activeTabElement.innerText;
    return activeTab;
  }
}

async function saveNewItem(item) {
  console.log("saving item");
  return new Promise((resolve, reject) => {
    storedItemList.push(item);

    chrome.storage.local.set({ yourItemList: storedItemList }, function () {
      console.log("Item saved successfully:", item);
      resolve();
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
  createMessage("all items deleted from interface", "#71e997");

  chrome.storage.local.remove("yourItemList");
  createMessage("all items deleted from local storage", "#71e997");

  loadInterface(getCurrentTab());
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

function createNewItemWithInput() {
  // Если уже есть активный элемент, удаляем его
  if (activeItem) {
    activeItem.remove();
  }

  const activeTab = getCurrentTab();

  const textArea = createTextArea("");
  textArea.placeholder = "Введите текст...";

  const div = createElements("div", "item");

  const confirmButton = createButton("Confirm", "confirm-button", function () {
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
          createMessage("something went wrong during saving new custom item");
          console.error("Error during saving new item:", error);
          // Обработка ошибок при сохранении
        });
      div.remove();
    } else {
      createMessage("Новый элемент не может быть пустым!");
    }
  });

  const cancelButton = createButton("Cancel", "cancel-button", function () {
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

function createTextWithImageElement(parent, text) {
  let remainingText = text;

  while (remainingText) {
    // Распознавание текста изображения (начинающегося с "data:image/") с использованием регулярного выражения
    const imageDataMatch = remainingText.match(/data:image\/[^ ]+/i);

    if (imageDataMatch) {
      const textBefore = remainingText.substring(0, imageDataMatch.index);
      if (textBefore) {
        const textElement = document.createElement("span");
        textElement.appendChild(document.createTextNode(textBefore));
        parent.appendChild(textElement);
      }

      const imgElement = createImageElement(imageDataMatch[0]);
      parent.appendChild(imgElement);

      remainingText = remainingText.substring(
        imageDataMatch.index + imageDataMatch[0].length
      );
    } else {
      // Если не найдено совпадение для текста изображения, продолжаем поиск обычных URL
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
}

function createMessage(text, bgColor) {
  const existingElements = document.querySelectorAll(".animated-element");

  existingElements.forEach((existingElement) => {
    const currentBottom = parseFloat(existingElement.style.bottom);
    existingElement.style.bottom = `${currentBottom + 45}px`;
    existingElement.animate(
      [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
      { duration: 150, easing: "ease-out", fill: "forwards" }
    );
  });

  const element = createElements("div", "animated-element");
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

function createNumberedList(number) {
  console.log(`creating ${number} items`);
  const itemList = [];

  for (let i = 1; i <= number; i++) {
    const newItem = {
      createdAt: new Date().getTime(),
      title: "",
      itemData: `item №${i}`,
      pinned: false,
      hide: false,
      fav: false,
      color: "",
      tab: "",
      list: "",
    };

    itemList.push(newItem);
  }
  itemList.forEach(function (item) {
    addNewItem(item);
  });
}

function createImageElement(imageUrl) {
  const imgElement = document.createElement("img");
  imgElement.loading = "lazy";
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
  createMessage("Invalid item type");
  const empty = document.createElement("span");
  empty.appendChild(document.createTextNode("UwU"));
  parentElement.appendChild(empty);
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

function createElements(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function createButton(label, className, clickHandler) {
  const button = createElements("button", className);
  button.innerText = label;
  button.type = "button";
  button.addEventListener("click", clickHandler);
  return button;
}

function createDropdownList(item) {
  const dropdownList = document.createElement("select");
  dropdownList.className = "dropdown-list";

  const defaultOption = document.createElement("option");
  defaultOption.text = "Move to...";
  defaultOption.value = "";
  dropdownList.add(defaultOption);

  const tabList = document.getElementById("tab-list");
  tabList.childNodes.forEach((tab) => {
    const option = document.createElement("option");
    option.value = tab.innerText;
    option.text = tab.innerText;
    dropdownList.add(option);
  });

  dropdownList.addEventListener("change", () => {
    moveItemToTab(item, dropdownList.value);
  });

  return dropdownList;
}

function createTabsInHeader() {
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
}

infoButton.addEventListener("mouseenter", () => showInfo());
infoButton.addEventListener("mouseleave", () => hideInfo());
clearAllButton.addEventListener("click", clearItemList);
createItemButton.addEventListener("click", createNewItemWithInput);
refreshButton.addEventListener("click", () => loadInterface(getCurrentTab()));
sendMessage.addEventListener("click", () =>
  createMessage("Проверка-проверка!!")
);
create1000.addEventListener("click", () => createNumberedList(1000));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/popup.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map
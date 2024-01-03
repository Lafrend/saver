"use strict";

import "./popup.css";

console.log("This is a popup!");

const getById = (id) => document.getElementById(id);
const create = (tag) => document.createElement(tag);

const listOfItems = getById("listOfItems");
const clearAllButton = getById("clearAllButton");
const createItemButton = getById("createItemButton");
const refreshButton = getById("refreshButton");
const sendMessage = getById("sendMessage");
const infoButton = getById("infoButton");
const create1000 = getById("create1000");
const conMenu = getById("customContextMenu");

const pinItemsDiv = create("div");
const notPinItemsDiv = create("div");
pinItemsDiv.className = "pin-items-div";
notPinItemsDiv.className = "not-pin-items-div";

const loadingDiv = create("div");
const loadingSpan = create("span");
loadingDiv.className = "loading-div";
loadingSpan.textContent = "Loading...";
loadingDiv.appendChild(loadingSpan);
console.log("show loading items");
document.body.appendChild(loadingDiv);

listOfItems.addEventListener("contextmenu", function (event) {
  const target = event.target;
  const itemElement = findParentWithClass(target, "item");
  if (itemElement) {
    event.preventDefault();

    const contextMenu = document.getElementById("customContextMenu");

    // Задаем ширину и высоту контекстного меню
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;

    // Задаем максимальное расстояние от края страницы, при котором меню будет открываться слева или справа
    const maxDistanceX = 20;

    // Получаем размеры окна браузера
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Вычисляем доступное пространство справа и слева от курсора
    const spaceRight = windowWidth - event.pageX;
    const spaceLeft = event.pageX;

    // Определяем, где открывать контекстное меню: справа или слева
    const openRight = spaceRight >= menuWidth || spaceRight >= spaceLeft;

    // Устанавливаем положение контекстного меню
    if (openRight) {
      contextMenu.style.left =
        Math.min(event.pageX, windowWidth - menuWidth - maxDistanceX) + "px";
    } else {
      contextMenu.style.left =
        Math.max(event.pageX - menuWidth, maxDistanceX) + "px";
    }

    contextMenu.style.top =
      Math.min(event.pageY, windowHeight - menuHeight) + "px";
    contextMenu.classList.remove("hidden");

    // // Добавьте обработчики для пунктов меню
    // document.getElementById("menuItem1").addEventListener("click", function () {
    //   alert("Menu Item 1 clicked!");
    //   contextMenu.classList.add("hidden");
    // });

    // document.getElementById("menuItem2").addEventListener("click", function () {
    //   alert("Menu Item 2 clicked!");
    //   contextMenu.classList.add("hidden");
    // });

    // document.getElementById("menuItem3").addEventListener("click", function () {
    //   alert("Menu Item 3 clicked!");
    //   contextMenu.classList.add("hidden");
    // });
  }
});
function findParentWithClass(element, className) {
  // Функция ищет родительский элемент с заданным классом
  while (element && !element.classList.contains(className)) {
    element = element.parentElement;
  }
  return element;
}
// Скрыть контекстное меню при клике вне его
document.addEventListener("click", function () {
  const contextMenu = document.getElementById("customContextMenu");
  contextMenu.classList.add("hidden");
});

const getLocalStorage = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, resolve);
  });
};

let dLStorage = await getLocalStorage("yourItemList");
let storedItemList = dLStorage.yourItemList || [];
dLStorage = null;

async function loadInterface(tab) {
  try {
    console.log("items in local:", storedItemList);
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
async function getLocalSize() {
  const bytesInUse = await new Promise((resolve) => {
    chrome.storage.local.getBytesInUse("yourItemList", resolve);
  });
  return getCorrectSize(bytesInUse);
}
async function getNumberOfItems() {
  try {
    const numberOfItems = storedItemList.length;
    return numberOfItems;
  } catch (error) {
    console.error(`Ошибка в getNumberOfItems: ${error}`);
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

  return `${bytes.toFixed(2)} ${sizeUnits[unitIndex]}`;
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

  // const moveDropdownList = createDropdownList(item);
  // moveDropdownList.className = "move-dropdown-list";
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
    //moveDropdownList,
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
// function createDropdownList(item) {
//   const dropdownList = document.createElement("select");
//   dropdownList.className = "dropdown-list";

//   const defaultOption = document.createElement("option");
//   defaultOption.text = "Move to...";
//   defaultOption.value = "";
//   dropdownList.add(defaultOption);

//   const tabList = document.getElementById("tab-list");
//   tabList.childNodes.forEach((tab) => {
//     const option = document.createElement("option");
//     option.value = tab.innerText;
//     option.text = tab.innerText;
//     dropdownList.add(option);
//   });

//   dropdownList.addEventListener("change", () => {
//     moveItemToTab(item, dropdownList.value);
//   });

//   return dropdownList;
// }
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
  const indexToRemove = storedItemList.findIndex(
    (item) => item.createdAt === createdAt
  );

  if (indexToRemove !== -1) {
    storedItemList.splice(indexToRemove, 1);

    chrome.storage.local.set({ yourItemList: storedItemList }, function () {
      createAnimatedElement(
        "Item deleted from local storage successfully",
        "#71e997"
      );
    });
  } else {
    createAnimatedElement("Item not found in local storage");
    console.error("Item not found in local storage with createdAt:", createdAt);
  }
}
function editItem(item) {
  const textarea = createTextArea(item.itemData);
  const confirmButton = createButtons("Confirm", "confirm-button", () =>
    confirmEdit(item, textarea)
  );
  const cancelButton = createButtons("Cancel", "cancel-button", () =>
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
  updateItemInLocalStorage(item);
}
function cancelEdit() {
  loadInterface(getCurrentTab());
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
  createAnimatedElement("Invalid item type");
  console.error("Invalid item type");
  const empty = document.createElement("span");
  empty.appendChild(document.createTextNode("Empty."));
  parentElement.appendChild(empty);
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
    createAnimatedElement("something went wrong during updating local storage");
    console.error("something went wrong during updating local storage");
  }
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
  createAnimatedElement("all items deleted from interface", "#71e997");

  chrome.storage.local.remove("yourItemList");
  createAnimatedElement("all items deleted from local storage", "#71e997");

  loadInterface(getCurrentTab());
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
infoButton.addEventListener("mouseenter", () => showInfo());
infoButton.addEventListener("mouseleave", () => hideInfo());
clearAllButton.addEventListener("click", clearItemList);
createItemButton.addEventListener("click", createNewItemWithInput);
refreshButton.addEventListener("click", () => loadInterface(getCurrentTab()));
sendMessage.addEventListener("click", () =>
  createAnimatedElement("Проверка-проверка!!")
);
create1000.addEventListener("click", () => createNumberedList(1000));

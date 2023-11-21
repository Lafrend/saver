"use strict";

import "./popup.css";

console.log("This is a popup!");

const listOfItems = document.getElementById("listOfItems");
const clearAllButton = document.getElementById("clearAllButton");
const createItemButton = document.getElementById("createItemButton");
const rephreshButton = document.getElementById("rephreshButton");
const sendMessage = document.getElementById("sendMessage");

const loadingDiv = document.createElement("div");
const loadingSpan = document.createElement("span");
const backgroundDiv = document.createElement("div");
backgroundDiv.style.backgroundColor = "#00000027";
backgroundDiv.style.zIndex = "9998";
backgroundDiv.style.width = "100%";
backgroundDiv.style.height = "700px";
backgroundDiv.style.position = "absolute";
loadingSpan.textContent = "Loading...";
loadingDiv.appendChild(loadingSpan);
loadingDiv.style.position = "absolute";
loadingDiv.style.left = "50%";
loadingDiv.style.top = "50%";
loadingDiv.style.width = "100px";
loadingDiv.style.height = "50px";
loadingDiv.style.zIndex = "9999";
loadingDiv.style.backgroundColor = "green";
console.log("show loading items");
document.body.appendChild(loadingDiv);
document.body.appendChild(backgroundDiv);

// Load stored data on extension open
chrome.storage.local.get("yourItemList", function (data) {
  console.log("loading stoared items");
  const storedItemList = data.yourItemList || [];
  displayItems(storedItemList);
});

window.addEventListener("load", (event) => {
  console.log("removing loading items");
  loadingDiv.remove();
  backgroundDiv.remove();
});

function displayItems(itemListData) {
  console.log("displaying loaded items");
  listOfItems.innerHTML = "";
  itemListData.forEach(function (item) {
    addNewItem(item);
  });
}

function addNewItem(item) {
  console.log("prepare to adding item to interface...", item);
  const div = document.createElement("div");
  div.className = "info-item";

  let itemContent = recognitionItems(item);

  const editButton = createButtons("Edit", "edit-button", () =>
    editItem(item, itemContent)
  );
  const deleteButton = createButtons("Delete", "delete-button", () =>
    deleteItem(item.createdAt)
  );

  // Set data-createdAt attribute to the createdAt value
  div.dataset.createdAt = item.createdAt;

  div.appendChild(itemContent);
  div.appendChild(editButton);
  div.appendChild(deleteButton);
  listOfItems.insertBefore(div, listOfItems.firstChild);
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
  const insertImageButton = createButtons(
    "Вставить изображение",
    "insert-image-button",
    function () {
      // Вставка фрагмента с флажком изображения в текстовое поле
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPos);
      const textAfterCursor = textarea.value.substring(cursorPos);
      const imageFragment = "(imgUrl:)";
      const newText = textBeforeCursor + imageFragment + textAfterCursor;
      textarea.value = newText;
    }
  );
  const insertLinkButton = createButtons(
    "Вставить ссылку",
    "insert-link-button",
    function () {
      // Вставка фрагмента с флажком ссылки в текстовое поле
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPos);
      const textAfterCursor = textarea.value.substring(cursorPos);
      const linkFragment = "(linkUrl:)";
      const newText = textBeforeCursor + linkFragment + textAfterCursor;
      textarea.value = newText;
    }
  );

  // Remove the existing buttons
  const div = content.parentElement;
  const editButton = div.querySelector(".edit-button");
  const deleteButton = div.querySelector(".delete-button");
  if (editButton) editButton.remove();
  if (deleteButton) deleteButton.remove();

  content.replaceWith(textarea);

  // Append buttons to the list item
  div.appendChild(confirmButton);
  div.appendChild(cancelButton);
  div.appendChild(insertLinkButton);
  div.appendChild(insertImageButton);

  console.log("editing item....", item);
}

function createTextArea(content) {
  const textarea = document.createElement("textarea");
  textarea.appendChild(document.createTextNode(content));
  textarea.readOnly = false; // Disable editing
  textarea.style.border = "none"; // No visible border
  textarea.style.resize = "none"; // Disable resizing
  textarea.style.backgroundColor = "transparent";
  textarea.style.overflow = "hidden";

  // Auto-adjust height as the user types
  textarea.addEventListener("input", function () {
    // Устанавливаем высоту textarea в scrollHeight плюс небольшой отступ
    textarea.style.height = textarea.scrollHeight + 10 + "px";
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
      const insertLinkButton = div.querySelector(".insert-link-button");
      const insertImageButton = div.querySelector(".insert-image-button");
      if (confirmButton) confirmButton.remove();
      if (cancelButton) cancelButton.remove();
      if (insertLinkButton) insertLinkButton.remove();
      if (insertImageButton) insertImageButton.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () =>
        editItem(item, newElement)
      );
      const deleteButton = createButtons("Delete", "delete-button", () =>
        deleteItem(item.createdAt)
      );
      div.appendChild(editButton);
      div.appendChild(deleteButton);
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

// function createTextElement(parentElement, textContent) {
//   const text = document.createElement("span");
//   text.appendChild(document.createTextNode(textContent));
//   parentElement.appendChild(text);
//   console.log("replacing editing blank with span...", textContent);
// }

// function createLinkElement(parentElement, linkData) {
//   const link = document.createElement("a");
//   const linkRegex = /\(linkUrl:([^)]+)\)/;
//   const linkUrl = linkData.match(linkRegex)[1];
//   link.href = linkUrl;
//   link.target = "_blank"; // Open in a new tab
//   link.textContent = linkUrl;
//   parentElement.appendChild(link);
//   console.log("replacing editing blank with link...", linkUrl);
// }

// function createImageElement(parentElement, imageData) {
//   const imageRegex = /\(imgUrl:([^)]+)\)/;
//   const imageUrl = imageData.match(imageRegex)[1];

//   console.log("replacing editing blank with img...", imageUrl);
//   // Create a span element
//   const image = document.createElement("img");
//   image.src = imageUrl;

//   parentElement.appendChild(image);

//   // Create "Open" button
//   const openButton = createButtons("Открыть", "open-button", function () {
//     window.open(imageUrl, "_blank");
//   });
//   parentElement.appendChild(openButton);
// }

function createTextWithImageElement(parent, text) {
  console.log("replacing editing blank with custom...", text);
  let remainingText = text;

  while (remainingText) {
    const imgMatch = remainingText.match(/\(imgUrl:([^)]+)\)/);
    const linkMatch = remainingText.match(/\(linkUrl:([^)]+)\)/);

    if (imgMatch && (!linkMatch || imgMatch.index < linkMatch.index)) {
      // (imgUrl:...) found
      const textBefore = remainingText.substring(0, imgMatch.index);
      if (textBefore) {
        const textElement = document.createElement("span");
        textElement.appendChild(document.createTextNode(textBefore));
        parent.appendChild(textElement);
      }

      const imgElement = document.createElement("img");
      imgElement.src = imgMatch[1];
      imgElement.addEventListener("click", function () {
        // Действие при клике на изображение
        // Например, открывать изображение в новой вкладке
        window.open(imgMatch[1], "_blank");
      });
      imgElement.style.cursor = "pointer";
      parent.appendChild(imgElement);

      remainingText = remainingText.substring(
        imgMatch.index + imgMatch[0].length
      );
    } else if (linkMatch && (!imgMatch || linkMatch.index < imgMatch.index)) {
      // (linkUrl:...) found
      const textBefore = remainingText.substring(0, linkMatch.index);
      if (textBefore) {
        const textElement = document.createElement("span");
        textElement.appendChild(document.createTextNode(textBefore));
        parent.appendChild(textElement);
      }

      const linkElement = document.createElement("a");
      linkElement.href = linkMatch[1];
      linkElement.target = "_blank"; // Open in a new tab
      linkElement.textContent = linkMatch[1];
      parent.appendChild(linkElement);

      remainingText = remainingText.substring(
        linkMatch.index + linkMatch[0].length
      );
    } else {
      // No (imgUrl:...) or (url:...) found
      const textElement = document.createElement("span");
      textElement.appendChild(document.createTextNode(remainingText));
      parent.appendChild(textElement);
      remainingText = "";
    }
  }
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
      if (confirmButton) confirmButton.remove();
      if (cancelButton) cancelButton.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () =>
        editItem(item, content)
      );
      const deleteButton = createButtons("Delete", "delete-button", () =>
        deleteItem(item.createdAt)
      );
      div.appendChild(editButton);
      div.appendChild(deleteButton);
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
  div.className = "info-item";

  textArea.placeholder = "Введите текст...";
  div.appendChild(textArea);

  const confirmButton = createButtons("Confirm", "confirm-button", function () {
    console.log("confirmin creating new custom item...");
    const text = textArea.value.trim();
    if (text !== "") {
      // Обработка текста и фрагментов изображений
      const newItem = {
        itemType: "custom",
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

  const insertImageButton = createButtons(
    "Вставить изображение",
    "insert-image-button",
    function () {
      // Вставка фрагмента с флажком изображения в текстовое поле
      const cursorPos = textArea.selectionStart;
      const textBeforeCursor = textArea.value.substring(0, cursorPos);
      const textAfterCursor = textArea.value.substring(cursorPos);
      const imageFragment = "(imgUrl:)";
      const newText = textBeforeCursor + imageFragment + textAfterCursor;
      textArea.value = newText;
    }
  );
  const insertLinkButton = createButtons(
    "Вставить ссылку",
    "insert-link-button",
    function () {
      // Вставка фрагмента с флажком ссылки в текстовое поле
      const cursorPos = textArea.selectionStart;
      const textBeforeCursor = textArea.value.substring(0, cursorPos);
      const textAfterCursor = textArea.value.substring(cursorPos);
      const linkFragment = "(linkUrl:)";
      const newText = textBeforeCursor + linkFragment + textAfterCursor;
      textArea.value = newText;
    }
  );
  div.appendChild(insertLinkButton);
  div.appendChild(insertImageButton);

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
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.style.position = "fixed";
  element.style.bottom = "50px";
  element.style.minWidth = "100px";
  element.style.height = "40px";
  element.style.left = "";
  element.style.borderRadius = "8px";
  element.style.overflow = "hidden";
  element.style.color = "white"; // Цвет текста черный
  element.style.transform = "translateX(-50%) translateY(100%)"; // Устанавливаем начальное положение внизу
  element.style.transition = "transform 0.3s ease-in-out";
  element.style.padding = "0 5px 0 5px";

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
  listOfItems.innerHTML = "";
  chrome.storage.local.remove("yourItemList");
}

rephreshButton.addEventListener("click", function () {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    displayItems(storedItemList);
  });
});

"use strict";

import "./popup.css";

console.log("This is a popup!");

const listOfItems = document.getElementById("listOfItems");
const clearAllButton = document.getElementById("clearAllButton");
const createItemButton = document.getElementById("createItemButton");
const rephreshButton = document.getElementById("rephreshButton");

// Load stored data on extension open
chrome.storage.local.get("yourItemList", function (data) {
  const storedItemList = data.yourItemList || [];
  displayItems(storedItemList);
});

function displayItems(itemListData) {
  listOfItems.innerHTML = "";
  itemListData.forEach(function (item) {
    addNewItem(item);
  });
}

function addNewItem(item) {
  const li = document.createElement("li");
  li.className = "info-item";

  const span = document.createElement("span");

  let itemContent;

  switch (item.itemType) {
    case "text":
      itemContent = document.createTextNode(item.itemData);
      break;
    case "link":
      const link = document.createElement("a");
      link.href = item.itemData;
      link.target = "_blank"; // Open in a new tab
      link.textContent = item.itemData;
      itemContent = link;
      break;
    case "image":
      const img = document.createElement("img");
      img.src = item.itemData;
      itemContent = img;
      break;
    default:
      itemContent = document.createTextNode("Empty.");
  }
  const editButton = createButtons("Edit", "edit-button", () => editItem(item, span));
  const deleteButton = createButtons("Delete", "delete-button", () => deleteItem(item.createdAt));

  // Set data-createdAt attribute to the createdAt value
  li.dataset.createdAt = item.createdAt;

  li.appendChild(span);
  span.appendChild(itemContent);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  listOfItems.insertBefore(li, listOfItems.firstChild);
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
            console.log("Item deleted successfully with createdAt:", createdAt);
          });
        }, 500); // 500 миллисекунд – время анимации
      }
    }
  });
}

// Function to handle item editing
function editItem(item, span) {
  const textarea = createTextArea(item.itemData);
  const confirmButton = createButtons("Confirm", "confirm-button", () =>
    confirmEdit(item, span, textarea)
  );
  const cancelButton = createButtons("Cancel", "cancel-button", () =>
    cancelEdit(item, span, textarea)
  );

  // Remove the existing buttons
  const li = span.parentElement;
  const editButton = li.querySelector(".edit-button");
  const deleteButton = li.querySelector(".delete-button");
  if (editButton) editButton.remove();
  if (deleteButton) deleteButton.remove();

  span.replaceWith(textarea);

  // Append buttons to the list item
  li.appendChild(confirmButton);
  li.appendChild(cancelButton);
}

function createTextArea(content) {
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.readOnly = false; // Disable editing
  textarea.style.width = "100%"; // Full width
  textarea.style.height = "50px"; // Fixed height
  textarea.style.border = "none"; // No visible border
  textarea.style.resize = "none"; // Disable resizing
  return textarea;
}

function confirmEdit(item, span, textarea) {
  item.itemData = textarea.value;

  // Update content in local storage
  updateLocalStorage(item);

  // Create a new span with the updated content
  const newSpan = document.createElement("span");
  newSpan.appendChild(document.createTextNode(item.itemData));

  // Replace the textarea with the new span
  const li = textarea.parentElement;

  if (li) {
    const index = Array.from(li.parentElement.children).indexOf(li);

    if (index !== -1) {
      li.replaceChild(newSpan, textarea);

      // Remove confirm and cancel buttons
      const confirmButton = li.querySelector(".confirm-button");
      const cancelButton = li.querySelector(".cancel-button");
      if (confirmButton) confirmButton.remove();
      if (cancelButton) cancelButton.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () => editItem(item, newSpan));
      const deleteButton = createButtons("Delete", "delete-button", () => deleteItem(item.createdAt));
      li.appendChild(editButton);
      li.appendChild(deleteButton);
    }
  }
}

function cancelEdit(item, span, textarea) {
  // Replace the textarea with the original span
  const li = textarea.parentElement;

  if (li) {
    const index = Array.from(li.parentElement.children).indexOf(li);

    if (index !== -1) {
      li.replaceChild(span, textarea);

      // Remove confirm and cancel buttons
      const confirmButton = li.querySelector(".confirm-button");
      const cancelButton = li.querySelector(".cancel-button");
      if (confirmButton) confirmButton.remove();
      if (cancelButton) cancelButton.remove();

      // Restore edit and delete buttons
      const editButton = createButtons("Edit", "edit-button", () => editItem(item, span));
      const deleteButton = createButtons("Delete", "delete-button", () => deleteItem(item.createdAt));
      li.appendChild(editButton);
      li.appendChild(deleteButton);
    }
  }
}

function updateLocalStorage(item) {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    // Find the index of the item in local storage
    const index = storedList.findIndex(
      (storedItem) => storedItem.createdAt === item.createdAt
    );

    if (index !== -1) {
      // Update the item's content
      storedList[index].itemData = item.itemData;

      // Save the updated list to local storage
      chrome.storage.local.set({ yourItemList: storedList }, function () {
        console.log("Item updated successfully:", item);
      });
    }
  });
}

let activeItem = null;

function createNewItemWithInput() {
  // Если уже есть активный элемент, удаляем его
  if (activeItem) {
    activeItem.remove();
    activeItem = null;
  }

  const li = document.createElement("li");
  li.className = "info-item";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Введите текст...";
  li.appendChild(input);

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Подтвердить";
  confirmButton.type = "button";
  confirmButton.addEventListener("click", function () {
    const text = input.value.trim();
    if (text !== "") {
      const newItem = {
        itemType: "text",
        itemData: text,
        createdAt: new Date().getTime(),
      };
      saveNewItem(newItem);
      li.remove();
      // Add the new item to the interface
      addNewItem(newItem);
    } else {
      createAnimatedElement("Новый элемент не может быть пустым!", "#db3232");
    }
  });
  li.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Отмена";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", function () {
    li.remove();
  });
  li.appendChild(cancelButton);

  // Add the new item to the interface
  listOfItems.insertBefore(li, listOfItems.firstChild);

  // Set the new active item
  activeItem = li;

  // Set focus on the input field when creating a new item
  input.focus();
}

function createAnimatedElement(text, bgColor) {
  const existingElements = document.querySelectorAll(".animated-element");

  existingElements.forEach((existingElement) => {
    const currentBottom = parseFloat(existingElement.style.bottom);
    existingElement.style.bottom = `${currentBottom + 60}px`; // Увеличиваем расстояние между элементами
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
  element.style.background = bgColor || "gray";
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.style.position = "fixed";
  element.style.bottom = "50px";
  element.style.minWidth = "100px";
  element.style.height = "50px";
  element.style.left = "";
  element.style.borderRadius = "8px";
  element.style.overflow = "hidden";
  element.style.color = "white"; // Цвет текста черный
  element.style.transform = "translateX(-50%) translateY(100%)"; // Устанавливаем начальное положение внизу
  element.style.transition = "transform 0.3s ease-in-out";
  element.style.padding = "5px";

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

// Clear button click handler
clearAllButton.addEventListener("click", clearItemList);

function clearItemList() {
  listOfItems.innerHTML = "";
  chrome.storage.local.remove("yourItemList");
}

// Create button click handler
createItemButton.addEventListener("click", createNewItemWithInput);

rephreshButton.addEventListener("click", function () {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedItemList = data.yourItemList || [];
    displayItems(storedItemList);
  });
});

"use strict";

import "./popup.css";

console.log("This is a popup!");

const infoList = document.getElementById("infoList");
const clearAllButton = document.getElementById("clearAllButton"); // Added clear button reference
const createButton = document.getElementById("createButton");

// Load stored data on extension open
chrome.storage.local.get("yourItemList", function (data) {
  const storedItemList = data.yourItemList || [];
  displayItemList(storedItemList);
});

function displayItemList(itemListData) {
  infoList.innerHTML = "";
  itemListData.forEach(function (item, index) {
    addNewItem(item, index);
  });
}

function addNewItem(item) {
  const li = document.createElement("li");
  li.className = "info-item";

  const span = document.createElement("span");
  li.appendChild(span);

  let itemText;
  if (item && item.text && !item.linkUrl) {
    itemText = item.text;
    const textNode = document.createTextNode(itemText);
    li.appendChild(textNode);
  } else if (item && item.linkUrl && !item.imageUrl) {
    const link = document.createElement("a");
    link.href = item.linkUrl;
    link.target = "_blank"; // Open in a new tab
    link.textContent = item.linkUrl;
    span.appendChild(link);
  } else if (item && item.imageUrl) {
    const img = document.createElement("img");
    img.src = item.imageUrl;
    li.appendChild(img);
  } else {
    itemText = "Empty.";
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerText = "X";

  // Add click event listener to the delete button
  deleteButton.addEventListener("click", function () {
    deleteItem(item.id);
  });

  li.appendChild(deleteButton);
  infoList.insertBefore(li, infoList.firstChild);
}


function deleteItem(index) {
  chrome.storage.local.get("yourItemList", function (data) {
    const storedList = data.yourItemList || [];

    if (index >= 0 && index < storedList.length) {
      // Remove the item from the list using splice
      storedList.splice(index, 1);

      // Update the local storage with the modified list
      chrome.storage.local.set({ yourItemList: storedList }, function () {
        console.log("Item deleted successfully at index:", index);

        // Remove the deleted item from the interface
        const itemToRemove = document.getElementById(`item-${index}`);
        if (itemToRemove) {
          itemToRemove.remove();
        }
      });
    }
  });
}




// Clear button click handler
clearAllButton.addEventListener("click", function () {
  clearItemList();
});

function clearItemList() {
  infoList.innerHTML = "";
  chrome.storage.local.remove("yourItemList");
}

// Create button click handler
createButton.addEventListener("click", function () {
  addNewItem();
});

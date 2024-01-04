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
  console.error("Invalid item type");
  const empty = document.createElement("span");
  empty.appendChild(document.createTextNode("Empty."));
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

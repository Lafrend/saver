const express = require("express");
const bodyParser = require("body-parser");
// const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const { Telegraf } = require("telegraf");
const FormData = require("form-data");
const bot = new Telegraf("6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg");
const app = express();

const telegramBotToken = "6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg";
const chatId = "ID_вашего_чата";
// const targetUserId = "912857723"; // Замените на реальный ID пользователя
const targetUserId = "-1002042824923";

// Инициализация multer для обработки данных формы (изображений)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.text()); // Используем middleware для обработки текстовых данных

app.post("/sendToTelegram", async (req, res) => {
  console.log("Received request:", req.body);
  const text = req.body;

  try {
    if (text) {
      await sendToUser(text); // Отправляем текст в личку телеграм-боту
    }

    res.status(200).send({ success: true, message: "Success" }); // Обновленный ответ сервера
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// app.post("/sendToTelegram", async (req, res) => {
//   console.log("Received request:", req.body);
//   const text = req.body;

//   try {
//     if (text) {
//       // await sendTextToTelegram(text);
//       await sendToUser("Ваш текст или изображение для отправки в личку");
//     }

//     // if (imageBase64) {
//     //   const imageBuffer = Buffer.from(imageBase64, "base64");
//     //   const imagePath = "temp_image.png";

//     //   // Сохраняем изображение как файл
//     //   fs.writeFileSync(imagePath, imageBuffer);

//     //   await sendImageToTelegram(imagePath);

//     //   // Удаляем временный файл
//     //   fs.unlinkSync(imagePath);
//     // }

//     res.status(200).send("Success");
//   } catch (error) {
//     console.error("Error sending to Telegram:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/sendToTelegram", upload.single("photo"), async (req, res) => {
//   const { text } = req.body;
//   const imageBuffer = req.file ? req.file.buffer : null;

//   try {
//     if (text) {
//       await sendToUser(text);
//     }

//     if (imageBuffer) {
//       await sendImageToTelegram(imageBuffer);
//     }

//     res.status(200).send("Success");
//   } catch (error) {
//     console.error("Error sending to Telegram:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// async function sendImageToTelegram(imageBuffer) {
//   const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;

//   // Создаем экземпляр формы и добавляем параметры
//   const formData = new FormData();
//   formData.append("chat_id", chatId);
//   formData.append("photo", imageBuffer, { filename: "temp_image.png" });

//   // Отправляем запрос с использованием axios
//   await axios.post(apiUrl, formData, {
//     headers: {
//       ...formData.getHeaders(),
//     },
//   });
// }

async function sendToUser(message) {
  try {
    await bot.telegram.sendMessage(targetUserId, message);
    console.log(`Message sent to user ${targetUserId}: ${message}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

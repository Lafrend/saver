const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Telegraf } = require("telegraf");

const bot = new Telegraf("6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg");

const app = express();

// const targetUserId = "912857723"; // Замените на реальный ID пользователя
const targetUserId = "-1002042824923";

// Используем multer для обработки файлов
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Используем upload.single('file') для обработки единичного файла с именем 'file'
app.post("/sendToTelegram", upload.single('file'), async (req, res) => {
  console.log("Received request:", req.body);

  try {
    if (req.file) {
      const createdAt = req.body.createdAt;
      await sendFileToUser(req.file.buffer, createdAt);
    } else if (req.body) {
      await sendStringToUser(req.body);
    }

    res.status(200).send({ success: true, message: "Success" });
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

async function sendFileToUser(fileBuffer, createdAt) {
  try {
    const fileName = `${createdAt}.png`;
    await bot.telegram.sendDocument(targetUserId, { source: fileBuffer, filename: fileName });
    console.log(`File sent to user ${targetUserId} with createdAt: ${createdAt}`);
  } catch (error) {
    console.error("Error sending file:", error);
  }
}
async function sendStringToUser(data) {
  try {
    // Обрабатываем строку и отправляем ее в телеграм (ваш логика обработки строки)
    await bot.telegram.sendMessage(targetUserId, data);
    console.log(`String sent to user ${targetUserId}`);
  } catch (error) {
    console.error("Error sending string:", error);
  }
}

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Choose a different port.`);
  } else if (err.code === 'ENOTFOUND') {
    console.error('Ошибка: Не удалось разрешить DNS. Возможно, проблемы с интернет-соединением.');
  } else {
    console.error('Error starting server:', err);
  }
});

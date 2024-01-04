const express = require("express");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");

const bot = new Telegraf("6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg");

const app = express();

// const targetUserId = "912857723"; // Замените на реальный ID пользователя
const targetUserId = "-1002042824923";

app.use(bodyParser.text());

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

async function sendToUser(message) {
  try {
    await bot.telegram.sendMessage(targetUserId, message);
    console.log(`Message sent to user ${targetUserId}: ${message}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Choose a different port.`);
  } else {
    console.error('Error starting server:', err);
  }
});

// const TelegramBot = require('node-telegram-bot-api');
const { Telegraf } = require('telegraf');

const bott = new Telegraf('6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg');

// Замените 'YOUR_BOT_TOKEN' на фактический токен вашего бота
// const token = '6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg';
// const bot = new TelegramBot(token, { polling: true });

// // Обработка команды /start
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Привет! Я ваш тестовый бот. Как я могу вам помочь?');
// });

// Обработчик команды /chatid
bott.command('chatid', (ctx) => {
    const chatId = ctx.chat.id;
    ctx.reply(`Идентификатор текущего чата: ${chatId}`);
});

// // Обработка текстовых сообщений
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;

//   // Пример отправки ответа на текстовое сообщение
//   bot.sendMessage(chatId, `Вы написали: ${messageText}`);
// });

// // Обработка изображений (для примера)
// bot.on('photo', (msg) => {
//   const chatId = msg.chat.id;
//   const photoId = msg.photo[0].file_id;

//   // Пример отправки ответа на изображение
//   bot.sendPhoto(chatId, photoId, { caption: 'Я получил ваше изображение!' });
// });

console.log('Бот запущен вввввввв. Для остановки нажмите Ctrl+C.');

bott.launch().then(() => {
    console.log('Бот запущен. Для остановки нажмите Ctrl+C.');
});
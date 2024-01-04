const { Telegraf } = require('telegraf');

const bot = new Telegraf('6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg');

// Обработчик команды /chatid
bot.command('chatid', (ctx) => {
    const chatId = ctx.chat.id;
    ctx.reply(`Идентификатор текущего чата: ${chatId}`);
});

console.log('Бот запущен. Для остановки нажмите Ctrl+C.');

bot.launch().then(() => {
    console.log('Бот запущен. Для остановки нажмите Ctrl+C.');
});
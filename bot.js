const { Telegraf } = require('telegraf');

const bott = new Telegraf('6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg');


// Обработчик команды /chatid
bott.command('chatid', (ctx) => {
    const chatId = ctx.chat.id;
    ctx.reply(`Идентификатор текущего чата: ${chatId}`);
});

console.log('Бот запущен вввввввв. Для остановки нажмите Ctrl+C.');

bott.launch().then(() => {
    console.log('Бот запущен. Для остановки нажмите Ctrl+C.');
});
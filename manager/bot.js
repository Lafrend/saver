const { Telegraf } = require('telegraf');

async function startBot() {
    const bot = new Telegraf('6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg');

    // Обработчик команды /chatid
    bot.command('chatid', (ctx) => {
        const chatId = ctx.chat.id;
        ctx.reply(`Идентификатор текущего чата: ${chatId}`);
    });

    // Обработка события успешного запуска бота
    bot.on(() => {
        console.log('cool');
        // Дополнительные действия по обработке ошибки вебхука
    });

    try {
        await bot.launch();
        console.log('Bot started successfully!');
    } catch (error) {
        if (error.description && error.description.includes('Conflict: terminated by other getUpdates request')) {
            console.error('Error: Another bot instance is already running.');
            // Дополнительные действия по обработке конфликта
        } else {
            console.error('Error:', error.message);
            // Дополнительные действия по обработке других ошибок
        }
    }
}

startBot();
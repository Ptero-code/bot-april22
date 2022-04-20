const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5182179244:AAEhqfc9caY922_fp5Ef17UtllQrberk8oo'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Давай так: я загадываю число от 0 до 9, а ты попробуешь его отгадать!`)
    const randomNumber = Math.floor(Math.random()*10 )
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}
const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Сыграть в игру'},
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/192/1.webp')
            return bot.sendMessage(chatId, `Приветствую тебя, человек ;)`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')


    })

    bot.on('callback_query', async message => {
        const data = message.data;
        const chatId = message.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал число ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, я загадал число ${chats[chatId]}`, againOptions)
        }

    })
}

start()

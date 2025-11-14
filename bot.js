import {Bot, Keyboard} from '@maxhub/max-bot-api'

// Создайте экземпляр класса Bot и передайте ему токен 
const bot = new Bot(process.env.BOT_TOKEN);

// Добавьте слушатели обновлений
// MAX Bot API будет вызывать их, когда пользователи взаимодействуют с ботом

const keyboard = Keyboard.inlineKeyboard([
	// Первая строка с тремя кнопками
	[
		Keyboard.button.callback('default'),
		Keyboard.button.callback('positive', { intent: 'positive' }),
		Keyboard.button.callback('negative', { intent: 'negative' }),
	],
]);

// Далее мы можем отправить клавиатуру пользователю в сообщении, например, при вызове команды страт
bot.command('start', (ctx) => {
	ctx.reply('Добро пожаловать!', {attachments: [keyboard]})
});

// Обработчик для команды '/start'

// Обработчик для любого другого сообщения
// bot.on('message_created', (ctx) => ctx.reply('Новое сообщение'));
// Теперь можно запустить бота, чтобы он подключился к серверам MAX и ждал обновлений
bot.start();

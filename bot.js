import {Bot, Keyboard} from '@maxhub/max-bot-api'

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('Token not provided');

const bot = new Bot(token);

bot.api.setMyCommands([
	{ name: 'start', description: 'Стартовая команда' },
	{ name: 'add-task', description: 'Добавить задачу' },
	{ name: 'list-of-tasks', description: 'Вывод списка задач' },
	{ name: 'remove-task', description: 'Удалить задачу' },
	{ name: 'complete-task', description: 'Выполнить задачу'},
	{ name: 'update-category', description: 'Изменить категорию'},
	{ name: 'main-menu', description: 'К главному меню'}
]);

const mainMenu = Keyboard.inlineKeyboard([
	[Keyboard.button.callback('Добавить задачу', 'add-task')],
	[Keyboard.button.callback('Удалить задачу', 'remove-task')],
	[Keyboard.button.callback('Список задач', 'list-of-tasks')],
	[Keyboard.button.callback('Выполнить задачу', 'complete-task')],
	[Keyboard.button.callback('Изменить категории', 'update-category')]
]);



bot.command('start', (ctx) => {
	ctx.reply('Привет! Это трекер твоих задач!', {attachments: [mainMenu]})
})

bot.command('main-menu', (ctx) => {
	ctx.reply('Главное меню:', {attachments: [mainMenu]})
})

bot.command('add-task', (ctx) => {
	ctx.reply('Введите название задачи: ');
})

bot.start();
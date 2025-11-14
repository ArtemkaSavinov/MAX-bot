import {Bot} from '@maxhub/max-bot-api'
import mongoose from 'mongoose'

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('Token not provided');

const bot = new Bot(token);
try {
	await mongoose.connect('mongodb://127.0.0.1:27017/max-bot')
	console.log('db connected')
} catch(e) {
	console.log(e)
}

// Хранилище текущих шагов пользователей
const userState = {};

const taskSchema = new mongoose.Schema({
	userId: String,
	title: String,
	deadline: String,
	difficulty: Number,
	category: String,
	createdAt: { type: Date, default: Date.now }
})

const Task = mongoose.model("Task", taskSchema)

bot.api.setMyCommands([
	{ name: 'start', description: 'Стартовая команда' },
	{ name: 'add-task', description: 'Добавить задачу' },
	{ name: 'list-of-tasks', description: 'Вывод списка задач' },
	{ name: 'remove-task', description: 'Удалить задачу' },
	{ name: 'complete-task', description: 'Выполнить задачу'},
	{ name: 'update-category', description: 'Изменить категорию'},
	{ name: 'main-menu', description: 'К главному меню'}
]);

const mainMenu = {
	type: "inline_keyboard",
	payload: {
		buttons: [
			[{ type: "callback", text: "Добавить задачу", payload: "add-task" }],
			[{ type: "callback", text: "Удалить задачу", payload: "remove-task" }],
			[{ type: "callback", text: "Список задач", payload: "list-of-tasks" }],
			[{ type: "callback", text: "Выполнить задачу", payload: "complete-task" }],
			[{ type: "callback", text: "Изменить категорию", payload: "update-category" }]
		]
	}
};

bot.command('start', (ctx) => {
	ctx.reply('Привет! Это трекер твоих задач!', {attachments: [mainMenu]})
})

bot.command('main-menu', (ctx) => {
	ctx.reply('Главное меню:', {attachments: [mainMenu]})
})

bot.action('add-task', async (ctx) => {
	const userId = ctx.callback.user.user_id;
	userState[userId] = { step: 'title', task: {} };
	await ctx.reply('Введите название задачи:');
	
});

bot.on('message_created', async (ctx) => {
	const userId = ctx.message.sender.user_id;
	if (!userState[userId]) return;
	
	const state = userState[userId];
	const text = ctx.text;
	
	switch(state.step) {
		case 'title':
			state.task.title = text;
			state.step = 'deadline';
			await ctx.reply('Введите дедлайн в формате dd.mm.yyyy:');
			break;
		
		case 'deadline':
			if (!/^\d{2}\.\d{2}\.\d{4}$/.test(text)) {
				return ctx.reply('Неверный формат. Используйте dd.mm.yyyy');
			}
			state.task.deadline = text;
			state.step = 'difficulty';
			await ctx.reply('Введите сложность (0–10):');
			break;
		
		case 'difficulty':
			const diff = Number(text);
			if (isNaN(diff) || diff < 0 || diff > 10) {
				return ctx.reply('Сложность должна быть числом от 0 до 10:');
			}
			state.task.difficulty = diff;
			state.step = 'category';
			await ctx.reply('Введите категорию задачи:');
			break;
		
		case 'category':
			state.task.category = text;
			
			// Сохраняем задачу в MongoDB
			await Task.create({
				userId,
				...state.task
			});
			
			await ctx.reply(
				`Задача добавлена!\n` +
				`Название: ${state.task.title}\n` +
				`Дедлайн: ${state.task.deadline}\n` +
				`Сложность: ${state.task.difficulty}\n` +
				`Категория: ${state.task.category}`,
				{ attachments: [mainMenu] }
			);
			
			delete userState[userId];
			break;
	}
});

bot.start();
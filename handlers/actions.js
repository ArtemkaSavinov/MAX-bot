import {userState} from '../state/userState.js'
import { Task } from '../models/Task.js';
import { startKb } from '../keyboards/tasksMenu.js';
import { middleKb } from '../keyboards/tasksMenu.js';
import { lastKb } from '../keyboards/tasksMenu.js';
import {mainMenu} from '../keyboards/mainMenu.js'

export function setupActions(bot) {
	bot.action('main-menu', async (ctx) => {
		ctx.reply('Главное меню:', {attachments: [mainMenu]})
		userState[ctx.message.sender.user_id] = {};
	});

	bot.action('add-task', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		userState[userId] = { step: 'title', task: {} };
		await ctx.reply('Введите название задачи:');
	});
	
	bot.action('list-of-tasks', async (ctx) => {
		const userId = ctx.callback.user.user_id;

		try {
			// Находим все задачи пользователя
			const tasks = await Task.find({ userId }).sort({ createdAt: -1});

			if (tasks.length === 0) {
				return await ctx.reply('У вас пока нет задач. 🎯');
			}

			// Формируем текст сообщения
			
			const taskList = tasks.map((task, index) => {
					return `${index + 1}. ${task.title} (Статус: ${task.status}, Дедлайн: ${task.deadline}, Сложность: ${task.difficulty}, Категория: ${task.category})`;
				})
				.join('\n\n');

			const message = `📋 *Ваши задачи:*\n\n${taskList}`;

			// Отправляем с форматированием Markdown
			await ctx.reply(message, { format: 'markdown', attachments: [mainMenu]});

		} catch (error) {
			console.error('Ошибка при получении задач:', error);
			await ctx.reply('Произошла ошибка при загрузке задач. Попробуйте позже.');
		}
	});
	
	bot.action('complete-task', async (ctx) => {
		await ctx.reply("Какая-то задача должна быть выполнена!")
	})
}
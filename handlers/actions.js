import {userState} from '../state/userState.js'
import { Task } from '../models/Task.js';

export function setupActions(bot) {
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
			const taskList = tasks
				.map((task, index) => {
					return `${statusIcon} ${index + 1}. ${task.title} (Статус: ${task.status}, Дедлайн: ${task.deadline}, Сложность: ${task.difficulty}, Категория: ${task.category})`;
				})
				.join('\n');

			const message = `📋 *Ваши задачи:*\n\n${taskList}`;

			// Отправляем с форматированием Markdown
			await ctx.reply(message, { format: 'markdown' });

		} catch (error) {
			console.error('Ошибка при получении задач:', error);
			await ctx.reply('Произошла ошибка при загрузке задач. Попробуйте позже.');
		}
	});
}
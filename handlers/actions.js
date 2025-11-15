import {userState} from '../state/userState.js'
import {Task} from '../models/Task.js'
import {mainMenu} from '../keyboards/mainMenu.js'
import { formatDate } from './dateRefactoring.js';

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
		userState[userId] = { page: 0 }; // сброс на первую страницу
		await sendTaskPage(ctx, userId);
	});

	bot.action('next-tasks', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		if (!userState[userId]) userState[userId] = { page: 0 };
		userState[userId].page += 1;
		await sendTaskPage(ctx, userId);
	});

	bot.action('prev-tasks', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		if (!userState[userId]) userState[userId] = { page: 0 };
		userState[userId].page = Math.max(0, userState[userId].page - 1);
		await sendTaskPage(ctx, userId);
	});

	async function sendTaskPage(ctx, userId) {
		const page = userState[userId]?.page ?? 0;
		const TASKS_PER_PAGE = 10;
		const skip = page * TASKS_PER_PAGE;
		
		const total = await Task.countDocuments({ userId });
		const tasks = await Task
			.find({ userId, status: 'active' })
			.sort({ deadline: 1 })
			.skip(skip)
			.limit(TASKS_PER_PAGE);

		if (tasks.length === 0 && page === 0) {
			return await ctx.reply('У вас нет активных задач.');
		}
		const list = tasks
			.map((t, i) => `${page * TASKS_PER_PAGE + i + 1}. ${t.title}\nДедлайн: ${formatDate(t.deadline)}\nСложность: ${t.difficulty}\nКатегория: ${t.category}`)
			.join('\n\n');

		const hasPrev = page > 0;
		const hasNext = skip + TASKS_PER_PAGE < total;

		const rows = [];

		// Первая строка: навигация (Назад / Далее)
		const navRow = [];
		if (hasPrev) navRow.push({ type: "callback", text: "Назад", payload: "prev-tasks" });
		if (hasNext) navRow.push({ type: "callback", text: "Далее", payload: "next-tasks" });

		if (navRow.length > 0) {
			rows.push(navRow);
		}

		// Вторая строка: всегда "Меню"
		rows.push([{ type: "callback", text: "Меню", payload: "main-menu" }]);

		const keyboard = {
			type: "inline_keyboard",
			payload: { buttons: rows } // ← массив массивов!
		};

		await ctx.reply(`📋 Задачи (стр. ${page + 1})\n\n${list}`, {
			format: 'markdown',
			attachments: [keyboard]
		});
	}
	
	bot.action('complete-task', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		
		try {
			// Находим все задачи пользователя
			const tasks = await Task.find({ userId }).sort({deadline: 1});
			
			if (tasks.length === 0) {
				return await ctx.reply('У вас пока нет задач. 🎯');
			}
			
			// Формируем текст сообщения
			
			const taskList = tasks.map((task, index) => {
				if (task.status === 'active'){
					return `${index + 1}. ${task.title}\nДедлайн: ${formatDate(task.deadline)}, Категория: ${task.category}`;
				}
			}).join('\n\n');
			
			const message = `📋 *Ваши задачи:*\n\n${taskList}`;
			
			// Отправляем с форматированием Markdown
			await ctx.reply(message, { format: 'markdown'});
			userState[userId] = {step: "complete", task: {}}
			await ctx.reply("Введите номер задачи, которую нужно выполнить:")
		} catch (error) {
			console.error('Ошибка при получении задач:', error);
			await ctx.reply('Произошла ошибка при загрузке задач. Попробуйте позже.');
		}
	});
	
	bot.action('remove-task', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		
		try {
			// Находим все задачи пользователя
			const tasks = await Task.find({ userId }).sort({ createdAt: -1});
			
			if (tasks.length === 0) {
				return await ctx.reply('У вас пока нет задач. 🎯');
			}
			
			// Формируем текст сообщения
			
			const taskList = tasks.map((task, index) => {
				return `${index + 1}. ${task.title}\nДедлайн: ${formatDate(task.deadline)}\nСтатус: ${task.status}\nКатегория: ${task.category}`;
			}).join('\n\n');
			
			const message = `📋 *Ваши задачи:*\n\n${taskList}`;
			
			// Отправляем с форматированием Markdown
			await ctx.reply(message, { format: 'markdown'});
			userState[userId] = {step: "remove", task: {}}
			await ctx.reply("Введите номер задачи, которую нужно удалить:")
		} catch (error) {
			console.error('Ошибка при получении задач:', error);
			await ctx.reply('Произошла ошибка при загрузке задач. Попробуйте позже.');
		}
	});
	
	bot.action('update-category', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		
		try {
			// Находим все задачи пользователя
			const tasks = await Task.find({ userId }).sort({ createdAt: -1});
			
			if (tasks.length === 0) {
				return await ctx.reply('У вас пока нет задач. 🎯');
			}
			
			// Формируем текст сообщения
			
			const taskList = tasks.map((task, index) => {
				return `${index + 1}. ${task.title} (Категория: ${task.category})`;
			}).join('\n\n');
			
			const message = `📋 *Ваши задачи:*\n\n${taskList}`;
			
			// Отправляем с форматированием Markdown
			await ctx.reply(message, { format: 'markdown'});
			userState[userId] = {step: "getTargetUpdateCategory", task: {}}
			await ctx.reply("Введите номер задачи, категорию которой нужно изменить:")
		} catch (error) {
			console.error('Ошибка при получении задач:', error);
			await ctx.reply('Произошла ошибка при загрузке задач. Попробуйте позже.');
		}
	})
}
import {mainMenu} from '../keyboards/mainMenu.js'
import {userState} from '../state/userState.js'
import {Task} from '../models/Task.js'
import {createTask} from '../admin/createTask.js'
import {formatDate} from '../handlers/dateRefactoring.js'

export function setupCommands(bot) {
	bot.command('start', (ctx) => {
		ctx.reply('Привет! Это трекер твоих задач!', {attachments: [mainMenu]})
	})
	
	bot.command('main-menu', (ctx) => {
		ctx.reply('Главное меню:', {attachments: [mainMenu]})
		userState[ctx.message.sender.user_id] = {};
	})

	bot.command('admin-add-task', async (ctx) => {
		const userId = ctx.message.sender.user_id;
		let task = createTask(userId);
		await task.save()

		await ctx.reply(
			`Задача добавлена!\n` +
			`Название: ${state.task.title}\n` +
			`Дедлайн: ${formatDate(state.task.deadline)}\n` +
			`Сложность: ${state.task.difficulty}\n` +
			`Категория: ${state.task.category}`,
			{ attachments: [mainMenu] }
		);
	});

	bot.command('admin-add-tasks', async (ctx) => {
		const userId = ctx.message.sender.user_id;
		for (let i = 0; i < 25; i++) {
			let task = createTask(userId);
			await task.save()
		}

		await ctx.reply(
			`Задачи добавлена!\n`,
			{ attachments: [mainMenu] }
		);
	});

	bot.command('admin-clear-tasks', async (ctx) => {
		const userId = ctx.message.sender.user_id;
		await Task.deleteMany({ userId });
		await ctx.reply('Все ваши задачи были удалены.', { attachments: [mainMenu] });
	});
}
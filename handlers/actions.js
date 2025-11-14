import {userState} from '../state/userState.js'

export function setupActions(bot) {
	bot.action('add-task', async (ctx) => {
		const userId = ctx.callback.user.user_id;
		userState[userId] = { step: 'title', task: {} };
		await ctx.reply('Введите название задачи:');
	});
	
	bot.action('list-of-tasks', async (ctx) => {
		await ctx.reply('Тут надо вывести список задач!')
	})
}
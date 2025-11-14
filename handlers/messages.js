import {userState} from '../state/userState.js'
import {Task} from '../models/Task.js'
import {mainMenu} from '../keyboards/mainMenu.js'
import { use } from 'react';

export function setupMessages(bot) {
	bot.on('message_created', async (ctx) => {
		const userId = ctx.message.sender.user_id;
		if (!userState[userId]) return;
		
		const state = userState[userId];
		const text = ctx.message.body.text.trim();
		
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
				let task = new Task({
					userId,
					...state.task
				});
				await task.save()
				
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
				
			case 'complete':
				const taskNumber = parseInt(text)
				if (isNaN(taskNumber) || taskNumber < 1) {
					await ctx.reply('Пожалуйста введите корректный номер задачи')
					break;
				}
				const tasks = await Task.find({ userId }).sort({ createdAt: -1 })
				
				if (taskNumber > tasks.length) {
					await ctx.reply(`У вас нет задачи с номером ${taskNumber}`)
					break
				}
				
				const taskToComplete = tasks[taskNumber - 1]
				await Task.findByIdAndUpdate(
					taskToComplete.id,
					{status: 'completed'}
				)
				await ctx.reply(`Задача "${taskToComplete.title}" отмечена как выполненная!`, { attachments: [mainMenu] })
				userState[userId] = {};
				break;
		}
	});
}
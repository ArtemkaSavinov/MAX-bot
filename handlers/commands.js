import {mainMenu} from '../keyboards/mainMenu.js'
import {userState} from '../state/userState.js'

export function setupCommands(bot) {
	bot.command('start', (ctx) => {
		ctx.reply('Привет! Это трекер твоих задач!', {attachments: [mainMenu]})
	})
	
	bot.command('main-menu', (ctx) => {
		ctx.reply('Главное меню:', {attachments: [mainMenu]})
		userState[ctx.message.sender.user_id] = {};
	})
}
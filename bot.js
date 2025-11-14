import {Bot} from '@maxhub/max-bot-api'
import {myCommands} from './handlers/myCommands.js'
import {setupCommands} from './handlers/commands.js'
import {setupActions} from './handlers/actions.js'
import {setupMessages} from './handlers/messages.js'
import {connectDB} from './config/database.js'

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('Token not provided')

const bot = new Bot(token);

await connectDB()

bot.api.setMyCommands(myCommands)
setupCommands(bot)
setupActions(bot)
setupMessages(bot)

bot.start()
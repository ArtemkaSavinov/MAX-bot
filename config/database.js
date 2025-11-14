import mongoose from 'mongoose'

// подключение к базе данных
export async function connectDB() {
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/max-bot')
		console.log('db connected')
	} catch(e) {
		console.log(e)
	}
}
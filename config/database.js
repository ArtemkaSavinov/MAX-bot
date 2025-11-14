import mongoose from 'mongoose'

// подключение к базе данных
export async function connectDB() {
	const url = process.env.MONGO_URL || "mongodb://mongo:27017/max-bot";
	try {
		await mongoose.connect(url)
		console.log('db connected')
	} catch(e) {
		console.error("Mongo connection error:", e);
	}
}
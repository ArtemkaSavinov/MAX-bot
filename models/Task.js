import mongoose from 'mongoose'

// модель задачи
const taskSchema = new mongoose.Schema({
	userId: String,
	title: String,
	deadline: String,
	difficulty: Number,
	category: String,
	createdAt: { type: Date, default: Date.now }
})

export const Task = mongoose.model("Task", taskSchema)
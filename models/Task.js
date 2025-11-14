import mongoose from 'mongoose'

// модель задачи
const taskSchema = new mongoose.Schema({
	userId: Number,
	title: String,
	deadline: String,
	status: { type: String, default: 'active' },
	difficulty: Number,
	category: String,
	createdAt: { type: Date, default: Date.now }
})

export const Task = mongoose.model("Task", taskSchema)
import mongoose from 'mongoose'

// модель задачи
const taskSchema = new mongoose.Schema({
	userId: Number,
	title: String,
	deadline: {type: Date},
	difficulty: Number,
	category: String,
	status: { type: String, default: 'active' },
	createdAt: { type: Date, default: Date.now }
})

export const Task = mongoose.model("Task", taskSchema)
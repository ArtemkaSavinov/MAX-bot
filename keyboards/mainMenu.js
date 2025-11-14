// главное меню бота
export const mainMenu = {
	type: "inline_keyboard",
	payload: {
		buttons: [
			[{ type: "callback", text: "Добавить задачу", payload: "add-task" }],
			[{ type: "callback", text: "Удалить задачу", payload: "remove-task" }],
			[{ type: "callback", text: "Список задач", payload: "list-of-tasks" }],
			[{ type: "callback", text: "Выполнить задачу", payload: "complete-task" }],
			[{ type: "callback", text: "Изменить категорию", payload: "update-category" }]
		]
	}
};
// главное меню бота
export const startKb = {
	type: "inline_keyboard",
	payload: {
		buttons: [
			[{ type: "callback", text: "Показать дальше", payload: "next-tasks" }],
			[{ type: "callback", text: "Отсортировать (не ворк)", payload: "sort" }],
			[{ type: "callback", text: "Вернуться в меню", payload: "main-menu" }],
		]
	}
};

export const middleKb = {
	type: "inline_keyboard",
	payload: {
		buttons: [
			[{ type: "callback", text: "Назад", payload: "prev-tasks" }],
			[{ type: "callback", text: "Показать дальше", payload: "next-tasks" }],
			[{ type: "callback", text: "Вернуться в меню", payload: "main-menu" }],
		]
	}
};

export const lastKb = {
	type: "inline_keyboard",
	payload: {
		buttons: [
			[{ type: "callback", text: "Назад", payload: "prev-tasks" }],
			[{ type: "callback", text: "Вернуться в меню", payload: "main-menu" }],
		]
	}
};
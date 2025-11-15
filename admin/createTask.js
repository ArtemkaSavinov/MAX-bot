import { Task } from '../models/Task.js';
import { parseDateDDMMYYYY } from '../handlers/dateRefactoring.js';

export function createTask(userId){
    // Вспомогательные данные
		const titles = Array.from({ length: 25 }, (_, i) => `task${i + 1}`); // ['task1', 'task2', ..., 'task25']
		const categories = ['Работа', 'Учёба', 'Личное', 'Хобби', 'Финансы'];

		// Генерация случайного элемента из массива
		const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

		// Генерация случайного числа в диапазоне [min, max] (включительно)
		const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

		// Генерация случайной даты в будущем (в пределах следующих 365 дней)
		const randomFutureDate = () => {
			const now = new Date();
			const randomDays = randomInt(1, 365);
			const futureDate = new Date(now);
			futureDate.setDate(now.getDate() + randomDays);
			// Формат: ДД.ММ.ГГГГ
			const day = String(futureDate.getDate()).padStart(2, '0');
			const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // getMonth() возвращает 0–11
			const year = futureDate.getFullYear();
			return `${day}.${month}.${year}`;
		};

		// Создание задачи
		let task = new Task({
			userId,
			title: randomItem(titles),
			deadline: parseDateDDMMYYYY(randomFutureDate()),
			difficulty: randomInt(1, 10),
			category: randomItem(categories)
		});
        return task;
}
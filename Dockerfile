FROM node:18

# Создаём рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё приложение
COPY . .

# Переменная окружения (будет перезаписана docker-compose)
ENV BOT_TOKEN=""
ENV MONGO_URL="mongodb://mongo:27017/max-bot"

# Запуск бота
CMD ["node", "bot.js"]

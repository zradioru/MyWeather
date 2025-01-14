const express = require('express');
const webPush = require('web-push');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// VAPID ключи (сгенерируйте с помощью web-push)
const vapidKeys = {
    publicKey: 'BBofecnQh2X7CJGTUhPvUbsUIrYFg08No4tAjJRbLDLKFG2vnl8G5B7t0oafxx1Un0zF7tz-3H5WhLDD8q1WaQA',
    privateKey: 'H5elu6StSpzOK6MtSf82kqnBcuvWpVWYyyRg0Umv4JU',
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const subscriptions = [];

app.use(express.json());

// Эндпоинт для подписки на push-уведомления
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

// Функция для проверки данных из ThingSpeak
async function checkThingSpeak() {
    const apiUrl = 'https://api.thingspeak.com/channels/2797788/fields/6/last.json?api_key=JVBVQE2RNN98SQK3';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const value = parseFloat(data.field6);

        if (value > 30) { // Заданный порог
            sendPushNotifications(`Температура превышена: ${value}°C`);
        }
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}

// Функция для отправки push-уведомлений
function sendPushNotifications(message) {
    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, JSON.stringify({
            title: 'Внимание!',
            body: message,
            icon: './icon-192x192.png',
        })).catch(error => {
            console.error('Ошибка отправки уведомления:', error);
        });
    });
}

// Проверка данных каждые 5 минут
setInterval(checkThingSpeak, 300000);

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


import express from 'express';
import bodyParser from 'body-parser';
import { initiatePayment } from './controllers/paymentController.js';
import { handleNotification } from './controllers/notifyController.js';
import { getPreService, getOperator } from './controllers/serviceController.js'
import { teleWebhook } from './controllers/teleController.js';
import TelegramBot from 'node-telegram-bot-api';
import { telegramConfig } from './config/config.js';
import { PORT } from './config/config.js';

const token = telegramConfig.apiKey;
const bot = new TelegramBot(token);

const app = express();
app.use(bodyParser.json());

app.post('/payment', initiatePayment);

app.post('/payment/notify', handleNotification);

app.post('/services/prepaid/', getPreService);

app.post('/services/prepaid/operator', getOperator);

app.post('/telegram/webhook', teleWebhook)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.setWebHook(`${telegramConfig.url}/telegram/webhook`);
console.log(telegramConfig.url+"/telegram/webhook")
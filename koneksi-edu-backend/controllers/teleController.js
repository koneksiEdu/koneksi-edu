import TelegramBot from 'node-telegram-bot-api';
import { telegramConfig } from '../config/config.js';

const token = telegramConfig.apiKey;
const bot = new TelegramBot(token);

// Endpoint untuk webhook
app.post('/webhook', (req, res) => {
  const chatId = req.body.message.chat.id;
  const text = `Chat ID Anda adalah: ${chatId}`;
  
  bot.sendMessage(chatId, text);

  // Kirim response 200 OK
  res.sendStatus(200);
});

export const teleWebhook = async (req, res) => {
  // Mengecek apakah ada pesan
  if (req.body.message) {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;

    // Mengecek apakah pesan adalah perintah khusus
    if (text === '/chatid') {
      const reply = `Chat ID Anda adalah: ${chatId}`;
      bot.sendMessage(chatId, reply);
    } else {
      // Opsional: tanggapi perintah lain atau pesan non-perintah
      bot.sendMessage(chatId, 'Kirim perintah /chatid untuk mendapatkan chat ID Anda.');
    }
  }

  // Kirim response 200 OK
  res.sendStatus(200);
};

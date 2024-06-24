import express from 'express';
import bodyParser from 'body-parser';
import { initiatePayment } from './controllers/paymentController.js';
import { handleNotification } from './controllers/notifyController.js';
import { getPreService } from './controllers/serviceController.js'
import { PORT } from './config/config.js';

const app = express();
app.use(bodyParser.json());

app.post('/payment', initiatePayment);

app.post('/payment/notify', handleNotification);

app.post('/services/prepaid/get', getPreService);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

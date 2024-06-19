import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';
import cors from 'cors'; // Tambahkan ini

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Tambahkan ini

const iPaymuConfig = {
    apiKey: "QbGcoO0Qds9sQFDmY0MWg1Tq.xtuh1",
    va: "1179000899",
    url: 'https://sandbox.ipaymu.com/api/v2/payment'
};

const PPOBConfig = {
    apiUrl: 'https://vip-reseller.co.id/api/prepaid',
    apiKey: 'YOUR_PPOB_API_KEY',
    apiId: 'YOUR_PPOB_API_ID'
};

app.post('/payment', async (req, res) => {
    const { product, qty, price, amount, returnUrl, cancelUrl, notifyUrl, referenceId, buyerName, buyerPhone, buyerEmail } = req.body;

    const body = {
        product,
        qty,
        price,
        amount,
        returnUrl,
        cancelUrl,
        notifyUrl,
        referenceId,
        buyerName,
        buyerPhone,
        buyerEmail
    };

    const bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body)).toString();
    const stringToSign = `POST:${iPaymuConfig.va}:${bodyEncrypt}:${iPaymuConfig.apiKey}`;
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringToSign, iPaymuConfig.apiKey));

    try {
        const response = await fetch(iPaymuConfig.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'va': iPaymuConfig.va,
                'signature': signature,
                'timestamp': new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]
            },
            body: JSON.stringify(body)
        });

        const responseJson = await response.json();
        res.json(responseJson);
    } catch (error) {
        res.status(500).json({ error: 'Payment request failed' });
    }
});

app.post('/payment/notify', async (req, res) => {
    const { status, referenceId } = req.body;

    if (status === 'success') {
        const sign = CryptoJS.MD5(PPOBConfig.apiId + PPOBConfig.apiKey).toString();
        const orderBody = {
            key: PPOBConfig.apiKey,
            sign: sign,
            type: 'order',
            service: 'SERVICE_CODE',
            data_no: referenceId
        };

        try {
            const response = await fetch(PPOBConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderBody)
            });

            const responseJson = await response.json();
            res.json(responseJson);
        } catch (error) {
            res.status(500).json({ error: 'Order processing failed' });
        }
    } else {
        res.status(400).json({ error: 'Payment failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

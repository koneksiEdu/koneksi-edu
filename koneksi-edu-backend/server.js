import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import FormData from 'form-data';
import CryptoJS from 'crypto-js';

const app = express();
app.use(bodyParser.json());

const iPaymuConfig = {
    apiKey: "QbGcoO0Qds9sQFDmY0MWg1Tq.xtuh1",
    va: "1179000899",
    url: 'https://sandbox.ipaymu.com/api/v2/payment'
};

const PPOBConfig = {
    apiUrl: 'https://vip-reseller.co.id/api/prepaid',
    apiKey: 'c86WacFkhxXscXkWYRdi3PuQZj4MufH4HJY7AUnSZ4AyZsshzJ3o3fyQ3FhWNEKs',
    apiId: 'JmQXlGBi'
};

// Endpoint untuk inisiasi pembayaran
app.post('/payment', async (req, res) => {
    const {
        product, qty, price, description, imageUrl, returnUrl, cancelUrl,
        referenceId, buyerName, buyerEmail, buyerPhone, paymentMethod,
    } = req.body;

    const notifyUrl = 'https://your-server.com/payment/notify'; // Sesuaikan dengan URL server Anda

    // Encrypt body
    const bodyEncrypt = CryptoJS.SHA256(JSON.stringify({
        product, qty, price, description, imageUrl, returnUrl, notifyUrl, cancelUrl,
        referenceId, buyerName, buyerEmail, buyerPhone, paymentMethod
    })).toString();

    // Generate signature
    const stringToSign = `POST:${iPaymuConfig.va}:${bodyEncrypt}:${iPaymuConfig.apiKey}`;
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringToSign, iPaymuConfig.apiKey));

    // Prepare data for request
    const data = new FormData();
    data.append('product[]', product);
    data.append('qty[]', qty);
    data.append('price[]', price);
    data.append('description[]', description);
    data.append('imageUrl[]', imageUrl);
    data.append('returnUrl', returnUrl);
    data.append('notifyUrl', notifyUrl); // Masukkan notifyUrl di sini
    data.append('cancelUrl', cancelUrl);
    data.append('referenceId', referenceId);
    data.append('buyerName', buyerName);
    data.append('buyerEmail', buyerEmail);
    data.append('buyerPhone', buyerPhone);
    data.append('paymentMethod', paymentMethod);

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: iPaymuConfig.url,
        headers: {
            'signature': signature,
            'va': iPaymuConfig.va,
            'timestamp': new Date().toISOString().replace(/[-:T]/g, '').split('.')[0],
            ...data.getHeaders()
        },
        data: data
    };

    try {
        // Send request to iPaymu
        const response = await axios(config);
        // Check response from iPaymu
        const responseData = response.data;
        if (responseData.Status === 200 && responseData.Data && responseData.Data.Url) {
            // Redirect user to payment URL
            res.redirect(responseData.Data.Url);
        } else {
            res.status(500).json({ error: 'Unexpected response from iPaymu' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Payment request failed', details: error.message });
    }
});

// Endpoint untuk menerima notifikasi pembayaran dari iPaymu
app.post('/payment/notify', async (req, res) => {
    const { status, buyerPhone } = req.body;

    if (status === 'success') {
        const sign = CryptoJS.MD5(PPOBConfig.apiId + PPOBConfig.apiKey).toString();
        const orderBody = {
            key: PPOBConfig.apiKey,
            sign: sign,
            type: 'order',
            service: req.body.service,
            data_no: buyerPhone
        };

        const config = {
            method: 'post',
            url: PPOBConfig.apiUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: orderBody
        };

        try {
            const response = await axios(config);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Order processing failed', details: error.message });
        }
    } else {
        res.status(400).json({ error: 'Payment failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

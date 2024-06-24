import axios from 'axios';
import CryptoJS from 'crypto-js';
import FormData from 'form-data';
import { iPaymuConfig, PORT } from '../config/config.js';
import { getFormattedTimestamp } from '../utils/utils.js';

export const initiatePayment = async (req, res) => {
    const {
        product, qty, price, returnUrl, cancelUrl,
        referenceId, buyerName, buyerPhone, buyerEmail
    } = req.body;

    const notifyUrl = `http://localhost:${PORT}/payment/notify`;

    const body = {
        product,
        qty,
        price,
        returnUrl,
        cancelUrl,
        notifyUrl,
        referenceId,
        buyerName,
        buyerPhone,
        buyerEmail,
        paymentMethod: 'qris'
    };

    // Encrypt body
    const bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex);
    const stringToSign = `POST:${iPaymuConfig.va}:${bodyEncrypt}:${iPaymuConfig.apiKey}`;
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringToSign, iPaymuConfig.apiKey));

    const data = new FormData();
    Object.keys(body).forEach(key => {
        if (Array.isArray(body[key])) {
            body[key].forEach(value => data.append(`${key}[]`, value));
        } else {
            data.append(key, body[key]);
        }
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: iPaymuConfig.url,
        headers: { 
            'Content-Type': 'application/json',
            'signature': signature, 
            'va': iPaymuConfig.va, 
            'timestamp': getFormattedTimestamp(), 
            'User-Agent': 'iPaymu',
            ...data.getHeaders(),
        },
        data: data
    };

    try {
        const response = await axios(config);
        const responseData = response.data;

        if (responseData.Status === 200 && responseData.Data && responseData.Data.Url) {
            res.redirect(responseData.Data.Url);
            console.log(responseData.Data.SessionID)
        } else {
            res.status(500).json({ error: 'Unexpected response from iPaymu', details: responseData });
        }
    } catch (error) {
        res.status(500).json({ error: 'Payment request failed', details: error.message });
    }
};

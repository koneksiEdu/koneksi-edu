import axios from 'axios';
import { PPOBConfig } from '../config/config.js';

export const handleNotification = async (req, res) => {
    const { status, sid } = req.body;

    if (status === 'success') {
        const orderBody = {
            key: PPOBConfig.apiKey,
            sign: PPOBConfig.sign,
            type: 'order',
            service: service,
            data_no: buyerPhone
        };

        const config = {
            method: 'post',
            url: PPOBConfig.apiUrlPrepaid,
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
    }
};
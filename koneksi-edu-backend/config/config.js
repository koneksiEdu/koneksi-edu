import { config } from 'dotenv';
config();

export const iPaymuConfig = {
    apiKey: process.env.PAYMENT_API,
    va: process.env.PAYMENT_VA,
    url: 'https://sandbox.ipaymu.com/api/v2/payment'
};

export const PPOBConfig = {
    apiUrlPrepaid: 'https://vip-reseller.co.id/api/prepaid',
    apiKey: process.env.PPOB_API,
    apiId: process.env.PPOB_ID,
    sign: process.env.PPOB_SIGN
};

export const PORT = process.env.PORT || 3000;
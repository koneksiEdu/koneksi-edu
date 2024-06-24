import axios from 'axios';
import FormData from 'form-data';
import { PPOBConfig } from '../config/config.js';

export const getPreService = async (req, res) => {
  try {
    
    const { filter_type, filter_value } = req.body;

    // Construct the body of the request to the external API
    const form = new FormData();
    form.append('key', PPOBConfig.apiKey);
    form.append('sign', PPOBConfig.sign);
    form.append('type', 'services');

    // Conditionally add optional parameters
    if (filter_type) {
      form.append('filter_type', filter_type);
    }
    if (filter_value) {
      form.append('filter_value', filter_value);
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: PPOBConfig.apiUrlPrepaid,
      headers: {
        'Content-Type': 'application/json',
        ...form.getHeaders(),
      },
      data: form
    };

    const response = await axios(config);

    // Return the response to the client
    res.json(response.data);
  } catch (error) {
    // Log the error message
    console.error('Error:', error.message);

    // Return an error response to the client
    res.status(500).json({ error: 'Order processing failed', details: error.message });
  }
};

export const getOperator = async (req, res) => { 
  try {
    const form = new FormData();
    form.append('key', PPOBConfig.apiKey);
    form.append('sign', PPOBConfig.sign);
    form.append('type', 'services');
    form.append('filter_type', 'type');
    form.append('filter_value', 'pulsa-reguler');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: PPOBConfig.apiUrlPrepaid,
      headers: {
        'Content-Type': 'application/json',
        ...form.getHeaders(),
      },
      data: form
    };

    const response = await axios(config);

    res.json(response.data);

  } catch (error) {
    console.error('Error:', error.message);

    res.status(500).json({ error: 'Order processing failed', details: error.message });
  }
};
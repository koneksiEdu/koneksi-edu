import axios from 'axios';
import { PPOBConfig } from '../config/config.js';

export const getPreService = async (req, res) => {
  try {
    // Log the request body
    console.log('Received request body:', req.body);

    const { filter_type, filter_value } = req.body;

    // Construct the body of the request to the external API
    const preServiceBody = {
      key: PPOBConfig.apiKey,
      sign: PPOBConfig.sign,
      type: 'services',
    };

    // Conditionally add optional parameters
    if (filter_type) {
      preServiceBody.filter_type = filter_type;
    }
    if (filter_value) {
      preServiceBody.filter_value = filter_value;
    }

    // Log the body being sent to the external API
    console.log('Sending request to external API with body:', preServiceBody);

    const config = {
      method: 'post',
      url: PPOBConfig.apiUrlPrepaid,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: preServiceBody
    };

    // Make the request to the external API
    const response = await axios(config);

    // Log the response from the external API
    console.log('Response from external API:', response.data);

    // Return the response to the client
    res.json(response.data);
  } catch (error) {
    // Log the error message
    console.error('Error:', error.message);

    // Return an error response to the client
    res.status(500).json({ error: 'Order processing failed', details: error.message });
  }
};

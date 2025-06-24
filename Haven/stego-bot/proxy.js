const express = require('express');
const axios = require('axios');
const steganography = require('steganography');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const StegCloak = require('stegcloak');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Proxy endpoint for Replicate API
app.post('/proxy/replicate', async (req, res) => {
  try {
    const { prompt, width, height } = req.body;
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'b21cbe271e65c1718f2999b038c18b45e21e4fba7d3d90dadd9e0b02b2abb9f3', // FLUX.1 [schnell]
        input: { prompt, width, height, num_outputs: 1 }
      },
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data.detail : 'Proxy request failed'
    });
  }
});

// Proxy endpoint to check prediction status
app.get('/proxy/replicate/:predictionId', async (req, res) => {
  try {
    const { predictionId } = req.params;
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy status error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data.detail : 'Proxy status request failed'
    });
  }
});

// --- STEGCLOAK TEXT STEGANOGRAPHY ENDPOINTS ---

// Encode: POST /stegcloak/encode { cover, secret, password }
app.post('/stegcloak/encode', (req, res) => {
  try {
    const { cover, secret, password } = req.body;
    if (!cover || !secret) {
      return res.status(400).json({ error: 'cover and secret are required' });
    }
    const stegged = stegcloak.hide(secret, password || '', cover);
    res.json({ stegged });
  } catch (error) {
    res.status(500).json({ error: 'Encoding failed', details: error.message });
  }
});

// Decode: POST /stegcloak/decode { stegged, password }
app.post('/stegcloak/decode', (req, res) => {
  try {
    const { stegged, password } = req.body;
    if (!stegged) {
      return res.status(400).json({ error: 'stegged is required' });
    }
    const secret = stegcloak.reveal(stegged, password || '');
    res.json({ secret });
  } catch (error) {
    res.status(500).json({ error: 'Decoding failed', details: error.message });
  }
});

// Serve static files (e.g., index.html)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

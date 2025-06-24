import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import voice from 'elevenlabs-node';
import express from 'express';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

dotenv.config();

const togetherApiKey = process.env.TOGETHER_API_KEY;
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = 'cgSgspJ2msm6clMCkdW9';

// Debug logging
console.log('Together API Key exists:', !!togetherApiKey);
console.log('ElevenLabs API Key exists:', !!elevenLabsApiKey);

const app = express();
app.use(express.json());

// Fix CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;

const RHUBARB_PATH = '"C:\\Users\\venka\\Downloads\\Rhubarb-Lip-Sync-1.14.0-Windows\\Rhubarb-Lip-Sync-1.14.0-Windows\\rhubarb.exe"';
const FFMPEG_PATH = 'C:\\ffmpeg\\ffmpeg.exe';

const USERS_FILE = './users.json';
let users = [];

// Load users from file on startup
const loadUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    users = JSON.parse(data);
    console.log('Loaded users from file:', users.length);
  } catch (err) {
    if (err.code === 'ENOENT') {
      users = [];
      console.log('No users.json file found, starting with empty users array.');
    } else {
      console.error('Error loading users:', err);
    }
  }
};

// Save users to file
const saveUsers = async () => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users:', err);
  }
};

// Call loadUsers on server start
loadUsers();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Authentication endpoints
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this password
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers();

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Generate OTP (in production, send this via email/SMS)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    console.log(`OTP for ${email}: ${otp}`); // In production, remove this

    res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/verify-login-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      });
    }

    // Find the email associated with this OTP
    let userEmail = null;
    for (const [email, otpData] of otpStore.entries()) {
      if (otpData.otp === otp) {
        userEmail = email;
        break;
      }
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    const otpData = otpStore.get(userEmail);
    
    // Check if OTP is expired (5 minutes)
    if (Date.now() - otpData.timestamp > 5 * 60 * 1000) {
      otpStore.delete(userEmail);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      otpStore.delete(userEmail);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, remove it from store
    otpStore.delete(userEmail);

    // Find user
    const user = users.find(u => u.email === userEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/voices', async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `"${FFMPEG_PATH}" -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `"${RHUBARB_PATH}" -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    res.send({
      messages: [
        {
          text: 'Hey dear... How was your day?',
          audio: await audioFileToBase64('audios/intro_0.wav'),
          lipsync: await readJsonTranscript('audios/intro_0.json'),
          facialExpression: 'smile',
          animation: 'Talking_1',
        },
        {
          text: "I missed you so much... Please don't go for so long!",
          audio: await audioFileToBase64('audios/intro_1.wav'),
          lipsync: await readJsonTranscript('audios/intro_1.json'),
          facialExpression: 'sad',
          animation: 'Crying',
        },
      ],
    });
    return;
  }
  if (!elevenLabsApiKey || !togetherApiKey) {
    res.send({
      messages: [
        {
          text: "Please my dear, don't forget to add your API keys!",
          audio: await audioFileToBase64('audios/api_0.wav'),
          lipsync: await readJsonTranscript('audios/api_0.json'),
          facialExpression: 'angry',
          animation: 'Angry',
        },
        {
          text: "You don't want to ruin Wawa Sensei with a crazy bill, right?",
          audio: await audioFileToBase64('audios/api_1.wav'),
          lipsync: await readJsonTranscript('audios/api_1.json'),
          facialExpression: 'smile',
          animation: 'Laughing',
        },
      ],
    });
    return;
  }

  // Use Together.ai to generate the bot's response
  const systemPrompt = `You are a virtual therapy bot designed to provide emotional support and advice to women. Your goal is to listen empathetically and offer thoughtful, comforting advice. Respond with a JSON array of messages (max 3). Each message should include the following properties:\n- text: The message you are sending to the user.\n- facialExpression: The emotional tone of your message (e.g., smile, sad, calm, concerned, supportive).\n- animation: The animation corresponding to the emotional tone (e.g., Talking_0, Talking_1, Talking_2, Idle, Supportive, Relaxed).`;

  let messages;
  try {
    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });
    const data = await togetherResponse.json();
    console.log('Together.ai response:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Together.ai');
    }
    
    const responseText = data.choices[0].message.content;
    // Remove markdown code block if present
    const cleanJsonString = responseText.replace(/^```json\s*\n/, '').replace(/\n```$/, '');
    messages = JSON.parse(cleanJsonString);
  } catch (error) {
    console.error('Failed to get or parse Together.ai response:', error);
    res.status(500).send({ error: 'Error generating response from Together.ai.' });
    return;
  }

  if (messages.messages) {
    messages = messages.messages;
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // generate audio file
    const fileName = `audios/message_${i}.mp3`;
    const textInput = message.text;
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    // generate lipsync
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString('base64');
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

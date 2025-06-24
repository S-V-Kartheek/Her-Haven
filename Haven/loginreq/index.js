const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto'); // Import crypto module for token generation
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // set to true if using https
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // allow both dev ports
    credentials: true // allow cookies
}));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yashwanth_seeram@srmap.edu.in',
        pass: 'cpdy bpgy sbys rzri'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email configuration on startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Data storage
const DATA_FILE = 'users.json';

// Initialize users.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }));
}

// Helper functions
function readUsers() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeUsers(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to generate a verification token
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    if (req.session.isLoggedIn) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Endpoint to handle email verification links
app.get('/verify-email', (req, res) => {
    const token = req.query.token;
    const data = readUsers();

    // Find the user with the matching verification token who is not yet verified
    const userIndex = data.users.findIndex(user => user.verificationToken === token && user.isVerified === false);

    if (userIndex !== -1) {
        // User found and not verified, mark as verified and remove token
        data.users[userIndex].isVerified = true;
        delete data.users[userIndex].verificationToken; // Remove the used token
        writeUsers(data);

        // Redirect to frontend sign-in page or show success message
        // Assuming frontend sign-in is at http://localhost:5173 in your AI-Avatar frontend
        res.redirect('http://localhost:5173/'); // Redirect to home/signin page

        // Or send a success response:
        // res.send('Email successfully verified! You can now sign in.');

    } else {
        // Token not found, user already verified, or token expired (not implemented)
        res.status(400).send('Invalid or expired verification token.');
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const data = readUsers();
    
    // Check if user already exists
    if (data.users.some(user => user.email === email)) {
        return res.json({ success: false, message: 'Email already registered' });
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create user object with hashed password, unverified status, and verification token
    const newUser = {
        name: name,
        email: email,
        password: hashedPassword, // Store the hashed password
        isVerified: false, // Mark as unverified initially
        verificationToken: verificationToken // Store the verification token
    };

    // Add the new user to the users array
    data.users.push(newUser);
    writeUsers(data);
    
    // Send verification email with timeout
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: 'yashwanth_seeram@srmap.edu.in',
        to: email,
        subject: 'Verify Your Email Address',
        text: `Please click the following link to verify your email: ${verificationLink}

If you did not register for this account, please ignore this email.`,
        html: `<p>Please click the following link to verify your email:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>If you did not register for this account, please ignore this email.</p>`
    };

    // Set a timeout for email sending
    const emailTimeout = setTimeout(() => {
        console.error('Email sending timed out');
        return res.json({ 
            success: false, 
            message: 'Email sending timed out. Please try again or contact support.' 
        });
    }, 10000); // 10 second timeout

    transporter.sendMail(mailOptions, (error) => {
        clearTimeout(emailTimeout); // Clear the timeout
        
        if (error) {
            console.error('Error sending verification email:', error);
            // For now, let's still register the user but show the verification link in console
            console.log('=== VERIFICATION LINK (Email failed) ===');
            console.log(`Email: ${email}`);
            console.log(`Verification Link: ${verificationLink}`);
            console.log('========================================');
            
            return res.json({ 
                success: true, 
                message: 'Registration successful but email failed. Check console for verification link.' 
            });
        }
        
        console.log('Verification email sent successfully to:', email);
        // Respond indicating successful registration and email sent
        res.json({ success: true, message: 'Registration successful. Please check your email to verify your account.' });
    });
});

app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    
    if (otp === req.session.registerOTP) {
        const data = readUsers();
        data.users.push(req.session.pendingUser);
        writeUsers(data);
        
        // Clear session data
        req.session.registerOTP = null;
        req.session.pendingUser = null;
        
        res.json({ success: true, message: 'Registration successful' });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});

app.post('/login', (req, res) => {
    const { email } = req.body;
    const data = readUsers();
    const user = data.users.find(u => u.email === email);

    if (user) {
        // Check if the user's email is verified
        if (!user.isVerified) {
            return res.json({ success: false, message: 'Email not verified. Please check your inbox for a verification link.' });
        }

        // If user is found and verified, proceed with OTP login
        const otp = generateOTP();
        req.session.loginOTP = otp;
        req.session.loginEmail = email;
        console.log("Session after setting OTP in /login:", req.session);

        // For testing: Print OTP to console instead of sending email
        console.log('=== LOGIN OTP FOR TESTING ===');
        console.log(`Email: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log('=============================');
        
        // Respond immediately without sending email
        res.json({ success: true, message: 'OTP sent! Check the backend console for the OTP.' });
        
        // Comment out the email sending for now
        /*
        const mailOptions = {
            from: 'yashwanth_seeram@srmap.edu.in',
            to: email,
            subject: 'Login OTP',
            text: `Your OTP for login is: ${otp}`
        };

        // Set a timeout for email sending
        const emailTimeout = setTimeout(() => {
            console.error('Login OTP email sending timed out');
            return res.json({ 
                success: false, 
                message: 'Email sending timed out. Please try again.' 
            });
        }, 10000); // 10 second timeout

        transporter.sendMail(mailOptions, (error) => {
            clearTimeout(emailTimeout); // Clear the timeout
            
            if (error) {
                console.error('Error sending OTP email:', error);
                // For now, show OTP in console if email fails
                console.log('=== LOGIN OTP (Email failed) ===');
                console.log(`Email: ${email}`);
                console.log(`OTP: ${otp}`);
                console.log('===============================');
                
                return res.json({ 
                    success: true, 
                    message: 'OTP generated but email failed. Check console for OTP.' 
                });
            }
            
            console.log('Login OTP email sent successfully to:', email);
            res.json({ success: true, message: 'OTP sent to your email.' });
        });
        */
    } else {
        res.json({ success: false, message: 'Email not registered.' }); // Changed message for clarity
    }
});

app.post('/verify-login-otp', (req, res) => {
    console.log("Session at beginning of /verify-login-otp:", req.session);
    const { otp } = req.body;
    
    if (otp === req.session.loginOTP) {
        req.session.loginOTP = null;
        req.session.isLoggedIn = true;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 
require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Import Models
const User = require('./models/user');
const Course = require('./models/course');

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

// 🔹 In-Memory Token Blacklist (Resets When Server Restarts)
let tokenBlacklist = new Set();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Authorization Middleware
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
};

// Logout Route (Adds Token to Blacklist)
app.post("/api/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    tokenBlacklist.add(token); // Add token to in-memory blacklist
    res.status(200).json({ message: "Logout successful" });
});

// Routes

// Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password for security
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

//<COME BACK TO THIS WHEN WORKING ON AUTHENTICATION PIECE>
// Register User (Student or Teacher)
// app.post('/api/register', async (req, res) => {
//     const { username, password, role } = req.body;
//     if (!username || !password || !role) return res.status(400).json({ message: 'All fields are required' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });

//     try {
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// Register User with Auto-Generated ID
app.post("/api/user", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Missing username, password, and/or role" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const prefix = role === 'student' ? 'S' : 'T';
        const latestUser = await User.findOne({ userId: new RegExp(`^${prefix}`) }).sort({ userId: -1 });
        const latestUserId = latestUser ? parseInt(latestUser.userId.slice(1)) : 0;
        const newUserId = `${prefix}${String(latestUserId + 1).padStart(4, '0')}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userId: newUserId,
            username,
            password: hashedPassword,
            role,
            enrolledCourses: []
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Token expires in 1 hour
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userId: user.userId });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply Middleware to Protect Routes
app.use("/api/courses", authenticateToken);

// Redirect Root Route
app.get("/", (req, res) => {
    res.redirect("/api/courses");
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

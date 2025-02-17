const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

//CONNECT /MODELS
const User = require('./models/user')
const Course = require('./models/course')

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONNECT TO MONGODB
mongoose.connect('mongodb+srv://group5:Ezac8fFC7yBf2ELW@cluster0.qea7x.mongodb.net/FinalProject?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to the database'))
    .catch(err => console.log('Database connection error:', err));

// AUTHENTICATION AND AUTHORIZATION MIDDLEWARE
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
};

// ROUTES

// Get All Users
app.get("/api/user", async(req, res) => {
    try{
        const users = await User.find({}); // This will grab all the users
        res.send(users); // This will send the users back to the client
        console.log(users);
    }
    catch(err){
        console.log(err);
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

// Create a new user in the database
app.post("/api/user", async(req, res) => {
    if(!req.body.username || !req.body.password || !req.body.role){ // If one of the values is missing
        return res.sendStatus(400).json({error: "Missing username, password, and/or role"}); // Send a status of 400
    }

    const newUser = await new User({
        username: req.body.username,  //Grab values from the form
        password: req.body.password,
        role: req.body.role
    })


    try{
        await newUser.save(); // Save the new user to the database
        return res.sendStatus(201).json({ message: 'User registered successfully' }); // Send a status of 201
        console.log(newUser);
        }
    catch(err){
        console.log(err);
        return res.sendStatus(400).json({ message: 'Cannot add user' });; // Send a status of 400});
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Get All Courses (Public)
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search Courses by Name or ID (Public)
app.get('/api/courses/search', async (req, res) => {
    const { query } = req.query;
    try {
        const courses = await Course.find({
            $or: [
                { courseName: new RegExp(query, 'i') },
                { courseId: new RegExp(query, 'i') }
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a Course (Teacher Only)
app.post('/api/courses', authenticateToken, authorizeRole('teacher'), async (req, res) => {
    const { courseName, courseId, subject, credits, description } = req.body;

    if (!courseName || !courseId || !subject || !credits || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const course = new Course({ courseName, courseId, subject, credits, description, createdBy: req.user.id });

    try {
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Enroll in a Course (Student Only)
app.post('/api/courses/enroll', authenticateToken, authorizeRole('student'), async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ message: 'Course ID is required' });

    try {
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const student = await User.findById(req.user.id);
        if (student.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        student.enrolledCourses.push(course._id);
        await student.save();

        res.status(201).json({ message: `Enrolled in course ${course.courseName}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Enrolled Courses (Student Only)
app.get('/api/students/:id/courses', authenticateToken, authorizeRole('student'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id).populate('enrolledCourses');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student.enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add redirect for Glitch
app.get("/", (req, res) => {
    res.redirect("/api/courses"); // Redirect the root URL to "/api/courses"
});

// SERVER SETUP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
mongoose.connect('mongodb+srv://group5:Ezac8fFC7yBf2ELW@cluster0.qea7x.mongodb.net/FinalProject?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token after "Bearer"

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; //._id and role from the token
        next();
    });
};

// Authorization Middleware
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
};

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
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Determine prefix based on role
        const prefix = role === 'student' ? 'S' : 'T';

        // Find the latest user ID with the same prefix and increment it
        const latestUser = await User.findOne({ userId: new RegExp(`^${prefix}`) }).sort({ userId: -1 });
        const latestUserId = latestUser ? parseInt(latestUser.userId.slice(1)) : 0;
        const newUserId = `${prefix}${String(latestUserId + 1).padStart(4, '0')}`;

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userId: newUserId,
            username: req.body.username,  //Grab values from the form
            password: hashedPassword,
            role: req.body.role,
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

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user.userId });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a Course (Teacher Only)
app.post('/api/courses', authenticateToken, authorizeRole('teacher'), async (req, res) => { 

// app.post('/api/courses', async (req, res) => {
    const { courseName, courseId, subject, credits, description, createdBy } = req.body; 

    if (!courseName || !courseId || !subject || !credits || !description || !createdBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }


    try {
        const course = new Course({ courseName, courseId, subject, credits, description, createdBy});   
        await course.save();
        console.log(course);
        return res.status(201).json(course);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(409).json({ message: 'Course ID already exists' });
        }
        console.error("Error adding course:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete a Course (Teacher Only)
app.delete('/api/courses', authenticateToken, authorizeRole('teacher'), async (req, res) => {
    const { courseId, userId } = req.body;

    try {
        const course = await Course.findOneAndDelete({ courseId: courseId, createdBy: userId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found or User not authorized delete' });
        }

        return res.status(200).json({ message: 'Course deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Update a Course (Teacher Only)
app.put('/api/courses', authenticateToken, authorizeRole('teacher'), async (req, res) => {
    const { updatedCourse, userId } = req.body;

    try {
        const course = await Course.findOneAndUpdate({ courseId: updatedCourse.courseId, createdBy: userId }, updatedCourse, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found or User not authorized to update' });
        }
        return res.status(200).json(course); // Return the updated course
    }
    catch (error) {
        console.error("Error updating course:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get Enrolled Courses (Student Only)
app.get('/api/user', authenticateToken, authorizeRole('student'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.enrolledCourses) {
            return res.status(404).json({ message: 'Enrolled courses not found' });
        }
        res.status(200).json({enrolledCourses: user.enrolledCourses});
    }
    catch (error) {
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
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (student.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        student.enrolledCourses.push(course._id);
        await student.save();

        res.status(201).json({ message: `Enrolled in course ${course.courseName}` });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Redirect Root Route
app.get("/", (req, res) => {
    res.redirect("/api/courses");
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

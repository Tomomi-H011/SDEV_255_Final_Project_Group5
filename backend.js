// SERVER SETUP AND DEPENDENCIES
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');


const app = express();

//MIDDLEWARE
app.use(express.json())
app.use(cors());

//CONNECT TO MANGODB
mongoose.connect(process.env.MANGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the database'))
    .catch(err => console.log('Database connection error:', err));

//COURSE MODEL
const CourseSchema = new mongoose.Schema ({
    courseName: { type: String, required: true },
    courseId: { type: String, required: true },
    subject: {type: String, required: true},
    credits: { type: Number, required:true},
    description: {type: String, required:true},
});

const Course = mongoose.model('Course', CourseSchema);

//ROUTES (API end points)
app.get('/api/courses', async (req, res) =>{
    try{
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
});

app.post('/api/courses/enroll', (req, res) => {
    const { studentName, studentId, courseId } = req.body;

    if (!studentName || !studentId || !courseId) {
        return res.status(400).json({ message: 'All fields are required' });    
    }
    res.status(201).json({
        message: `Student ${studentName} (ID: ${studentId}) enrolled in course ${courseId}`
    });
});

//SEVER SET-UP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const Course = require('../models/course');
const router = require('express').Router();

// Get list of all courses in the database
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);  // Send the list of courses to client
        console.log(courses);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

// Add a new course to the database
router.post("/", async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();  // Save the course to the database
        res.status(201).json(course);  // Send the course to client
        console.log(course); // Log the course to the console
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

module.exports = router;  // Export the router









// Post reuest example
// POST /api/courses
// {
//     "courseName": "Economics Fundamentals",
//     "courseId": "ECON 101",
//     "subject": "Social Sciences",
//     "credits": 3,
//     "description": "Provides a survey of microeconomics, macroeconomics, international economics, comparative economic systems, historical development of economic thought, and their application to current economic problems."
//   }
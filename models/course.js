const db = require('../db');  // Import the database connection

// Define a model for courses
const Course = db.model('Course', {
    courseName: {type: String, required: true},
    courseId: {type: String, required: true},
    subject: String,
    credits: Number,
    description: String,
    username: String
});

module.exports = Course;  // Export the model
const db = require('../db');  // Import the database connection

// Define a model for courses
const User = db.model('User', {
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: String //'Teacher vs Student
});
module.exports = User;  // Export the model
const express = require('express');
const app = express();

app.use(express.json());  // Parse JSON request bodies

app.use('/api/courses', require('./api/courses'));  // Use the courses router

app.listen(3000, () => {
    // console.log('Server is running on http://localhost:3000'); // For testing
});
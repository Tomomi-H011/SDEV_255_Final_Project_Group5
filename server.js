const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = require('./api/courses');

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());  // Parse JSON request bodies

//Redirect for Glitch
app.get("/", (req, res) => {
  res.redirect("/api/courses");
});

app.use('/api/courses', require('./api/courses'));  // Use the courses router

app.listen(3000, () => {
    // console.log('Server is running on http://localhost:3000'); // For testing
});
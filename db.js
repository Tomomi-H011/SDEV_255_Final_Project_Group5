const mongoose = require('mongoose');
const db = mongoose.connection;

// Connect to the FinalProject database
mongoose.connect("mongodb+srv://group5:Ezac8fFC7yBf2ELW@cluster0.qea7x.mongodb.net/FinalProject?retryWrites=true&w=majority");

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to the database');
});

module.exports = mongoose;

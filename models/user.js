const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  // enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  enrolledCourses: [{ type: String}]
});

module.exports = mongoose.model('User', UserSchema);

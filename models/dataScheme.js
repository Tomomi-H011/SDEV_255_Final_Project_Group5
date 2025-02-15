// USER MODEL (For students and teachers)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // For students to track enrolled courses
});
const User = mongoose.model('User', UserSchema);
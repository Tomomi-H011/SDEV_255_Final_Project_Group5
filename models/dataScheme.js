// USER MODEL (For students and teachers)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // For students to track enrolled courses
});
const User = mongoose.model('User', UserSchema);

// COURSE MODEL
const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseId: { type: String, required: true },
    subject: { type: String, required: true },
    credits: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Course = mongoose.model('Course', CourseSchema);

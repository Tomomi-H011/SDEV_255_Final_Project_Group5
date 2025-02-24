// View Course function
      
// Function to get the userId from local storage
function getUserId() {
  return localStorage.getItem('userId');
}

async function viewCourse() {

  const response = await fetch(
    "https://merciful-spiral-heliotrope.glitch.me/api/courses/"
  );
  const courses = await response.json(); // Get all courses

  const userId = getUserId();

  // Filter courses to include only those created by the current user
  const filteredCourses = courses.filter(course => course.createdBy === userId);

  filteredCourses.sort((a, b) => a.courseId.localeCompare(b.courseId));  // Sort courses by courseId


  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';
  filteredCourses.forEach(course => {
    const courseItem = document.createElement('div');
    courseItem.innerHTML = `
      <p> Name: ${course.courseName} </p>
      <p> ID: ${course.courseId} </p>
      <p> Subject: ${course.subject} </p>
      <p> Credits: ${course.credits} </p>
      <p> Description: ${course.description} </p>
      <p> Created By: ${course.createdBy} </p>
      <br>
      `;
    courseList.appendChild(courseItem);
  });
}


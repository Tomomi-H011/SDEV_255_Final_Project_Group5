// Function to get the token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Function to get the userId from local storage
function getUserId() {
  return localStorage.getItem('userId');
}

// Function to fetch already enrolled coures
async function fetchEnrolledCourses() {
  const token = getToken();
  // const userId = getUserId();

  try {
  let response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/user/", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

  });
  if (response.ok) {
    let returnedCourses = await response.json();
    return returnedCourses.enrolledCourses;
  } 
  // else {
  //   alert("No enrolled courses found.");
  // } //DO NOT SHOW ALART
  }
  catch (error) {
    console.error("Error:", error);
    alert("Error occured while fetching enrolled courses.");
  }
}

// Function to fetch all courses
async function fetchAllCourses() {
  const response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/courses/");
  const allCourses = await response.json(); // Get all courses
  return allCourses;
}



// Function to populate the select element with courses
async function populateCourses() {
  const allCourses = await fetchAllCourses();  // Returns array of all courses
  const enrolledCourses = await fetchEnrolledCourses();  // Returns array of enrolled courses
  const courseSelect = document.getElementById('course-select');
  courseSelect.innerHTML = ''; // Clear the select element

  // Filter out the courses that are already enrolled
  const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.courseId));
  
  availableCourses.forEach(course => {
    let option = document.createElement('option');
    option.value = course.courseId;
    option.textContent = `${course.courseId}: ${course.courseName}`; // Format as "courseId: courseName"
    courseSelect.appendChild(option);
  });

}


addEventListener("DOMContentLoaded", function () {
  populateCourses(); // Populate the select element with courses
  document.querySelector("#enrollBtn").addEventListener("click", enrollCourse);

        // let courses = JSON.parse(localStorage.getItem('courses')) || [];

        // let courseSelect =  document.getElementById('course-select');
});

// Add Course function
async function addCourse() {
  const token = getToken(); // Retrieve the token from local storage
  const userId = getUserId(); // Retrieve the userId from local storage

  const selectedCourseName = document.getElementById('course-select').value;
  
        courses.forEach(course => {
          let option = document.createElement('option');
          option.value = course.id;
          option.textContent = course.name;
          courseSelect.appendChild(option)
        });
};
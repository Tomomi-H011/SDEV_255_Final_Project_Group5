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
      let returnedCourses = await response.json();  // Returns array of enrolled courseIds
      return returnedCourses.enrolledCourses;
    }
    else if (response.status === 403) {
      alert("Access denied. Please login as Student to access this page.");
    }
    else if (response.status === 404) {
      alert("No enrolled courses found.");
    } 
  }
  catch (error) {
    console.error("Error:", error);
    alert("Error occured while fetching enrolled courses.");
  }
}

// Function to display enrolled courses
async function displayEnrolledCourses() {

  const enrolledCourseIds = await fetchEnrolledCourses();  // Returns array of enrolled courses
  const allCourses = await fetchAllCourses();  // Returns objects of all courses
  const courseList = document.getElementById('enrolled-course-list');
  courseList.innerHTML = '';

  enrollCourse.forEach(courseId => {
  const course = allCourses.find(course => course.courseId === courseId); // Find the course object with the same courseId
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



// Function to fetch all courses
async function fetchAllCourses() {
  const response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/courses/");
  const allCourses = await response.json(); // Get all courses
  return allCourses;
}



// Function to populate the select element with courses
async function populateCourses() {
  const allCourses = await fetchAllCourses();  // Returns array of all courses
  const enrolledCourseIds = await fetchEnrolledCourses();  // Returns array of enrolled courses
  const courseSelect = document.getElementById('course-select');
  courseSelect.innerHTML = ''; // Clear the select element

  // Filter out the courses that are already enrolled
  const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.courseId));
  
  availableCourses.forEach(course => {
    let option = document.createElement('option');
    option.value = course.courseId;
    option.textContent = `${course.courseId} : ${course.courseName}`; // Format as "courseId: courseName"
    courseSelect.appendChild(option);
  });

}


addEventListener("DOMContentLoaded", function () {
  populateCourses(); // Populate the select element with courses
  displayEnrolledCourses(); // Display the enrolled courses in the enrolled-course-list section
  document.querySelector("#enrollBtn").addEventListener("click", enrollCourse);

  // Populate the student ID field with userId from local storage
  const userId = getUserId();
  document.getElementById('student-id').value = userId;

        // let courses = JSON.parse(localStorage.getItem('courses')) || [];

        // let courseSelect =  document.getElementById('course-select');
});

// Enroll Course function
async function enrollCourse() {
  const token = getToken(); // Retrieve the token from local storage
  const userId = getUserId(); // Retrieve the userId from local storage

  const selectedCourseId = document.getElementById('course-select').value; //get the selected course ID from the drop down
  
  try {
    let response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/user/enroll", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      },
      body: JSON.stringify({ courseId: selectedCourseId }) // Send the selected course ID in the request body
    });
    if (response.ok) {
      alert("Enrolled successfully");
      populateCourses(); // Repopulate the courses in the dropdown
      displayEnrolledCourses(); // Repopulate the enrolled courses in the enrolled-course-list section
    }
    else if (response.status === 400) {
      alert("Course ID is required");
    }
  }
  catch (error) {
    console.error("Error:", error);
    alert("Error occured while enrolling in the course.");
  }
};
// import { getToken, getUserId } from './utils.js'; // Import the functions from utils.js

// Function to get the token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Function to get the userId from local storage
function getUserId() {
  return localStorage.getItem('userId');
}

// Add Course function
async function addCourse() {
  let courseId = document.getElementById('course-id').value;

  //HANDLE THIS ON THE BACKEND AND DATABASE SIDE
  // Check if course ID already exists
  // if (courses.some(course => course.id === courseId)) {
  //   alert("Course ID already exists!");
  //   return;
  // }

  let course = {
    courseName: document.getElementById('course-name').value,
    courseId: courseId,
    subject: document.getElementById('course-subject').value,
    credits: document.getElementById('course-credits').value,
    description: document.getElementById('course-description').value,
    createdBy: getUserId() // Retrieve the userId from local storage
  };

  const token = getToken(); // Retrieve the token from local storage

// "https://merciful-spiral-heliotrope.glitch.me/api/courses/"
// Put in Post Request for Add Course
  // try{ MOVE TRY CATCH TO BACKEND.JS
    let response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/courses/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      },
      body: JSON.stringify(course)
    });
    
  
  //SEND DATA TO DATABASE INSTEAD OF LOCAL STORAGE
  //   if (response.ok) {
  //     courses.push(course);
  //     localStorage.setItem('courses', JSON.stringify(courses));
  //       alert("Course Added.")
  //       clearForm();}
  //   else {
  //     alert("Failed to add course.");
  //   }
  // }
  //   catch (error){
  //     console.error("Error:", error);
  //     alert("Error occured while adding course.");
  //   }
    
  if(response.ok) {
    const results = await response.json();
    alert("Course Added.")
    document.querySelector("#course-list").innerHTML = `
      <p>Course ID: ${document.getElementById('course-id').value}</p>
      <p>Course Name: ${document.getElementById('course-name').value}</p>
      <p>Subject: ${document.getElementById('course-subject').value}</p>
      <p>Credits: ${document.getElementById('course-credits').value}</p>
      <p>Description: ${document.getElementById('course-description').value}</p>
      <p>Created By: ${getUserId()}</p>
      `;

    clearForm();
    console.log(results);
  }
  else if (response.status === 400) {
    alert("All fields are required.");
    document.querySelector("#course-list").innerHTML = "All fields are required"; // Display an error message
  }
  else if (response.status === 409) {
    alert("Course ID already exists.");
    document.querySelector("#course-list").innerHTML = `Course ID ${document.getElementById('course-id').value} already exists`; 
  }
  else {
    alert("Failed to add course.");
    document.querySelector("#course-list").innerHTML = "Cannot add course"; // Display an error message
  }
}




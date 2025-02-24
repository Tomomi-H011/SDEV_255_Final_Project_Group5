// const { update } = require("../models/user");

// Function to get the token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Function to get the userId from local storage
function getUserId() {
  return localStorage.getItem('userId');
}


// Update Course function
async function updateCourse() {
  //THE CODE BELOW FOR STORING COURSES IN LOCAL STORAGE
  // let index = courses.findIndex(course => course.id === courseId);

  // if (index === -1) {
  //   alert("Course not found.");
  //   return;
  // }
  // courses[index] = {
  //   name: document.getElementById('course-name').value,
  //   id: courseId,
  //   subject: document.getElementById('course-subject').value,
  //   credits: document.getElementById('course-credits').value,
  //   description: document.getElementById('course-description').value
  // };

  let courseId = document.getElementById('course-id').value;
  let courseName = document.getElementById('course-name').value;
  let subject = document.getElementById('course-subject').value;
  let credits = document.getElementById('course-credits').value;
  let description = document.getElementById('course-description').value;
  let userId = getUserId();
  const token = getToken();

  let updatedCourse = {
    courseName: courseName,
    courseId: courseId,
    subject: subject,
    credits: credits,
    description: description,
    createdBy: userId
  };

//Put in POST Request to Update Course
        try{
          let response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/courses/", {
            method: "PUT",
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token}` // Add the token to the Authorization header
            },
            body: JSON.stringify({updatedCourse, userId})
          });

          if (response.ok){
            // course[index] = updatedCourse;
            // localStorage.setItem('courses', JSON.stringify(courses));
            const updatedCourse = await response.json();
            alert("Course Updated.");
            clearForm();
            document.querySelector("#course-list").innerHTML = `
            <p>Course ID: ${updatedCourse.courseId}</p>
            <p>Course Name: ${updatedCourse.courseName}</p>
            <p>Subject: ${updatedCourse.subject}</p>
            <p>Credits: ${updatedCourse.credits}</p>
            <p>Description: ${updatedCourse.description}</p>
            <p>Created By: ${updatedCourse.createdBy}</p>
            `;
          } 
          else if (response.status === 404) {
            alert("Course not found or User not authorized to update.");
          }
          else {
            alert("Failed to update existing course.");
          }
        } catch (error){
          console.error("Error:", error);
          alert("Error occured while updating course.");
        }
      }

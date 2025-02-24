// Function to get the token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Function to get the userId from local storage
function getUserId() {
  return localStorage.getItem('userId');
}

// Delete Course function
      async function deleteCourse() {
        let courseId = document.getElementById('course-id').value;
        let userId = getUserId();
        const token = getToken();

        //THE CODE BELOW IS MOVED TO BACKEND.JS
        // let index = courses.findIndex(course => course.id === courseId);

        // if (index === -1) {
        //   alert("Course not found!");
        //   return;
        // }

// Put in Post Request to Delete Course

        try{
          let response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/courses/", {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      
            },
            body: JSON.stringify({courseId: courseId, userId: userId })
          });

          if (response.ok) {
            // courses.splice(index, 1);
            // localStorage.setItem('courses', JSON.stringify(courses));
            alert("Course Deleted.");
            clearForm();
          } 
          else if (response.status === 404) {
            alert("Course not found or User not authorized to delete.");
          }
          else {
            alert("Failed to delete course.")
          }
        } catch (error){
          console.error("Error:", error);
          alert("Error occured when deleting course.")
        }
      }

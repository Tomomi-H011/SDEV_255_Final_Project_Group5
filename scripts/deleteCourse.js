// Delete Course function
      async function deleteCourse() {
        let courseId = document.getElementById('course-id').value;
        let index = courses.findIndex(course => course.id === courseId);

        if (index === -1) {
          alert("Course not found!");
          return;
        }

// Put in Post Request to Delete Course

        try{
          let response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: courseId})
          });

          if (response.ok) {
            courses.splice(index, 1);
            localStorage.setItem('courses', JSON.stringify(courses));
            alert("Course Deleted.");
            clearForm();
          } else {
            alert("Failed to delete course.")
          }
        } catch (error){
          console.error("Error:", error);
          alert("Error occured when deleting course.")
        }
      }

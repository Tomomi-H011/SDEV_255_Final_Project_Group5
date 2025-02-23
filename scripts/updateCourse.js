// Update Course function
      async function updateCourse() {
        let courseId = document.getElementById('course-id').value;
        let index = courses.findIndex(course => course.id === courseId);

        if (index === -1) {
          alert("Course not found.");
          return;
        }

        courses[index] = {
          name: document.getElementById('course-name').value,
          id: courseId,
          subject: document.getElementById('course-subject').value,
          credits: document.getElementById('course-credits').value,
          description: document.getElementById('course-description').value
        };


//Put in POST Request to Update Course
        try{
          let response = await fetch("/api/courses", {
            method: "POST",
            headers: {
              'Content-Type': "application/json"
            },
            body: JSON.stringify(updatedCourse)
          });

          if (response.ok){
            course[index] = updatedCourse;
            localStorage.setItem('courses', JSON.stringify(courses));
            alert("Course Updated.");
            clearForm();
          } else {
            alert("Failed to update existing course.");
          }
        } catch (error){
          console.error("Error:", error);
          alert("Error occured while updating course.");
        }
      }

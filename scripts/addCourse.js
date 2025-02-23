// Add Course function
      async function addCourse() {
        let courseId = document.getElementById('course-id').value;

        // Check if course ID already exists
        if (courses.some(course => course.id === courseId)) {
          alert("Course ID already exists!");
          return;
        }

        let course = {
          name: document.getElementById('course-name').value,
          id: courseId,
          subject: document.getElementById('course-subject').value,
          credits: document.getElementById('course-credits').value,
          description: document.getElementById('course-description').value
        };


// Put in Post Request for Add Course
        try{
          let response = await fetch("/api/courses", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(course)
          });
          
          if (response.ok) {
            courses.push(course);
            localStorage.setItem('courses', JSON.stringify(courses));
              alert("Course Added.")
              clearForm();}
          else {
            alert("Failed to add course.");
          }
        }
          catch (error){
            console.error("Error:", error);
            alert("Error occured while adding course.");
          }
        
      }

      

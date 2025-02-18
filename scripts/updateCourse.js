// Update Course function
      function updateCourse() {
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

        alert("Course Updated.");
        clearForm();
      }
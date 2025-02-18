// Add Course function
      function addCourse() {
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

        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
        alert("Course Added.");
        clearForm();
      }
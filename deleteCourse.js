 // Delete Course function
      function deleteCourse() {
        let courseId = document.getElementById('course-id').value;
        let index = courses.findIndex(course => course.id === courseId);

        if (index === -1) {
          alert("Course not found!");
          return;
        }

        courses.splice(index, 1);
        alert("Course Deleted.");
        clearForm();
      }
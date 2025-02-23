document.addEventListener("DOMContentLoaded", function () {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];

        let courseSelect =  document.getElementById('course-select');

        courses.forEach(course => {
          let option = document.createElement('option');
          option.value = course.id;
          option.textContent = course.name;
          courseSelect.appendChild(option)
        });
      });
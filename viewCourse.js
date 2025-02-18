// View Course function
      function viewCourse() {
        const courseList = document.getElementById('course-list');
        courseList.innerHTML = '';
        courses.forEach(course => {
          const courseItem = document.createElement('div');
          courseItem.innerHTML = `
        <p> Name: ${course.name} </p>
        <p> ID: ${course.id} </p>
        <p> Subject: ${course.subject} </p>
        <p> Credits: ${course.credits} </p>
        <p> Description: ${course.description} </p>
        `;
          courseList.appendChild(courseItem);
        });
      }

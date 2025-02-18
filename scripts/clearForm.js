let courses = [];

      //adding the clearform function so the fields will be cleared after adding, updating, and deleting.
      function clearForm() {
        document.getElementById('course-name').value = '';
        document.getElementById('course-id').value = '';
        document.getElementById('course-subject').value = '';
        document.getElementById('course-credits').value = '';
        document.getElementById('course-description').value = '';
      }
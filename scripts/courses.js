// Get all courses
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch(
    "https://merciful-spiral-heliotrope.glitch.me/api/courses/"
  );
  const courses = await response.json(); // Get all courses
  
  courses.sort((a, b) => a.courseId.localeCompare(b.courseId));  // Sort courses by courseId

  let html = "";

  for (let course of courses) {
    html += `
      <div>
          <li style="font-weight: bold; text-decoration: underline;">${course.courseId} : ${course.courseName} (${course.credits})</li>
          <p>Subject : ${course.subject}</p>
          <p>Description : ${course.description}</p>
          <p>Created By : ${course.createdBy}</p>
          <br><br>
      </div>
    `;
  }
  document.querySelector("#coursesList").innerHTML = html;
});

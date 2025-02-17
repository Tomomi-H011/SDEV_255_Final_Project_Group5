addEventListener("DOMContentLoaded", function() {
    document.querySelector("#registerBtn").addEventListener("click", registerUser);
});

async function registerUser() {
    // Create a user object
    const user = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        role: document.querySelector("#role").value
    };

    // Send a POST request to the server and save the user to the database
    const response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/user/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if(response.ok) {
        const results = await response.json();
        console.log(results);
        alert("User registered successfully"); // Display a success message

        // Reset the form after successful registration
        document.querySelector("#registrationForm").reset();
    }
    else {
        document.querySelector("#error").innerHTML = "Cannot add user"; // Display an error message
    }
}
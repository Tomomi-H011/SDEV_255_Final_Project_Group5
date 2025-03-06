let token;

window.onload = function(){
    // document.querySelector("#loginBtn").addEventListener("click", async function(){
    //     const userId = document.querySelector("#userId").value; // Grab the values from the input fields
    //     const password = document.querySelector("#password").value;
    //     login(userId, password);
    // });
    const loginBtn = document.querySelector("#loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", async function(){
            const userId = document.querySelector("#userId").value; // Grab the values from the input fields
            const password = document.querySelector("#password").value;
            login(userId, password);
        });

    const logoutBtn = document.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("token"); 
            localStorage.removeItem("userId"); 
            window.location.replace("index.html"); 
        });
    }
};

async function login(userId, password){
    const login_cred = {
        userId,
        password
    }

    //Send the login post request to the backend
    const response = await fetch("https://merciful-spiral-heliotrope.glitch.me/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login_cred)
    })
    
    if(response.ok){
        //take the token and save it to the local storage
        const tokenResponse = await response.json(); //reive the token from the response
        token = tokenResponse.token; //save the token to the token variable
        userId = tokenResponse.userId;
        console.log(userId);
        console.log(token);

        // save the token and userId to the local storage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        //redirect the user to the home page
        window.location.replace("courses.html");
    }
    else{
        document.querySelector("#errorMsg").innerHTML = "Bad username and password"; //Insert the error message to the div with the id "error"
    }

}

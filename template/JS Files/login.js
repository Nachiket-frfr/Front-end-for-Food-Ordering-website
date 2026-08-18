
function loggedIn(username){
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("Username", username);


    window.location.href="index.html";
}

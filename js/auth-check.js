const email =
localStorage.getItem("userEmail");

if(!email){

window.location.href =
"../login.html";

}
function logout(){

localStorage.removeItem(
"userEmail"
);

localStorage.removeItem(
"userRole"
);

window.location.href =
"../login.html";

}
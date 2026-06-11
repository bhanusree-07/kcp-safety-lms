async function verifyEmployee(){

const email=
localStorage.getItem(
"userEmail"
);

if(!email){

window.location.href=
"../login.html";
return;

}

try{

const response=
await fetch(
`http://localhost:3000/verify-user?email=${email}`
);

const user=
await response.json();

if(
!user ||
user.role!=="employee"
){

window.location.href=
"../login.html";
return;

}

document.body.style.display=
"block";

}

catch(error){

window.location.href=
"../login.html";

}

}

verifyEmployee();


const role =
localStorage.getItem(
"userRole"
);

if(role !== "employee"){

window.location.href =
"../login.html";

}
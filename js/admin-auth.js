async function verifyAdmin(){

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
`https://kcp-safety-lms.onrender.com/verify-user?email=${email}`
);

const user=
await response.json();

if(
!user ||
user.role!=="admin"
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

verifyAdmin();


const role =
localStorage.getItem(
"userRole"
);

if(role !== "admin"){

window.location.href =
"../login.html";

}
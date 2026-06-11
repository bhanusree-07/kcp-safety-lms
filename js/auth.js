
//login
const loginForm=
document.getElementById(
"login-form"
);

if(loginForm){

loginForm.addEventListener(
"submit",
async function(e){

e.preventDefault();

const email=
document.getElementById(
"login-email"
).value;

const password=
document.getElementById(
"loginPassword"
).value;

const response=
await fetch(
"http://localhost:3000/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);

const data=
await response.json();

if(!data.success){

alert(data.message);
return;

}

localStorage.setItem(
"userEmail",
email
);

localStorage.setItem(
"userRole",
data.user.role
);

if(
data.user.role==="admin"
){

window.location.href=
"admin/dashboard.html";

}

else{

window.location.href=
"employee/courses.html";

}

}

);

}

// SIGNUP
const signupForm=
document.getElementById(
"signup-form"
);

if(signupForm){

signupForm.addEventListener(
"submit",
async function(e){

e.preventDefault();

const full_name=
document.getElementById(
"signup-name"
).value;

const email=
document.getElementById(
"signup-email"
).value;

const password=
document.getElementById(
"signupPassword"
).value;

const confirmPassword=
document.getElementById(
"confirmPassword"
).value;

if(
password!==confirmPassword
){

alert(
"Passwords do not match"
);

return;

}

const response=
await fetch(
"http://localhost:3000/signup",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
full_name,
email,
password
})
}
);

const data=
await response.json();

alert(
data.message
);

if(data.success){

window.location.href=
"login.html";

}

}

);

}

/* forgot password 

const forgotForm =
    document.getElementById(
        "forgot-form"
    );

if(forgotForm){

    forgotForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const email =
                document.getElementById(
                    "forgot-email"
                ).value;

            sendPasswordResetEmail(
                auth,
                email
            )

            .then(() => {

                alert(
                    "Password reset email sent"
                );

            })

            .catch((error) => {

                alert(error.message);

            });

        }
    );

}
    
*/


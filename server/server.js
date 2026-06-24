const bcrypt = require("bcrypt");

const express = require("express");

const cors = require("cors");

const db = require("./db");

const app = express();

const multer = require("multer");

const path = require("path");

// FILE UPLOAD CONFIG

const storage = multer.diskStorage({

destination:(req,file,cb)=>{

if(file.fieldname==="pdf_file"){

cb(
null,
path.join(
__dirname,
"../assests/pdfs"
)
);

}else{

cb(
null,
path.join(
__dirname,
"../assests/module-images"
)
);

}

},

filename:(req,file,cb)=>{

cb(
null,
Date.now()+"-"+file.originalname
);

}

});

const upload=
multer({
storage
});


// MIDDLEWARE

app.use(cors());

app.use(express.json());


app.use(
"/course-thumbnails",
express.static(
path.join(
__dirname,
"../assests/course-thumbnails"
)
)
);


app.use(
"/module-pdfs",
express.static(
path.join(
__dirname,
"../assests/module-pdfs"
)
)
);

// CREATE USER

app.post(
"/create-user",
(req,res)=>{

const{
full_name,
email,
password,
role,
department,
designation
}=req.body;

const sql=`
INSERT INTO users
(
full_name,
email,
password,
role,
department,
designation
)
VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(
sql,
[
full_name,
email,
password,
role,
department,
designation
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
"User created successfully"
);

}

);

}
);

// LOGIN

app.post(
"/login",
async(req,res)=>{

const{
email,
password
}=req.body;

const sql=`
SELECT *
FROM users
WHERE email=?
`;

db.query(
sql,
[email],
async(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json({
success:false,
message:"Invalid email or password"
});

}

const user =
result[0];

const match =
await bcrypt.compare(
password,
user.password
);

if(!match){

return res.json({
success:false,
message:"Invalid email or password"
});

}

res.json({
success:true,
user
});

}

);

}
);


// SIGNUP

app.post(
"/signup",
async(req,res)=>{

const{
full_name,
email,
password
}=req.body;

const checkSql=
"SELECT id FROM users WHERE email=?";

db.query(
checkSql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length>0){

return res.json({
success:false,
message:"Email already exists"
});

}

let role = "employee";

if(email.toLowerCase().endsWith("@kcp.co.in")){
    role = "admin";
}

const insertSql=`

INSERT INTO users
(
full_name,
email,
password,
role,
department,
designation
)

VALUES
(
?,
?,
?,
?,
'',
''
)

`;


const hashedPassword =
await bcrypt.hash(password,10);


db.query(
insertSql,
[
full_name,
email,
hashedPassword,
role
],
(err2,result2)=>{

if(err2){

return res
.status(500)
.json(err2);

}

res.json({
success:true,
message:"Account created"
});

}

);

}

);

}
);

// GET USER ROLE

app.get(
"/get-user-role",
(req,res)=>{

const email=
req.query.email;

const sql=
"SELECT role FROM users WHERE email=?";

db.query(
sql,
[email],
async(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json({
role:null
});

}

res.json({
role:
result[0].role
});

}

);

}
);


app.get(
"/verify-user",
(req,res)=>{

const email=
req.query.email;

const sql=
`
SELECT
id,
full_name,
email,
role
FROM users
WHERE email=?
`;

db.query(
sql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(
null
);

}

res.json(
result[0]
);

}

);

}
);


// GET USER DETAILS

app.get(
"/get-user",
(req,res)=>{

const email=
req.query.email;

const sql=
`
SELECT
id,
full_name,
email,
role,
department,
designation
FROM users
WHERE email=?
`;

db.query(
sql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(
null
);

}

res.json(
result[0]
);

}

);

}
);

// UPLOAD MODULE FILES

app.post(
"/upload-module-files",
upload.fields([
{
name:"pdf_file",
maxCount:1
}
]),
(req,res)=>{

console.log(req.files);

res.json({

pdf_file:
req.files?.pdf_file?.[0]?.filename || ""

});
}
);


const courseStorage=
multer.diskStorage({

destination:(req,file,cb)=>{

cb(
null,
path.join(
__dirname,
"../assests/course-thumbnails"
)
);

},

filename:(req,file,cb)=>{

cb(
null,
Date.now()+
"-"+
file.originalname
);

}

});

const courseUpload=
multer({
storage:courseStorage
});

app.post(
"/upload-course-thumbnail",

courseUpload.single(
"thumbnail"
),

(req,res)=>{

res.json({

thumbnail:
req.file.filename

});

}
);


const modulePdfStorage=
multer.diskStorage({

destination:(req,file,cb)=>{

cb(
null,
path.join(
__dirname,
"../assests/module-pdfs"
)
);

},

filename:(req,file,cb)=>{

cb(
null,
Date.now()+
"-"+
file.originalname
);

}

});

const modulePdfUpload=
multer({
storage:modulePdfStorage
});

app.post(
"/upload-module-pdf",

modulePdfUpload.single(
"pdf"
),

(req,res)=>{

res.json({

pdf_file:
req.file.filename

});

}
);


// UPDATE USER

app.post(
"/update-user",
(req,res)=>{

const{
full_name,
email,
department,
designation,
old_email
}=req.body;

const sql=`

UPDATE users

SET

full_name=?,
email=?,
department=?,
designation=?

WHERE email=?

`;

db.query(
sql,
[
full_name,
email,
department,
designation,
old_email
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true,
message:"Profile updated successfully"
});

}

);

}
);


// CREATE COURSE

app.post(
"/create-course",
(req,res)=>{

const{
title,
description,
language,
duration,
thumbnail,
status,
created_by
}=req.body;

const sql=`
INSERT INTO courses
(
title,
description,
language,
duration,
thumbnail,
status,
created_by
)
VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(
sql,
[
title,
description,
language,
duration,
thumbnail,
status,
created_by
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
"Course created successfully"
);

}

);

}
);

app.post(
"/update-course",
(req,res)=>{

console.log("UPDATE COURSE BODY:");
console.log(req.body);

const{
course_id,
title,
description,
language,
duration,
thumbnail,
status
}=req.body;

const sql=`

UPDATE courses

SET

title=?,
description=?,
language=?,
duration=?,
thumbnail=?,
status=?

WHERE id=?

`;

db.query(
sql,
[
title,
description,
language,
duration,
thumbnail,
status,
course_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true
});

}

);

}
);

// GET COURSES

app.get(
"/courses",
(req,res)=>{

const sql=
"SELECT * FROM courses WHERE status='published'";

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result
);

}

);

}
);


// GET EMPLOYEE COURSES

app.get(
"/employee-courses",
(req,res)=>{

const email=
req.query.email;

const sql=`

SELECT
courses.*,
COALESCE(progress.progress_percent,0)
AS progress_percent
FROM employee_courses

JOIN users
ON employee_courses.user_id=
users.id

JOIN courses
ON employee_courses.course_id=
courses.id

LEFT JOIN progress
ON progress.user_id=
users.id

AND progress.course_id=
courses.id


WHERE users.email=?
AND courses.status='published'

`;

db.query(
sql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result
);

}

);

}
);


// GET COURSE DETAILS

app.get(
"/course-details",
(req,res)=>{

const course_id=
req.query.course_id;

const sql=`
SELECT *
FROM courses
WHERE id=?
`;

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(
null
);

}

res.json(
result[0]
);

}

);

}
);

// GET COURSE NAME

app.get(
"/course-name",
(req,res)=>{

const course_id=
req.query.course_id;

const sql=
`
SELECT title
FROM courses
WHERE id=?
`;

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(null);

}

res.json(
result[0]
);

}

);

}
);

// GET COURSE NAME

app.get(
"/course-name",
(req,res)=>{

const course_id=
req.query.course_id;

const sql=
`
SELECT title
FROM courses
WHERE id=?
`;

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(null);

}

res.json(
result[0]
);

}

);

}
);



// GET COURSE MODULES

app.get(
"/course-modules",
(req,res)=>{

const course_id=
req.query.course_id;

const sql=`
SELECT *
FROM modules
WHERE course_id=?
ORDER BY module_order ASC
`;

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result
);

}

);

}
);




// GET MODULE DETAILS

app.get(
"/module-details",
(req,res)=>{

const module_id=
req.query.module_id;

const sql=`
SELECT *
FROM modules
WHERE id=?
`;

db.query(
sql,
[module_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(
null
);

}

res.json(
result[0]
);

}

);

}
);


// UPDATE MODULE

app.put(
"/update-module",
(req,res)=>{

const{
module_id,
module_title,
module_content,
module_order,
pdf_file,
video_link,
ppt_link
}=req.body;

const sql=`

UPDATE modules

SET

module_title=?,
module_content=?,
module_order=?,
pdf_file=?,
video_link=?,
ppt_link=?

WHERE id=?

`;

db.query(
sql,
[
module_title,
module_content,
module_order,
pdf_file,
video_link,
ppt_link,
module_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true
});

}

);

}
);




// UPDATE PROGRESS

app.post(
"/update-progress",
(req,res)=>{

console.log(req.body);

const{
user_id,
course_id,
progress_percent,
status,
quiz_completed = 0,
quiz_score = 0,
quiz_percentage = 0
}=req.body;

const sql=`

INSERT INTO progress
(
user_id,
course_id,
progress_percent,
status,
quiz_completed,
quiz_score,
quiz_percentage
)
VALUES (?, ?, ?, ?, ?, ?, ?)

ON DUPLICATE KEY UPDATE

progress_percent=?,
status=?,
quiz_completed=?,
quiz_score=?,
quiz_percentage=?,
updated_at=CURRENT_TIMESTAMP

`;

db.query(
sql,
[
user_id,
course_id,
progress_percent,
status,
quiz_completed || 0,
quiz_score || 0,
quiz_percentage || 0,

progress_percent,
status,
quiz_completed || 0,
quiz_score || 0,
quiz_percentage || 0
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
"Progress updated"
);

}

);

}
);




// GET USER PROGRESS
// Returns completed/in-progress courses

app.get(
"/user-progress",
(req,res)=>{

const email=
req.query.email;

const sql=`

SELECT
progress.course_id,
courses.title AS course_title,
progress.progress_percent,
progress.status

FROM progress

JOIN users
ON progress.user_id=
users.id

JOIN courses
ON progress.course_id=
courses.id

WHERE users.email=?

`;

db.query(
sql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result
);

}

);

}
);

// CREATE CERTIFICATE
// Auto create after completion

app.post(
"/create-certificate",
(req,res)=>{

const{
user_id,
course_id
}=req.body;

const certificateCode=
"KCP-"+
Date.now();

const checkSql = `

SELECT *
FROM certificates
WHERE user_id=?
AND course_id=?

`;

db.query(
checkSql,
[user_id,course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length > 0){

return res.json(
{
success:true,
message:"Certificate already exists"
}
);

}
const sql=`

INSERT INTO certificates
(
user_id,
course_id,
certificate_code
)
VALUES (?, ?, ?)

`;

db.query(
sql,
[
user_id,
course_id,
certificateCode
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
{
success:true,
message:"Certificate created"
}
);

}

);

}
);

}
);

// GET USER CERTIFICATES

app.get(
"/user-certificates",
(req,res)=>{

const email=
req.query.email;

const sql=`
SELECT
certificates.id,
certificates.certificate_code,
certificates.issued_at,
courses.title
FROM certificates

JOIN users
ON certificates.user_id=users.id

JOIN courses
ON certificates.course_id=courses.id

WHERE users.email=?
`;

db.query(
sql,
[email],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

}
);


// ASSIGN COURSE


app.post(
"/assign-course",
(req,res)=>{

const{
user_id,
course_id
}=req.body;

const sql=`

INSERT INTO employee_courses
(
user_id,
course_id
)
VALUES (?,?)

`;

db.query(
sql,
[
user_id,
course_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
"Course assigned successfully"
);

}

);

}
);


// testing delete course funtion 
app.delete(
"/delete-course",
(req,res)=>{

const course_id=
req.query.course_id;

const sql=
"DELETE FROM courses WHERE id=?";

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true,
message:"Course deleted"
});

}

);

}
);




// TEST

app.get(
"/",
(req,res)=>{

res.send(
"KCP LMS Backend Running"
);

}
);


// GET ALL EMPLOYEES

app.get(
"/employees",
(req,res)=>{

const sql=`

SELECT
id,
full_name,
email,
department,
designation,
role

FROM users

WHERE role='employee'

ORDER BY full_name

`;

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

}
);


// GET EMPLOYEE DETAILS

app.get(
"/employee-details",
(req,res)=>{

const user_id=
req.query.user_id;

const sql=`

SELECT
id,
full_name,
email,
department,
designation

FROM users

WHERE id=?

`;

db.query(
sql,
[user_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(null);

}

res.json(
result[0]
);

}

);

}
);


// GET ASSIGNED COURSES

app.get(
"/assigned-courses",
(req,res)=>{

const user_id=
req.query.user_id;

const sql=`

SELECT
courses.id,
courses.title,
progress.status

FROM employee_courses

JOIN courses
ON employee_courses.course_id=
courses.id

LEFT JOIN progress
ON progress.course_id=
courses.id
AND progress.user_id=
employee_courses.user_id

WHERE employee_courses.user_id=?

`;

db.query(
sql,
[user_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

}
);

//dashboard stats
app.get(
"/dashboard-stats",
(req,res)=>{

const sql=`

SELECT
(SELECT COUNT(*) FROM courses) AS totalCourses,
(SELECT COUNT(*) FROM users WHERE role='employee') AS totalEmployees,
(SELECT COUNT(*) FROM progress WHERE status='completed') AS completedTrainings,
(SELECT COUNT(*) FROM certificates) AS certificatesIssued

`;

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result[0]
);

}

);

}
);

//course analytics IN DASHBOARD

app.get(
"/course-analytics",
(req,res)=>{

const sql=`

SELECT
courses.title,
COUNT(employee_courses.user_id)
AS learners

FROM courses

LEFT JOIN employee_courses
ON courses.id=
employee_courses.course_id

GROUP BY courses.id

ORDER BY learners DESC

`;

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

}
);


app.post(
"/create-module",
(req,res)=>{

const{
course_id,
module_title,
module_content,
module_order,
pdf_file,
video_link,
ppt_link
}=req.body;

const sql=`

INSERT INTO modules
(
course_id,
module_title,
module_content,
module_order,
pdf_file,
video_link,
ppt_link
)

VALUES
(
?,
?,
?,
?,
?,
?,
?
)

`;

db.query(
sql,
[
course_id,
module_title,
module_content,
module_order,
pdf_file,
video_link,
ppt_link
],
(err,result)=>{

if(err){

console.log("MODULE ERROR:");
console.log(err);

return res
.status(500)
.json(err);

}

res.json({
success:true
});

}

);

}
);

// DELETE MODULE

app.delete(
"/delete-module",
(req,res)=>{

const module_id=
req.query.module_id;

const sql=`
DELETE FROM modules
WHERE id=?
`;

db.query(
sql,
[module_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true
});

}

);

}
);


function updateQuizTotalMarks(quizId){

const sumSql = `

SELECT
SUM(marks) AS total
FROM quiz_questions
WHERE quiz_id=?

`;

db.query(
sumSql,
[quizId],
(err,result)=>{

if(err){
console.log(err);
return;
}

const totalMarks =
result[0].total || 0;

const updateSql = `

UPDATE quizzes

SET total_marks=?

WHERE course_id=?

`;

db.query(
updateSql,
[
totalMarks,
quizId
]
);

}
);

}


// CREATE QUIZ QUESTION

app.post(
"/create-question",
(req,res)=>{

const{
quiz_id,
question,
option_a,
option_b,
option_c,
option_d,
correct_answer,
marks
}=req.body;

const sql=`

INSERT INTO quiz_questions
(
quiz_id,
question,
option_a,
option_b,
option_c,
option_d,
correct_answer,
marks
)

VALUES
(
?,
?,
?,
?,
?,
?,
?,
?
)

`;

db.query(
sql,
[
quiz_id,
question,
option_a,
option_b,
option_c,
option_d,
correct_answer,
marks
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

updateQuizTotalMarks(
quiz_id
);

res.json({
success:true
});

}

);

}
);


// UPDATE QUIZ QUESTION

app.post(
"/update-question",
(req,res)=>{

const{
id,
question,
option_a,
option_b,
option_c,
option_d,
correct_answer,
marks
}=req.body;

const sql=`

UPDATE quiz_questions

SET

question=?,
option_a=?,
option_b=?,
option_c=?,
option_d=?,
correct_answer=?,
marks=?

WHERE id=?

`;

db.query(
sql,
[
question,
option_a,
option_b,
option_c,
option_d,
correct_answer,
marks,
id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

updateQuizTotalMarks(1);

res.json({
success:true
});

}

);

}
);


app.get(
"/quiz-questions",
(req,res)=>{

const quiz_id=
req.query.quiz_id;

const sql=`

SELECT *
FROM quiz_questions
WHERE quiz_id=?

`;

db.query(
sql,
[quiz_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result
);

}

);

}
);

// GET QUIZ SETTINGS

app.get(
"/quiz-settings",
(req,res)=>{

const course_id =
req.query.course_id;

const sql = `
SELECT *
FROM quizzes
WHERE course_id=?
`;

db.query(
sql,
[course_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json({
quiz_title:"",
total_marks:0,
passing_marks:0
});

}

res.json(
result[0]
);

}

);

}
);


// UPDATE QUIZ SETTINGS

app.post(
"/update-quiz-settings",
(req,res)=>{
console.log(req.body);

const{
course_id,
quiz_title,
passing_marks
}=req.body;

const sql = `

UPDATE quizzes

SET

quiz_title=?,
passing_marks=?

WHERE course_id=?

`;

db.query(
sql,
[
quiz_title,
passing_marks,
course_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({
success:true
});

}

);

}
);


app.delete(
"/delete-question",
(req,res)=>{

const question_id=
req.query.question_id;

const findSql = `
SELECT quiz_id
FROM quiz_questions
WHERE id=?
`;

db.query(
findSql,
[question_id],
(err,result)=>{

const quizId =
result[0].quiz_id;

const deleteSql = `
DELETE FROM quiz_questions
WHERE id=?
`;

db.query(
deleteSql,
[question_id],
(err2,result2)=>{

updateQuizTotalMarks(
quizId
);

res.json({
success:true
});

}
);

}
);

}
);



// GET ALL EMPLOYEE PROGRESS

console.log("all-progress route loaded");

app.get("/all-progress", (req, res) => {
  const sql = `
    SELECT 
  users.id AS user_id,
  users.full_name AS employee,
  users.department,
  courses.title AS course,
  progress.progress_percent,
  progress.status
    FROM progress
    JOIN users ON progress.user_id = users.id
    JOIN courses ON progress.course_id = courses.id
    ORDER BY users.full_name ASC
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.get("/all-courses",(req,res)=>{

const sql=`
SELECT title
FROM courses
ORDER BY title ASC
`;

db.query(sql,(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

});



// GET CERTIFICATES

app.get(
"/certificates",
(req,res)=>{

const sql = `

SELECT

certificates.id,
users.full_name AS employee,
users.department,
courses.title AS course,
progress.progress_percent,
certificates.issued_at

FROM certificates
JOIN users
ON certificates.user_id = users.id

JOIN courses
ON certificates.course_id = courses.id

JOIN progress
ON progress.user_id = users.id
AND progress.course_id = courses.id

WHERE progress.progress_percent > 0

ORDER BY users.full_name

`;

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}
);

}
);

// COMPLETE MODULE

app.post(
"/complete-module",
(req,res)=>{

const{
user_id,
course_id,
module_id
}=req.body;

console.log("USER:", user_id);
console.log("COURSE:", course_id);
console.log("MODULE:", module_id);

const sql=`

INSERT IGNORE INTO
module_progress
(
user_id,
course_id,
module_id,
completed
)
VALUES
(
?,
?,
?,
1
)

`;

db.query(
sql,
[
user_id,
course_id,
module_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

const totalModulesSql = `
SELECT COUNT(*) AS totalModules
FROM modules
WHERE course_id=?
`;

db.query(
totalModulesSql,
[course_id],
(err,totalResult)=>{

const totalModules =
totalResult[0].totalModules;

const completedSql = `
SELECT COUNT(*) AS completedModules
FROM module_progress
WHERE user_id=?
AND course_id=?
`;

db.query(
completedSql,
[user_id,course_id],
(err,completedResult)=>{

const completedModules =
completedResult[0].completedModules;

const progressPercent =
Math.round(
(completedModules /
(totalModules + 1))
* 100
);

console.log("Total Modules:", totalModules);
console.log("Completed Modules:", completedModules);
console.log("Progress:", progressPercent);

const updateSql = `
INSERT INTO progress
(
user_id,
course_id,
progress_percent,
status
)
VALUES (?, ?, ?, ?)

ON DUPLICATE KEY UPDATE

progress_percent=?,
status=?
`;

db.query(
updateSql,
[
user_id,
course_id,
progressPercent,
"in_progress",
progressPercent,
"in_progress"
],
(err,result)=>{

console.log("UPDATE PROGRESS ERROR:", err);
console.log("UPDATE PROGRESS RESULT:", result);

res.json({
success:true
});

}
);

}
);

}
);

}

);

}
);


// GET MODULE PROGRESS

app.get(
"/module-progress",
(req,res)=>{

const{
email,
course_id
}=req.query;

const sql=`

SELECT
module_progress.module_id

FROM module_progress

JOIN users
ON module_progress.user_id=
users.id

WHERE
users.email=?
AND
module_progress.course_id=?

`;

db.query(
sql,
[
email,
course_id
],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

}
);





app.get(
"/certificate-details",
(req,res)=>{

const certificate_id =
req.query.certificate_id;

const sql = `

SELECT
certificates.*,
users.full_name,
courses.title

FROM certificates

JOIN users
ON certificates.user_id =
users.id

JOIN courses
ON certificates.course_id =
courses.id

WHERE certificates.id = ?

`;

db.query(
sql,
[certificate_id],
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res.json(null);

}

res.json(
result[0]
);

}

);

}
);






// START SERVER

app.get("/test", (req,res)=>{
res.send("working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


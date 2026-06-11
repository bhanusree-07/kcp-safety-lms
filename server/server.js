const express = require("express");

const cors = require("cors");

const db = require("./db");

const app = express();

const PORT = 3000;

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
(req,res)=>{

const{
email,
password
}=req.body;

const sql=`
SELECT *
FROM users
WHERE email=?
AND password=?
`;

db.query(
sql,
[email,password],
(err,result)=>{

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

res.json({
success:true,
user:result[0]
});

}

);

}
);

// SIGNUP

app.post(
"/signup",
(req,res)=>{

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
'employee',
'',
''
)

`;

db.query(
insertSql,
[
full_name,
email,
password
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
(err,result)=>{

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
},
{
name:"image_file",
maxCount:1
}
]),
(req,res)=>{

res.json({

pdf_file:
req.files?.pdf_file?.[0]?.filename || "",

image_file:
req.files?.image_file?.[0]?.filename || ""

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
courses.*
FROM employee_courses

JOIN users
ON employee_courses.user_id=
users.id

JOIN courses
ON employee_courses.course_id=
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
image_file,
video_link
}=req.body;

const sql=`

UPDATE modules

SET

module_title=?,
module_content=?,
module_order=?,
pdf_file=?,
image_file=?,
video_link=?

WHERE id=?

`;

db.query(
sql,
[
module_title,
module_content,
module_order,
pdf_file,
image_file,
video_link,
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

const{
user_id,
course_id,
progress_percent,
status
}=req.body;

const sql=`

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
status=?,
updated_at=CURRENT_TIMESTAMP

`;

db.query(
sql,
[
user_id,
course_id,
progress_percent,
status,
progress_percent,
status
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
progress.progress_percent,
progress.status

FROM progress

JOIN users
ON progress.user_id=
users.id

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
"Certificate created"
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
image_file,
video_link
}=req.body;

const sql=`

INSERT INTO modules
(
course_id,
module_title,
module_content,
module_order,
pdf_file,
image_file,
video_link
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
image_file,
video_link
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



// START SERVER

app.listen(
PORT,
()=>{

console.log(
`Server running on port ${PORT}`
);

}
);



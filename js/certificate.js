let allCertificates = [];
let allCourses = [];

document.addEventListener(
"DOMContentLoaded",
()=>{

fetch(
"http://localhost:3000/certificates"
)

.then(res=>res.json())

.then(data=>{

allCertificates = data;

fetch(
"http://localhost:3000/courses"
)

.then(res=>res.json())

.then(courses=>{

allCourses = courses;

populateFilters();

renderTable(data);

});

});

});


function populateFilters(){

const departmentFilter =
document.getElementById(
"departmentFilter"
);

const courseFilter =
document.getElementById(
"courseFilter"
);

courseFilter.innerHTML = `
<option value="">
Courses
</option>
`;

const departments =
[
...new Set(
allCertificates.map(
row=>row.department
)
)
];

const courses =
allCourses.map(
course=>course.title
);

departments.forEach(
department=>{

departmentFilter.innerHTML +=
`
<option value="${department}">
${department}
</option>
`;

}
);

courses.forEach(
course=>{

courseFilter.innerHTML +=
`
<option value="${course}">
${course}
</option>
`;

}
);

}

function renderTable(data){

const tbody =
document.querySelector(
".admin-progress-table tbody"
);

tbody.innerHTML = "";

data.forEach(row=>{

const certificateStatus =
row.progress_percent === 100
?
"Available"
:
"Pending";

const issueDate =
row.progress_percent === 100
?
new Date().toLocaleDateString()
:
"--";

tbody.innerHTML += `

<tr>

<td title="${row.employee}">
${
row.employee.length > 14
?
row.employee.substring(0,14) + "..."
:
row.employee
}
</td>

<td title="${row.course}">
${
row.course.split(" ").length > 3
?
row.course.split(" ").slice(0,3).join(" ") + "..."
:
row.course
}
</td>

<td>
${issueDate}
</td>

<td>

<span class="progress-badge ${
row.progress_percent === 100
?
"completed"
:
"not-started"
}">

${certificateStatus}

</span>

</td>

<td>

${
row.progress_percent === 100
?
'<a href="#">Download</a>'
:
'--'
}

</td>

</tr>

`;

});

}



function filterTable(){

const selectedDepartment =
document.getElementById(
"departmentFilter"
).value;

const selectedCourse =
document.getElementById(
"courseFilter"
).value;

const searchText =
document.getElementById(
"searchInput"
).value.toLowerCase();

const filteredData =

allCertificates.filter(row=>{

const departmentMatch =

!selectedDepartment ||

row.department ===
selectedDepartment;

const courseMatch =

!selectedCourse ||

row.course ===
selectedCourse;

const searchMatch =

row.employee
.toLowerCase()
.includes(searchText)

||

row.course
.toLowerCase()
.includes(searchText);

return(

departmentMatch &&
courseMatch &&
searchMatch

);

});

renderTable(
filteredData
);

}


document.getElementById(
"departmentFilter"
).addEventListener(
"change",
filterTable
);

document.getElementById(
"courseFilter"
).addEventListener(
"change",
filterTable
);

document.getElementById(
"searchInput"
).addEventListener(
"input",
filterTable
);


document.getElementById(
"clearFilters"
).addEventListener(
"click",
()=>{

document.getElementById(
"departmentFilter"
).value = "";

document.getElementById(
"courseFilter"
).value = "";

document.getElementById(
"searchInput"
).value = "";

renderTable(
allCertificates
);

}
);
let allProgress = [];

document.addEventListener("DOMContentLoaded", () => {

  fetch("https://kcp-safety-lms.onrender.com/all-progress")

    .then(res => res.json())

    .then(data => {

  allProgress = data;

  populateFilters();

  renderTable(data);

function populateFilters(){

const departmentFilter =
document.getElementById(
"departmentFilter"
);

const courseFilter =
document.getElementById(
"courseFilter"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

const departments =
[...new Set(
allProgress.map(
row => row.department
).filter(Boolean)
)];


const statuses =
[...new Set(
allProgress.map(
row => row.status
)
)];

departments.forEach(department=>{

departmentFilter.innerHTML +=
`<option value="${department}">
${department}
</option>`;

});


statuses.forEach(status=>{

statusFilter.innerHTML +=
`<option value="${status}">
${status.replaceAll("_"," ")}
</option>`;

});

fetch("https://kcp-safety-lms.onrender.com/all-courses")

.then(res=>res.json())

.then(courses=>{

courses.forEach(course=>{

courseFilter.innerHTML +=
`<option value="${course.title}">
${course.title}
</option>`;

});

});

}

})

    .catch(err =>
      console.error(
        "Error loading progress:",
        err
      )
    );

});

function renderTable(data){

  const tbody =
  document.querySelector(
    ".admin-progress-table tbody"
  );

  tbody.innerHTML = "";

  data.forEach(row => {

    tbody.innerHTML += `

      <tr>

        <td>${row.employee}</td>

        <td title="${row.course}">

${
row.course.split(" ").length > 3

?

row.course
.split(" ")
.slice(0,3)
.join(" ")

+ "..."

:

row.course

}

</td>

        <td>${row.progress_percent}%</td>

        <td>

          <span class="progress-badge ${row.status.replaceAll("_","-")}">

            ${row.status.replaceAll("_"," ")}

          </span>

        </td>

        <td>

<a href="employee-details.html?id=${row.user_id}">
  View
</a>

</td>

      </tr>

    `;

  });

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
"statusFilter"
).addEventListener(
"change",
filterTable
);

function filterTable(){

const selectedDepartment =
document.getElementById(
"departmentFilter"
).value;

const selectedCourse =
document.getElementById(
"courseFilter"
).value;

const selectedStatus =
document.getElementById(
"statusFilter"
).value;

const filteredData =

allProgress.filter(row => {

const departmentMatch =

!selectedDepartment ||

row.department ===
selectedDepartment;

const courseMatch =

!selectedCourse ||

row.course ===
selectedCourse;

const statusMatch =

!selectedStatus ||

row.status ===
selectedStatus;

return(

departmentMatch &&
courseMatch &&
statusMatch

);

});

renderTable(
filteredData
);

}

document.getElementById(
"clearFilters"
).addEventListener(
"click",
()=>{

document.getElementById(
"departmentFilter"
).value="";

document.getElementById(
"courseFilter"
).value="";

document.getElementById(
"statusFilter"
).value="";

renderTable(
allProgress
);

}
);
// Apply saved theme on EVERY page

const themeBtn =
document.querySelector(".theme-toggle");

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}

if(themeBtn){

    themeBtn.textContent =
    localStorage.getItem("theme") === "dark"
    ? "☼"
    : "⏾";

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
        document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeBtn.textContent =
        isDark ? "☼" : "⏾";

    });

}
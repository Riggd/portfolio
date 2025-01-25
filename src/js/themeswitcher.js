/* // function to set a given theme/color-scheme
 function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        document.getElementById('slider').checked = false;
    } else {
        setTheme('theme-light');
      document.getElementById('slider').checked = true;
    }
})();*/


/* document.addEventListener("DOMContentLoaded", (event) => {
    const toggleButton = document.getElementById("theme-toggle");

    //is this necessary
    if (localStorage.getItem("theme") === "theme-dark") {
    }

    toggleButton.addEventListener("click", () => {
        if (
            document.documentElement.classList.contains(
                "theme-dark"
            )
        ) {
            document.documentElement.classList.remove("theme-dark");
            //Might have a more elegant solution to work out here.
            document.documentElement.classList.add("theme-light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("theme-dark");
            localStorage.setItem("theme", "dark");
        }
    });
}); */

var toggle = document.getElementById("theme-toggle");

//var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
var storedTheme = sessionStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
}

toggle.onclick = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('data-theme', targetTheme);
    //localStorage.setItem('theme', targetTheme);
    sessionStorage.setItem('theme', targetTheme);
};

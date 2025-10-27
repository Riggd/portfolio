// This script handles the theme toggle button click.
// The initial theme is set by an inline script in the <head> to prevent FOUC.
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById("theme-toggle");
    
    if (toggle) {
        toggle.onclick = function() {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const targetTheme = currentTheme === "light" ? "dark" : "light";
    
            document.documentElement.setAttribute('data-theme', targetTheme);
            sessionStorage.setItem('theme', targetTheme);
        };
    }
});
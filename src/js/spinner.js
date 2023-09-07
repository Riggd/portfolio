/* window.addEventListener("load", function() {
    console.log("Load complete");
    document.getElementById("loading-spinner").style.display = "block";  
}); 
 */
const loader = document.querySelector("div.loading-spinner");

loader.addEventListener("animationend", function(){
    console.log("animation started");
    document.getElementById("loading-spinner").style.display = "block";  
});

loader.addEventListener("animationend", function(){
    console.log("animation end");
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("main-content").style.display = "unset";
});
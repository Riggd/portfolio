document.addEventListener('DOMContentLoaded', function () {
    // The marquee animation should only run on the homepage.
    if (window.location.pathname === '/') {
        const marqueeContent = document.getElementById("marqueeLeft-content");

        // If the marquee element doesn't exist on the page, do nothing.
        if (!marqueeContent) {
            return;
        }

        let position = 0;
        // Adjust this value to control the animation speed.
        let speed = 0.5; 

        function animateMarquee() {
            position -= speed;
            marqueeContent.style.transform = `translateX(${position}px)`;

            // When the first half of the content has moved off-screen, reset the position.
            if (Math.abs(position) > marqueeContent.offsetWidth / 2) {
                position = 0;
            }
            
            // Use requestAnimationFrame for a smooth, efficient animation loop.
            requestAnimationFrame(animateMarquee);
        }

        // Slow down the animation on hover.
        marqueeContent.addEventListener("mouseover", () => { speed = 0.1; });
        // Restore the original speed when the mouse leaves.
        marqueeContent.addEventListener("mouseout", () => { speed = 0.5; });
        // Start the animation loop.
        requestAnimationFrame(animateMarquee);
    }
});
// Import your scripts here. The order matters.
import './main.js';
import chronoTheme from './chrono-theme.js';
import './marquee.js';

// Initialize ChronoTheme after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => chronoTheme.init());
} else {
    chronoTheme.init();
}

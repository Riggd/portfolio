import mediumZoom from 'medium-zoom';
import { track } from './tracker.js';

mediumZoom('[data-zoomable]', {
    margin: 24,
    // Figure out a good color to use here
    background: 'var(--background-color)'
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => track('project_card_click:' + card.id));
    });
});
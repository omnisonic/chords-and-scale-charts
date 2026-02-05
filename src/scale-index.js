// Main entry point for Scale application

import { initializeEventListeners } from './modules/ui/events.js';

// Initialize the scale application
function initScaleApp() {
    // Set up event listeners
    initializeEventListeners();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScaleApp);
} else {
    initScaleApp();
}
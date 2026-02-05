// Main entry point for Chord application

import { chordsData } from './modules/chord/data.js';
import { renderAllChords } from './modules/ui/renderer.js';
import { initializeEventListeners } from './modules/ui/events.js';

// Initialize the application
function initChordApp() {
    // Set up event listeners
    initializeEventListeners();
    
    // Note: The progression rendering is handled by the event listeners
    // when the key selector changes, which is already set up in initializeEventListeners
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChordApp);
} else {
    initChordApp();
}
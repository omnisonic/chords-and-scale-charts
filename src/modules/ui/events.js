// Event handling and state management

import { renderProgressionChords, renderProgressionExamples, toggleSidebar, setActiveLink } from './renderer.js';
import { renderScaleDiagrams } from '../scale/rendering.js';
import { diatonicScaleData, pentatonicScaleData } from '../scale/data.js';
import { highlightProgressionChords } from '../chord/rendering.js';
import { chordProgressions } from '../chord/data.js';

// State management
let currentScaleType = 'diatonic';
let currentScaleData = diatonicScaleData;
let highlightTonic = false;
let selectedKey = 'C';
let scaleRootNote = 'C';
let labelsVisible = false;
let scaleDegreesVisible = false; // Start with scale degrees hidden

/**
 * Restore note label visibility state after re-rendering
 */
function restoreLabelVisibility() {
    document.querySelectorAll('.scale-note-label').forEach(function(el) {
        if (labelsVisible) {
            el.classList.remove('invisible');
        } else {
            el.classList.add('invisible');
        }
    });
}

/**
 * Restore scale degree visibility state after re-rendering
 */
function restoreScaleDegreeVisibility() {
    document.querySelectorAll('.scale-degree-label').forEach(function(el) {
        if (scaleDegreesVisible) {
            el.classList.remove('invisible');
            // Hide note labels when scale degrees are visible
            document.querySelectorAll('.scale-note-label').forEach(function(noteEl) {
                noteEl.classList.add('invisible');
            });
        } else {
            el.classList.add('invisible');
            // Show note labels when scale degrees are hidden
            document.querySelectorAll('.scale-note-label').forEach(function(noteEl) {
                if (labelsVisible) {
                    noteEl.classList.remove('invisible');
                }
            });
        }
    });
}

/**
 * Initialize event listeners for the application
 */
export function initializeEventListeners() {
    // Set active link on page load
    document.addEventListener('DOMContentLoaded', setActiveLink);
    
    // Key selector change (chord page)
    const keySelector = document.getElementById('keySelector');
    if (keySelector) {
        keySelector.addEventListener('change', function() {
            selectedKey = this.value;
            const container = document.getElementById('chordContainer');
            if (container) {
                container.dataset.selectedKey = selectedKey;
                renderProgressionChords(selectedKey);
                renderProgressionExamples(selectedKey);
            }
        });
        
        // Initialize chord page on load
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('chordContainer');
            if (container) {
                container.dataset.selectedKey = selectedKey;
                renderProgressionChords(selectedKey);
                renderProgressionExamples(selectedKey);
            }
        });
    }
    
// Root note selector change (scale page)
const scaleKeySelector = document.getElementById('scaleKeySelector');
if (scaleKeySelector) {
    scaleKeySelector.addEventListener('change', function() {
        scaleRootNote = this.value;
        labelsVisible = false; // Hide labels when changing key
        scaleDegreesVisible = false; // Hide scale degrees when changing key
        renderScaleDiagrams(currentScaleData, scaleRootNote, highlightTonic, currentScaleType);
        restoreLabelVisibility();
        restoreScaleDegreeVisibility();
    });
}
    
    // Scale type toggle (scale page)
    const toggleScaleType = document.getElementById('toggleScaleType');
    if (toggleScaleType) {
        toggleScaleType.addEventListener('click', function() {
            const toggleContainer = this;
            const options = toggleContainer.querySelectorAll('.toggle-option');
            
            if (currentScaleType === 'diatonic') {
                currentScaleType = 'pentatonic';
                currentScaleData = pentatonicScaleData;
                const scaleHeader = document.getElementById('scaleHeader');
                if (scaleHeader) {
                    scaleHeader.textContent = 'Pentatonic Scale Patterns';
                }
                
                // Update visual state
                toggleContainer.classList.add('pentatonic');
                options[0].classList.remove('active');
                options[1].classList.add('active');
            } else {
                currentScaleType = 'diatonic';
                currentScaleData = diatonicScaleData;
                const scaleHeader = document.getElementById('scaleHeader');
                if (scaleHeader) {
                    scaleHeader.textContent = 'Diatonic Scale Patterns';
                }
                
                // Update visual state
                toggleContainer.classList.remove('pentatonic');
                options[0].classList.add('active');
                options[1].classList.remove('active');
            }
            
            // Clear and re-render scales
            renderScaleDiagrams(currentScaleData, scaleRootNote, highlightTonic, currentScaleType);
            restoreLabelVisibility();
        });
    }
    
    // Toggle note labels visibility (scale page)
    const toggleVisibility = document.getElementById('toggleVisibility');
    if (toggleVisibility) {
        toggleVisibility.addEventListener('click', function() {
            labelsVisible = !labelsVisible;
            scaleDegreesVisible = false; // Hide scale degrees when showing note labels
            document.querySelectorAll('.scale-note-label').forEach(function(el) {
                el.classList.toggle('invisible');
            });
            document.querySelectorAll('.scale-degree-label').forEach(function(el) {
                el.classList.add('invisible');
            });
        });
    }
    
    // Toggle scale degrees visibility (scale page)
    const toggleScaleDegrees = document.getElementById('toggleScaleDegrees');
    if (toggleScaleDegrees) {
        toggleScaleDegrees.addEventListener('click', function() {
            scaleDegreesVisible = !scaleDegreesVisible;
            labelsVisible = false; // Hide note labels when showing scale degrees
            document.querySelectorAll('.scale-degree-label').forEach(function(el) {
                el.classList.toggle('invisible');
            });
            document.querySelectorAll('.scale-note-label').forEach(function(el) {
                el.classList.add('invisible');
            });
        });
    }
    
    // Major/Minor root highlight buttons (scale page)
    const setMajorRootBtn = document.getElementById('setMajorRoot');
    const setMinorRootBtn = document.getElementById('setMinorRoot');

    if (setMajorRootBtn) {
        setMajorRootBtn.addEventListener('click', function() {
            if (highlightTonic === 'major') {
                highlightTonic = false;
                this.classList.remove('active');
            } else {
                highlightTonic = 'major';
                this.classList.add('active');
                if (setMinorRootBtn) setMinorRootBtn.classList.remove('active');
            }
            renderScaleDiagrams(currentScaleData, scaleRootNote, highlightTonic, currentScaleType);
            restoreLabelVisibility();
        });
    }

    if (setMinorRootBtn) {
        setMinorRootBtn.addEventListener('click', function() {
            if (highlightTonic === 'minor') {
                highlightTonic = false;
                this.classList.remove('active');
            } else {
                highlightTonic = 'minor';
                this.classList.add('active');
                if (setMajorRootBtn) setMajorRootBtn.classList.remove('active');
            }
            renderScaleDiagrams(currentScaleData, scaleRootNote, highlightTonic, currentScaleType);
            restoreLabelVisibility();
            restoreScaleDegreeVisibility();
        });
    }

    // Initial scale render
    document.addEventListener('DOMContentLoaded', function() {
        renderScaleDiagrams(currentScaleData, scaleRootNote, highlightTonic, currentScaleType);
        // Hide note labels by default
        restoreLabelVisibility();
        // Hide scale degrees by default
        restoreScaleDegreeVisibility();
    });
    
    // Progression item click handlers (added dynamically)
    document.addEventListener('click', function(e) {
        const progressionItem = e.target.closest('.progression-item');
        if (progressionItem) {
            const progression = progressionItem.dataset.progression.split('-');
            const container = document.querySelector('.chord-container');
            const key = container?.dataset.selectedKey || selectedKey;
            
            if (key && chordProgressions[key]) {
                highlightProgressionChords(progression, key, chordProgressions);
            }
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
}

/**
 * Clean up event listeners (for potential cleanup scenarios)
 */
export function cleanupEventListeners() {
    // This would remove event listeners if needed
    // For this simple application, we don't need complex cleanup
}

// Global functions for HTML onclick handlers
// These need to be attached to window for direct HTML onclick calls
if (typeof window !== 'undefined') {
    window.toggleSidebar = toggleSidebar;
    window.setActiveLink = setActiveLink;
}

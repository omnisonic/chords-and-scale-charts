// UI rendering and DOM manipulation functions

import { renderChordDiagram } from '../chord/rendering.js';
import { chordProgressions } from '../chord/data.js';
import { isMinorKey, getChordFunctionLabel } from '../chord/utils.js';

/**
 * Renders all chords in a grid format
 * @param {Array} chordsData - Array of chord data objects
 * @param {string} containerSelector - CSS selector for container
 */
export function renderAllChords(chordsData, containerSelector = '.chord-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'chord-container';
    
    chordsData.forEach((chord, index) => {
        const chordElement = renderChordDiagram(chord.shape, chord.name);
        chordElement.id = `chord-${index}`;
        container.appendChild(chordElement);
    });
}

/**
 * Renders chords grouped by progression for selected key
 * @param {string} key - The selected key (e.g., "C", "Am")
 * @param {string} containerSelector - CSS selector for container
 */
export function renderProgressionChords(key, containerSelector = '.chord-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'chord-container progression-view';
    
    const progression = chordProgressions[key];
    if (!progression) return;
    
    // Determine if key is major or minor
    const isMinor = isMinorKey(key);
    
    // Create progression groups based on key type
    let groups;
    if (isMinor) {
        groups = [
            {
                title: 'Primary Progression (i-iv-V)',
                chords: [progression.I, progression.IV, progression.V, progression.V7],
                className: 'primary-group'
            },
            {
                title: 'Common Secondary Chords',
                chords: [progression.III, progression.VI, progression.vii],
                className: 'secondary-group'
            }
        ];
    } else {
        groups = [
            {
                title: 'Primary Progression (I-IV-V)',
                chords: [progression.I, progression.IV, progression.V, progression.V7],
                className: 'primary-group'
            },
            {
                title: 'Common Secondary Chords',
                chords: [progression.ii, progression.iii, progression.vi],
                className: 'secondary-group'
            }
        ];
    }
    
    groups.forEach(group => {
        // Group container
        const groupDiv = document.createElement('div');
        groupDiv.className = `chord-group ${group.className}`;
        groupDiv.innerHTML = `<h3>${group.title}</h3>`;
        
        const chordsWrapper = document.createElement('div');
        chordsWrapper.className = 'chord-group-chords';
        
        group.chords.forEach((chord) => {
            if (chord) {
                const chordFunction = getChordFunctionLabel(key, chord.name) || '';
                const chordElement = renderChordDiagram(
                    chord.shape, 
                    chord.name, 
                    chordFunction, 
                    chord.type
                );
                chordsWrapper.appendChild(chordElement);
            }
        });
        
        groupDiv.appendChild(chordsWrapper);
        container.appendChild(groupDiv);
    });
}

/**
 * Renders progression examples
 * @param {string} key - The selected key
 * @param {string} containerSelector - CSS selector for container
 */
export function renderProgressionExamples(key, containerSelector = '.chord-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const examplesDiv = document.createElement('div');
    examplesDiv.className = 'progression-examples';
    
    // Determine if key is major or minor
    const isMinor = isMinorKey(key);
    
    let progressionHTML = `<h3>Common Progressions in ${key}</h3><div class="progression-list">`;
    
    if (isMinor) {
        // Minor key progressions
        progressionHTML += `
            <div class="progression-item" data-progression="i-iv-V">
                <strong>i-iv-V</strong> (Minor Blues)
            </div>
            <div class="progression-item" data-progression="i-VI-III-VII">
                <strong>i-VI-III-VII</strong> (Minor Pop)
            </div>
            <div class="progression-item" data-progression="iiø-V-i">
                <strong>iiø-V-i</strong> (Minor Jazz)
            </div>
        `;
    } else {
        // Major key progressions
        progressionHTML += `
            <div class="progression-item" data-progression="I-IV-V">
                <strong>I-IV-V</strong> (Classic Blues)
            </div>
            <div class="progression-item" data-progression="I-V-vi-IV">
                <strong>I-V-vi-IV</strong> (Pop Progression)
            </div>
            <div class="progression-item" data-progression="ii-V-I">
                <strong>ii-V-I</strong> (Jazz Turnaround)
            </div>
        `;
    }
    
    progressionHTML += `</div>`;
    examplesDiv.innerHTML = progressionHTML;
    container.appendChild(examplesDiv);
}

/**
 * Sets active link in sidebar based on current page
 */
export function setActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.sidebar a');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Toggles sidebar on mobile
 */
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}
// Chord SVG rendering functions

import { detectBarChord, getMinFret } from './utils.js';

/**
 * Generates SVG for a chord diagram
 * @param {string} chord - Chord shape string (e.g., "x32010")
 * @returns {string} - SVG HTML string
 */
export function generateChordDiagram(chord) {
    const strings = 6; // Number of strings on a guitar
    const frets = 5; // Number of frets to display
    const stringDistance = 20;
    const fretDistance = 20;
    const radius = 5; // Dot radius
    const topPadding = 30; // Increased top padding to ensure nothing is cut off
    const sidePadding = 20;
    const svgWidth = sidePadding * 2 + stringDistance * (strings - 1);
    const svgHeight = topPadding + fretDistance * frets;

    // Detect if there is a bar chord
    let barChord = detectBarChord(chord);
    // Calculate starting fret
    let minFret = getMinFret(chord);
    let startFret = (minFret >= frets) ? minFret : 1;

    let svg = `<svg width="${svgWidth}" height="${svgHeight + 20}" xmlns="http://www.w3.org/2000/svg">`; // Extra space for starting fret text

    // Draw strings
    for (let i = 0; i < strings; i++) {
        svg += `<line x1="${sidePadding + i * stringDistance}" y1="${topPadding}"
                       x2="${sidePadding + i * stringDistance}" y2="${svgHeight}" stroke="black"/>`;
    }

    // Draw frets and the nut, or omit the nut if starting fret is 3 or more
    for (let i = 0; i <= frets; i++) {
        // Conditionally set the stroke width for the nut (i == 0 represents the nut position)
        let strokeWidth = (i == 0 && startFret < 3) ? 3 : 1; // Making nut line thicker if it is drawn

        // Check if we should draw the top line or not (don't draw if startFret is 3 or more)
        if (!(i == 0 && startFret >= 2)) {
            svg += `<line x1="${sidePadding}" y1="${topPadding + i * fretDistance}"
                           x2="${svgWidth - sidePadding}" y2="${topPadding + i * fretDistance}"
                           stroke="black" stroke-width="${strokeWidth}"/>`;
        }
    }
    if (startFret !== 1) {
        svg += `<text x="${sidePadding - 20}" y="${topPadding + 25 * 0.5}" font-family="Verdana" font-size="14">${startFret}</text>`;
    }

    // Draw chord positions
    chord.split('').forEach((fret, string) => {
        let stringPosition = sidePadding + string * stringDistance;
        if (fret === 'x') {
            // Draw an 'X' for muted strings
            svg += `<text x="${stringPosition - radius/2}" y="${topPadding - 10}" font-family="Verdana" font-size="14">X</text>`;
        } else if (fret === '0') {
            // Draw an 'O' for open strings
            svg += `<text x="${stringPosition - radius/2}" y="${topPadding - 10}" font-family="Verdana" font-size="14">0</text>`;
        } else {
            // Draw a circle for fretted notes
            // Calculate the fret position, placing the dot in the middle of the space between frets
            let fretPosition = topPadding + (fret - startFret + 1) * fretDistance - fretDistance / 2;
            svg += `<circle cx="${stringPosition}" cy="${fretPosition}" r="${radius}" fill="black"/>`;
        }
    });

    // Draw bar if a bar chord was detected
    if (barChord !== null) {
        let barStartString = sidePadding + barChord.startString * stringDistance;
        let barEndString = sidePadding + barChord.endString * stringDistance;
        let fretPosition = topPadding + (barChord.fret - startFret + 1) * fretDistance - fretDistance / 2;
        svg += `<rect x="${barStartString}" y="${fretPosition - radius}" width="${barEndString - barStartString}" height="${radius * 2}" fill="black"/>`;
    }

    svg += `</svg>`;

    return svg;
}

/**
 * Renders a single chord diagram in the DOM
 * @param {string} chordShape - Chord shape string
 * @param {string} chordName - Chord name
 * @param {string} chordFunction - Optional function label (I, IV, V, etc.)
 * @param {string} chordType - Optional type (major, minor, 7th)
 * @returns {HTMLElement} - Chord diagram element
 */
export function renderChordDiagram(chordShape, chordName, chordFunction = '', chordType = '') {
    const chordDiv = document.createElement('div');
    let classes = 'chord-diagram';
    
    if (chordFunction) {
        classes += ' progression-chord';
        if (chordType) {
            classes += ` ${chordType}`;
        }
    }
    
    chordDiv.className = classes;
    
    let html = `<p class="chord-name">${chordName}</p>`;
    
    if (chordFunction) {
        html += `<span class="chord-function">${chordFunction}</span>`;
    }
    
    html += generateChordDiagram(chordShape);
    chordDiv.innerHTML = html;
    
    return chordDiv;
}

/**
 * Highlights chords in a progression
 * @param {string[]} progression - Array of chord function labels (e.g., ['I', 'IV', 'V'])
 * @param {string} key - The current key
 * @param {object} progressionsData - Chord progressions data
 */
export function highlightProgressionChords(progression, key, progressionsData) {
    // Remove existing highlights
    document.querySelectorAll('.chord-diagram').forEach(cd => {
        cd.classList.remove('highlighted', 'dimmed');
    });
    
    const progressionData = progressionsData[key];
    if (!progressionData) return;
    
    // Map function names to chord names
    const chordNames = progression.map(func => {
        if (progressionData[func]) {
            return progressionData[func].name;
        }
        return null;
    }).filter(Boolean);
    
    // Apply highlights
    document.querySelectorAll('.chord-diagram').forEach(cd => {
        const nameEl = cd.querySelector('.chord-name');
        if (nameEl && chordNames.includes(nameEl.textContent)) {
            cd.classList.add('highlighted');
        } else if (nameEl) {
            cd.classList.add('dimmed');
        }
    });
}
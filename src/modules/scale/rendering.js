// Scale SVG rendering functions

import { convertPatternToRoot, calculateFretDistance, transposeNote, getNoteFretonSixthString } from './utils.js';

/**
 * Generates SVG for a scale diagram
 * @param {object} scaleData - Scale pattern data
 * @param {string} rootNote - Root note for key-agnostic display
 * @param {boolean} highlightTonic - Whether to highlight tonic notes
 * @returns {string} - SVG HTML string
 */
export function generateScaleDiagram(scaleData, rootNote = 'C', highlightTonic = false) {
    const strings = 6;
    const frets = 5;
    const stringDistance = 20;
    const fretDistance = 20;
    const radius = 7;
    const topPadding = 20;
    const sidePadding = 20;
    const svgWidth = sidePadding * 2 + stringDistance * frets;
    const svgHeight = topPadding + fretDistance * strings;

    // Add extra left offset so labels to the left of the nut aren't clipped
    const leftOffset = 18;
    const svgTotalWidth = svgWidth + leftOffset;

    let svg = `<svg width="${svgTotalWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // Draw frets (vertical lines)
    for (let i = 0; i <= frets; i++) {
        svg += `<line x1="${leftOffset + sidePadding + i * stringDistance}" y1="${topPadding}"
                       x2="${leftOffset + sidePadding + i * stringDistance}" y2="${svgHeight}" stroke="#666" stroke-width="1"/>`;
    }

    // Draw strings (horizontal lines)
    for (let i = 0; i < strings; i++) {
        svg += `<line x1="${leftOffset + sidePadding}" y1="${topPadding + i * fretDistance}"
                       x2="${leftOffset + svgWidth - sidePadding}" y2="${topPadding + i * fretDistance}"
                       stroke="#666" stroke-width="1"/>`;
    }

    // Convert pattern to the new root note
    const convertedData = convertPatternToRoot(scaleData, rootNote);
    const pattern = scaleData.pattern;
    const convertedPattern = convertedData.convertedPattern;
    const originalRoot = 'C'; // All patterns are originally in C
    
    // Calculate transposition interval
    const transpositionInterval = calculateFretDistance(originalRoot, rootNote);

    // If highlighting minor root, compute the relative minor note (down 3 semitones)
    let relativeMinor = null;
    if (highlightTonic === 'minor') {
        relativeMinor = transposeNote(rootNote, -3);
    }
    
    // Find the starting fret by looking at position 0 (leftmost column) and scanning down strings
    // to find the first non-underscore note
    let startingFret = 0;
    let fretLabelStringIndex = 0;
    let foundFirstNote = false;
    
    for (let stringIndex = 0; stringIndex < pattern.length && !foundFirstNote; stringIndex++) {
        const stringPattern = pattern[stringIndex];
        if (stringPattern && stringPattern !== '______' && stringPattern.length > 0) {
            const noteAtPosition0 = stringPattern[0];
            if (noteAtPosition0 !== '_') {
                // Found the first non-underscore note at position 0
                const fretOnSixthString = getNoteFretonSixthString(noteAtPosition0);
                // Transpose it based on the selected key
                startingFret = fretOnSixthString + transpositionInterval;
                fretLabelStringIndex = stringIndex;
                foundFirstNote = true;
            }
        }
    }
    
    // Draw scale notes
    pattern.forEach((stringPattern, stringIndex) => {
        if (stringPattern && stringPattern !== '______') {
            stringPattern.split('').forEach((note, fretIndex) => {
                if (note !== '_') {
                    const x = leftOffset + sidePadding + fretIndex * stringDistance;
                    const y = topPadding + (stringIndex + 0.5) * fretDistance;
                    
                    // Transpose the note name based on the new key
                    const transposedNote = transposeNote(note, transpositionInterval);
                    
                    // Determine if this should be highlighted based on mode
                    let shouldHighlight = false;
                    if (highlightTonic === 'major' && transposedNote === rootNote) {
                        shouldHighlight = true;
                    } else if (highlightTonic === 'minor' && relativeMinor && transposedNote === relativeMinor) {
                        shouldHighlight = true;
                    }

                    const fillColor = shouldHighlight ? '#FF5722' : '#4CAF50';
                    
                    // Draw note circle
                    svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fillColor}"/>`;
                    
                    // Draw note name
                    svg += `<text class="scale-note-label" x="${x}" y="${y + 3}" text-anchor="middle" font-family="Verdana" font-size="9" fill="white" font-weight="bold">${transposedNote}</text>`;
                }
            });
        }
    });
    
    // Draw fret number to the left of the string, aligned with the chosen label string index
    if (fretLabelStringIndex !== -1) {
        const y = topPadding + (fretLabelStringIndex + 0.5) * fretDistance;
        let displayFret = startingFret;
        while (displayFret > 12) displayFret -= 12;
        svg += `<text x="${leftOffset + sidePadding - 12}" y="${y + 3}" text-anchor="end" font-family="Verdana" font-size="12" fill="#333" font-weight="bold">${displayFret}</text>`;
    }

    svg += `</svg>`;
    return svg;
}


/**
 * Renders scale diagrams in the DOM
 * @param {Array} scaleDataArray - Array of scale pattern data
 * @param {string} rootNote - Root note for key-agnostic display
 * @param {boolean} highlightTonic - Whether to highlight tonic notes
 */
export function renderScaleDiagrams(scaleDataArray, rootNote = 'C', highlightTonic = false, scaleType = 'diatonic') {
    const container = document.querySelector('.scale-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    scaleDataArray.forEach(scaleData => {
        const scaleDiv = document.createElement('div');
        scaleDiv.className = 'scale-diagram';
        
        const svg = generateScaleDiagram(scaleData, rootNote, highlightTonic);
        
        scaleDiv.innerHTML = `
            <p class="chord-name">${scaleData.name}</p>
            ${svg}
        `;
        
        container.appendChild(scaleDiv);
    });
}
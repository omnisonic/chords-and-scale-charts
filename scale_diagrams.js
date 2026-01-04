// Define scale intervals (in semitones from root)
const scaleIntervals = {
    "Major": [0, 2, 4, 5, 7, 9, 11],
    "Minor": [0, 2, 3, 5, 7, 8, 10],
    "Pentatonic Major": [0, 2, 4, 7, 9],
    "Pentatonic Minor": [0, 3, 5, 7, 10],
    "Blues": [0, 3, 5, 6, 7, 10]
};

// Standard guitar tuning (low to high): E A D G B E
const standardTuning = [4, 9, 2, 7, 11, 4]; // E=4, A=9, D=2, G=7, B=11, E=4
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Function to translate pattern with '0's into note names
function translateScalePattern(pattern, rootNote, scaleType) {
    const rootIndex = noteNames.indexOf(rootNote);
    const intervals = scaleIntervals[scaleType];

    if (rootIndex === -1 || !intervals) {
        console.error("Invalid root note or scale type");
        return pattern;
    }

    return pattern.map((fretRow, fretNumber) => {
        return fretRow.split('').map((char, stringIndex) => {
            if (char === '0') {
                // Calculate the note at this position
                const openStringNote = standardTuning[stringIndex];
                const fretNote = (openStringNote + fretNumber) % 12;

                // Check if this note is in the scale
                const relativeInterval = (fretNote - rootIndex + 12) % 12;
                if (intervals.includes(relativeInterval)) {
                    return noteNames[fretNote];
                }
                return 'x'; // Not in scale
            }
            return char;
        }).join('');
    });
}

function generateScaleDiagram(scaleName, scalePattern) {
    const strings = 6; // Number of strings on a guitar
    const frets = scalePattern.length + 1; // Number of frets derived from the scale pattern
    const stringDistance = 20;
    const fretDistance = 20;
    const radius = 7; // Dot radius for the scale notes
    const topPadding = 40; // Increased to accommodate scale name
    const sidePadding = 20;
    const svgWidth = sidePadding * 2 + stringDistance * (strings - 1);
    const svgHeight = topPadding + fretDistance * (frets - 1);

    let svg = `<svg class="chart-svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // Add scale name above the diagram
    svg += `<text x="${svgWidth / 2}" y="15" font-family="Verdana" font-size="14" text-anchor="middle">${scaleName}</text>`;

    // Draw strings
    for (let i = 0; i < strings; i++) {
        svg += `<line x1="${sidePadding + i * stringDistance}" y1="${topPadding}" x2="${sidePadding + i * stringDistance}" y2="${svgHeight}" stroke="black"/>`;

    }

    // Draw frets
    for (let i = 1; i < frets -1; i++) {
        svg += `<line x1="${sidePadding}" y1="${topPadding + i * fretDistance}" x2="${svgWidth - sidePadding}" y2="${topPadding + i * fretDistance}" stroke="black"/>`;
    }

    // Draw scale pattern
    scalePattern.forEach((fretRow, rowIndex) => {
        const frets = fretRow.split('');
        frets.forEach((fret, stringIndex) => {
            // Skip empty positions (x, _, or empty string)
            if (fret !== 'x' && fret !== '_' && fret !== '' && fret !== ' ') {
                let stringPosition = sidePadding + stringIndex * stringDistance;
                let fretPosition = topPadding + rowIndex * fretDistance + fretDistance / 2;
                // Draw the circle
                svg += `<circle cx="${stringPosition}" cy="${fretPosition}" r="${radius}" fill="black"/>`;
                // Draw the note name text on top of the circle
                svg += `<text x="${stringPosition - 3}" y="${fretPosition + 3}" class="zero-text">${fret}</text>`;
            }
        });
    });

    svg += `</svg>`;

    return svg;
}
// JSON formatted scale patterns
//
//const scalePatternsJson = `[
//    {"name": "Major Scale", "pattern": ["xxx0xx", "000000", "xxxx0x", "0000x0", "00xx00", "xxxxxx"]},
//    {"name": "Minor Scale", "pattern": ["000xx0", "00x000", "xx0xxx", "000000", "xxx0xx", "xxxxxx"]},
//    {"name": "Pentatonic Major", "pattern": ["xx00xx", "000000", "xxxxxx", "000000", "0xxx00", "xxxxxx"]},
//    {"name": "Pentatonic Minor", "pattern": ["000000", "0xxx00", "x000xx", "000x00", "xxxxxx", "xxxxxx"]},
//    {"name": "Blues Scale", "pattern": ["x000xx", "000x00", "xxx0xx", "000x00", "xxxx0x", "xxxxxx"]}
//]`;

// const scalePatterns = JSON.parse(scalePatternsJson);

//const scaleContainer = document.getElementById('scaleDiagramsModal');

//scalePatterns.forEach(({name, pattern}) => {
//    let scaleSVG = generateScaleDiagram(name, pattern);
//    scaleContainer.innerHTML += scaleSVG;
//});
// This function will be called from the template with the scale data
//
function renderScaleDiagrams(scaleData) {
    const container = document.querySelector('.scale-container');
    scaleData.forEach(({name, pattern, root, type}) => {
        // If root and type are provided, translate pattern, otherwise use as-is
        let finalPattern = pattern;
        if (root && type) {
            finalPattern = translateScalePattern(pattern, root, type);
        }
        const scaleSVG = generateScaleDiagram(name, finalPattern);
        container.innerHTML += `<div class="scale-diagram" id="scale-${name}">
                                    ${scaleSVG}
                                </div>`;
    });

}


// Event listener for toggle visibility is now handled in index.html

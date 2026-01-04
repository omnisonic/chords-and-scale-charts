function detectBarChord(chord) {
    let positions = chord.split('');
    let numericPositions = positions.map(fret => fret === 'x' ? 0 : parseInt(fret));
    let barStart = null;
    let barEnd = null;
    let barFret = null;

    for (let i = 0; i < numericPositions.length; i++) {
        if (numericPositions[i] > 0) {
            if (barFret === null) {
                barFret = numericPositions[i];
                barStart = i;
                barEnd = i;
            } else if (numericPositions[i] === barFret) {
                barEnd = i;
            }
        }
    }

    // Check if the bar covers at least 3 strings and it's the lowest fret
    if (barStart !== null && barEnd - barStart >= 3 && barFret === Math.min(...numericPositions.filter(fret => fret > 0))) {
        return {
            startString: barStart,
            endString: barEnd,
            fret: barFret.toString()
        };
    }

    return null; // No bar chord detected
}

function generateChordDiagram(chord) {
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
    let minFret = Math.min(...chord.split('').filter(f => f !== 'x' && f !== '0').map(f => parseInt(f)));
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

// Chord progression data structure
const chordProgressions = {
    'C': {
        I: { name: 'C Major', shape: 'x32010', type: 'major' },
        IV: { name: 'F Major', shape: '133211', type: 'major' },
        V: { name: 'G Major', shape: '320003', type: 'major' },
        V7: { name: 'G7', shape: '320001', type: '7th' },
        ii: { name: 'D Minor', shape: 'xx0231', type: 'minor' },
        iii: { name: 'E Minor', shape: '022000', type: 'minor' },
        vi: { name: 'A Minor', shape: 'x02210', type: 'minor' }
    },
    'D': {
        I: { name: 'D Major', shape: 'xx0232', type: 'major' },
        IV: { name: 'G Major', shape: '320003', type: 'major' },
        V: { name: 'A Major', shape: 'x02220', type: 'major' },
        V7: { name: 'A7', shape: 'x02020', type: '7th' },
        ii: { name: 'E Minor', shape: '022000', type: 'minor' },
        iii: { name: 'F# Minor', shape: '244222', type: 'minor' },
        vi: { name: 'B Minor', shape: 'x24432', type: 'minor' }
    },
    'E': {
        I: { name: 'E Major', shape: '022100', type: 'major' },
        IV: { name: 'A Major', shape: 'x02220', type: 'major' },
        V: { name: 'B Major', shape: 'x24442', type: 'major' },
        V7: { name: 'B7', shape: 'x21202', type: '7th' },
        ii: { name: 'F# Minor', shape: '244222', type: 'minor' },
        iii: { name: 'G# Minor', shape: '466444', type: 'minor' },
        vi: { name: 'C# Minor', shape: 'x46654', type: 'minor' }
    },
    'F': {
        I: { name: 'F Major', shape: '133211', type: 'major' },
        IV: { name: 'Bb Major', shape: 'x13331', type: 'major' },
        V: { name: 'C Major', shape: 'x32010', type: 'major' },
        V7: { name: 'C7', shape: 'x32310', type: '7th' },
        ii: { name: 'G Minor', shape: '355333', type: 'minor' },
        iii: { name: 'A Minor', shape: 'x02210', type: 'minor' },
        vi: { name: 'D Minor', shape: 'xx0231', type: 'minor' }
    },
    'G': {
        I: { name: 'G Major', shape: '320003', type: 'major' },
        IV: { name: 'C Major', shape: 'x32010', type: 'major' },
        V: { name: 'D Major', shape: 'xx0232', type: 'major' },
        V7: { name: 'D7', shape: 'xx0212', type: '7th' },
        ii: { name: 'A Minor', shape: 'x02210', type: 'minor' },
        iii: { name: 'B Minor', shape: 'x24432', type: 'minor' },
        vi: { name: 'E Minor', shape: '022000', type: 'minor' }
    },
    'A': {
        I: { name: 'A Major', shape: 'x02220', type: 'major' },
        IV: { name: 'D Major', shape: 'xx0232', type: 'major' },
        V: { name: 'E Major', shape: '022100', type: 'major' },
        V7: { name: 'E7', shape: '020100', type: '7th' },
        ii: { name: 'B Minor', shape: 'x24432', type: 'minor' },
        iii: { name: 'C# Minor', shape: 'x46654', type: 'minor' },
        vi: { name: 'F# Minor', shape: '244222', type: 'minor' }
    },
    'B': {
        I: { name: 'B Major', shape: 'x24442', type: 'major' },
        IV: { name: 'E Major', shape: '022100', type: 'major' },
        V: { name: 'F# Major', shape: '244322', type: 'major' },
        V7: { name: 'F#7', shape: '242322', type: '7th' },
        ii: { name: 'C# Minor', shape: 'x46654', type: 'minor' },
        iii: { name: 'D# Minor', shape: 'x68876', type: 'minor' },
        vi: { name: 'G# Minor', shape: '466444', type: 'minor' }
    },
    'Am': {
        I: { name: 'A Minor', shape: 'x02210', type: 'minor' },
        IV: { name: 'D Minor', shape: 'xx0231', type: 'minor' },
        V: { name: 'E Minor', shape: '022000', type: 'minor' },
        V7: { name: 'E7', shape: '020100', type: '7th' },
        ii: { name: 'B Diminished', shape: 'x2323x', type: 'diminished' },
        III: { name: 'C Major', shape: 'x32010', type: 'major' },
        VI: { name: 'F Major', shape: '133211', type: 'major' }
    },
    'Em': {
        I: { name: 'E Minor', shape: '022000', type: 'minor' },
        IV: { name: 'A Minor', shape: 'x02210', type: 'minor' },
        V: { name: 'B Minor', shape: 'x24432', type: 'minor' },
        V7: { name: 'B7', shape: 'x21202', type: '7th' },
        ii: { name: 'F# Diminished', shape: '2332xx', type: 'diminished' },
        III: { name: 'G Major', shape: '320003', type: 'major' },
        VI: { name: 'C Major', shape: 'x32010', type: 'major' }
    },
    'Dm': {
        I: { name: 'D Minor', shape: 'xx0231', type: 'minor' },
        IV: { name: 'G Minor', shape: '355333', type: 'minor' },
        V: { name: 'A Minor', shape: 'x02210', type: 'minor' },
        V7: { name: 'A7', shape: 'x02020', type: '7th' },
        ii: { name: 'E Diminished', shape: 'xx2320', type: 'diminished' },
        III: { name: 'F Major', shape: '133211', type: 'major' },
        VI: { name: 'Bb Major', shape: 'x13331', type: 'major' }
    },
    'Gm': {
        I: { name: 'G Minor', shape: '355333', type: 'minor' },
        IV: { name: 'C Minor', shape: 'x35543', type: 'minor' },
        V: { name: 'D Minor', shape: 'xx0231', type: 'minor' },
        V7: { name: 'D7', shape: 'xx0212', type: '7th' },
        ii: { name: 'A Diminished', shape: 'x0101x', type: 'diminished' },
        III: { name: 'Bb Major', shape: 'x13331', type: 'major' },
        VI: { name: 'Eb Major', shape: 'x68876', type: 'major' }
    },
    'Cm': {
        I: { name: 'C Minor', shape: 'x35543', type: 'minor' },
        IV: { name: 'F Minor', shape: '133111', type: 'minor' },
        V: { name: 'G Minor', shape: '355333', type: 'minor' },
        V7: { name: 'G7', shape: '320001', type: '7th' },
        ii: { name: 'D Diminished', shape: 'xx0101', type: 'diminished' },
        III: { name: 'Eb Major', shape: 'x68876', type: 'major' },
        VI: { name: 'Ab Major', shape: '466554', type: 'major' }
    },
    'Fm': {
        I: { name: 'F Minor', shape: '133111', type: 'minor' },
        IV: { name: 'Bb Minor', shape: 'x13321', type: 'minor' },
        V: { name: 'C Minor', shape: 'x35543', type: 'minor' },
        V7: { name: 'C7', shape: 'x32310', type: '7th' },
        ii: { name: 'G Diminished', shape: '3433xx', type: 'diminished' },
        III: { name: 'Ab Major', shape: '466554', type: 'major' },
        VI: { name: 'Db Major', shape: 'x46654', type: 'major' }
    },
    'Bm': {
        I: { name: 'B Minor', shape: 'x24432', type: 'minor' },
        IV: { name: 'E Minor', shape: '022000', type: 'minor' },
        V: { name: 'F# Minor', shape: '244222', type: 'minor' },
        V7: { name: 'F#7', shape: '242322', type: '7th' },
        ii: { name: 'C# Diminished', shape: 'x4544x', type: 'diminished' },
        III: { name: 'D Major', shape: 'xx0232', type: 'major' },
        VI: { name: 'G Major', shape: '320003', type: 'major' }
    }
};

// Main render function - now always uses progression view
function renderChords(chordsData) {
    const container = document.querySelector('.chord-container');
    if (!container) return;
    
    // Always use progression view with selected key
    const selectedKey = container.dataset.selectedKey || 'C';
    renderProgressionChords(selectedKey);
}

// Render all chords in original grid format
function renderAllChords(chordsData) {
    const container = document.querySelector('.chord-container');
    container.innerHTML = '';
    container.className = 'chord-container';
    
    chordsData.forEach((chord, index) => {
        const chordSVG = generateChordDiagram(chord.shape);
        container.innerHTML += `<div class="chord-diagram" id="chord-${index}">
                                    <p class="chord-name">${chord.name}</p>
                                    ${chordSVG}
                                </div>`;
    });
}

// Render chords grouped by progression for selected key
function renderProgressionChords(key) {
    const container = document.querySelector('.chord-container');
    container.innerHTML = '';
    container.className = 'chord-container progression-view';
    
    const progression = chordProgressions[key];
    if (!progression) return;
    
    // Determine if key is major or minor
    const isMinor = key.endsWith('m');
    
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
        
        group.chords.forEach((chord, index) => {
            if (chord) {
                const chordSVG = generateChordDiagram(chord.shape);
                const chordDiv = document.createElement('div');
                chordDiv.className = `chord-diagram progression-chord ${chord.type}`;
                chordDiv.innerHTML = `
                    <p class="chord-name">${chord.name}</p>
                    <span class="chord-function">${getChordFunctionLabel(key, chord.name)}</span>
                    ${chordSVG}
                `;
                chordsWrapper.appendChild(chordDiv);
            }
        });
        
        groupDiv.appendChild(chordsWrapper);
        container.appendChild(groupDiv);
    });
}

// Get chord function label (I, IV, V, etc.) - lowercase for minor keys
function getChordFunctionLabel(key, chordName) {
    const progression = chordProgressions[key];
    if (!progression) return '';
    
    // Determine if key is minor
    const isMinor = key.endsWith('m');
    
    for (const [func, data] of Object.entries(progression)) {
        if (data.name === chordName) {
            // Return lowercase for minor keys, uppercase for major keys
            return isMinor ? func.toLowerCase() : func;
        }
    }
    return '';
}

// Show progression examples
function renderProgressionExamples(key) {
    const container = document.querySelector('.chord-container');
    const examplesDiv = document.createElement('div');
    examplesDiv.className = 'progression-examples';
    
    // Determine if key is major or minor
    const isMinor = key.endsWith('m');
    const baseKey = isMinor ? key.slice(0, -1) : key;
    
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
    
    // Add click handlers
    examplesDiv.querySelectorAll('.progression-item').forEach(item => {
        item.addEventListener('click', function() {
            const progression = this.dataset.progression.split('-');
            highlightProgressionChords(progression);
        });
    });
}

// Highlight specific progression chords
function highlightProgressionChords(progression) {
    // Remove existing highlights
    document.querySelectorAll('.chord-diagram').forEach(cd => {
        cd.classList.remove('highlighted', 'dimmed');
    });
    
    // Get current key
    const container = document.querySelector('.chord-container');
    const key = container.dataset.selectedKey || 'C';
    const progressionData = chordProgressions[key];
    
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

// Add CSS for progression styling
const style = document.createElement('style');
style.textContent = `
    .chord-container.progression-view {
        flex-direction: column;
        gap: 40px;
    }
    
    .chord-group {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .chord-group h3 {
        text-align: center;
        color: #333;
        margin: 0 0 15px 0;
        font-size: 18px;
    }
    
    .chord-group-chords {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }
    
    .chord-group.primary-group {
        border-left: 4px solid #4CAF50;
    }
    
    .chord-group.secondary-group {
        border-left: 4px solid #FF9800;
    }
    
    .chord-diagram.progression-chord {
        position: relative;
        transition: transform 0.2s ease;
    }
    
    .chord-diagram.progression-chord:hover {
        transform: scale(1.05);
    }
    
    .chord-diagram.progression-chord .chord-function {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #4CAF50;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: bold;
    }
    
    .chord-diagram.progression-chord.major .chord-function {
        background: #4CAF50;
    }
    
    .chord-diagram.progression-chord.minor .chord-function {
        background: #2196F3;
    }
    
    .chord-diagram.progression-chord.7th .chord-function {
        background: #9C27B0;
    }
    
    .progression-examples {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-top: 20px;
    }
    
    .progression-examples h3 {
        text-align: center;
        color: #333;
        margin: 0 0 15px 0;
    }
    
    .progression-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
    }
    
    .progression-item {
        background: #f5f5f5;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s ease;
        border: 2px solid transparent;
    }
    
    .progression-item:hover {
        background: #e8f5e9;
        border-color: #4CAF50;
    }
    
    .chord-diagram.highlighted {
        border: 3px solid #4CAF50;
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        transform: scale(1.05);
    }
    
    .chord-diagram.dimmed {
        opacity: 0.3;
        filter: grayscale(50%);
    }
    
    .progression-controls {
        text-align: center;
        margin: 20px 0;
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
    }
    
    .key-selector {
        padding: 8px 15px;
        font-size: 14px;
        border: 2px solid #4CAF50;
        border-radius: 4px;
        background: white;
        color: #333;
        cursor: pointer;
    }
    
    .key-selector:hover {
        background: #e8f5e9;
    }
    
    .view-toggle {
        padding: 8px 15px;
        font-size: 14px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .view-toggle:hover {
        background: #1976D2;
    }
    
    .view-toggle.active {
        background: #4CAF50;
    }
`;

document.head.appendChild(style);

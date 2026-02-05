// Scale utility functions

// Map note names to semitone values (C = 0)
const noteToSemitone = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

// Reverse map - semitone to note name
const semitoneToNote = {
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
    6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
};

// Enharmonic equivalents - map sharp notes to flats
const enharmonicEquivalents = {
    'C#': ['C#', 'Db'],
    'D#': ['D#', 'Eb'],
    'F#': ['F#', 'Gb'],
    'G#': ['G#', 'Ab'],
    'A#': ['A#', 'Bb']
};

// Keys that traditionally use flat spellings
const flatKeys = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);

/**
 * Choose an enharmonic spelling for a note based on the selected key.
 * If the key prefers flats and the note has a flat equivalent, return the flat name.
 * Otherwise return the original note.
 * @param {string} note - Note name produced by transpose (sharp-based)
 * @param {string} key - Selected key/root note (e.g., 'F', 'Bb')
 * @returns {string}
 */
export function chooseEnharmonic(note, key) {
    if (!note || typeof note !== 'string') return note;
    // Find if note has an enharmonic pair defined
    for (const sharp in enharmonicEquivalents) {
        const pair = enharmonicEquivalents[sharp];
        if (pair.includes(note)) {
            // If the selected key prefers flats, return the flat variant if available
            if (flatKeys.has(key) && pair.length > 1) {
                return pair[1];
            }
            return pair[0];
        }
    }
    return note;
}

/**
 * Transpose a note name by a given number of semitones
 * @param {string} note - Note name (C, D, E, F, G, A, B, C#, D#, etc.)
 * @param {number} semitones - Number of semitones to transpose (can be negative)
 * @returns {string} - Transposed note name
 */
export function transposeNote(note, semitones) {
    // Safeguard: ensure note is a string
    if (!note || typeof note !== 'string') {
        return 'C'; // Fallback to C
    }
    
    const originalSemitone = noteToSemitone[note];
    if (originalSemitone === undefined) {
        // If note not recognized, return it as-is
        return note;
    }
    
    let newSemitone = (originalSemitone + semitones) % 12;
    if (newSemitone < 0) {
        newSemitone += 12;
    }
    
    const transposed = semitoneToNote[newSemitone];
    // Ensure we always return a string, fallback to original note if lookup fails
    return (transposed && typeof transposed === 'string') ? transposed : note;
}

// Map notes to their fret position on the open 6th string (E)
const noteToSixthStringFret = {
    'E': 0, 'F': 1, 'F#': 2, 'G': 3, 'G#': 4, 'A': 5,
    'A#': 6, 'B': 7, 'C': 8, 'C#': 9, 'D': 10, 'D#': 11
};

/**
 * Get the fret position of a note on the open 6th string (E)
 * @param {string} note - Note name (C, D, E, F, G, A, B, C#, D#, etc.)
 * @returns {number} - Fret position on the 6th string (0-11)
 */
export function getNoteFretonSixthString(note) {
    return noteToSixthStringFret[note] !== undefined ? noteToSixthStringFret[note] : 0;
}

// Map notes to scale degrees in a major scale (relative to C)
const majorScaleDegrees = {
    'C': 1, 'D': 2, 'E': 3, 'F': 4, 'G': 5, 'A': 6, 'B': 7
};

/**
 * Calculate the fret number from a root note to a target note
 * @param {string} rootNote - Root note (e.g., 'C', 'F#')
 * @param {string} targetNote - Target note (e.g., 'E', 'G')
 * @returns {number} - Number of semitones (frets) between root and target
 */
export function calculateFretDistance(rootNote, targetNote) {
    const rootSemitone = noteToSemitone[rootNote];
    const targetSemitone = noteToSemitone[targetNote];
    
    let distance = targetSemitone - rootSemitone;
    if (distance < 0) {
        distance += 12;
    }
    
    return distance;
}

/**
 * Get the scale degree of a note relative to C major (for reference)
 * @param {string} note - Note name (C, D, E, F, G, A, B)
 * @returns {number} - Scale degree (1-7) or null if not found
 */
function getScaleDegree(note) {
    return majorScaleDegrees[note] || null;
}

/**
 * Convert note patterns to display patterns showing fret numbers
 * Shows fret number for the first note on each string, then uses scale degrees
 * @param {object} scaleData - Original scale data with note patterns
 * @param {string} newRoot - New root note for the pattern
 * @returns {object} - Modified scale data with fret display information
 */
export function convertPatternToRoot(scaleData, newRoot) {
    const originalRoot = 'C'; // All patterns are originally in C
    const originalPattern = scaleData.pattern;
    const rootDistance = calculateFretDistance(newRoot, originalRoot);
    
    // Create a new pattern array with scale degrees and fret information
    const newPattern = originalPattern.map((stringPattern, stringIndex) => {
        if (!stringPattern || stringPattern === '______') {
            return {
                pattern: stringPattern,
                firstFret: null,
                stringIndex: stringIndex
            };
        }
        
        let newStringPattern = '';
        let firstFretNumber = null;
        
        stringPattern.split('').forEach((note, fretIndex) => {
            if (note === '_') {
                newStringPattern += '_';
            } else {
                const scaleDegree = getScaleDegree(note);
                
                // For the first note on the string, calculate fret number
                if (firstFretNumber === null) {
                    const noteFretDistance = calculateFretDistance(newRoot, note);
                    firstFretNumber = noteFretDistance;
                }
                
                newStringPattern += scaleDegree || note;
            }
        });
        
        return {
            pattern: newStringPattern,
            firstFret: firstFretNumber,
            stringIndex: stringIndex
        };
    });
    
    return {
        ...scaleData,
        root: newRoot,
        convertedPattern: newPattern,
        originalPattern: originalPattern
    };
}

/**
 * Get the fret position information for displaying on diagrams
 * @param {Array} convertedPattern - Pattern with fret information
 * @param {string} stringIndex - Current string index
 * @returns {number|null} - Fret number to display, or null
 */
export function getFirstFretNumber(convertedPattern, stringIndex) {
    if (convertedPattern[stringIndex]) {
        return convertedPattern[stringIndex].firstFret;
    }
    return null;
}

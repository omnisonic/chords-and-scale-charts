import { chordProgressions } from './data.js';

// Chord utility functions

/**
 * Detects if a chord is a barre chord
 * @param {string} chord - Chord shape string (e.g., "x32010")
 * @returns {object|null} - Barre chord info or null
 */
export function detectBarChord(chord) {
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

/**
 * Validates a chord shape
 * @param {string} chord - Chord shape string
 * @returns {boolean} - True if valid
 */
export function validateChordShape(chord) {
    if (typeof chord !== 'string' || chord.length !== 6) {
        return false;
    }
    
    const validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'x'];
    return chord.split('').every(char => validChars.includes(char));
}

/**
 * Gets the minimum fret for a chord (for determining starting position)
 * @param {string} chord - Chord shape string
 * @returns {number} - Minimum fret number
 */
export function getMinFret(chord) {
    const frets = chord.split('').filter(f => f !== 'x' && f !== '0').map(f => parseInt(f));
    return frets.length > 0 ? Math.min(...frets) : 1;
}

/**
 * Gets chord function label (I, IV, V, etc.)
 * @param {string} key - The key (e.g., "C", "Am")
 * @param {string} chordName - The chord name (e.g., "C Major")
 * @returns {string} - Function label
 */
export function getChordFunctionLabel(key, chordName) {
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

/**
 * Determines if a key is minor
 * @param {string} key - The key (e.g., "C", "Am")
 * @returns {boolean} - True if minor
 */
export function isMinorKey(key) {
    return key.endsWith('m');
}

/**
 * Gets the base key without minor suffix
 * @param {string} key - The key (e.g., "Am")
 * @returns {string} - Base key (e.g., "A")
 */
export function getBaseKey(key) {
    return isMinorKey(key) ? key.slice(0, -1) : key;
}
// Chord data and progression constants

// Common guitar chords including 7th chords
export const chordsData = [
    { name: "C Major", shape: "x32010" },
    { name: "D Major", shape: "xx0232" },
    { name: "E Major", shape: "022100" },
    { name: "F Major", shape: "133211" },
    { name: "G Major", shape: "320003" },
    { name: "A Major", shape: "x02220" },
    { name: "B Major", shape: "x24442" },
    { name: "C Minor", shape: "x35543" },
    { name: "D Minor", shape: "xx0231" },
    { name: "E Minor", shape: "022000" },
    { name: "F Minor", shape: "133111" },
    { name: "G Minor", shape: "355333" },
    { name: "A Minor", shape: "x02210" },
    { name: "B Minor", shape: "x24432" },
    { name: "C7", shape: "x32310" },
    { name: "D7", shape: "xx0212" },
    { name: "E7", shape: "020100" },
    { name: "F7", shape: "131211" },
    { name: "G7", shape: "320001" },
    { name: "A7", shape: "x02020" },
    { name: "B7", shape: "x21202" }
];

// Chord progression data structure
export const chordProgressions = {
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
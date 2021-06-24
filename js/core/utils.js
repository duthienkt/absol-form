import {identCharacters} from "absol/src/String/stringGenerate";

var randomSeed = new Date().getTime();

export function randomUniqueIdent() {
    var s = '';
    var l = identCharacters.length;
    var x = ++randomSeed;
    while (x > 0) {
        s = identCharacters[x % l] + s;
        x = Math.floor(x / l);
    }
    while (s.length < 16) {
        s += identCharacters[Math.floor(Math.random() * l)];
    }
    return s;
}
import { rings, sectors, letters } from './board.js';
import { parseCellId } from './figure.js';

export let state = {
    someonesDragging: false,
    chosenCellId: null,
    clickedFigure: null
};

const userPlayer = "white";
export const local = false;
export const crazy = true;

export let captured_figures = {
    "black": [],
    "white": [],
    "gray": []
}

export let eliminated_players = {
    "black": false,
    "white": false,
    "gray": false
}

export let double_pawns = {}

export let figures_pos = {
    "A1": "rook-white",
    "B1": "knight-white",
    "C1": "bishop-white",
    "D1": "king-white",
    "E1": "queen-white",
    "F1": "bishop-white",
    "G1": "knight-white",
    "H1": "rook-white",

    "A2": "pawn-white",
    "B2": "pawn-white",
    "C2": "pawn-white",
    "D2": "pawn-white",
    "E2": "pawn-white",
    "F2": "pawn-white",
    "G2": "pawn-white",
    "H2": "pawn-white",

    "I1": "rook-black",
    "J1": "knight-black",
    "K1": "bishop-black",
    "L1": "king-black",
    "A12": "queen-black",
    "B12": "bishop-black",
    "C12": "knight-black",
    "D12": "rook-black",

    "I2": "pawn-black",
    "J2": "pawn-black",
    "K2": "pawn-black",
    "L2": "pawn-black",
    "A11": "pawn-black",
    "B11": "pawn-black",
    "C11": "pawn-black",
    "D11": "pawn-black",

    "E12": "rook-gray",
    "F12": "knight-gray",
    "G12": "bishop-gray",
    "H12": "king-gray",
    "I12": "queen-gray",
    "J12": "bishop-gray",
    "K12": "knight-gray",
    "L12": "rook-gray",

    "E11": "pawn-gray",
    "F11": "pawn-gray",
    "G11": "pawn-gray",
    "H11": "pawn-gray",
    "I11": "pawn-gray",
    "J11": "pawn-gray",
    "K11": "pawn-gray",
    "L11": "pawn-gray",
}

export function getAvailCells(figure) {
    const [kind, player] = figure.name.split("-");
    const [char, number] = parseCellId(figure.cellId);
    let availCells = [figure.cellId];
    if(kind === "pawn") {
        return getPawnCells(availCells, figure, player, char, number);
    }
    else if(kind === "bishop") {
        return getBihshopCells(availCells, figure, player, char, number);
    }
    else if(kind === "knight") {
        return getKnightCells(availCells, figure, player, char, number);
    }
    else if(kind === "rook") {
        return getRookCells(availCells, figure, player, char, number);
    }
    else if(kind === "queen") {
        const bishopCells = getBihshopCells(availCells, figure, player, char, number);
        const rookCells = getRookCells(availCells, figure, player, char, number);
        return bishopCells.concat(rookCells);
    }
    else if(kind === "king") {
        return getKingCells(availCells, figure, player, char, number);
    }
    else {
        console.log("Вид фигуры не распознан");
    }
    return availCells;
}

function getPawnCells(availCells, figure, player, char, number) {
    const forwardId = char + (number + figure.pawnDirection);
    if(figures_pos[forwardId] === null || figures_pos[forwardId] === undefined) {
        availCells.push(forwardId);
    }

    const doubleForwardId = char + (number + figure.pawnDirection * 2);
    if( (figures_pos[doubleForwardId] === null || figures_pos[doubleForwardId] === undefined) &&
        ((figure.pawnDirection === 1 && number === 2) ||
            (figure.pawnDirection === -1 && number === 11)) ) {
        availCells.push(doubleForwardId);
    }

    if( (figure.pawnDirection === 1 && number >= 4) ||
            (figure.pawnDirection === -1 && number <= 9) ) {
        pushDiagPawnCell(availCells, figure, player, char, number, 1);
        pushDiagPawnCell(availCells, figure, player, char, number, -1);
    }

    return availCells;
}

function pushDiagPawnCell(availCells, figure, player, char, number, right) {
    let up = figure.pawnDirection;
    const [sideChar, sideNumber] = moveToCell(char, number, 0, right);
    const offset = getDiagOffset(right, up);
    const oldChar = char;
    const oldNumber = number;
    [char, number, up] = moveToDiagCell(char, number, up, right, offset);

    if(figures_pos[char + number] !== null && figures_pos[char + number] !== undefined ||
        double_pawns[sideChar + sideNumber + "-double-pawn"] === true) {
        addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber);
    }
}

export function setPawnDirection(figure, cell) {
    const [kind, player] = figure.name.split("-");
    const [char, number] = parseCellId(cell.id);

    if(kind === "pawn") {
        if(player === "white") {
            if(number <= 6 && "ABCDEFGHIJ".includes(char) 
                    || number >= 7 && !"KL".includes(char)) {
                figure.pawnDirection = 1;
            }
            else {
                figure.pawnDirection = -1;
            }
        }

        if(player === "gray") {
            if(number >= 7 && "CDEFGHIJKL".includes(char) 
                    || number <= 6 && !"AB".includes(char)) {
                figure.pawnDirection = -1;
            }
            else {
                figure.pawnDirection = 1;
            }
        }
        if(player === "black") {
            if(number <= 6 && "GHIJKL".includes(char) 
                    || number >= 7 && !"ABCDEF".includes(char) ) {
                figure.pawnDirection = 1;
            }
            else {
                figure.pawnDirection = -1;
            }
        }
    }
}

function getBihshopCells(availCells, figure, player, char, number) {
    pushInfinityDiagCells(availCells, figure, player, char, number, 1, 1);
    pushInfinityDiagCells(availCells, figure, player, char, number, 1, -1);
    pushInfinityDiagCells(availCells, figure, player, char, number, -1, 1);
    pushInfinityDiagCells(availCells, figure, player, char, number, -1, -1);
    return availCells
}

function pushInfinityDiagCells(availCells, figure, player, char, number, up, right) {
    const offset = getDiagOffset(right, up);
    const oldChar = char;
    const oldNumber = number;

    while(true) {
        
        [char, number, up] = moveToDiagCell(char, number, up, right, offset);
        
        if(addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber)) {
            continue;
        }
        else {
            break;
        }

    }

    return availCells;
}

function getKingCells(availCells, figure, player, char, number) {
    pushCell(availCells, figure, player, char, number, 1, 0);
    pushCell(availCells, figure, player, char, number, 0, 1);
    pushCell(availCells, figure, player, char, number, 0, -1);
    pushCell(availCells, figure, player, char, number, -1, 0);

    pushDiagCell(availCells, figure, player, char, number, 1, 1);
    pushDiagCell(availCells, figure, player, char, number, 1, -1);
    pushDiagCell(availCells, figure, player, char, number, -1, 1);
    pushDiagCell(availCells, figure, player, char, number, -1, -1);

    return availCells;
}


function getKnightCells(availCells, figure, player, char, number) {
    pushCell(availCells, figure, player, char, number, 2, 1);
    pushCell(availCells, figure, player, char, number, 2, -1);
    pushCell(availCells, figure, player, char, number, -2, 1);
    pushCell(availCells, figure, player, char, number, -2, -1);

    pushCell(availCells, figure, player, char, number, 1, 2);
    pushCell(availCells, figure, player, char, number, 1, -2);
    pushCell(availCells, figure, player, char, number, -1, 2);
    pushCell(availCells, figure, player, char, number, -1, -2);

    return availCells;
}

function getRookCells(availCells, figure, player, char, number) {
    pushInfinityCells(availCells, figure, player, char, number, 1, 0);
    pushInfinityCells(availCells, figure, player, char, number, -1, 0);
    pushInfinityCells(availCells, figure, player, char, number, 0, 1);
    pushInfinityCells(availCells, figure, player, char, number, 0, -1);

    return availCells;
}

function pushCell(availCells, figure, player, char, number, up, right) {
    const oldChar = char;
    const oldNumber = number;
    [char, number] = moveToCell(char, number, up, right);
    addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber);
}

function pushInfinityCells(availCells, figure, player, char, number, up, right) {
    const oldChar = char;
    const oldNumber = number;

    while(true) {
        
        [char, number] = moveToCell(char, number, up, right);
        
        if(addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber)) {
            continue;
        }
        else {
            break;
        }

    }
}

export function moveToCell(char, number, up, right) {
    let newChar;
    if(right === 0) {
        newChar = char;
    }
    else if(letters.indexOf(char) + right < 0) {
        newChar = letters[letters.length + (letters.indexOf(char) + right)];
    }
    else {
        newChar = letters[(letters.indexOf(char) + right) % letters.length];
    }

    let newNumber;
    if(right > 0 && newChar < char) {
        newNumber = (letters.length - (number + up)) + 1;
    }
    else if(right < 0 && newChar > char) {
        newNumber = (letters.length - (number + up)) + 1;
    }
    else {
        newNumber = number + up;
    }
    
    return [newChar, newNumber];
}

function pushDiagCell(availCells, figure, player, char, number, up, right) {
    const offset = getDiagOffset(right, up);
    const oldChar = char;
    const oldNumber = number;
    [char, number, up] = moveToDiagCell(char, number, up, right, offset);
    addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber)
    return availCells;
}

function moveToDiagCell(char, number, up, right, offset) {
    let newChar;
    if(right === 0) {
        newChar = char;
    }
    else if(letters.indexOf(char) + right < 0) {
        if(offset === 10 && (number === 6 && up === 1 || number === 7 && up === -1)) {
            newChar = letters[(letters.indexOf(char) + offset) % letters.length];
        }
        else {
            newChar = letters[letters.length + (letters.indexOf(char) + right)];
        }
    }
    else {
        if((number === 6 && up === 1 || number === 7 && up === -1)) {
            newChar = letters[(letters.indexOf(char) + offset) % letters.length];
        }
        else {
            newChar = letters[(letters.indexOf(char) + right) % letters.length];
        }


    }

    let newNumber;
    if(right > 0 && newChar < char) {
        newNumber = (letters.length - (number + up)) + 1;
        up = -up;
    }
    else if(right < 0 && newChar > char) {

        newNumber = (letters.length - (number + up)) + 1;
        up = -up;
    }
    else {
        newNumber = number + up;
    }

    return [newChar, newNumber, up];
}

function getDiagOffset(right, up) {
    if((right === 1 && up === 1) || (right === 1 && up === -1)) {
        return 2;
    }
    return 10;
}

function addCheckCell(availCells, figure, player, char, number, oldChar, oldNumber) {
    if(number < 1 || number > 12 || !checkThickStripes(figure, char, number, oldChar, oldNumber)) {
        return false;
    }
    const newCellId = char + number;
    
    if(figures_pos[newCellId] === null || figures_pos[newCellId] === undefined) {
        availCells.push(newCellId);
        return true;
    }
    const [otherKind, otherPlayer] = figures_pos[newCellId].split("-");
    if(otherPlayer === player) {
        return false;
    }
    else {
        availCells.push(newCellId);
        return false;
    }
}

function checkThickStripes(figure, char, number, oldChar, oldNumber) {
    const [kind, player] = figure.name.split("-");

    const toTerritoryPlayer = getTerritoryPlayer(char, number, 0);
    
    
    if(toTerritoryPlayer === null) return true;
    if(toTerritoryPlayer === player) return true;

    if(eliminated_players[toTerritoryPlayer]) return true;
    if(figures_pos[char + number] === null || figures_pos[char + number] === undefined) return true;

    if(kind === "rook" || kind === "queen") {
        const fromTerritoryPlayer = getTerritoryPlayer(oldChar, oldNumber, 0);
        if(fromTerritoryPlayer === null || toTerritoryPlayer === null || fromTerritoryPlayer === toTerritoryPlayer) {
            console.log(kind, toTerritoryPlayer, char, number, fromTerritoryPlayer, oldChar, oldNumber)
            return true;
        }
        return false;
    }
    else if(kind === "knight") {
        const fromTerritoryPlayer2 = getTerritoryPlayer(oldChar, oldNumber, 1);
        const fromTerritoryPlayer3 = getTerritoryPlayer(oldChar, oldNumber, 2);
        console.log(kind, fromTerritoryPlayer2, fromTerritoryPlayer3, toTerritoryPlayer, char, number)
        if( (fromTerritoryPlayer2 === null && fromTerritoryPlayer3 === null) || 
                toTerritoryPlayer === null || fromTerritoryPlayer2 === toTerritoryPlayer) {
            return true;
        }
        return false;

    }
    
    return true;
}

function getTerritoryPlayer(char, number, line=0) {
    if(number === (1 + line) && "ABCDEFGH".includes(char)) {
        return "white";
    }
    if(number === (12 - line) && "EFGHIJKL".includes(char)) {
        return "gray";
    }
    if(number === (1 + line) && "IJKL".includes(char) || number === (12 - line) && "ABCD".includes(char)) {
        return "black";
    }
    return null
}
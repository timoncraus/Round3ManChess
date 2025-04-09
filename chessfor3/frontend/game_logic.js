import { rings, sectors, letters } from './board.js';
import { parseCellId } from './figure.js';

export let state = {
    someonesDragging: false,
    chosenCellId: null,
    clickedFigure: null
};

const userPlayer = "white";

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

export let figures_pos1 = {
    "A1": "bishop-white",
}

export function getAvailCells(figure) {
    const [kind, player] = figure.name.split("-");
    const [char, number] = parseCellId(figure.cellId);
    if(kind === "pawn") {
        return getPawnCells(figure, player, char, number);
    }
    else if(kind === "bishop") {
        return getBihshopCells(figure, player, char, number);
    }
    else if(kind === "knight") {
        return getKnightCells(figure, player, char, number);
    }
    else if(kind === "rook") {
        return getRookCells(figure, player, char, number);
    }
    else if(kind === "queen") {
        const bishopCells = getBihshopCells(figure, player, char, number);
        const rookCells = getRookCells(figure, player, char, number);
        return bishopCells.concat(rookCells);
    }
    else if(kind === "king") {
        return getKingCells(figure, player, char, number);
    }
    else {
        console.log("Вид фигуры не распознан");
    }
    return [];
}

function getPawnCells(figure, player, char, number) {
    let availCells = [];

    const forwardId = char + (number + figure.pawnDirection);
    if(figures_pos[forwardId] === null || figures_pos[forwardId] === undefined) {
        availCells.push(forwardId);
    }

    const doubleForwardId = char + (number + figure.pawnDirection * 2);
    if( (figure.pawnDirection === 1 && number === 2) ||
            (figure.pawnDirection === -1 && number === 11) ) {
        availCells.push(doubleForwardId);
    }

    if( (figure.pawnDirection === 1 && number >= 4) ||
            (figure.pawnDirection === -1 && number <= 9) ) {
        pushDiagPawnCell(availCells, figure, player, char, number, -1);
        pushDiagPawnCell(availCells, figure, player, char, number, 1);
    }

    return availCells;
}

function pushDiagPawnCell(availCells, figure, player, char, number, right) {
    const forwardDiagonalId = letters[(letters.indexOf(char) + right) % letters.length] 
                                                            + (number + figure.pawnDirection);
    if(figures_pos[forwardDiagonalId] !== null && figures_pos[forwardDiagonalId] !== undefined) {
        const [kind_fw, player_fw] = figures_pos[forwardDiagonalId].split("-");
        if(player_fw != player) {
            availCells.push(forwardDiagonalId);
        }
    }
}

function getBihshopCells(figure, player, char, number) {
    let availCells = []
    pushDiagBishopCells(availCells, figure, player, char, number, 1, 1);
    pushDiagBishopCells(availCells, figure, player, char, number, 1, -1);
    pushDiagBishopCells(availCells, figure, player, char, number, -1, 1);
    pushDiagBishopCells(availCells, figure, player, char, number, -1, -1);
    return availCells
}

function pushDiagBishopCells(availCells, figure, player, char, number, up, right) {
    let offset;
    if((right === 1 && up === 1) || (right === 1 && up === -1)) {
        offset = 2;
    }
    else {
        offset = 10;
    }

    while(true) {
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

            char = newChar;
            number = newNumber;
        
        if(addCheckCell(availCells, player, char, number)) {
            continue;
        }
        else {
            break;
        }

    }
    return availCells;
}

function getKingCells(figure, player, char, number) {
    let availCells = [];

    pushCell(availCells, figure, player, char, number, 1, 0);
    pushCell(availCells, figure, player, char, number, 1, 1);
    pushCell(availCells, figure, player, char, number, 1, -1);

    pushCell(availCells, figure, player, char, number, 0, 1);
    pushCell(availCells, figure, player, char, number, 0, -1);

    pushCell(availCells, figure, player, char, number, -1, 0);
    pushCell(availCells, figure, player, char, number, -1, 1);
    pushCell(availCells, figure, player, char, number, -1, -1);

    return availCells;
}


function getKnightCells(figure, player, char, number) {
    let availCells = [];

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

function getRookCells(figure, player, char, number) {
    let availCells = [];

    pushInfinityCells(availCells, figure, player, char, number, 1, 0);
    pushInfinityCells(availCells, figure, player, char, number, -1, 0);
    pushInfinityCells(availCells, figure, player, char, number, 0, 1);
    pushInfinityCells(availCells, figure, player, char, number, 0, -1);

    return availCells;
}

function pushCell(availCells, figure, player, char, number, up, right) {
    [char, number] = moveToCell(char, number, up, right);
    addCheckCell(availCells, player, char, number);
}

function pushInfinityCells(availCells, figure, player, char, number, up, right) {
    while(true) {
        [char, number] = moveToCell(char, number, up, right);
        
        if(addCheckCell(availCells, player, char, number)) {
            continue;
        }
        else {
            break;
        }

    }
}

function addCheckCell(availCells, player, char, number) {
    if(number < 1 || number > 12) {
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

function moveToCell(char, number, up, right) {
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

    char = newChar;
    number = newNumber;
    
    return [newChar, number];
}
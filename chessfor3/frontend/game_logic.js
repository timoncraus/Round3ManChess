import { rings, sectors, letters } from './board.js';
import { parseCellId } from './figure.js';

export let state_click = {
    someonesDragging: false,
    chosenCellId: null,
    clickedFigure: null
};

export const playerColor = sessionStorage.getItem('player_color' + gameId);

const figureHeightDisplay = 60

function drawPlayerDisplay() {
    const playerDisplay = document.getElementById("player-display");
    let backgroundImagePlayer = `${images}/king-white.png`;
    const figurePlayerDisplay = document.getElementById("figure-player-display");
    if(playerColor === "white") {
        playerDisplay.textContent = "Вы за белых";
        backgroundImagePlayer = `${images}/king-white.png`;
    }
    else if(playerColor === "black") {
        playerDisplay.textContent = "Вы за черных";
        backgroundImagePlayer = `${images}/king-black.png`;
    }
    else if(playerColor === "gray") {
        playerDisplay.textContent = "Вы за серых";
        backgroundImagePlayer = `${images}/king-gray.png`;
    }
    else {
        playerDisplay.textContent = "Вы наблюдатель";
        backgroundImagePlayer = `${images}/pawn-white.png`;
    }
    const img = new Image();

    img.onload = function () {
        figurePlayerDisplay.style.backgroundImage = `url(${backgroundImagePlayer})`;
        figurePlayerDisplay.relation = img.naturalWidth / img.naturalHeight;
        figurePlayerDisplay.style.backgroundSize = 'cover';
        figurePlayerDisplay.style.width = figureHeightDisplay * figurePlayerDisplay.relation + 'px';
        figurePlayerDisplay.style.height = figureHeightDisplay + 'px';
    }
    img.src = backgroundImagePlayer;
}
drawPlayerDisplay();

export function drawTurnDisplay() {
    const turnDisplay = document.getElementById("turn-display");
    let backgroundImageTurn = `${images}/king-white.png`;
    const figureTurnDisplay = document.getElementById("figure-turn-display");
    if(state_game.turn === "white") {
        turnDisplay.textContent = "Ход белых";
        backgroundImageTurn = `${images}/king-white.png`;
    }
    else if(state_game.turn === "black") {
        turnDisplay.textContent = "Ход черных";
        backgroundImageTurn = `${images}/king-black.png`;
    }
    else if(state_game.turn === "gray") {
        turnDisplay.textContent = "Ход серых";
        backgroundImageTurn = `${images}/king-gray.png`;
    }
    else {
        turnDisplay.textContent = "Непонятно, чей ход";
        backgroundImageTurn = `${images}/pawn-white.png`;
    }
    const img = new Image();

    img.onload = function () {
        figureTurnDisplay.style.backgroundImage = `url(${backgroundImageTurn})`;
        figureTurnDisplay.relation = img.naturalWidth / img.naturalHeight;
        figureTurnDisplay.style.backgroundSize = 'cover';
        figureTurnDisplay.style.width = figureHeightDisplay * figureTurnDisplay.relation + 'px';
        figureTurnDisplay.style.height = figureHeightDisplay + 'px';
    }
    img.src = backgroundImageTurn;
}
drawTurnDisplay();

export function changeTurn() {
    if(state_game.turn === "white") {
        state_game.turn = "gray";
    }
    else if(state_game.turn === "gray") {
        state_game.turn = "black";
    }
    else if(state_game.turn === "black") {
        state_game.turn = "white";
    }
    if(state_game.eliminated_players[state_game.turn] === true) {
        changeTurn();
    }
    drawTurnDisplay();
}

export function checkWinDefeat() {
    const winDisplay = document.getElementById("win-display");
    const defeatDisplay = document.getElementById("defeat-display");
    if(state_game.eliminated_players[playerColor]) {
        // Поражение
        winDisplay.style.display = "none";
        defeatDisplay.style.display = "block";
    }
    else {
        const otherColors = Object.keys(state_game.eliminated_players).filter(color => color !== playerColor);
        const othersEliminated = otherColors.every(color => state_game.eliminated_players[color]);

        if (othersEliminated) {
            // Ты остался один — победа
            winDisplay.style.display = "block";
            defeatDisplay.style.display = "none";
        } else {
            // Игра продолжается
            winDisplay.style.display = "none";
            defeatDisplay.style.display = "none";
        }
    }
}
checkWinDefeat();


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
    //console.log(availCells, figure, player, char, number)
    const forwardId = char + (number + figure.pawnDirection);
    if(state_game.figures_pos[forwardId] === null || state_game.figures_pos[forwardId] === undefined) {
        availCells.push(forwardId);
    }

    const doubleForwardId = char + (number + figure.pawnDirection * 2);
    if( (state_game.figures_pos[forwardId] === null || state_game.figures_pos[forwardId] === undefined) &&
        (state_game.figures_pos[doubleForwardId] === null || state_game.figures_pos[doubleForwardId] === undefined) &&
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
    let sideFigure = null;
    for (const someFigure of document.querySelectorAll(".figure")) {
        if(someFigure.cellId === sideChar + sideNumber) {
            sideFigure = someFigure;
            break;
        }
    }
    let sideKind = null;
    let sidePlayer = null;
    if(sideFigure !== null) {
        [sideKind, sidePlayer] = sideFigure.name.split("-");
    }

    const offset = getDiagOffset(right, up);
    const oldChar = char;
    const oldNumber = number;
    [char, number, up] = moveToDiagCell(char, number, up, right, offset);

    if(state_game.figures_pos[char + number] !== null && state_game.figures_pos[char + number] !== undefined ||
        (state_game.double_pawns.includes(sideChar + sideNumber) && sidePlayer !== player)) {
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

    if(state_game.kings_rooks_stayed.includes(char + number)) {
        const [sideChar1, sideNumber1] = moveToCell(char, number, 0, -3);
        if(state_game.kings_rooks_stayed.includes(sideChar1 + sideNumber1)) {
            const [sideChar1_1, sideNumber1_1] = moveToCell(char, number, 0, -1);
            const [sideChar1_2, sideNumber1_2] = moveToCell(char, number, 0, -2);
            const cond1 = state_game.figures_pos[sideChar1_1 + sideNumber1_1] === undefined || 
                                    state_game.figures_pos[sideChar1_1 + sideNumber1_1] === null
            const cond2 = state_game.figures_pos[sideChar1_2 + sideNumber1_2] === undefined || 
                                    state_game.figures_pos[sideChar1_2 + sideNumber1_2] === null
            if(cond1 && cond2) {
                availCells.push(sideChar1_2 + sideNumber1_2);
            }
        }

        const [sideChar2, sideNumber2] = moveToCell(char, number, 0, 4);
        if(state_game.kings_rooks_stayed.includes(sideChar2 + sideNumber2)) {
            const [sideChar2_1, sideNumber2_1] = moveToCell(char, number, 0, 1);
            const [sideChar2_2, sideNumber2_2] = moveToCell(char, number, 0, 2);
            const [sideChar2_3, sideNumber2_3] = moveToCell(char, number, 0, 3);
            const cond1 = state_game.figures_pos[sideChar2_1 + sideNumber2_1] === undefined || 
                                    state_game.figures_pos[sideChar2_1 + sideNumber2_1] === null
            const cond2 = state_game.figures_pos[sideChar2_2 + sideNumber2_2] === undefined || 
                                    state_game.figures_pos[sideChar2_2 + sideNumber2_2] === null
            const cond3 = state_game.figures_pos[sideChar2_3 + sideNumber2_3] === undefined || 
                                    state_game.figures_pos[sideChar2_3 + sideNumber2_3] === null
            if(cond1 && cond2 && cond3) {
                availCells.push(sideChar2_2 + sideNumber2_2);
            }
        }
    }

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
    
    if(state_game.figures_pos[newCellId] === null || state_game.figures_pos[newCellId] === undefined) {
        availCells.push(newCellId);
        return true;
    }
    const [otherKind, otherPlayer] = state_game.figures_pos[newCellId].split("-");
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

    if(state_game.eliminated_players[toTerritoryPlayer]) return true;
    if(state_game.figures_pos[char + number] === null || state_game.figures_pos[char + number] === undefined) return true;

    if(kind === "rook" || kind === "queen") {
        const fromTerritoryPlayer = getTerritoryPlayer(oldChar, oldNumber, 0);
        if(fromTerritoryPlayer === null || toTerritoryPlayer === null || fromTerritoryPlayer === toTerritoryPlayer) {
            return true;
        }
        return false;
    }
    else if(kind === "knight") {
        const fromTerritoryPlayer2 = getTerritoryPlayer(oldChar, oldNumber, 1);
        const fromTerritoryPlayer3 = getTerritoryPlayer(oldChar, oldNumber, 2);
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
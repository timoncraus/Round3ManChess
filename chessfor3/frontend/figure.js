import { setPawnDirection, state_click, moveToCell } from './game_logic.js';
import { viewBoxDict, boardParams, rings, letters } from './board.js';
import { overCell, outCell, paintAvailCells } from './cell.js';
import { drawAllMiniFigures } from './mini_figure.js';
import { sendMove } from './index.js';

const figureHeight = 46

export function drawAllFigures() {
    document.querySelectorAll(".figure").forEach(el => el.remove());

    document.querySelectorAll(".cell").forEach(cell => {
        if(state_game.figures_pos[cell.id] !== undefined && state_game.figures_pos[cell.id] !== null) {
            const imageUrl = `${images}/${state_game.figures_pos[cell.id]}.png`;
            const img = new Image();

            img.onload = function () {
                drawFigure(cell, imageUrl, img);
            }

            img.src = imageUrl;
        }
    });
}


function drawFigure(cell, imageUrl, img) {
    const figure = document.createElement('div');

    figure.cellId = cell.id;
    figure.name = state_game.figures_pos[cell.id];

    figure.style.backgroundImage = `url(${imageUrl})`;
    figure.style.backgroundSize = 'cover';
    figure.relation = img.naturalWidth / img.naturalHeight;
    figure.setAttribute("class", "figure");
    figure.style.width = figureHeight * figure.relation + 'px';
    figure.style.height = figureHeight + 'px';
    
    setFigure(figure, cell);

    document.body.appendChild(figure);

    addFigureListeners(figure);
}

function addFigureListeners(figure) {
    figure.addEventListener('mouseover', function () {
        overFigure(figure);
    });
    figure.addEventListener('mouseout', function () {
        const cell = document.querySelector("#" + figure.cellId);
        outCell(cell);
    });
    figure.addEventListener('mousedown', function () {
        downFigure(figure);
    });
    document.addEventListener('mousemove', function (e) {
        moveFigure(e, figure);
    });
    document.addEventListener('mouseup', function() {
        upFigure(figure);
    });
}

function overFigure(figure) {
    const cell = document.querySelector("#" + figure.cellId);
    overCell(cell);
    figure.style.cursor = 'grab';
}

export function downFigure(figure) {
    if(!state_click.someonesDragging) {
        figure.isDragging = true;
        state_click.someonesDragging = true;

        figure.dragOffsetX = figure.offsetWidth / 2;
        figure.dragOffsetY = figure.offsetHeight / 2;
        figure.style.cursor = 'grabbing';
        figure.style.pointerEvents = 'none';
        figure.style.zIndex = "100";

        paintAvailCells(figure);
        state_click.clickedFigure = figure;
    }
}

function moveFigure(e, figure){
    if(figure.isDragging) {
        const x = e.clientX - figure.dragOffsetX;
        const y = e.clientY - figure.dragOffsetY;

        figure.style.left = x + 'px';
        figure.style.top = y + 'px';
    }
}

export function upFigure(figure) {
    if(figure.isDragging) {
        figure.isDragging = false;
        state_click.someonesDragging = false;
        const chosenCell = document.querySelector("#" + state_click.chosenCellId);
        if (state_click.chosenCellId === figure.cellId || state_click.chosenCellId === null || (!chosenCell.available && !state_game.crazy)) {
            overFigure(figure);
            resetFigurePos(figure);
            paintAvailCells(figure);
            state_click.clickedFigure = figure;
        }
        else {
            // figure.cellId - предыдущая клетка, ее очищаем 
            // state_click.chosenCellId - новая клетка, утверждаем на ней фигуру

            const [kind, player] = figure.name.split("-");
            const [char, number] = parseCellId(state_click.chosenCellId);
            const [prevChar, prevNumber] = parseCellId(figure.cellId);
            sendMove(state_click.chosenCellId, figure.cellId);
            setDoublePawnMark(figure, kind, number, prevNumber);

            removeEnemy(figure, player, char, number);


            if( kind === "pawn" && (number === 12 || number === 1) ) {
                figure.name = "queen-" + player;
                updateFiguresPos(figure);
                drawAllFigures();
            }
            else {
                updateFiguresPos(figure);
            }
        }
        figure.style.pointerEvents = 'auto';
        document.querySelectorAll(".cell").forEach(cell => {
            document.querySelector("#" + cell.id + "Border").setAttribute("stroke-width", "0");
        });
        if(state_click.clickedFigure === null) {
            document.querySelectorAll(".cell").forEach(cell => {
                cell.setAttribute("fill", cell.color);
                cell.available = false;
            });
        }
        
    }
}

function removeEnemy(figure, player, char, number) {
    

    const [sideChar, sideNumber] = moveToCell(char, number, -figure.pawnDirection, 0);
    if (state_game.figures_pos[state_click.chosenCellId] !== undefined && state_game.figures_pos[state_click.chosenCellId] !== null) {
        document.querySelectorAll(".figure").forEach(existingFigure => {
            if (existingFigure.cellId === state_click.chosenCellId) {
                const [exKind, exPlayer] = existingFigure.name.split("-");
                if(player !== exPlayer || state_game.crazy) {
                    removeFigure(player, existingFigure);
                }
            }
        });
    }
    else if(state_game.double_pawns[sideChar + sideNumber + "-double-pawn"] === true) {
        document.querySelectorAll(".figure").forEach(existingFigure => {
            const [exKind, exPlayer] = figure.name.split("-");
            if (existingFigure.cellId === sideChar + sideNumber) {
                state_game.figures_pos[sideChar + sideNumber] = null;
                state_game.double_pawns[sideChar + sideNumber + "-double-pawn"] = null;

                const [exKind, exPlayer] = existingFigure.name.split("-");
                if(player !== exPlayer || state_game.crazy) {
                    removeFigure(player, existingFigure);
                }
            }
        });
    }
}

function removeFigure(player, existingFigure) {
    const [exKind, exPlayer] = existingFigure.name.split("-");
    if(exKind == "king") {
        state_game.eliminated_players[exPlayer] = true;
    }
    state_game.captured_figures[player].push(existingFigure.name);
    drawAllMiniFigures(player);
    existingFigure.remove();
}

function setDoublePawnMark(figure, kind, number, prevNumber) {
    if(kind === "pawn") {
        if( (figure.pawnDirection === 1 && number === 4 && prevNumber === 2) || 
                                (figure.pawnDirection === -1 && number === 9 && prevNumber === 11) ) {
            state_game.double_pawns[state_click.chosenCellId + "-double-pawn"] = true;
        }
        else if(state_game.double_pawns[state_click.chosenCellId + "-double-pawn"] === true) {
            state_game.double_pawns[state_click.chosenCellId + "-double-pawn"] = null;
        }
    }
    
}

function updateFiguresPos(figure) {
    state_game.figures_pos[state_click.chosenCellId] = figure.name;
    state_game.figures_pos[figure.cellId] = null;
    figure.cellId = state_click.chosenCellId;
    const cell = document.querySelector("#" + state_click.chosenCellId);
    setFigure(figure, cell);

    state_click.chosenCellId = null;
    state_click.clickedFigure = null;
}

function resetFigurePos(figure) {
    figure.style.left = figure.style.pinnedLeft;
    figure.style.top = figure.style.pinnedTop;
    figure.style.zIndex = figure.style.realZIndex;
}

function setFigure(figure, cell) {
    figure.style.left = (boardParams.centerX - figureHeight*figure.relation/2 
        + parseFloat(cell.getAttribute("x")) * boardParams.widthRelat) + 'px';
    figure.style.top = (boardParams.centerY - figureHeight/2 
        + parseFloat(cell.getAttribute("y")) * boardParams.heightRelat) + 'px';
    figure.style.pinnedLeft = figure.style.left;
    figure.style.pinnedTop = figure.style.top;

    const [char, number] = parseCellId(cell.id);

    if(number > 6) {
        figure.style.zIndex = rings - Math.abs(rings - number)
             + 6*(Math.abs(letters.length/2 - letters.indexOf(char)));
    }
    else {
        figure.style.zIndex = Math.abs(rings - number)
         + 6*(letters.length - Math.abs(letters.length/2 - letters.indexOf(char)));
    }
    figure.style.realZIndex = figure.style.zIndex;
    figure.isDragging = false;

    setPawnDirection(figure, cell);
}

export function parseCellId(cellId) {
    const match = cellId.match(/^([A-Za-z]+)(\d+)$/);
    const char = match[1];
    const number = parseInt(match[2]);
    return [char, number]
}
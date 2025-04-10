import { figures_pos, double_pawns, captured_figures, state, moveToCell } from './game_logic.js';
import { viewBoxDict, board, rings, letters } from './board.js';
import { overCell, outCell, paintAvailCells } from './cell.js';

const figureHeight = 46

export function drawAllFigures() {
    const boundBoard = board.getBoundingClientRect();

    document.querySelectorAll(".figure").forEach(el => el.remove());

    document.querySelectorAll(".cell").forEach(cell => {
        if(figures_pos[cell.id] !== undefined && figures_pos[cell.id] !== null) {
            const imageUrl = `${images}/${figures_pos[cell.id]}.png`;
            const img = new Image();

            img.onload = function () {
                drawFigure(cell, imageUrl, img, boundBoard);
            }

            img.src = imageUrl;
        }
    });
}


function drawFigure(cell, imageUrl, img, boundBoard) {
    const figure = document.createElement('div');

    figure.cellId = cell.id;
    figure.name = figures_pos[cell.id];

    figure.style.backgroundImage = `url(${imageUrl})`;
    figure.style.backgroundSize = 'cover';
    figure.relation = img.naturalWidth / img.naturalHeight;
    figure.setAttribute("class", "figure");
    figure.widthRelat = parseFloat(board.getAttribute("width")) / viewBoxDict[2] - 0.1;
    figure.heightRelat = parseFloat(board.getAttribute("height")) / viewBoxDict[3];
    figure.style.width = figureHeight * figure.relation + 'px';
    figure.style.height = figureHeight + 'px';

    figure.centerX = boundBoard.x + boundBoard.width/2;
    figure.centerY = boundBoard.y + boundBoard.height/2;

    
    
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
    if(!state.someonesDragging) {
        figure.isDragging = true;
        state.someonesDragging = true;

        figure.dragOffsetX = figure.offsetWidth / 2;
        figure.dragOffsetY = figure.offsetHeight / 2;
        figure.style.cursor = 'grabbing';
        figure.style.pointerEvents = 'none';
        figure.style.zIndex = "100";

        paintAvailCells(figure);
        state.clickedFigure = figure;
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
        state.someonesDragging = false;
        if (state.chosenCellId === figure.cellId || state.chosenCellId === null) {
            overFigure(figure);
            resetFigurePos(figure);
            paintAvailCells(figure);
            state.clickedFigure = figure;
        }
        else {
            // figure.cellId - предыдущая клетка, ее очищаем 
            // state.chosenCellId - новая клетка, утверждаем на ней фигуру

            const [kind, player] = figure.name.split("-");
            const [char, number] = parseCellId(state.chosenCellId);
            const [prevChar, prevNumber] = parseCellId(figure.cellId);

            removeEnemy(figure, player, char, number);

            setDoublePawnMark(figure, kind, number, prevNumber);


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
        if(state.clickedFigure === null) {
            document.querySelectorAll(".cell").forEach(cell => {
                cell.setAttribute("fill", cell.color);
                cell.available = false;
            });
        }
        
    }
}

function removeEnemy(figure, player, char, number) {
    const [sideChar, sideNumber] = moveToCell(char, number, -figure.pawnDirection, 0);
    if (figures_pos[state.chosenCellId] !== undefined && figures_pos[state.chosenCellId] !== null) {
        document.querySelectorAll(".figure").forEach(existingFigure => {
            if (existingFigure.cellId === state.chosenCellId) {
                removeFigure(player, existingFigure);
            }
        });
    }
    else if(double_pawns[sideChar + sideNumber + "-double-pawn"] === true) {
        document.querySelectorAll(".figure").forEach(existingFigure => {
            if (existingFigure.cellId === sideChar + sideNumber) {
                figures_pos[sideChar + sideNumber] = null;
                double_pawns[sideChar + sideNumber + "-double-pawn"] = null;
                removeFigure(player, existingFigure);
            }
        });
    }
}

function removeFigure(player, existingFigure) {
    captured_figures[player].push(existingFigure.name);
    existingFigure.remove();
}

function setDoublePawnMark(figure, kind, number, prevNumber) {
    if(kind === "pawn" && ( (figure.pawnDirection === 1 && number === 4 && prevNumber === 2) || 
                            (figure.pawnDirection === -1 && number === 9 && prevNumber === 11) )
    ) {
        double_pawns[state.chosenCellId + "-double-pawn"] = true;
    }
    else if(double_pawns[state.chosenCellId + "-double-pawn"] !== null && 
            double_pawns[state.chosenCellId + "-double-pawn"] !== undefined) {
        double_pawns[state.chosenCellId + "-double-pawn"] = null;
    }
}

function updateFiguresPos(figure) {
    figures_pos[state.chosenCellId] = figure.name;
    figures_pos[figure.cellId] = null;
    figure.cellId = state.chosenCellId;
    const cell = document.querySelector("#" + state.chosenCellId);
    setFigure(figure, cell);

    state.chosenCellId = null;
    state.clickedFigure = null;
}

function resetFigurePos(figure) {
    figure.style.left = figure.style.pinnedLeft;
    figure.style.top = figure.style.pinnedTop;
    figure.style.zIndex = figure.style.realZIndex;
}

function setFigure(figure, cell) {
    figure.style.left = (figure.centerX - figureHeight*figure.relation/2 
        + parseFloat(cell.getAttribute("x")) * figure.widthRelat) + 'px';
    figure.style.top = (figure.centerY - figureHeight/2 
        + parseFloat(cell.getAttribute("y")) * figure.heightRelat) + 'px';
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

function setPawnDirection(figure, cell) {
    const [kind, player] = figure.name.split("-");
    const [char, number] = parseCellId(cell.id);

    if(kind === "pawn") {
        if(player === "white") {
            if(number <= 6 && "ABCDEFGHIJ".includes(char) 
                    || player === "white" && number >= 7 && !"KL".includes(char)) {
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

export function parseCellId(cellId) {
    const match = cellId.match(/^([A-Za-z]+)(\d+)$/);
    const char = match[1];
    const number = parseInt(match[2]);
    return [char, number]
}
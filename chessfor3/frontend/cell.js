import { getX, getY } from './common_math.js';
import { board, rings, sectors, letters } from './board.js';
import { state_click, getAvailCells } from './game_logic.js';
import { downFigure, upFigure } from './figure.js';

export function drawCell(ring, sector, innerRadius, outerRadius, startAngle, endAngle) {
    const path = createCellPath(innerRadius, outerRadius, startAngle, endAngle);
    const cell = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cell.setAttribute("d", path);

    const color = (ring + sector) % 2 === 0 ? "#DCC8BA" : "#A45C4B";
    cell.color = color;
    cell.setAttribute("fill", color);
    cell.setAttribute("class", "cell");

    const letter = letters[(sectors - sector) % letters.length]
    if(sector === 0 || sector > letters.length) {
        cell.setAttribute("id", letter + (rings + ring));
    }
    else {
        cell.setAttribute("id", letter + (rings - ring + 1));
    }

    const midAngle = (startAngle + endAngle) / 2
    const midRadius = (innerRadius + outerRadius) / 2
    cell.setAttribute("x", getX(midAngle) * midRadius);
    cell.setAttribute("y", getY(midAngle) * midRadius);

    cell.available = false;
    
    board.appendChild(cell);

    addCellListeners(cell);

    return [midAngle, midRadius];
}

function createCellPath(innerR, outerR, startAngle, endAngle) {
    const x1 = getX(startAngle) * innerR;
    const y1 = getY(startAngle) * innerR;
    const x2 = getX(endAngle) * innerR;
    const y2 = getY(endAngle) * innerR;
    const x3 = getX(endAngle) * outerR;
    const y3 = getY(endAngle) * outerR;
    const x4 = getX(startAngle) * outerR;
    const y4 = getY(startAngle) * outerR;

    return `M ${x1} ${y1} A ${innerR} ${innerR} 0 0 1 ${x2} ${y2} 
            L ${x3} ${y3} A ${outerR} ${outerR} 0 0 0 ${x4} ${y4} Z`;
}

function addCellListeners(cell) {
    cell.addEventListener("mouseover", function () {
        overCell(cell);
    });

    cell.addEventListener('mousedown', function () {
        downCell(cell);
    });
    
    cell.addEventListener("mouseout", function () {
        outCell(cell);
    });
    cell.addEventListener('mouseup', function() {
        upCell(cell);
    });
}

export function downCell(cell) {
    if(state_click.clickedFigure === null) {
        let thisFigure = null
        for (const someFigure of document.querySelectorAll(".figure")) {
            if(someFigure.cellId === cell.id) {
                thisFigure = someFigure;
                break;
            }
        }
        if(thisFigure !== null) {
            downFigure(thisFigure);
        }
    } 
}

export function upCell(cell, other=false) {
    if(state_click.clickedFigure !== null) {
        state_click.chosenCellId = cell.id;
        state_click.clickedFigure.isDragging = true;
        state_click.someonesDragging = true;
        upFigure(state_click.clickedFigure, other);
    }
}

export function drawAllCellBorders() {
    document.querySelectorAll(".cell").forEach(cell => {
        drawCellBorder(cell);
    })
}

function drawCellBorder(cell) {
    const cellBorder = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cellBorder.setAttribute("id", cell.id + "Border");
    cellBorder.setAttribute("d", cell.getAttribute("d"));
    cellBorder.setAttribute("fill", "none");
    cellBorder.setAttribute("stroke", "white");
    cellBorder.setAttribute("stroke-width", "0");
    board.appendChild(cellBorder);
}

export function overCell(cell) {
    if(!state_click.someonesDragging){
        cell.setAttribute("fill", "lightgreen");
    }
    else {
        if(state_click.chosenCellId !== null) {
            document.querySelector("#" + state_click.chosenCellId + "Border").setAttribute("stroke-width", "0");
        }
        document.querySelector("#" + cell.id + "Border").setAttribute("stroke-width", "10");
        state_click.chosenCellId = cell.id;
    }
    document.getElementById("cell-id-display").textContent = "Клетка: " + cell.id;
}

export function outCell(cell) {
    if(!state_click.someonesDragging){
        if(state_click.clickedFigure !== null && cell.available) {
            cell.setAttribute("fill", "green");
        }
        else {
            cell.setAttribute("fill", cell.color);
        }
        
    }
    document.getElementById("cell-id-display").textContent = "Наведи на клетку";
}


export function paintAvailCells(figure) {
    clearAvailCells();
    const availCellIds = getAvailCells(figure);
    availCellIds.forEach(availCellId => {
        const availCell = document.querySelector("#" + availCellId);
        if(availCell.getAttribute("fill") !== "lightgreen") {
            availCell.setAttribute("fill", "green");
        }
        availCell.available = true;

    })

}

export function clearAvailCells() {
    document.querySelectorAll(".cell").forEach(cell => {
        if(cell.getAttribute("fill") !== "lightgreen") {
            cell.setAttribute("fill", cell.color);
        }
        cell.available = false;
    })
}
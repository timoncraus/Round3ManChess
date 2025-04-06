import { getX, getY } from './common_math.js';
import { board, rings, sectors, letters } from './board.js';
import { state, getAvailCells } from './game_logic.js';

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
    
    cell.addEventListener("mouseout", function () {
        outCell(cell);
    });
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
    if(!state.someonesDragging){
        cell.setAttribute("fill", "lightgreen");
    }
    else {
        if(state.chosenCellId !== null) {
            document.querySelector("#" + state.chosenCellId + "Border").setAttribute("stroke-width", "0");
        }
        document.querySelector("#" + cell.id + "Border").setAttribute("stroke-width", "10");
        state.chosenCellId = cell.id;
    }
    document.getElementById("cell-id-display").textContent = "Клетка: " + cell.id;
}

export function outCell(cell) {
    if(!state.someonesDragging){
        if(state.clickedFigure !== null && cell.available) {
            cell.setAttribute("fill", "green");
        }
        else {
            cell.setAttribute("fill", cell.color);
        }
        
    }
    document.getElementById("cell-id-display").textContent = "Наведи на клетку";
}


export function paintAvailCells(figure) {
    const availCellIds = getAvailCells(figure);
    availCellIds.forEach(availCellId => {
        const availCell = document.querySelector("#" + availCellId);
        if(availCell.getAttribute("fill") !== "lightgreen") {
            availCell.setAttribute("fill", "green");
        }
        availCell.available = true;
    })
}
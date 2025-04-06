import { getX, getY, toRad } from './common_math.js';
import { drawCell, drawAllCellBorders } from './cell.js';

export const board = document.getElementById("board");
export const viewBoxDict = board.getAttribute("viewBox").split(" ").map(Number);
export const rings = 6;
export const sectors = 24;
export const radiusStep = 40;
export const centerRadius = 100;
export const outerBorderThick = 9
export const outerBorderRadius = (rings * radiusStep) + centerRadius + outerBorderThick;
export const angleStep = 360 / sectors;
export const letters = "ABCDEFGHIJKL"
export const lineColors = ["yellow-line", "blue-line", "pink-line", "black-line", 
    "green-line", "maroon-line", "gray-line", "yellow-line"]

export function drawBoard() {
    drawcenterCircle();
    drawCellsAndArcs();
    drawOuterBorder();
}

function drawcenterCircle() {
    const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerCircle.setAttribute("cx", 0);
    centerCircle.setAttribute("cy", 0);
    centerCircle.setAttribute("r", centerRadius);
    centerCircle.setAttribute("fill", "#BE885E");
    board.appendChild(centerCircle);
}

function drawCellsAndArcs() {
    for (let ring = 1; ring <= rings; ring++) {
        const innerRadius = (ring - 1) * radiusStep + centerRadius;
        const outerRadius = ring * radiusStep + centerRadius;
        for (let sector = 0; sector < sectors; sector++) {
            const startAngle = sector * angleStep;
            const endAngle = (sector + 1) * angleStep;
            const midValues = drawCell(ring, sector, innerRadius, outerRadius, startAngle, endAngle);
            if(ring === rings) {
                drawArc(midValues, lineColors[sector % lineColors.length]);
            }
        }
    }
    drawAllCellBorders();
}

function drawOuterBorder() {
    const outerBorder = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outerBorder.setAttribute("cx", 0);
    outerBorder.setAttribute("cy", 0);
    outerBorder.setAttribute("r", outerBorderRadius);
    outerBorder.setAttribute("class", "outer-border");
    board.appendChild(outerBorder);
    for (let sector = 0; sector < sectors; sector++) {
        drawLetterOuterBorder(sector);
    }
}

function drawLetterOuterBorder(sector) {
    const midAngle = (sector + 0.5) * angleStep;
    const letter = letters[(sectors - sector) % letters.length]
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", Math.cos(toRad(midAngle)) * outerBorderRadius + 1);
    text.setAttribute("y", Math.sin(toRad(midAngle)) * outerBorderRadius + 1);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-family", `sans-serif`);
    text.setAttribute("fill", "#000");
    text.setAttribute("class", "board-letter");
    text.setAttribute("transform", `rotate(${midAngle - 90}, 
        ${Math.cos(toRad(midAngle)) * outerBorderRadius}, 
        ${Math.sin(toRad(midAngle)) * outerBorderRadius})`);
    text.textContent = letter;
    board.appendChild(text);
}

function drawArc(values, lineColor) {
    const angle = values[0]
    const radius = values[1]
    const path = `
        M ${getX(angle) * radius} ${getY(angle) * radius} 

        ${getArcPoint(angle, radius, 1.0, 1.0)}
        ${getArcPoint(angle, radius, 2.0, 2.0)}
        ${getArcPoint(angle, radius, 3.0, 3.0)}
        ${getArcPoint(angle, radius, 4.0, 4.0)}
        ${getArcPoint(angle, radius, 4.0, 4.0)}
        ${getArcPoint(angle, radius, 5.0, 5.0)}
        ${getArcPoint(angle, radius, 5.3, 5.3)}
        ${getArcPoint(angle, radius, 0.0, 8.8, 0.6)}
        ${getArcPoint(angle, radius, -5.3, 5.3)}
        ${getArcPoint(angle, radius, -5.0, 5.0)}
        ${getArcPoint(angle, radius, -4.0, 4.0)}
        ${getArcPoint(angle, radius, -3.0, 3.0)}
        ${getArcPoint(angle, radius, -2.0, 2.0)}
        ${getArcPoint(angle, radius, -1.0, 1.0)}

        A ${radius} ${radius} 0 0 0 ${getX(angle) * radius} ${getY(angle) * radius}
        Z
    `;

    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttribute("d", path);
    arc.setAttribute("class", `line ${lineColor}`);
    board.appendChild(arc);
}

function getArcPoint(angle, radius, kX, kY, kRadius=1) {
    return `A ${radius*kRadius} ${radius * kRadius} 0 0 0 `+
        `${getX(angle - angleStep * kX) * (radius - radiusStep * kY)} `+
        `${getY(angle - angleStep * kX) * (radius - radiusStep * kY)}`
}
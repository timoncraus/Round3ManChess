import { getX, getY, toRad } from './common_math.js';
import { drawCell, drawAllCellBorders } from './cell.js';
import { drawAllPlayersMiniFigures } from './mini_figure.js';

export const board = document.getElementById("board");
export const viewBoxDict = board.getAttribute("viewBox").split(" ").map(Number);
export const rings = 6;
export const sectors = 24;
export const radiusStep = 40;
export const centerRadius = 100;
export const outerBorderIndent = 13
export const outerBorderRadius = (rings * radiusStep) + centerRadius + outerBorderIndent;
export const angleStep = 360 / sectors;
export const letters = "ABCDEFGHIJKL"
export const lineColors = ["orange-line", "blue-line", "pink-line", "black-line", 
    "green-line", "maroon-line", "gray-line", "yellow-line"]

export function drawBoard() {
    drawLowerPlayerBorder();
    drawAllPlayersCircles();

    drawCenterCircle();
    drawCellsAndArcs();
    drawOuterBorder();

    drawAllPlayersMiniFigures();
}

function drawAllPlayersCircles() {
    drawPlayerCircle(5, "black");
    drawPlayerCircle(13, "white");
    drawPlayerCircle(-3, "gray");
}

function drawPlayerCircle(angleK, player) {
    const [angle, radius] = [angleStep * angleK, outerBorderRadius - 21];
    const path = `
        M ${getPoint(angle, radius)} 
        ${getArcPoint(angle, radius, 0.0, -1.0)}
        ${getArcPoint(angle, radius, 1.0, -1.0)}
        ${getArcPoint(angle, radius, 2.0, -1.0)}
        ${getArcPoint(angle, radius, 3.0, -1.0)}
        ${getArcPoint(angle, radius, 4.0, -1.0)}
        ${getArcPoint(angle, radius, 5.0, -1.0)}
        ${getArcPoint(angle, radius, 6.0, -1.0)}
        ${getArcPoint(angle, radius, 7.0, -1.0)}
        ${getArcPoint(angle, radius, 8.0, -1.0)}
        ${getArcPoint(angle, radius, 8.0, 0.0)}

        Z
    `;

    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttribute("d", path);
    arc.setAttribute("class", `player-border ${player}`);
    board.appendChild(arc);
}

function drawCenterCircle() {
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

    drawGreenStripes(3, 5, "thin");
    drawGreenStripes(5, 6, "thick");

    drawAllCellBorders();
}

function drawLowerPlayerBorder() {
    const playerBorder = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    playerBorder.setAttribute("cx", 0);
    playerBorder.setAttribute("cy", 0);
    playerBorder.setAttribute("r", outerBorderRadius + 21);
    playerBorder.setAttribute("class", "player-border black");
    board.appendChild(playerBorder);
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
    text.setAttribute("x", Math.cos(toRad(midAngle)) * outerBorderRadius + 4);
    text.setAttribute("y", Math.sin(toRad(midAngle)) * outerBorderRadius + 4);
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
    const [angle, radius] = values;
    const path = `
        M ${getPoint(angle, radius)} 

        ${getArcPoint(angle, radius, 1.0, 1.0)}
        ${getArcPoint(angle, radius, 1.5, 1.5)}
        ${getArcPoint(angle, radius, 2.0, 2.0)}
        ${getArcPoint(angle, radius, 2.5, 2.5)}
        ${getArcPoint(angle, radius, 3.0, 3.0)}
        ${getArcPoint(angle, radius, 3.5, 3.5)}
        ${getArcPoint(angle, radius, 4.0, 4.0)}
        ${getArcPoint(angle, radius, 4.5, 4.5)}
        ${getArcPoint(angle, radius, 4.0, 4.0)}
        ${getArcPoint(angle, radius, 5.0, 5.0)}
        ${getArcPoint(angle, radius, 5.3, 5.3)}
        ${getArcPoint(angle, radius, 0.0, 8.8, 0.6)}
        ${getArcPoint(angle, radius, -5.3, 5.3)}
        ${getArcPoint(angle, radius, -5.0, 5.0)}
        ${getArcPoint(angle, radius, -4.5, 4.5)}
        ${getArcPoint(angle, radius, -4.0, 4.0)}
        ${getArcPoint(angle, radius, -3.5, 3.5)}
        ${getArcPoint(angle, radius, -3.0, 3.0)}
        ${getArcPoint(angle, radius, -2.5, 2.5)}
        ${getArcPoint(angle, radius, -2.0, 2.0)}
        ${getArcPoint(angle, radius, -1.5, 1.5)}
        ${getArcPoint(angle, radius, -1.0, 1.0)}

        A ${radius} ${radius} 0 0 0 ${getPoint(angle, radius)}
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
        `${getY(angle - angleStep * kX) * (radius - radiusStep * kY)} `;
}

function getPoint(angle, radius) {
    return `${getX(angle) * radius} ${getY(angle) * radius} `;
}

function drawGreenStripes(ring1, ring2, kindStripe) {
    const radius1 = ring1 * radiusStep + centerRadius;
    const radius2 = ring2 * radiusStep + centerRadius;
    for(let sector = 5; sector < sectors; sector += 8) {
        const angle = sector * angleStep;
        drawGreenStripe(radius1, radius2, angle, kindStripe);
    }
}

function drawGreenStripe(radius1, radius2, angle, kindStripe) {
    const path = `
        M ${getPoint(angle, radius1)}
        L ${getPoint(angle, radius2)}
        Z
    `;
    const stripe = document.createElementNS("http://www.w3.org/2000/svg", "path");
    stripe.setAttribute("d", path);
    stripe.setAttribute("class", `stripe ${kindStripe}`);
    board.appendChild(stripe);
}
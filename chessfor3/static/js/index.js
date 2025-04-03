const board = document.getElementById("board");
const rings = 6; // Количество колец (по вертикали)
const sectors = 24; // Общее количество клеток по горизонтали
const radiusStep = 40; // Расстояние между кольцами
const centerRadius = 100; // Увеличиваем радиус центральной пустой клетки
const outerBorderRadius = (rings * radiusStep) + centerRadius; // Радиус внешней границы
const angleStep = 360 / sectors;

const lineColors = ["yellow-line", "blue-line", "pink-line", "black-line", 
    "green-line", "maroon-line", "gray-line", "yellow-line"]

function drawBoard() {
    // Отрисовка центральной клетки (пустышка)
    const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    center.setAttribute("cx", 0);
    center.setAttribute("cy", 0);
    center.setAttribute("r", centerRadius);
    center.setAttribute("fill", "#BE885E");
    board.appendChild(center);

    // Отрисовка колец и секторов
    for (let r = 1; r <= rings; r++) {
        let innerRadius = (r - 1) * radiusStep + centerRadius;
        let outerRadius = r * radiusStep + centerRadius;

        for (let s = 0; s < sectors; s++) {
            let startAngle = s * angleStep;
            let endAngle = (s + 1) * angleStep;

            let path = createSectorPath(innerRadius, outerRadius, startAngle, endAngle);
            let cell = document.createElementNS("http://www.w3.org/2000/svg", "path");
            cell.setAttribute("d", path);

            // Чередование цветов клеток
            let color = (r + s) % 2 === 0 ? "#DCC8BA" : "#A45C4B";
            cell.setAttribute("fill", color);
            cell.setAttribute("class", "cell");
            
            board.appendChild(cell);
            if(r==rings) {
                midAngle = (startAngle + endAngle) / 2
                midRadius = (innerRadius + outerRadius) / 2
                drawDashedArc(midAngle, midRadius, lineColors[s%8]);
            }
        }
    }

    // Добавление внешней границы
    const border = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    border.setAttribute("cx", 0);
    border.setAttribute("cy", 0);
    border.setAttribute("r", outerBorderRadius);
    border.setAttribute("class", "border");
    board.appendChild(border);

    // Нарисуем цветную дугу через центральную клетку
    
}

function toRad(angle) {
    return (Math.PI / 180) * angle;
}

function createSectorPath(innerR, outerR, startAngle, endAngle) {
    let x1 = Math.cos(toRad(startAngle)) * innerR;
    let y1 = Math.sin(toRad(startAngle)) * innerR;
    let x2 = Math.cos(toRad(endAngle)) * innerR;
    let y2 = Math.sin(toRad(endAngle)) * innerR;
    let x3 = Math.cos(toRad(endAngle)) * outerR;
    let y3 = Math.sin(toRad(endAngle)) * outerR;
    let x4 = Math.cos(toRad(startAngle)) * outerR;
    let y4 = Math.sin(toRad(startAngle)) * outerR;

    return `M ${x1} ${y1} A ${innerR} ${innerR} 0 0 1 ${x2} ${y2} 
            L ${x3} ${y3} A ${outerR} ${outerR} 0 0 0 ${x4} ${y4} Z`;
}

function getX(angle) {
    return Math.cos(toRad(angle));
}

function getY(angle) {
    return Math.sin(toRad(angle));
}

function getPoint(startAngle, startRadius, a, k, radius=1) {
    return `A ${startRadius*radius} ${startRadius*radius} 0 0 0 `+
        `${getX(startAngle - angleStep*a) * (startRadius - radiusStep*k)} `+
        `${getY(startAngle - angleStep*a) * (startRadius - radiusStep*k)}`
}

// Функция для рисования цветной пунктирной дуги
function drawDashedArc(startAngle, startRadius, lineColor) {
    const radius = 10
    const endRadius = startRadius + 40; // Радиус для конца дуги

    // Путь для дуги, который будет плавно изгибаться через центральную клетку
    const path = `
        M ${getX(startAngle) * startRadius} ${getY(startAngle) * startRadius} 

        ${getPoint(startAngle, startRadius, 1, 1)}
        ${getPoint(startAngle, startRadius, 2, 2)}
        ${getPoint(startAngle, startRadius, 3, 3)}
        ${getPoint(startAngle, startRadius, 4, 4)}
        ${getPoint(startAngle, startRadius, 4, 4)}
        ${getPoint(startAngle, startRadius, 5, 5)}
        ${getPoint(startAngle, startRadius, 5.3, 5.3)}
        ${getPoint(startAngle, startRadius, 0, 8.8, 0.6)}
        ${getPoint(startAngle, startRadius, -5.3, 5.3)}
        ${getPoint(startAngle, startRadius, -5, 5)}
        ${getPoint(startAngle, startRadius, -4, 4)}
        ${getPoint(startAngle, startRadius, -3, 3)}
        ${getPoint(startAngle, startRadius, -2, 2)}
        ${getPoint(startAngle, startRadius, -1, 1)}

        A ${startRadius} ${startRadius} 0 0 0 ${getX(startAngle) * startRadius} ${getY(startAngle) * startRadius}
        Z
    `;

    // Добавление дуги
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc.setAttribute("d", path);
    arc.setAttribute("class", `line ${lineColor}`);
    board.appendChild(arc);
}

drawBoard();
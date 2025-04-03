const board = document.getElementById("board");
const rings = 6; // Количество колец (по вертикали)
const sectors = 24; // Общее количество клеток по горизонтали
const radiusStep = 40; // Расстояние между кольцами
const centerRadius = 100; // Увеличиваем радиус центральной пустой клетки
const outerBorderRadius = (rings * radiusStep) + centerRadius; // Радиус внешней границы
const angleStep = 360 / sectors;
const letters = "ABCDEFGHIJKL"
const figure_width = 47

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
            let letter = letters[(sectors - s) % letters.length]
            if(s==0 || s > letters.length) {
                cell.setAttribute("id", letter + (rings+r));
            }
            else {
                cell.setAttribute("id", letter + (rings-r+1));
            }

            midAngle = (startAngle + endAngle) / 2
            midRadius = (innerRadius + outerRadius) / 2
            cell.setAttribute("x", getX(midAngle) * midRadius);
            cell.setAttribute("y", getY(midAngle) * midRadius);
            
            board.appendChild(cell);
            if(r==rings) {
                drawArc(midAngle, midRadius, lineColors[s%8]);
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
    for (let s = 0; s < sectors; s++) {
        let midAngle = (s + 0.5) * angleStep;
        // Добавление латинских букв по кругу
        let letter = letters[(sectors - s) % letters.length]
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", Math.cos(toRad(midAngle)) * outerBorderRadius + 1);
        text.setAttribute("y", Math.sin(toRad(midAngle)) * outerBorderRadius + 1);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("alignment-baseline", "middle");
        text.setAttribute("font-size", "16");
        text.setAttribute("font-family", `sans-serif`);
        text.setAttribute("fill", "#000");
        text.setAttribute("transform", `rotate(${midAngle-90}, 
            ${Math.cos(toRad(midAngle)) * outerBorderRadius}, 
            ${Math.sin(toRad(midAngle)) * outerBorderRadius})`);
        text.textContent = letter;
        board.appendChild(text);
    }
}

function toRad(angle) {
    return (Math.PI / 180) * angle;
}

function createSectorPath(innerR, outerR, startAngle, endAngle) {
    let x1 = getX(startAngle) * innerR;
    let y1 = getY(startAngle) * innerR;
    let x2 = getX(endAngle) * innerR;
    let y2 = getY(endAngle) * innerR;
    let x3 = getX(endAngle) * outerR;
    let y3 = getY(endAngle) * outerR;
    let x4 = getX(startAngle) * outerR;
    let y4 = getY(startAngle) * outerR;

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
function drawArc(startAngle, startRadius, lineColor) {
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

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("mouseover", function () {
        document.getElementById("cell-id-display").textContent = "Клетка: " + this.id;
    });
    
    cell.addEventListener("mouseout", function () {
        document.getElementById("cell-id-display").textContent = "Наведи на клетку";
    });
});

figures_pos = {
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


document.querySelectorAll(".cell").forEach(cell => {
    if(figures_pos[cell.id] != undefined && figures_pos[cell.id] != null) {
        let figure = document.createElementNS("http://www.w3.org/2000/svg", "image");
        figure.setAttribute("href", `/static/images/${figures_pos[cell.id]}.png`);
        figure.setAttribute("x", cell.getAttribute("x") - figure_width/2);
        figure.setAttribute("y", cell.getAttribute("y") - figure_width/2);
        figure.setAttribute("width", figure_width);
        figure.setAttribute("height", figure_width);
        figure.setAttribute("class", "figure");
        board.appendChild(figure);
    }
});
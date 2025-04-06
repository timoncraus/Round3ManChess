const board = document.getElementById("board");
const viewBoxDict = board.getAttribute("viewBox").split(" ").map(Number);
const rings = 6; // Количество колец (по вертикали)
const sectors = 24; // Общее количество клеток по горизонтали
const radiusStep = 40; // Расстояние между кольцами
const centerRadius = 100; // Увеличиваем радиус центральной пустой клетки
const outerBorderThick = 9
const outerBorderRadius = (rings * radiusStep) + centerRadius + outerBorderThick; // Радиус внешней границы
const angleStep = 360 / sectors;
const letters = "ABCDEFGHIJKL"
const figure_height = 50

let someonesDragging = false;
let chosenCellId = null;
let clickedFigure = null;

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
            cell.color = color;
            cell.setAttribute("fill", color);
            cell.setAttribute("class", "cell");
            let letter = letters[(sectors - s) % letters.length]
            if(s === 0 || s > letters.length) {
                cell.setAttribute("id", letter + (rings+r));
            }
            else {
                cell.setAttribute("id", letter + (rings-r+1));
            }

            midAngle = (startAngle + endAngle) / 2
            midRadius = (innerRadius + outerRadius) / 2
            cell.setAttribute("x", getX(midAngle) * midRadius);
            cell.setAttribute("y", getY(midAngle) * midRadius);

            cell.available = false;
            
            board.appendChild(cell);
            if(r === rings) {
                drawArc(midAngle, midRadius, lineColors[s%lineColors.length]);
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
        text.setAttribute("class", "board-letter");
        text.setAttribute("transform", `rotate(${midAngle-90}, 
            ${Math.cos(toRad(midAngle)) * outerBorderRadius}, 
            ${Math.sin(toRad(midAngle)) * outerBorderRadius})`);
        text.textContent = letter;
        board.appendChild(text);
    }
}
drawBoard();

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


document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("mouseover", function () {
        overCell(cell);
    });
    
    cell.addEventListener("mouseout", function () {
        outCell(cell);
    });
});

document.querySelectorAll(".cell").forEach(cell => {
    let cellBorder = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cellBorder.setAttribute("id", cell.id + "Border");
    cellBorder.setAttribute("d", cell.getAttribute("d"));
    cellBorder.setAttribute("fill", "none");
    cellBorder.setAttribute("stroke", "white");
    cellBorder.setAttribute("stroke-width", "0");
    board.appendChild(cellBorder);
});

function overCell(cell) {
    if(!someonesDragging){
        cell.setAttribute("fill", "lightgreen");
    }
    else {
        if(chosenCellId !== null) {
            document.querySelector("#" + chosenCellId + "Border").setAttribute("stroke-width", "0");
        }
        document.querySelector("#" + cell.id + "Border").setAttribute("stroke-width", "10");
        chosenCellId = cell.id;
    }
    document.getElementById("cell-id-display").textContent = "Клетка: " + cell.id;
}

function outCell(cell) {
    if(!someonesDragging){
        if(clickedFigure !== null && cell.available) {
            cell.setAttribute("fill", "green");
        }
        else {
            cell.setAttribute("fill", cell.color);
        }
        
    }
    document.getElementById("cell-id-display").textContent = "Наведи на клетку";
}

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

function drawFigures() {
    const boundBoard = board.getBoundingClientRect();

    document.querySelectorAll(".figure").forEach(el => el.remove());

    document.querySelectorAll(".cell").forEach(cell => {
        if(figures_pos[cell.id] !== undefined && figures_pos[cell.id] !== null) {
            const imageUrl = `${images}/${figures_pos[cell.id]}.png`;
            const img = new Image();

            img.onload = function () {

                const figure = document.createElement('div');

                figure.cellId = cell.id;
                
                figure.style.backgroundImage = `url(${imageUrl})`;
                figure.style.backgroundSize = 'cover';
                figure.relation = img.naturalWidth / img.naturalHeight;
                figure.setAttribute("class", "figure");
                figure.widthRelat = parseFloat(board.getAttribute("width")) / viewBoxDict[2];
                figure.heightRelat = parseFloat(board.getAttribute("height")) / viewBoxDict[3];
                figure.style.width = figure_height * figure.relation + 'px';
                figure.style.height = figure_height + 'px';

                figure.centerX = boundBoard.x + boundBoard.width/2;
                figure.centerY = boundBoard.y + boundBoard.height/2;
                
                setFigure(figure, cell);

                document.body.appendChild(figure);

                figure.addEventListener('mouseover', function () {
                    overFigure(figure);
                });
                figure.addEventListener('mouseout', function () {
                    let cell = document.querySelector("#" + figure.cellId);
                    outCell(cell);
                });
                figure.addEventListener('mousedown', function (e) {
                    if(!someonesDragging) {
                        figure.isDragging = true;
                        someonesDragging = true;

                        figure.dragOffsetX = figure.offsetWidth / 2;
                        figure.dragOffsetY = figure.offsetHeight / 2;
                        figure.style.cursor = 'grabbing';
                        figure.style.pointerEvents = 'none';
                        figure.style.zIndex = "100";

                        paintAvailCells(figure);
                        clickedFigure = figure;
                    }
                });
                document.addEventListener('mousemove', function (e) {
                    if(figure.isDragging) {
                        let x = e.clientX - figure.dragOffsetX;
                        let y = e.clientY - figure.dragOffsetY;

                        figure.style.left = x + 'px';
                        figure.style.top = y + 'px';
                    }
                });
                document.addEventListener('mouseup', function(e) {
                    if(figure.isDragging) {
                        figure.isDragging = false;
                        someonesDragging = false;
                        if (chosenCellId === figure.cellId || chosenCellId === null) {
                            overFigure(figure);
                            resetFigurePos(figure);
                            paintAvailCells(figure);
                            clickedFigure = figure;
                        }
                        else {
                            console.log(figure.cellId, chosenCellId)
                            if (figures_pos[chosenCellId] !== undefined && figures_pos[chosenCellId] !== null) {
                                document.querySelectorAll(".figure").forEach(existingFigure => {
                                    if (existingFigure.cellId === chosenCellId) {
                                        existingFigure.remove();
                                    }
                                });
                            }

                            figures_pos[chosenCellId] = figures_pos[figure.cellId];
                            figures_pos[figure.cellId] = null;
                            figure.cellId = chosenCellId;

                            const cell = document.querySelector("#" + chosenCellId);
                            setFigure(figure, cell);
                            chosenCellId = null;

                            clickedFigure = null;
                        }
                        figure.style.pointerEvents = 'auto';
                        document.querySelectorAll(".cell").forEach(cell => {
                            document.querySelector("#" + cell.id + "Border").setAttribute("stroke-width", "0");
                        });
                        if(clickedFigure === null) {
                            document.querySelectorAll(".cell").forEach(cell => {
                                cell.setAttribute("fill", cell.color);
                                cell.available = false;
                            });
                        }
                        
                    }
                });
            }

            img.src = imageUrl;
        }
    });
}

function paintAvailCells(figure) {
    let availCellIds = getAvailCells(figure);
    availCellIds.forEach(availCellId => {
        let availCell = document.querySelector("#" + availCellId);
        if(availCell.getAttribute("fill") !== "lightgreen") {
            availCell.setAttribute("fill", "green");
        }
        availCell.available = true;
    })
}

function getAvailCells(figure) {
    let availCells = []
    for (let r = 1; r <= rings; r++) {
        for (let s = 0; s < sectors; s++) {
            let letter = letters[(sectors - s) % letters.length]
            if(letter === "A") {
                if(s === 0 || s > letters.length) {
                    availCells.push(letter + (rings+r));
                }
                else {
                    availCells.push(letter + (rings-r+1));
                }
            }
        }
    }
    return availCells;
}

function overFigure(figure) {
    let cell = document.querySelector("#" + figure.cellId);
    overCell(cell);
    figure.style.cursor = 'grab';
}
function resetFigurePos(figure) {
    figure.style.left = figure.style.realLeft;
    figure.style.top = figure.style.realTop;
    figure.style.zIndex = figure.style.realZIndex;
}

function setFigure(figure, cell) {
    figure.style.left = (figure.centerX - figure_height*figure.relation/2 
        + parseFloat(cell.getAttribute("x")) * figure.widthRelat) + 'px';
    figure.style.top = (figure.centerY - figure_height/2 
        + parseFloat(cell.getAttribute("y")) * figure.heightRelat) + 'px';
    figure.style.realLeft = figure.style.left;
    figure.style.realTop = figure.style.top;

    const match = cell.id.match(/^([A-Za-z]+)(\d+)$/);
    const char = match[1];
    const number = parseInt(match[2]);
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
}

window.addEventListener("load", drawFigures);
window.addEventListener("resize", drawFigures);

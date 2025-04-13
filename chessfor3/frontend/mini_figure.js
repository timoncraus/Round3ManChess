import { viewBoxDict, board, outerBorderRadius, angleStep } from './board.js';
import { captured_figures } from './game_logic.js';
import { getX, getY } from './common_math.js';

const miniFigureHeight = 26;

export function drawAllPlayersMiniFigures() {
    drawAllMiniFigures("black");
    drawAllMiniFigures("white");
    drawAllMiniFigures("gray");
}

export function drawAllMiniFigures(player) {
    const boundBoard = board.getBoundingClientRect();

    document.querySelectorAll(".mini-figure").forEach(miniFigure => {
        if(player === miniFigure.playerCaptured) {
            miniFigure.remove();
        }
    });
    const length = captured_figures[player].length;
    for(let count = 0; count < length; count++) {
        const miniFigureName = captured_figures[player][count];

        const imageUrl = `${images}/${miniFigureName}.png`;
        const img = new Image();

        img.onload = function () {
            let initialX = 0;
            const initialY = 45;
            const diffY = 30;
            const initialDistX = 0.26;
            const diffDistX = 0.03;
            const countList = [12, 8, 6, 4, 2];

            if(player === "gray") {
                initialX = 14.6;
            }
            else if(player === "white") {
                initialX = 9.1;
            }
            else if(player === "black") {
                initialX = 2.6;
            }

            let i = 0;
            let sum = 0;
            while(sum < count+1) {
                sum += countList[i];
                i++;
            }
            i--;

            const prevSum = (sum - countList[i])
            const distX = (initialDistX - diffDistX * i);

            drawMiniFigure(imageUrl, img, boundBoard, player,
                initialX - (Math.min(length - prevSum, countList[i]) / 2 - (count+1 - prevSum)) * distX, 
                initialY + diffY * i);
        }
        img.src = imageUrl;
    }
}

function drawMiniFigure(imageUrl, img, boundBoard, player, shiftX, shiftY) {
	const miniFigure = document.createElement('div');
    miniFigure.playerCaptured = player;
    miniFigure.style.backgroundImage = `url(${imageUrl})`;
    miniFigure.style.backgroundSize = 'cover';
    miniFigure.relation = img.naturalWidth / img.naturalHeight;
    miniFigure.setAttribute("class", "mini-figure");
    miniFigure.widthRelat = parseFloat(board.getAttribute("width")) / viewBoxDict[2] - 0.1;
    miniFigure.heightRelat = parseFloat(board.getAttribute("height")) / viewBoxDict[3];
    miniFigure.style.width = miniFigureHeight * miniFigure.relation + 'px';
    miniFigure.style.height = miniFigureHeight + 'px';

    miniFigure.centerX = boundBoard.x + boundBoard.width/2;
    miniFigure.centerY = boundBoard.y + boundBoard.height/2;

    const x = getX(angleStep * shiftX) * (outerBorderRadius + shiftY);
    const y = getY(angleStep * shiftX) * (outerBorderRadius + shiftY);

    miniFigure.style.left = (miniFigure.centerX - miniFigureHeight*miniFigure.relation/2 
        + parseFloat(x) * miniFigure.widthRelat) + 'px';
    miniFigure.style.top = (miniFigure.centerY - miniFigureHeight/2 
        + parseFloat(y) * miniFigure.heightRelat) + 'px';

    document.body.appendChild(miniFigure);
}
import { drawBoard, updateBoardParams, drawTextDisplay } from './board.js';
import { drawAllFigures } from './figure.js';
import { drawAllPlayersMiniFigures } from './mini_figure.js';

drawBoard();

window.addEventListener("load", drawAllFigures);
window.addEventListener("resize", () => {
	updateBoardParams();

	drawTextDisplay();
	drawAllFigures();
	drawAllPlayersMiniFigures();
});

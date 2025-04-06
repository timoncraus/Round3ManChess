import { drawBoard } from './board.js';
import { drawAllFigures } from './figure.js';

drawBoard();

window.addEventListener("load", drawAllFigures);
window.addEventListener("resize", drawAllFigures);

import { drawBoard, updateBoardParams, drawTextDisplay } from './board.js';
import { drawAllFigures, downFigure } from './figure.js';
import { upCell } from './cell.js';
import { drawAllPlayersMiniFigures } from './mini_figure.js';
import { state_click } from './game_logic.js';

drawBoard();

window.addEventListener("load", drawAllFigures);
window.addEventListener("resize", () => {
	updateBoardParams();

	drawTextDisplay();
	drawAllFigures();
	drawAllPlayersMiniFigures();
});

const gameId = document.getElementById('game').dataset.gameId;
const socket = new WebSocket("ws://" + window.location.host + `/ws/game/${gameId}/`);

export function sendMove(to_cell_id, from_cell_id, clear, edit_new) {
  socket.send(JSON.stringify({
    'type': 'move',
    'clear': clear,
    'edit_new': edit_new,
    'to_cell_id': to_cell_id,
    'from_cell_id': from_cell_id
  }));
}

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'move') {
	for (const figure of document.querySelectorAll(".figure")) {
	    if(figure.cellId === data.from_cell_id) {
	    	downFigure(figure);
			break;
	    }
	}
	upCell(document.querySelector("#" + data.to_cell_id));
  }
};

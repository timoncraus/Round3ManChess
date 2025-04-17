import { drawBoard, updateBoardParams, drawTextDisplay } from './board.js';
import { drawAllFigures, downFigure } from './figure.js';
import { upCell } from './cell.js';
import { drawAllPlayersMiniFigures } from './mini_figure.js';
import { state_click, playerColor } from './game_logic.js';

drawBoard();

window.addEventListener("load", drawAllFigures);
window.addEventListener("resize", () => {
	updateBoardParams();

	drawTextDisplay();
	drawAllFigures();
	drawAllPlayersMiniFigures();
});

const gameId = document.getElementById('game').dataset.gameId;
const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const socket = new WebSocket(protocol + window.location.host + `/ws/game/${gameId}/`);

export function sendMove(to_cell_id, from_cell_id, clear, edit_new) {
  socket.send(JSON.stringify({
    'type': 'move',
    'clear': clear,
    'edit_new': edit_new,
    'to_cell_id': to_cell_id,
    'from_cell_id': from_cell_id,
    'turn': state_game.turn,
    'captured_figures': state_game.captured_figures,
    'eliminated_players': state_game.eliminated_players,
    'double_pawns': state_game.double_pawns,
    'kings_rooks_stayed': state_game.kings_rooks_stayed
  }));
}

socket.onmessage = function(event) {
  
  const data = JSON.parse(event.data);
  if (data.type === 'move') {
  	let movedFigure = null;
	for (const figure of document.querySelectorAll(".figure")) {
	    if(figure.cellId === data.from_cell_id) {
	    	movedFigure = figure;
			break;
	    }
	}
	if(movedFigure !== null) {
		const [kind, player] = movedFigure.name.split("-");
		if(player !== playerColor) {
			downFigure(movedFigure);
			upCell(document.querySelector("#" + data.to_cell_id), true);
		}
	}
  }
};

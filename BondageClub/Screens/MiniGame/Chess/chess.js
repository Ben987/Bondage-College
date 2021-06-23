"use strict";
/*

Chess AI by Brandon Yanofsky - https://byanofsky.com/2017/07/06/building-a-simple-chess-ai/

A chess AI, with with different algorithms of increasing intelligence.

Play live version here: https://bay-chess-ai.herokuapp.com/

Based on [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

*/

var MiniGameChessBoard = null;
var MiniGameChessGame = null;

// Starts the chess with a depth (difficulty)
function MiniGameChessStart(Depth, PlayerColor) {
	const MinMaxDepth = Depth;
	const PauseDepth = 2;
	const chessOnMoveEvent = new Event('chessOnMove');
	let moveInProgress = false;

	/**
	 * Evaluates current chess board relative to player
	 * @param {string} color - Players color, either 'b' or 'w'
	 * @return {Number} board value relative to player
	 */
	function evaluateBoard(board, color) {
		// Sets the value for each piece using standard piece value
		const pieceValue = {
			p: 100,
			n: 350,
			b: 350,
			r: 525,
			q: 1000,
			k: 10000
		};

		// Loop through all pieces on the board and sum up total
		let value = 0;
		for (const row of board) {
			for (const piece of row) {
				if (piece) value += pieceValue[piece.type] * (piece.color === color ? 1 : -1);
			}
		}

		return value;
	}

	function sleep() {
		return new Promise(resolve => setTimeout(resolve, 25));
	}

	/**
	 * Calculates the best move using Minimax with Alpha Beta Pruning.
	 * @param {Number} depth - How many moves ahead to evaluate
	 * @param {Object} game - The game to evaluate
	 * @param {string} playerColor - Players color, either 'b' or 'w'
	 * @param {Number} alpha
	 * @param {Number} beta
	 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
	 * @return {Array} The best move value, and the best move
	 */
	async function calcBestMove(
		depth,
		game,
		playerColor,
		alpha = Number.NEGATIVE_INFINITY,
		beta = Number.POSITIVE_INFINITY,
		isMaximizingPlayer = true
	) {
		let value = 0;

		// Base case: evaluate board
		if (depth === 0) {
			value = evaluateBoard(game.board(), playerColor);
			return [value, null];
		}
		if (depth >= PauseDepth) {
			await sleep();
		}
		// Recursive case: search possible moves
		let bestMove = null; // best move not set yet
		const possibleMoves = game.moves();
		// Set random order for possible moves
		possibleMoves.sort(() => 0.5 - Math.random());
		// Set a default best move value
		let bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
		// Search through all possible moves
		for (let i = 0; i < possibleMoves.length; i++) {
			const move = possibleMoves[i];
			// Make the move, but undo before exiting loop
			game.move(move);
			// Recursively get the value from this move
			value = (await calcBestMove(depth - 1, game, playerColor, alpha, beta, !isMaximizingPlayer))[0];
			// Log the value of this move
			//console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value, bestMove, bestMoveValue);

			if (isMaximizingPlayer) {
				// Look for moves that maximize position
				if (value > bestMoveValue) {
					bestMoveValue = value;
					bestMove = move;
				}
				alpha = Math.max(alpha, value);
			} else {
				// Look for moves that minimize position
				if (value < bestMoveValue) {
					bestMoveValue = value;
					bestMove = move;
				}
				beta = Math.min(beta, value);
			}
			// Undo previous move
			game.undo();
			// Check for alpha beta pruning
			if (beta <= alpha) {
				//console.log('Prune', alpha, beta);
				break;
			}
		}
		// Log the best move at the current depth
		//console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
		// Return the best move, or the only move
		return [bestMoveValue, bestMove || possibleMoves[0]];
	}

	// Computer makes a move with algorithm choice and skill/depth level
	async function makeMove(skill = 3) {
		// exit if the game is over
		if (game.game_over() === true) {
			//console.log('game over');
			return;
		}
		// Calculate the best move
		moveInProgress = true;
		var move = (await calcBestMove(skill, game, game.turn()))[1];
		moveInProgress = false;
		// Make the calculated move
		game.move(move);
		// Update board positions
		board.position(game.fen());

		// Announce a move was made
		document.dispatchEvent(chessOnMoveEvent);
	}

	// Handles what to do after human makes move.
	// Computer automatically makes next move
	function onDrop(source, target) {
		// see if the move is legal
		const move = game.move({
			from: source,
			to: target,
			promotion: "q" // NOTE: always promote to a queen for example simplicity
		});

		// If illegal move, snapback
		if (move === null) return "snapback";

		// Log the move
		//console.log(move)

		// Announce a move was made
		document.dispatchEvent(chessOnMoveEvent);

		// make move for black
		window.setTimeout(function () {
			makeMove(MinMaxDepth);
		}, 200);
	}

	let board;
	let game = new Chess();

	// Check before pick pieces that it is the player's color and game is not over
	function onDragStart(source, piece, position, orientation) {
		if (game.game_over() === true || moveInProgress || piece.search(PlayerColor) === -1) {
			return false;
		}
	}

	// Update the board position after the piece snap
	// for castling, en passant, pawn promotion
	function onSnapEnd() {
		board.position(game.fen());
	}

	// Creates the board div
	if (document.getElementById("DivChessBoard") == null) {
		const div = document.createElement("div");
		div.setAttribute("ID", "DivChessBoard");
		div.className = "HideOnDisconnect";
		document.body.appendChild(div);
	}

	// Configure the board
	board = ChessBoard("DivChessBoard", {
		draggable: true,
		position: "start",
		pieceTheme: "Screens/MiniGame/Chess/{piece}.png",
		orientation: PlayerColor === "w" ? "white" : "black",
		// Handlers for user actions
		onDragStart: onDragStart,
		onDrop: onDrop,
		onSnapEnd: onSnapEnd
	});

	// Resets the board and shows it
	board.clear();
	board.start();
	game.reset();
	MiniGameChessBoard = board;
	MiniGameChessGame = game;

	// Opponent starts
	if (PlayerColor === "b") {
		window.setTimeout(function () {
			makeMove(MinMaxDepth);
		}, 200);
	}
}

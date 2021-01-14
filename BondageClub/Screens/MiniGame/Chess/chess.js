/*

Chess AI by Brandon Yanofsky - https://byanofsky.com/2017/07/06/building-a-simple-chess-ai/

A chess AI, with with different algorithms of increasing intelligence.

Play live version here: https://bay-chess-ai.herokuapp.com/

Based on [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

*/

var MiniGameChessBoard = null;
var MiniGameChessGame = null;

// Starts the chess with a depth (difficulty)
function MiniGameChessStart(Depth) {
	
	var MinMaxDepth = Depth;
		
	/**
	 * Finds a random move to make
	 * @return {string} move to make
	 */
	var randomMove = function() {
	  var possibleMoves = game.moves();
	  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
	  return possibleMoves[randomIndex];
	};

	/**
	 * Evaluates current chess board relative to player
	 * @param {string} color - Players color, either 'b' or 'w'
	 * @return {Number} board value relative to player
	 */
	var evaluateBoard = function(board, color) {
	  // Sets the value for each piece using standard piece value
	  var pieceValue = {
		'p': 100,
		'n': 350,
		'b': 350,
		'r': 525,
		'q': 1000,
		'k': 10000
	  };

	  // Loop through all pieces on the board and sum up total
	  var value = 0;
	  board.forEach(function(row) {
		row.forEach(function(piece) {
		  if (piece) {
			// Subtract piece value if it is opponent's piece
			value += pieceValue[piece['type']]
					 * (piece['color'] === color ? 1 : -1);
		  }
		});
	  });

	  return value;
	};

	/**
	 * Calculates the best move looking one move ahead
	 * @param {string} playerColor - Players color, either 'b' or 'w'
	 * @return {string} the best move
	 */
	var calcBestMoveOne = function(playerColor) {
	  // List all possible moves
	  var possibleMoves = game.moves();
	  // Sort moves randomly, so the same move isn't always picked on ties
	  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

	  // exit if the game is over
	  if (game.game_over() === true || possibleMoves.length === 0) return;

	  // Search for move with highest value
	  var bestMoveSoFar = null;
	  var bestMoveValue = Number.NEGATIVE_INFINITY;
	  possibleMoves.forEach(function(move) {
		game.move(move);
		var moveValue = evaluateBoard(game.board(), playerColor);
		if (moveValue > bestMoveValue) {
		  bestMoveSoFar = move;
		  bestMoveValue = moveValue;
		}
		game.undo();
	  });

	  return bestMoveSoFar;
	}

	/**
	 * Calculates the best move using Minimax without Alpha Beta Pruning.
	 * @param {Number} depth - How many moves ahead to evaluate
	 * @param {Object} game - The game to evaluate
	 * @param {string} playerColor - Players color, either 'b' or 'w'
	 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
	 * @return {Array} The best move value, and the best move
	 */
	var calcBestMoveNoAB = function(depth, game, playerColor,
									isMaximizingPlayer=true) {
	  // Base case: evaluate board
	  if (depth === 0) {
		value = evaluateBoard(game.board(), playerColor);
		return [value, null]
	  }

	  // Recursive case: search possible moves
	  var bestMove = null; // best move not set yet
	  var possibleMoves = game.moves();
	  // Set random order for possible moves
	  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
	  // Set a default best move value
	  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
											 : Number.POSITIVE_INFINITY;
	  // Search through all possible moves
	  for (var i = 0; i < possibleMoves.length; i++) {
		var move = possibleMoves[i];
		// Make the move, but undo before exiting loop
		game.move(move);
		// Recursively get the value of this move
		value = calcBestMoveNoAB(depth-1, game, playerColor, !isMaximizingPlayer)[0];
		// Log the value of this move
		//console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value, bestMove, bestMoveValue);

		if (isMaximizingPlayer) {
		  // Look for moves that maximize position
		  if (value > bestMoveValue) {
			bestMoveValue = value;
			bestMove = move;
		  }
		} else {
		  // Look for moves that minimize position
		  if (value < bestMoveValue) {
			bestMoveValue = value;
			bestMove = move;
		  }
		}
		// Undo previous move
		game.undo();
	  }
	  // Log the best move at the current depth
	  //console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
	  // Return the best move, or the only move
	  return [bestMoveValue, bestMove || possibleMoves[0]];
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
	var calcBestMove = function(depth, game, playerColor,
								alpha=Number.NEGATIVE_INFINITY,
								beta=Number.POSITIVE_INFINITY,
								isMaximizingPlayer=true) {
	  // Base case: evaluate board
	  if (depth === 0) {
		value = evaluateBoard(game.board(), playerColor);
		return [value, null]
	  }

	  // Recursive case: search possible moves
	  var bestMove = null; // best move not set yet
	  var possibleMoves = game.moves();
	  // Set random order for possible moves
	  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
	  // Set a default best move value
	  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
											 : Number.POSITIVE_INFINITY;
	  // Search through all possible moves
	  for (var i = 0; i < possibleMoves.length; i++) {
		var move = possibleMoves[i];
		// Make the move, but undo before exiting loop
		game.move(move);
		// Recursively get the value from this move
		value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
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
	var makeMove = function(algo, skill=3) {
	  // exit if the game is over
	  if (game.game_over() === true) {
		//console.log('game over');
		return;
	  }
	  // Calculate the best move, using chosen algorithm
	  if (algo === 1) {
		var move = randomMove();
	  } else if (algo === 2) {
		var move = calcBestMoveOne(game.turn());
	  } else if (algo === 3) {
		var move = calcBestMoveNoAB(skill, game, game.turn())[1];
	  } else {
		var move = calcBestMove(skill, game, game.turn())[1];
	  }
	  // Make the calculated move
	  game.move(move);
	  // Update board positions
	  board.position(game.fen());
	}

	// Computer vs Computer
	var playGame = function(algo=4, skillW=2, skillB=2) {
	  if (game.game_over() === true) {
		//console.log('game over');
		return;
	  }
	  var skill = game.turn() === 'w' ? skillW : skillB;
	  makeMove(algo, skill);
	  window.setTimeout(function() {
		playGame(algo, skillW, skillB);
	  }, 250);
	};

	// Handles what to do after human makes move.
	// Computer automatically makes next move
	var onDrop = function(source, target) {
	  // see if the move is legal
	  var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	  });

	  // If illegal move, snapback
	  if (move === null) return 'snapback';

	  // Log the move
	  //console.log(move)

	  // make move for black
	  window.setTimeout(function() {
		makeMove(4, MinMaxDepth);
	  }, 200);
	};

	var board,
		game = new Chess();

	// Actions after any move
	var onMoveEnd = function(oldPos, newPos) {
	  // Alert if game is over
	  if (game.game_over() === true) {
		//alert('Game Over');
		//console.log('Game Over');
	  }

	  // Log the current game position
	  //console.log(game.fen());
	};

	// Check before pick pieces that it is white and game is not over
	var onDragStart = function(source, piece, position, orientation) {
	  if (game.game_over() === true || piece.search(/^b/) !== -1) {
		return false;
	  }
	};

	// Update the board position after the piece snap
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
	  board.position(game.fen());
	};

	// Creates the board div
	if (document.getElementById("DivChessBoard") == null) {
		var div = document.createElement("div");
		div.setAttribute("ID", "DivChessBoard");
		div.className = "HideOnDisconnect";
		div.style.width = "600px";
		div.style.height = "600px";
		document.body.appendChild(div);
	}

	// Configure the board
	var cfg = {
	  draggable: true,
	  position: 'start',
	  // Handlers for user actions
	  onMoveEnd: onMoveEnd,
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onSnapEnd: onSnapEnd
	}
	board = ChessBoard('DivChessBoard', cfg);

	// Resets the board and shows it
	board.clear();
	board.start();
	game.reset();
	MiniGameChessResize();
	MiniGameChessBoard = board;
	MiniGameChessGame = game;

}

// Resizes the chess board to fit the screen
function MiniGameChessResize() {

	// Gets the chess board
	let TileSize = (MainCanvas.height / 8).toString() + "px";
	let FullSize = MainCanvas.height.toString() + "px";
	var div = document.getElementById("DivChessBoard");

	// If the board must be resized
	if (DivChessBoard.style.width != FullSize) {
		DivChessBoard.style.width = FullSize;
		DivChessBoard.style.height = FullSize;
		DivChessBoard.style.padding = "0";
		DivChessBoard.style.margin = "auto";
		DivChessBoard.style.outline = "none";
		DivChessBoard.style.display = "block";
		DivChessBoard.style.top = "0";
		DivChessBoard.style.bottom = "0";
		DivChessBoard.style.left = "0";
		DivChessBoard.style.right = "0";
		DivChessBoard.style.position = "absolute";
		for (let L0 = 0; L0 < DivChessBoard.children.length; L0++) {
			DivChessBoard.children[L0].style.width = FullSize;
			for (let L1 = 0; L1 < DivChessBoard.children[L0].children.length; L1++) {
				DivChessBoard.children[L0].children[L1].style.width = FullSize;
				for (let L2 = 0; L2 < DivChessBoard.children[L0].children[L1].children.length; L2++) {
					DivChessBoard.children[L0].children[L1].children[L2].style.width = FullSize;
					DivChessBoard.children[L0].children[L1].children[L2].style.height = TileSize;
					for (let L3 = 0; L3 < DivChessBoard.children[L0].children[L1].children[L2].children.length; L3++) {
						DivChessBoard.children[L0].children[L1].children[L2].children[L3].style.width = TileSize;
						DivChessBoard.children[L0].children[L1].children[L2].children[L3].style.height = TileSize;
						for (let L4 = 0; L4 < DivChessBoard.children[L0].children[L1].children[L2].children[L3].children.length; L4++) {
							DivChessBoard.children[L0].children[L1].children[L2].children[L3].children[L4].style.width = TileSize;
							DivChessBoard.children[L0].children[L1].children[L2].children[L3].children[L4].style.height = TileSize;
						}
					}
				}
			}
		}
	}

}
/*

# Chess-AI by gautambajaj
* A simple Chess-AI built in JavaScript, supporting multiple difficulty levels for the bot.
* Used the open-source library [chessboard.js](http://chessboardjs.com/) for game UI

## How it Works
Each possible move by the AI is assigned a numerical score using an evaluation function obtained from [chess-wiki](https://chessprogramming.wikispaces.com/Simplified+evaluation+function). The evaluation function assigns a score to each chess piece based on the piece's type and position on the board. For example, a knight on the center of the board is better (because it has more options and is more active) than a knight on the edge of the board. 

With this evaluation function, we’re able to assign a numerical score to any given move. For each possible next move, a decision tree is then made and evaluated using the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax). A tree depth of 3 is easily achieved with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning). The AI finally decides to make a move that leads to the subtree with the highest possible evaluation.

## Try it out here: https://simple-chessai.herokuapp.com/

*/

var MiniGameChessBoard = null;
var MiniGameChessGame = null;

// Starts the chess engine with a dept level for difficulty
function MiniGameChessStart(Depth) {
	
	var minimaxDepth = Depth;

	var board,
	  game = new Chess();

	var removeGreySquares = function() {
		$('#board .square-55d63').css('background', '');
	};


	var greySquare = function(square) {
	  var squareEl = $('#board .square-' + square);
	  
	  var background = '#a9a9a9';
	  if (squareEl.hasClass('black-3c85d') === true) {
	    background = '#696969';
	  }

	  squareEl.css('background', background);
	};


	// do not pick up pieces if the game is over
	// only pick up pieces for White
	var onDragStart = function(source, piece, position, orientation) {
	  if (game.in_checkmate() === true || game.in_draw() === true || game.game_over() === true ) {
	  	//$('#gameover').show();
	  	//$("#gameover").html('Game over!');
	    return false;
	  }
	};


	// uses the minimax algorithm with alpha beta pruning to caculate the best move
	var calculateBestMove = function() {

	    var possibleNextMoves = game.moves();
	    var bestMove = -9999;
	    var bestMoveFound;

	    for(var i = 0; i < possibleNextMoves.length; i++) {
	        var possibleNextMove = possibleNextMoves[i]
	        game.move(possibleNextMove);
	        var value = minimax(minimaxDepth, -10000, 10000, false);
	        game.undo();
	        if(value >= bestMove) {
	            bestMove = value;
	            bestMoveFound = possibleNextMove;
	        }
	    }
	    return bestMoveFound;
	};


	// minimax with alhpha-beta pruning and search depth d = 3 levels
	var minimax = function (depth, alpha, beta, isMaximisingPlayer) {
	    if (depth === 0) {
	        return -evaluateBoard(game.board());
	    }

	    var possibleNextMoves = game.moves();
	    var numPossibleMoves = possibleNextMoves.length

	    if (isMaximisingPlayer) {
	        var bestMove = -9999;
	        for (var i = 0; i < numPossibleMoves; i++) {
	            game.move(possibleNextMoves[i]);
	            bestMove = Math.max(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
	            game.undo();
	            alpha = Math.max(alpha, bestMove);
	            if(beta <= alpha){
	            	return bestMove;
	            }
	        }

	    } else {
	        var bestMove = 9999;
	        for (var i = 0; i < numPossibleMoves; i++) {
	            game.move(possibleNextMoves[i]);
	            bestMove = Math.min(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
	            game.undo();
	            beta = Math.min(beta, bestMove);
	            if(beta <= alpha){
	            	return bestMove;
	            }
	        }
	    }

		return bestMove;
	};


	// the evaluation function for minimax
	var evaluateBoard = function (board) {
	    var totalEvaluation = 0;
	    for (var i = 0; i < 8; i++) {
	        for (var j = 0; j < 8; j++) {
	            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
	        }
	    }
	    return totalEvaluation;
	};


	var reverseArray = function(array) {
    	return array.slice().reverse();
	};

	var whitePawnEval =
	    [
	        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
	        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
	        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
	        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
	        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
	        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
	        [0.5,  1.0,  1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
	        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
	    ];

	var blackPawnEval = reverseArray(whitePawnEval);

	var knightEval =
	    [
	        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
	        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
	        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
	        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
	        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
	        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
	        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
	        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
	    ];

	var whiteBishopEval = [
	    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
	    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
	    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
	    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
	    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
	    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
	    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
	    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
	];

	var blackBishopEval = reverseArray(whiteBishopEval);

	var whiteRookEval = [
	    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
	    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
	    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
	    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
	    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
	    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
	    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
	    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
	];

	var blackRookEval = reverseArray(whiteRookEval);

	var evalQueen = [
	    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
	    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
	    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
	    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
	    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
	    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
	    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
	    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
	];

	var whiteKingEval = [

	    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
	    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
	    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
	    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
	];

	var blackKingEval = reverseArray(whiteKingEval);


	var getPieceValue = function (piece, x, y) {
	    if (piece === null) {
	        return 0;
	    }

	    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);

	    if(piece.color === 'w'){
	    	return absoluteValue;
	    } else {
	    	return -absoluteValue;
	    }
	};


	var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? whitePawnEval[y][x] : blackPawnEval[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? whiteRookEval[y][x] : blackRookEval[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? whiteBishopEval[y][x] : blackBishopEval[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? whiteKingEval[y][x] : blackKingEval[y][x] );
        }
	};


	var makeAImove = function () {
	    var bestMove = calculateBestMove();
	    game.move(bestMove);
	    board.position(game.fen());
	};


	var onDrop = function(source, target) {
  	  removeGreySquares();

	  // see if the move is legal
	  var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' 
	  });

	  // illegal move
	  if (move === null) return 'snapback';

	  // make legal move for black AI player
	  window.setTimeout(makeAImove, 250);
	};


	var onMouseoverSquare = function(square, piece) {
	  // get list of possible moves for this square
	  var moves = game.moves({
	    square: square,
	    verbose: true
	  });

	  // exit if there are no moves available for this square
	  if (moves.length === 0) return;

	  // highlight the square they moused over
	  greySquare(square);

	  // highlight the possible squares for this piece
	  for (var i = 0; i < moves.length; i++) {
	    greySquare(moves[i].to);
	  }
	};


	var onMouseoutSquare = function(square, piece) {
	  removeGreySquares();
	};


	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
	  board.position(game.fen());
	};
	
	if (document.getElementById("DivChessBoard") == null) {
		var div = document.createElement("div");
		div.setAttribute("ID", "DivChessBoard");
		div.style.width = "600px";
		div.style.height = "600px";
		document.body.appendChild(div);
	}
	
	var cfg = {
	  draggable: true,
	  position: 'start',
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onMouseoutSquare: onMouseoutSquare,
  	  onMouseoverSquare: onMouseoverSquare,
	  onSnapEnd: onSnapEnd
	};
	board = ChessBoard('DivChessBoard', cfg);
	
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
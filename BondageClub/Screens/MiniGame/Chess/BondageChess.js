"use strict";
var ChessBackground = "CollegeClassDark";
var ChessCharacterLeft = null;
var ChessCharacterRight = null;
var ChessEndStatus = "";
var ChessMinorPieceWhite = 8;
var ChessMajorPieceWhite = 8;
var ChessMinorPieceBlack = 8;
var ChessMajorPieceBlack = 8;

/**
 * Loads the chess mini game and sets the difficulty ratio before serving the first ball
 * @returns {void} - Nothing
 */
function ChessLoad() {
	ChessMinorPieceWhite = 8;
	ChessMajorPieceWhite = 8;
	ChessMinorPieceBlack = 8;
	ChessMajorPieceBlack = 8;
	MiniGameChessStart(MiniGameDifficulty);
}

/**
 * Runs the chess mini game and draws its components on screen
 * @returns {void} - Nothing
 */
function ChessRun() {

	// Resize the board if needed
	MiniGameChessResize();

	// Applies restraints or strip if there are special rules
	CollegeChessGameProgress();

	// Draw the characters
	DrawCharacter(ChessCharacterLeft, 0, 0, 1);
	DrawCharacter(ChessCharacterRight, 1500, 0, 1);

	// The game can end in many ways
	MiniGameEnded = (MiniGameChessGame.in_checkmate() || MiniGameChessGame.in_stalemate() || MiniGameChessGame.in_threefold_repetition() || MiniGameChessGame.in_draw());
	if (MiniGameEnded) DrawText(TextGet("ClickEnd"), 250, 30, "#ff4040", "white");
	else DrawButton(125, 800, 250, 60, TextGet("Concede"), "White", "", "");

	// Define the text that goes under the player
	let TextLeft = ChessCharacterLeft.Name;
	let TextRight = ChessCharacterRight.Name;
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "b")) { TextLeft = TextGet("Victory"); TextRight = TextGet("Checkmate"); }
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "w")) { TextLeft = TextGet("Checkmate"); TextRight = TextGet("Victory"); }
	if (MiniGameChessGame.in_stalemate()) { TextLeft = TextGet("Stalemate"); TextRight = TextGet("Stalemate"); }
	if (MiniGameChessGame.in_threefold_repetition()) { TextLeft = TextGet("ThreefoldRepetition"); TextRight = TextGet("ThreefoldRepetition"); }
	if (MiniGameChessGame.in_draw()) { TextLeft = TextGet("Draw"); TextRight = TextGet("Draw"); }
	DrawText(TextLeft, 250, 970, "white", "silver");
	DrawText(TextRight, 1750, 970, "white", "silver");

}

/**
 * Handles clicks during the chess mini game
 * @returns {void} - Nothing
 */
function ChessClick() {

	// The player can concede the game and ends it right away
	if (!MiniGameEnded && MouseIn(125, 800, 250, 60)) {
		ChessEndStatus = "Defeat";
		ElementRemove("DivChessBoard");
		CollegeChessGameConcede();
		CommonDynamicFunction(MiniGameReturnFunction + "()");
	}

	// When the game ended, the player can click on herself to go back
	if (MiniGameEnded && MouseIn(0, 0, 500, 1000)) {
		ChessEndStatus = "Draw";
		if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "b")) ChessEndStatus = "Victory";
		if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "w")) ChessEndStatus = "Defeat";
		ElementRemove("DivChessBoard");
		CommonDynamicFunction(MiniGameReturnFunction + "()");
	}

}
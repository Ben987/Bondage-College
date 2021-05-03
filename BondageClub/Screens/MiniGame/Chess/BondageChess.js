"use strict";
var ChessBackground = "CollegeClass";
var ChessCharacterWhite = null;
var ChessCharacterBlack = null;
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
	CurrentDarkFactor = 0.5;
	ChessMinorPieceWhite = 8;
	ChessMajorPieceWhite = 8;
	ChessMinorPieceBlack = 8;
	ChessMajorPieceBlack = 8;
	MiniGameChessStart(MiniGameDifficulty, ChessPlayerColor());
}

/**
 * Runs the chess mini game and draws its components on screen
 * @returns {void} - Nothing
 */
function ChessRun() {

	// Draw the characters
	DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CollegeChessOpponent, 1500, 0, 1);

	// The game can end in many ways
	MiniGameEnded = (MiniGameChessGame.in_checkmate() || MiniGameChessGame.in_stalemate() || MiniGameChessGame.in_threefold_repetition() || MiniGameChessGame.in_draw());
	if (MiniGameEnded) DrawText(TextGet("ClickEnd"), 250, 30, "#ff4040", "white");
	else DrawButton(125, 800, 250, 60, TextGet("Concede"), "White", "", "");

	// Define the text that goes under the player
	let TextLeft = Player.Name;
	let TextRight = CollegeChessOpponent.Name;
	if (MiniGameChessGame.in_checkmate() && MiniGameChessGame.turn() !== ChessPlayerColor()) { TextLeft = TextGet("Victory"); TextRight = TextGet("Checkmate"); }
	else if (MiniGameChessGame.in_checkmate() && MiniGameChessGame.turn() === ChessPlayerColor()) { TextLeft = TextGet("Checkmate"); TextRight = TextGet("Victory"); }
	else if (MiniGameChessGame.in_stalemate()) { TextLeft = TextGet("Stalemate"); TextRight = TextGet("Stalemate"); }
	else if (MiniGameChessGame.in_threefold_repetition()) { TextLeft = TextGet("ThreefoldRepetition"); TextRight = TextGet("ThreefoldRepetition"); }
	else if (MiniGameChessGame.in_draw()) { TextLeft = TextGet("Draw"); TextRight = TextGet("Draw"); }
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
		if (MiniGameChessGame.in_checkmate()) ChessEndStatus = MiniGameChessGame.turn() === ChessPlayerColor() ? "Defeat" : "Victory";
		ElementRemove("DivChessBoard");
		CommonDynamicFunction(MiniGameReturnFunction + "()");
	}

}

/**
 * Returns a single letter character indicating which color pieces the player is controlling
 * @returns {"w" | "b"} - "w" for white or "b" for black
 */
function ChessPlayerColor() {
	return ChessCharacterWhite.ID === 0 ? "w" : "b";
}

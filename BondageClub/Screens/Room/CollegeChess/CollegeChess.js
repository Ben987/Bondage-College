"use strict";
var CollegeChessBackground = "CollegeClass";
var CollegeChessOpponent = null;
var CollegeChessDifficulty = 0;
var CollegeChessBet = "";

/**
 * Loads the college chest screen by generating the opponent.
 * @returns {void} - Nothing
 */
function CollegeChessLoad() {
	if (CollegeChessOpponent == null) {
		CollegeChessOpponent = CharacterLoadNPC("NPC_CollegeChess_Opponent");
		CollegeChessOpponent.AllowItem = false;
		CollegeEntranceWearStudentClothes(CollegeChessOpponent);
	}
}

/**
 * Runs and draws the college chess screen.  Shows the player and the opponent.
 * @returns {void} - Nothing
 */
function CollegeChessRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CollegeChessOpponent, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles clicks in the college chess court screen
 * @returns {void} - Nothing
 */
function CollegeChessClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(CollegeChessOpponent);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Starts the chess mini game on the given difficulty.
 * @param {number} Difficulty - Difficulty factor of the minigame, changes the depth of the chess script
 * @param {string} Bet - The type of bet that will go on the game
 * @returns {void} - Nothing
 */
function CollegeChessGameStart(Difficulty, Bet) {
	CollegeChessDifficulty = parseInt(Difficulty);
	CollegeChessBet = Bet;
	if (Bet == "Money") CharacterChangeMoney(Player, (CollegeChessDifficulty + 1) * -10);
	//MiniGameStart("Chess", Difficulty, "CollegeChessGameEnd");
}

/**
 * Triggered when the chess game ends.
 * @returns {void} - Nothing
 */
function CollegeChessGameEnd() {
	CommonSetScreen("Room", "CollegeChess");
	CharacterSetCurrent(CollegeChessOpponent);
}
"use strict";
var CollegeChessBackground = "CollegeClass";
var CollegeChessOpponent = null;
var CollegeChessDifficulty = 0;
var CollegeChessBet = "";
var CollegeChessPlayerAppearance = null;
var CollegeChessOpponentAppearance = null;

// Quick functions for player interactions with the chess opponent
function CollegeChessCanStripPlayer() { return !CharacterIsNaked(Player) }
function CollegeChessCanStripOpponent() { return !CharacterIsNaked(CollegeChessOpponent) }
function CollegeChessCanMakeLove() { return (CharacterIsNaked(Player) && CharacterIsNaked(CollegeChessOpponent) && !Player.IsChaste()) }

/**
 * Loads the college chest screen by generating the opponent.
 * @returns {void} - Nothing
 */
function CollegeChessLoad() {
	if (CollegeChessOpponent == null) {
		CollegeChessOpponent = CharacterLoadNPC("NPC_CollegeChess_Opponent");
		CollegeChessOpponent.AllowItem = false;
		CollegeEntranceWearStudentClothes(CollegeChessOpponent);
		CollegeChessOpponentAppearance = CollegeChessOpponent.Appearance.slice(0);
	}
	if (CollegeChessPlayerAppearance == null) CollegeChessPlayerAppearance = Player.Appearance.slice(0);
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
	if (Bet == "Money") CharacterChangeMoney(Player, CollegeChessDifficulty * -10);
	ChessCharacterLeft = Player;
	ChessCharacterRight = CollegeChessOpponent;
	MiniGameStart("Chess", CollegeChessDifficulty, "CollegeChessGameEnd");
}

/**
 * In strip or bondage chess, a player can lose one piece of cloth
 * @returns {void} - Nothing, the returns are quick exit short cuts
 */
function CollegeChessStrip(C) {
	if (InventoryGet(C, "Shoes") != null) return InventoryRemove(C, "Shoes");
	if (InventoryGet(C, "Socks") != null) return InventoryRemove(C, "Socks");
	if (InventoryGet(C, "Cloth") != null) return InventoryRemove(C, "Cloth");
	if (InventoryGet(C, "Bra") != null) return InventoryRemove(C, "Bra");
	if (InventoryGet(C, "Panties") != null) return InventoryRemove(C, "Panties");
}

/**
 * In bondage chess, a player can get restrained progressively
 * @returns {void} - Nothing, the returns are quick exit short cuts
 */
function CollegeChessRestrain(C) {
	if ((InventoryGet(C, "ItemLegs") == null) && !InventoryGroupIsBlocked(C, "ItemLegs")) return InventoryWearRandom(C, "ItemLegs");
	if ((InventoryGet(C, "ItemFeet") == null) && !InventoryGroupIsBlocked(C, "ItemFeet")) return InventoryWearRandom(C, "ItemFeet");
	if ((InventoryGet(C, "ItemNeck") == null) && !InventoryGroupIsBlocked(C, "ItemNeck")) return InventoryWearRandom(C, "ItemNeck");
	if (InventoryGet(C, "Cloth") != null) return;
	if ((InventoryGet(C, "ItemTorso") == null) && !InventoryGroupIsBlocked(C, "ItemTorso")) return InventoryWearRandom(C, "ItemTorso");
	if ((InventoryGet(C, "ItemBreast") == null) && !InventoryGroupIsBlocked(C, "ItemBreast")) return InventoryWearRandom(C, "ItemBreast");
	if ((InventoryGet(C, "ItemPelvis") == null) && !InventoryGroupIsBlocked(C, "ItemPelvis")) return InventoryWearRandom(C, "ItemPelvis");
}

/**
 * Called from the chess game to see if we must apply changes (strip or restrain) any opponent
 * @returns {void} - Nothing
 */
function CollegeChessGameProgress() {
	if ((CollegeChessBet != "Strip") && (CollegeChessBet != "Bondage")) return;
	if (MiniGameEnded || (MiniGameChessGame.board() == null)) return;
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "b") && (CollegeChessBet == "Strip")) return CharacterNaked(ChessCharacterRight);
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "w") && (CollegeChessBet == "Strip")) return CharacterNaked(ChessCharacterLeft);
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "b") && (CollegeChessBet == "Bondage")) return InventoryWearRandom(ChessCharacterRight, "ItemArms", 5);
	if (MiniGameChessGame.in_checkmate() && (MiniGameChessGame.turn() == "w") && (CollegeChessBet == "Bondage")) return InventoryWearRandom(ChessCharacterLeft, "ItemArms", 5);
	let MinorWhite = 0;
	let MajorWhite = 0;
	let MinorBlack = 0;
	let MajorBlack = 0;
	let Board = MiniGameChessGame.board();
	for (let X = 0; X < Board.length; X++)
		for (let Y = 0; Y < Board[X].length; Y++)
			if (Board[X][Y] != null) {
				if ((Board[X][Y].color == "b") && (Board[X][Y].type == "p")) MinorWhite++;
				if ((Board[X][Y].color == "b") && (Board[X][Y].type != "p")) MajorWhite++;
				if ((Board[X][Y].color == "w") && (Board[X][Y].type == "p")) MinorBlack++;
				if ((Board[X][Y].color == "w") && (Board[X][Y].type != "p")) MajorBlack++;
			}
	if ((ChessMinorPieceWhite > MinorWhite) && (CollegeChessBet == "Bondage")) CollegeChessStrip(ChessCharacterRight);
	if ((ChessMinorPieceBlack > MinorBlack) && (CollegeChessBet == "Bondage")) CollegeChessStrip(ChessCharacterLeft);
	if ((ChessMajorPieceWhite > MajorWhite) && (CollegeChessBet == "Strip")) CollegeChessStrip(ChessCharacterRight);
	if ((ChessMajorPieceBlack > MajorBlack) && (CollegeChessBet == "Strip")) CollegeChessStrip(ChessCharacterLeft);
	if ((ChessMajorPieceWhite > MajorWhite) && (CollegeChessBet == "Bondage")) CollegeChessRestrain(ChessCharacterRight);
	if ((ChessMajorPieceBlack > MajorBlack) && (CollegeChessBet == "Bondage")) CollegeChessRestrain(ChessCharacterLeft);
	ChessMinorPieceWhite = MinorWhite;
	ChessMajorPieceWhite = MajorWhite;
	ChessMinorPieceBlack = MinorBlack;
	ChessMajorPieceBlack = MajorBlack;
}

/**
 * Called from the chess game when the player concedes, the AI never concedes
 * @returns {void} - Nothing
 */
function CollegeChessGameConcede() {
	if (CollegeChessBet == "Strip") CharacterNaked(Player);
	if (CollegeChessBet == "Bondage") InventoryWearRandom(Player, "ItemArms", 5);
}

/**
 * Triggered when the chess game ends.
 * @returns {void} - Nothing
 */
function CollegeChessGameEnd() {
	CommonSetScreen("Room", "CollegeChess");
	if ((CollegeChessBet == "Money") && (ChessEndStatus == "Draw")) CharacterChangeMoney(Player, CollegeChessDifficulty * 10);
	if ((CollegeChessBet == "Money") && (ChessEndStatus == "Victory")) CharacterChangeMoney(Player, CollegeChessDifficulty * 20);
	if (((CollegeChessBet == "Bondage") || (CollegeChessBet == "Strip")) && (ChessEndStatus == "Draw")) CollegeChessRestoreAppearance();
	CollegeChessOpponent.Stage = "Result" + ChessEndStatus + CollegeChessBet;
	CollegeChessOpponent.CurrentDialog = DialogFind(CollegeChessOpponent, "Intro" + ChessEndStatus + CollegeChessBet);
	CharacterSetCurrent(CollegeChessOpponent);
}

/**
 * When both the player and the opponent should dress back up, we restore the backup appearance
 * @returns {void} - Nothing
 */
function CollegeChessRestoreAppearance() {
	CollegeChessOpponent.Appearance = CollegeChessOpponentAppearance.slice(0);
	CharacterRefresh(CollegeChessOpponent);
	Player.Appearance = CollegeChessPlayerAppearance.slice(0);
	CharacterRefresh(Player, true);
	CollegeChessOpponent.AllowItem = false;
}

/**
 * A few activities can trigger a medium blush for the opponent
 * @returns {void} - Nothing
 */
function CollegeChessOpponentBlush() {
	CharacterSetFacialExpression(CollegeChessOpponent, "Blush", "Medium", 10);
}

/**
 * The player can be restrained by the opponent after losing a bondage chess game
 * @returns {void} - Nothing
 */
function CollegeChessPlayerFullBondage() {
	CharacterRelease(CollegeChessOpponent);
	CharacterRelease(Player);
	CharacterNaked(Player);
	CharacterFullRandomRestrain(Player, "ALL");
	InventoryWearRandom(Player, "ItemTorso");
	InventoryRemove(Player, "ItemHead");
	InventoryWearRandom(Player, "ItemMouth");
}

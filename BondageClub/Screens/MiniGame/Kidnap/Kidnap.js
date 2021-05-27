"use strict";
var KidnapVictory = false;
var KidnapDifficulty = 0;
var KidnapBackground = "KidnapLeague";
var KidnapReturnFunction = "";
var KidnapOpponent = null;
var KidnapPlayerCloth = null;
var KidnapPlayerClothAccessory = null;
var KidnapPlayerClothLower = null;
var KidnapOpponentCloth = null;
var KidnapOpponentClothAccessory = null;
var KidnapOpponentClothLower = null;
var KidnapTimer = 0;
var KidnapMode = "";
var KidnapDialog = "";
var KidnapPlayerMove = "";
var KidnapOpponentMove = "";
var KidnapResultPlayer = "test";
var KidnapResultOpponent = "test";
var KidnapResultUpperHand = "";
var KidnapUpperHandVictim = null;
var KidnapUpperHandSelection = 0;
var KidnapMoveType = ["BruteForce", "Domination", "Sneakiness", "Meditation"];
var KidnapUpperHandMoveType = ["Cloth", "ItemMouth", "ItemFeet", "UndoCloth", "UndoItemMouth", "UndoItemFeet", "Mercy"];
var KidnapMoveMap = [
	[1, 2, 0, 2], // BruteForce
	[0, 1, 2, 2], // Domination
	[2, 0, 1, 2], // Sneakiness
	[0, 0, 0, 0] // Meditation
];

/**
 * Generates the kidnap stats for the given character, factoring in any bonus it might have.
 * @param {Character} C - The character for which to generate the stats for.
 * @param {number} Bonus - The possible stat bonus a character has
 * @returns {void} - Nothing
 */
function KidnapLoadStats(C, Bonus) {
	let Pandora = (KidnapReturnFunction.indexOf("Pandora") == 0);
	if (C.ID == 0)
		C.KidnapStat = [6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[0]) + ((Pandora && InfiltrationPerksActive("Strength")) ? 2 : 0),
						6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[1]) + ((Pandora && InfiltrationPerksActive("Charisma")) ? 2 : 0),
						6 + CharacterGetBonus(C, "Kidnap" + KidnapMoveType[2]) + ((Pandora && InfiltrationPerksActive("Agility")) ? 2 : 0),
						-1];
	else
		C.KidnapStat = [6 + Bonus, 6 + Bonus, 6 + Bonus, -1];
}

/**
 * Builds the inventory items that are available when kidnapping
 * @returns {void} - Nothing
 */
function KidnapInventoryBuild() {

	// Loop in the player inventory for that group for items that can be worn, is enable and is allowed for random events
	DialogInventory = [];
	if (KidnapOpponent.FocusGroup != null)
		for (let A = 0; A < Player.Inventory.length; A++)
			if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == KidnapOpponent.FocusGroup.Name) && Player.Inventory[A].Asset.Enable && Player.Inventory[A].Asset.Wear && Player.Inventory[A].Asset.Random)
				DialogInventoryAdd(KidnapOpponent, Player.Inventory[A], false, DialogSortOrderEnabled);
	DialogInventorySort();

}

/**
 * Sets the current battle status and its related timer
 * @param {string} NewMode - New mode for the battle
 * @returns {void} - Nothing
 */
function KidnapSetMode(NewMode) {

	// Removes the focus group if not selecting an item
	if (NewMode != "SelectItem") KidnapOpponent.FocusGroup = null;

	// If we must enter in Upper Hand mode
	if (KidnapMode == "UpperHand") KidnapUpperHandVictim = null;
	if ((NewMode == "SelectMove") && (KidnapUpperHandVictim != null)) NewMode = "UpperHand";
	if ((NewMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0)) KidnapAIMoveUpperHand();

	// If we must enter the sudden death mode
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0) && (KidnapOpponent.KidnapWillpower <= 0)) {
		Player.KidnapWillpower = 1;
		KidnapOpponent.KidnapWillpower = 1;
		NewMode = "SuddenDeath";
	}

	// If we must end the mini game in defeat
	if ((NewMode == "SelectMove") && (Player.KidnapWillpower <= 0)) {
		InventoryWearRandom(Player, "ItemArms", KidnapDifficulty);
		NewMode = "End";
	}

	// If we must end the mini game in victory, one last item can be equipped
	if ((NewMode == "SelectMove") && (KidnapOpponent.KidnapWillpower <= 0)) {
		if (!KidnapVictory) {
			for (let A = 0; A < AssetGroup.length; A++)
				if (AssetGroup[A].Name == "ItemArms") {
					KidnapOpponent.FocusGroup = AssetGroup[A];
					KidnapInventoryBuild();
					break;
				}
			NewMode = (KidnapOpponent.FocusGroup != null) ? "SelectItem" : "End";
			KidnapVictory = true;
		} else NewMode = "End";
	}

	// Sets the mode and timer
	KidnapMode = NewMode;
	if ((NewMode == "Intro") || (NewMode == "SuddenDeath") || (NewMode == "End")) KidnapTimer = CommonTime() + 5000;
	else KidnapTimer = CommonTime() + 15000;

}

/**
 * Generates a move value for the NPC based on the best possible options
 * @returns {number} - Returns the move type
 */
function KidnapAIMove() {

	// Builds an array of each potential damage that can be done with a move, to rate that move, there's always at least a small odd
	let MoveOdds = [10, 10, 10, 0];
	for (let OppMove = 0; OppMove <= 2; OppMove++) {
		for (let PlaMove = 0; PlaMove <= 2; PlaMove++) {
			let PlaEff = Math.round(Player.KidnapStat[PlaMove] / (KidnapMoveEffective(Player, PlaMove) ? 1 : 2));
			let OppEff = Math.round(KidnapOpponent.KidnapStat[OppMove] / (KidnapMoveEffective(KidnapOpponent, OppMove) ? 1 : 2));
			if (KidnapMoveMap[OppMove][PlaMove] == 0) MoveOdds[OppMove] = MoveOdds[OppMove] - PlaEff;
			if (KidnapMoveMap[OppMove][PlaMove] == 1) MoveOdds[OppMove] = MoveOdds[OppMove] + OppEff - PlaEff;
			if (KidnapMoveMap[OppMove][PlaMove] == 2) MoveOdds[OppMove] = MoveOdds[OppMove] + OppEff;
		}
		if (MoveOdds[OppMove] <= 0) MoveOdds[OppMove] = 1;
	}

	// Meditation can start to happen when total of moves are 12 or less
	MoveOdds[3] = (13 - KidnapOpponent.KidnapStat[0] - KidnapOpponent.KidnapStat[1] - KidnapOpponent.KidnapStat[2]) * 4;
	if (MoveOdds[3] < 0) MoveOdds[3] = 0;

	// Rolls a random result between all moves and returns it
	let Result = Math.floor(Math.random() * (MoveOdds[0] + MoveOdds[1] + MoveOdds[2] + MoveOdds[3]));
	if (Result < MoveOdds[0]) return 0;
	if (Result < MoveOdds[0] + MoveOdds[1]) return 1;
	if (Result < MoveOdds[0] + MoveOdds[1] + MoveOdds[2]) return 2;
	return 3;

}

/**
 * Validates or checks if a given upper hand move type is available.
 * @param {number} MoveType - The type of move to check for or perform
 * @param {boolean} DoMove - Whether or not the move is being performed
 * @returns {boolean} - Returns TRUE if the upper hand move type is available
 */
function KidnapUpperHandMoveAvailable(MoveType, DoMove) {

	// Mercy is always available
	let MoveName = KidnapUpperHandMoveType[MoveType];
	if (MoveName == "Mercy") return true;

	// If we need to check to strip the opponent
	if ((MoveName == "Cloth") && (InventoryGet(KidnapUpperHandVictim, "Cloth") != null)) {
		if (DoMove) {
			InventoryRemove(KidnapUpperHandVictim, "Cloth");
			InventoryRemove(KidnapUpperHandVictim, "ClothLower");
			InventoryRemove(KidnapUpperHandVictim, "ClothAccessory");
		}
		return true;
	}

	// If we need to check to apply a restrain
	if (((MoveName == "ItemFeet") || (MoveName == "ItemMouth")) && (InventoryGet(KidnapUpperHandVictim, MoveName) == null)) {
		if (DoMove) InventoryWearRandom(KidnapUpperHandVictim, MoveName, (KidnapUpperHandVictim.ID == 0) ? KidnapDifficulty : 0);
		return true;
	}

	// If we need to check to dress back
	let C = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponent : Player;
	let Cloth = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentCloth : KidnapPlayerCloth;
	let ClothAccessory = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothAccessory : KidnapPlayerClothAccessory;
	let ClothLower = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothLower : KidnapPlayerClothLower;
	if ((MoveName == "UndoCloth") && (InventoryGet(C, "Cloth") == null) && (Cloth != null)) {
		if (DoMove) InventoryWear(C, Cloth.Asset.Name, "Cloth", Cloth.Color);
		if (DoMove && (ClothAccessory != null)) InventoryWear(C, ClothAccessory.Asset.Name, "ClothAccessory", ClothAccessory.Color);
		if (DoMove && (ClothLower != null)) InventoryWear(C, ClothLower.Asset.Name, "ClothLower", ClothLower.Color);
		return true;
	}

	// If we need to check to remove the restrain
	if ((MoveName == "UndoItemFeet") || (MoveName == "UndoItemMouth")) {
		let I = InventoryGet(C, MoveName.replace("Undo", ""));
		if ((I != null) && ((C.ID != 0) || !InventoryItemHasEffect(I, "Lock", true))) {
			if (DoMove) InventoryRemove(C, MoveName.replace("Undo", ""));
			return true;
		}
	}

	// Invalid move
	return false;

}

/**
 * Sets a random upper hand move for the NPC to use
 * @returns {void} - Nothing
 */
function KidnapAIMoveUpperHand() {
	var Try = 0;
	var MoveDone = false;
	while ((Try < 100) && (MoveDone == false)) {
		KidnapUpperHandSelection = Math.floor(Math.random() * (KidnapUpperHandMoveType.length - 1));
		MoveDone = KidnapUpperHandMoveAvailable(KidnapUpperHandSelection, true);
		Try++;
	}
	if (MoveDone == false) KidnapUpperHandSelection = KidnapUpperHandMoveType.indexOf("Mercy");
}

/**
 * Draws the move text (left side) and the effect (right side)
 * @returns {void} - Nothing
 */
function KidnapShowMove() {
	DrawTextWrap(TextGet(KidnapDialog + "Action"), 10, 150, 580, 200, "white");
	DrawTextWrap(Player.Name + ": " + SpeechGarble(Player, TextGet(KidnapDialog + "Player")), 10, 350, 580, 200, "white");
	DrawTextWrap(KidnapOpponent.Name + ": " + SpeechGarble(KidnapOpponent, TextGet(KidnapDialog + "Opponent")), 10, 550, 580, 200, "white");
	DrawTextWrap(KidnapResultPlayer, 1410, 150, 580, 200, "white");
	DrawTextWrap(KidnapResultOpponent, 1410, 350, 580, 200, "white");
	DrawTextWrap(KidnapResultUpperHand, 1410, 550, 580, 200, "white");
	DrawText(TextGet(KidnapMoveType[KidnapPlayerMove]), 750, 25, "white", "gray");
	DrawText(TextGet(KidnapMoveType[KidnapOpponentMove]), 1250, 25, "white", "gray");
}

/**
 * Checks if a given move is effective against a given character
 * @param {Character} C - Character for which to check if the move is
 * @param {number} MoveType - Type of move to check for
 * @returns {boolean} - Returns TRUE if the move for that person is effective
 */
function KidnapMoveEffective(C, MoveType) {
	if ((KidnapUpperHandMoveType[MoveType] == "Cloth") && (InventoryGet(C, KidnapUpperHandMoveType[MoveType]) != null)) return true;
	if ((KidnapUpperHandMoveType[MoveType] != "Cloth") && (InventoryGet(C, KidnapUpperHandMoveType[MoveType]) == null)) return true;
	return false;
}

/**
 * Processes a selected move. Triggered when the player selects their move.
 * @param {number} PlayerMove - Type of the player move (Represented by the index of the character move array)
 * @returns {void} - Nothing
 */
function KidnapSelectMove(PlayerMove) {

	// Gets both moves effectiveness
	var OpponentMove = KidnapAIMove();
	var PM = KidnapMoveMap[PlayerMove][OpponentMove];
	var OM = KidnapMoveMap[OpponentMove][PlayerMove];
	KidnapDialog = "Player" + KidnapMoveType[PlayerMove] + "Opponent" + KidnapMoveType[OpponentMove];

	// Keep the move to show it later
	KidnapPlayerMove = PlayerMove;
	KidnapOpponentMove = OpponentMove;

	// If the move is effective, we lower the willpower and show it as text
	if (PM >= 1) {
		let Damage = parseInt(Player.KidnapStat[PlayerMove]);
		if (!KidnapMoveEffective(Player, PlayerMove)) Damage = Math.round(Damage / 2);
		if (PlayerMove == OpponentMove) Damage = Damage - parseInt(KidnapOpponent.KidnapStat[OpponentMove]);
		if (Damage < 0) Damage = 0;
		KidnapOpponent.KidnapWillpower = parseInt(KidnapOpponent.KidnapWillpower) - Damage;
		KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("NoLost");
	if (OM >= 1) {
		let Damage = parseInt(KidnapOpponent.KidnapStat[OpponentMove]);
		if (!KidnapMoveEffective(KidnapOpponent, OpponentMove)) Damage = Math.round(Damage / 2);
		if (PlayerMove == OpponentMove) Damage = Damage - parseInt(Player.KidnapStat[PlayerMove]);
		if (Damage < 0) Damage = 0;
		Player.KidnapWillpower = parseInt(Player.KidnapWillpower) - Damage;
		KidnapResultPlayer = Player.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultPlayer = Player.Name + " " + TextGet("NoLost");

	// Builds the "Upperhand" text
	KidnapResultUpperHand = "";
	KidnapUpperHandVictim = null;
	if ((PM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = KidnapOpponent; KidnapResultUpperHand = Player.Name + " " + TextGet("UpperHand"); }
	if ((OM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = Player; KidnapResultUpperHand = KidnapOpponent.Name + " " + TextGet("UpperHand"); }

	// If both players have 0 willpower, they go back to 1 in a sudden death
	if (Player.KidnapWillpower < 0) Player.KidnapWillpower = 0;
	if (KidnapOpponent.KidnapWillpower < 0) KidnapOpponent.KidnapWillpower = 0;

	// The move that was used is halved
	if (PlayerMove <= 2) Player.KidnapStat[PlayerMove] = Math.round(Player.KidnapStat[PlayerMove] / 2);
	if (OpponentMove <= 2) KidnapOpponent.KidnapStat[OpponentMove] = Math.round(KidnapOpponent.KidnapStat[OpponentMove] / 2);

	// When someone meditates, it resets her stats to max
	if (PlayerMove == 3) KidnapLoadStats(Player, 0);
	if (OpponentMove == 3) KidnapLoadStats(KidnapOpponent, Math.round(KidnapDifficulty / 2.5));

	// Shows the move dialog
	KidnapSetMode("ShowMove");

}

/**
 * Processes a selected upper handmove. Triggered when the player selects their upper hand move.
 * @param {number} PlayerMove - Type of the player upper hand move (Represented by the index of the character move array)
 * @returns {void} - Nothing
 */
function KidnapSelectMoveUpperHand(PlayerMove) {
	const MoveName = KidnapUpperHandMoveType[PlayerMove];

	// Stripping or undoing something is automatic
	if ((MoveName === "Cloth") || (MoveName === "UndoCloth") || (MoveName === "UndoItemFeet") || (MoveName === "UndoItemMouth"))
		if (KidnapUpperHandMoveAvailable(PlayerMove, true))
			KidnapSetMode("SelectMove");

	// Apply an item enters another mode with a focused group
	if ((MoveName === "ItemFeet") || (MoveName === "ItemMouth"))
		if (KidnapUpperHandMoveAvailable(PlayerMove, false))
			for (let A = 0; A < AssetGroup.length; A++)
				if (AssetGroup[A].Name === MoveName) {
					KidnapOpponent.FocusGroup = AssetGroup[A];
					KidnapInventoryBuild();
					KidnapSetMode("SelectItem");
					break;
				}

	// Mercy is always available
	if (MoveName === "Mercy") KidnapSetMode("SelectMove");
}

/**
 * Triggered when the player surrenders to her opponent
 * @returns {void} - Nothing
 */
function KidnapSurrender() {
	Player.KidnapWillpower = 0;
	KidnapSetMode("SelectMove");
}

/**
 * Starts a kidnap match
 * @param {Character} Opponent - The NPC that will be the opponent for the fight
 * @param {string} Background - The background for the fight, changes depending on which room the battle is happening
 * @param {number} Difficulty - Difficulty modifier for the fight, higher is harder
 * @param {string} ReturnFunction - The callback to execute through CommonDynamicFunction
 * @returns {void} - Nothing
 */
function KidnapStart(Opponent, Background, Difficulty, ReturnFunction) {
	KidnapDifficulty = (Difficulty == null) ? 0 : Difficulty;
	KidnapVictory = false;
	KidnapReturnFunction = ReturnFunction;
	KidnapPlayerCloth = InventoryGet(Player, "Cloth");
	KidnapPlayerClothAccessory = InventoryGet(Player, "ClothAccessory");
	KidnapPlayerClothLower = InventoryGet(Player, "ClothLower");
	KidnapOpponentCloth = InventoryGet(Opponent, "Cloth");
	KidnapOpponentClothAccessory = InventoryGet(Opponent, "ClothAccessory");
	KidnapOpponentClothLower = InventoryGet(Opponent, "ClothLower");
	KidnapOpponent = Opponent;
	KidnapBackground = Background;
	MiniGameCheatAvailable = (CheatFactor("MiniGameBonus", 0) == 0);
	CurrentCharacter = null;
	if (KidnapReturnFunction.indexOf("Pandora") == 0) {
		Player.KidnapMaxWillpower = PandoraMaxWillpower;
		Player.KidnapWillpower = PandoraWillpower;
	} else {
		Player.KidnapMaxWillpower = 20 + (SkillGetLevel(Player, "Willpower") * 2);
		Player.KidnapWillpower = Player.KidnapMaxWillpower;
	}
	KidnapOpponent.KidnapMaxWillpower = 20 + (KidnapDifficulty * 2);
	KidnapOpponent.KidnapWillpower = KidnapOpponent.KidnapMaxWillpower;
	KidnapLoadStats(Player, 0);
	KidnapLoadStats(KidnapOpponent, Math.round(KidnapDifficulty / 2.5));
	KidnapSetMode("Intro");
	CommonSetScreen("MiniGame", "Kidnap");
}

/**
 * Draws the given character move.
 * @param {Character} C - Character to draw the move for
 * @param {string} Header - Text to display
 * @param {number} X - Position of the text to draw on the X axis, normally the position of the character
 * @returns {void} - Nothing
 */
function KidnapDrawMove(C, Header, X) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	for (let M = 0; M < 4; M++)
		DrawButton(X - 200, (M * 100) + 100, 400, 70, TextGet(KidnapMoveType[M]) + ((C.KidnapStat[M] > 0) ? " ( " + C.KidnapStat[M].toString() + ((KidnapMoveEffective(C, M)) ? "" : " / 2") + " )" : ""), (C.ID == 0) ? (KidnapMoveEffective(C, M) ? "White" : "Silver") : "Pink");
	DrawButton(X - 200, 900, 400, 70, TextGet("Surrender"), (C.ID == 0) ? "White" : "Pink");
}

/**
 * Draws the upper hand moves
 * @returns {void} - Nothing
 */
function KidnapDrawMoveUpperHand() {
	var X = (KidnapUpperHandVictim.ID == 0) ? 1500 : 0;
	if (KidnapUpperHandVictim.ID == 0) DrawTextWrap(TextGet("UpperHand" + KidnapUpperHandMoveType[KidnapUpperHandSelection]), 10, 300, 580, 200, "White");
	DrawText(TextGet("UpperHandMove"), X + 250, 50, "white", "gray");
	for (let M = 0; M <= KidnapUpperHandMoveType.length - 1; M++)
		DrawButton(X + 50, (M * 100) + 100, 400, 70, TextGet(KidnapUpperHandMoveType[M]), (KidnapUpperHandVictim.ID != 0) ? ((KidnapUpperHandMoveAvailable(M, false)) ? "White" : "Pink") : ((KidnapUpperHandSelection == M) ? "Aquamarine" : "Pink"));
}

/**
 * Draws a large timer in the middle of the screen based on the kidnapping timer.
 * @returns {void} - Nothing
 */
function KidnapShowTimer() {
	if ((KidnapMode == "SelectItem") || (KidnapMode == "SelectMove") || (KidnapMode == "UpperHand") || (KidnapMode == "ShowMove")) {
		var Sec = Math.floor((KidnapTimer - CommonTime() + 1000) / 1000);
		MainCanvas.font = "italic 300 " + CommonGetFont(200);
		DrawText(Sec.toString(), (KidnapMode == "SelectItem") ? 500 : 1000, 500, (Sec <= 3) ? "red" : "white", "black");
		MainCanvas.font = CommonGetFont(36);
	}
}

/**
 * Draws a large title in the center of the screen.
 * @param {string} Title - Title to display on screen
 * @returns {void} - Nothing
 */
function KidnapTitle(Title) {
	MainCanvas.font = "italic 300 " + CommonGetFont(200);
	DrawText(Title, 1003, 503, "White");
	DrawText(Title, 997, 497, "Red");
	MainCanvas.font = CommonGetFont(36);
}

/**
 * Shows the items that can be used by the player.
 * @returns {void} - Nothing
 */
function KidnapShowItem() {

	// Draw the header
	DrawText(TextGet("SelectItemToUse"), 1375, 50, "white", "black");
	DrawButton(1750, 25, 225, 65, TextGet("Cancel"), "White");

	// For each items in the player inventory
	var X = 1000;
	var Y = 125;
	for (let I = 0; I < DialogInventory.length; I++) {
		const Item = DialogInventory[I];
		const Hover = MouseIn(X, Y, 225, 275) && !CommonIsMobile;
		const Background = Hover ? "cyan" : DialogInventory[I].Worn ? "pink" : "#fff";
		DrawAssetPreview(X, Y, Item.Asset, { Background });

		X = X + 250;
		if (X > 1800) {
			X = 1000;
			Y = Y + 300;
		}
	}

}

/**
 * Runs and draws the kidnapping minigame
 * @returns {void} - Nothing
 */
function KidnapRun() {

	// Draw the kidnap elements
	var X = 500;
	if (KidnapMode == "SelectItem") X = 0;
	DrawCharacter(Player, X, 0, 1);
	DrawCharacter(KidnapOpponent, X + 500, 0, 1);
	DrawProgressBar(X + 100, 960, 300, 35, Math.round(Player.KidnapWillpower / Player.KidnapMaxWillpower * 100));
	DrawProgressBar(X + 600, 960, 300, 35, Math.round(KidnapOpponent.KidnapWillpower / KidnapOpponent.KidnapMaxWillpower * 100));
	DrawText(Player.KidnapWillpower.toString(), X + 250, 979, "black", "white");
	DrawText(KidnapOpponent.KidnapWillpower.toString(), X + 750, 979, "black", "white");
	if (KidnapMode == "Intro") KidnapTitle(Player.Name + " vs " + KidnapOpponent.Name);
	if (KidnapMode == "SuddenDeath") KidnapTitle(TextGet("SuddenDeath"));
	if (KidnapMode == "End") KidnapTitle(((KidnapVictory) ? Player.Name : KidnapOpponent.Name) + " " + TextGet("Wins"));
	if (KidnapMode == "SelectMove") { KidnapDrawMove(Player, "SelectMove", 250); KidnapDrawMove(KidnapOpponent, "OpponentMove", 1750); }
	if (KidnapMode == "UpperHand") KidnapDrawMoveUpperHand();
	if (KidnapMode == "ShowMove") KidnapShowMove();
	if (KidnapMode == "SelectItem") KidnapShowItem();

	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "SelectMove") { KidnapSelectMove(3); return; }
		if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }
		if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || (KidnapMode == "UpperHand") || (KidnapMode == "SelectItem")) KidnapSetMode("SelectMove");
	} else KidnapShowTimer();

}

/**
 * Handles clicks in the kidnap mini game
 * @returns {void} - Nothing
 */
function KidnapClick() {

	// If we must end the fight
	if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }

	// When the user wants to skip the result or upper hand selection from the AI
	if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0))) {
		KidnapSetMode("SelectMove");
		return;
	}

	// When the user selects a regular move
	if (KidnapMode == "SelectMove") {
		for (let M = 0; M < 4; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMove(M);
		if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 900) && (MouseY <= 970))
			KidnapSurrender();
		return;
	}

	// When the user selects a upper hand move
	if ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID > 0)) {
		for (let M = 0; M <= KidnapUpperHandMoveType.length - 1; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMoveUpperHand(M);
		return;
	}

	// If we must cancel out and don't select any item
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 90))
		KidnapSetMode("SelectMove");

	// If the user clicks on one of the items to be applied to the opponent
	if ((KidnapMode == "SelectItem") && (MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000)) {

		// For each items in the player/opponent inventory
		var X = 1000;
		var Y = 125;
		for (let I = 0; I < DialogInventory.length; I++) {

			// If the item at position is clicked, we add the item to the opponent
			if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
				InventoryWear(KidnapOpponent, DialogInventory[I].Asset.Name, DialogInventory[I].Asset.Group.Name);
				KidnapSetMode("SelectMove");
				break;
			}

			// Change the X and Y position to get the next square
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}

		}

	}

}

/**
 * Handles the key press in the kidnap mini game, the C cheat key can help you recover some lost willpower
 * @returns {void} - Nothing
 */
function KidnapKeyDown() {
	if (MiniGameCheatKeyDown()) {
		Player.KidnapWillpower = Player.KidnapWillpower + 6;
		if (Player.KidnapWillpower > Player.KidnapMaxWillpower) Player.KidnapWillpower = Player.KidnapMaxWillpower;
	}
}
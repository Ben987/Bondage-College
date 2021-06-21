"use strict";
var KinkyDungeonBackground = "BrickWall";
var KinkyDungeonPlayer = null;
var KinkyDungeonState = "Menu";

var KinkyDungeonRep = 0; // Variable to store max level to avoid losing it if the server doesnt take the rep update

var KinkyDungeonKeybindings = null;
var KinkyDungeonKeybindingsTemp = null;
var KinkyDungeonKeybindingCurrentKey = 0;

var KinkyDungeonGameRunning = false;

//var KinkyDungeonKeyLower = [87+32, 65+32, 83+32, 68+32, 81+32, 45+32, 90+32, 43+32]; // WASD
var KinkyDungeonKey = [119, 97, 115, 100, 113, 101, 122, 99]; // WASD
//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
var KinkyDungeonKeySpell = [49, 50, 51]; // 1 2 3
var KinkyDungeonKeyWait = [120]; // x

var KinkyDungeonRootDirectory = "Screens/MiniGame/KinkyDungeon/";
var KinkyDungeonPlayerCharacter = null; // Other player object
var KinkyDungeonGameData = null; // Data sent by other player
var KinkyDungeonGameDataNullTimer = 4000; // If data is null, we query this often
var KinkyDungeonGameDataNullTimerTime = 0;
var KinkyDungeonStreamingPlayers = []; // List of players to stream to


/**
 * Loads the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonLoad() {

	CurrentDarkFactor = 0;
	
	if (!KinkyDungeonIsPlayer()) KinkyDungeonGameRunning = false;
	
	if (!KinkyDungeonGameRunning) {
		if (!KinkyDungeonPlayer)
			KinkyDungeonPlayer = CharacterLoadNPC("NPC_Avatar");
	

		//KinkyDungeonCreateMap(MiniGameDifficulty);
		var appearance = CharacterAppearanceStringify(KinkyDungeonPlayerCharacter ? KinkyDungeonPlayerCharacter : Player);
		CharacterAppearanceRestore(KinkyDungeonPlayer, appearance);
		CharacterReleaseTotal(KinkyDungeonPlayer);
		CharacterNaked(KinkyDungeonPlayer);
		KinkyDungeonInitializeDresses();
		KinkyDungeonDressPlayer();

		KinkyDungeonKeybindings = Player.KinkyDungeonKeybindings;

		if (KinkyDungeonIsPlayer()) {
			KinkyDungeonState = "Menu";
			KinkyDungeonGameData = null;
		} else {
			KinkyDungeonState = "Game";
			if (!KinkyDungeonGameData) KinkyDungeonInitialize(1);
		}

		for (let G = 0; G < KinkyDungeonStruggleGroupsBase.length; G++) {
			let group = KinkyDungeonStruggleGroupsBase[G];
			if (group == "ItemM") {
				if (InventoryGet(Player, "ItemMouth"))
					KinkyDungeonRestraintsLocked.push("ItemMouth");
				if (InventoryGet(Player, "ItemMouth2"))
					KinkyDungeonRestraintsLocked.push("ItemMouth2");
				if (InventoryGet(Player, "ItemMouth3"))
					KinkyDungeonRestraintsLocked.push("ItemMouth3");
			}
			if (InventoryGet(Player, group))
				KinkyDungeonRestraintsLocked.push(group);

		}
	}
}

/**
 * Restricts Devious Dungeon Challenge to only occur when inside the arcade
 * @returns {bool} - If the player is in the arcade
 */
function KinkyDungeonDeviousDungeonAvailable() {
	return KinkyDungeonIsPlayer() && (DialogGamingPreviousRoom == "Arcade" || MiniGameReturnFunction == "ArcadeKinkyDungeonEnd");
}

/**
 * Returns whether or not the player is the one playing, which determines whether or not to draw the UI and struggle groups
 * @returns {bool} - If the player is the game player
 */
function KinkyDungeonIsPlayer() {
	return (!KinkyDungeonPlayerCharacter || KinkyDungeonPlayerCharacter == Player) ;
}

/**
 * Runs the kinky dungeon game and draws its components on screen
 * @returns {void} - Nothing
 */
function KinkyDungeonRun() {
	DrawImage("Backgrounds/BrickWall.jpg", 0, 0);

	// Draw the characters
	DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);


	if (KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game")
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

	if (KinkyDungeonState == "Menu") {
		// Draw temp start screen
		DrawText(TextGet("Intro"), 1250, 400, "white", "silver");
		DrawText(TextGet("Intro2"), 1250, 500, "white", "silver");
		DrawText(TextGet("Intro3"), 1250, 600, "white", "silver");

		if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable())
			DrawText(TextGet("DeviousChallenge"), 1250, 925, "white", "silver");

		DrawButton(875, 750, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");
	} else if (KinkyDungeonState == "Lose") {
		// Draw temp start screen
		DrawText(TextGet("End"), 1250, 400, "white", "silver");
		DrawText(TextGet("End2"), 1250, 500, "white", "silver");
		DrawText(TextGet("End3"), 1250, 600, "white", "silver");
		DrawButton(875, 750, 350, 64, TextGet("GameStart"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("GameConfigKeys"), "White", "");
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonGameRunning = true;
		KinkyDungeonDrawGame();
	} else if (KinkyDungeonState == "End") {
		KinkyDungeonGameRunning = false;
		// Draw temp start screen
		DrawText(TextGet("EndWin"), 1250, 400, "white", "silver");
		DrawText(TextGet("EndWin2"), 1250, 500, "white", "silver");
	} else if (KinkyDungeonState == "Keybindings") {
		// Draw temp start screen
		DrawButton(1075, 750, 350, 64, TextGet("GameReturnToMenu"), "White", "");

		// Draw key buttons
		DrawButton(1075, 350, 350, 64, TextGet("KinkyDungeonKeyUp") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Up) + "'", "White", "");
		DrawButton(1075, 550, 350, 64, TextGet("KinkyDungeonKeyDown") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Down) + "'", "White", "");
		DrawButton(675, 450, 350, 64, TextGet("KinkyDungeonKeyLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Left) + "'", "White", "");
		DrawButton(1475, 450, 350, 64, TextGet("KinkyDungeonKeyRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Right) + "'", "White", "");

		DrawButton(675, 350, 350, 64, TextGet("KinkyDungeonKeyUpLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.UpLeft) + "'", "White", "");
		DrawButton(1475, 350, 350, 64, TextGet("KinkyDungeonKeyUpRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.UpRight) + "'", "White", "");
		DrawButton(675, 550, 350, 64, TextGet("KinkyDungeonKeyDownLeft") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.DownLeft) + "'", "White", "");
		DrawButton(1475, 550, 350, 64, TextGet("KinkyDungeonKeyDownRight") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.DownRight) + "'", "White", "");


		DrawButton(1075, 450, 350, 64, TextGet("KinkyDungeonKeyWait") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Wait) + "'", "White", "");

		DrawButton(675, 200, 350, 64, TextGet("KinkyDungeonKeySpell1") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell1) + "'", "White", "");
		DrawButton(1075, 200, 350, 64, TextGet("KinkyDungeonKeySpell2") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell2) + "'", "White", "");
		DrawButton(1475, 200, 350, 64, TextGet("KinkyDungeonKeySpell3") + ": '" + String.fromCharCode(KinkyDungeonKeybindingsTemp.Spell3) + "'", "White", "");

		if (KinkyDungeonKeybindingCurrentKey > 0)
			DrawText(TextGet("KinkyDungeonCurrentPress") + ": '" + String.fromCharCode(KinkyDungeonKeybindingCurrentKey) + "'", 1250, 900, "white", "silver");

		DrawText(TextGet("KinkyDungeonCurrentPressInfo"), 1250, 950, "white", "silver");
	}

}

/**
 * Handles clicks during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonClick() {
	if (MouseIn(1885, 25, 90, 90) && (KinkyDungeonDrawState == "Game" || KinkyDungeonState != "Game")) {
		KinkyDungeonExit();
	}
	if (KinkyDungeonState == "Menu" || KinkyDungeonState == "Lose") {
		if (MouseIn(875, 750, 350, 64)) {
			KinkyDungeonInitialize(1);
			KinkyDungeonState = "Game";

			if (KinkyDungeonKeybindings) {
				KinkyDungeonKey = [KinkyDungeonKeybindings.Up, KinkyDungeonKeybindings.Left, KinkyDungeonKeybindings.Down, KinkyDungeonKeybindings.Right, KinkyDungeonKeybindings.UpLeft, KinkyDungeonKeybindings.UpRight, KinkyDungeonKeybindings.DownLeft, KinkyDungeonKeybindings.DownRight]; // WASD
				//var KinkyDungeonKeyNumpad = [56, 52, 50, 54, 55, 57, 49, 51]; // Numpad
				KinkyDungeonKeySpell = [KinkyDungeonKeybindings.Spell1, KinkyDungeonKeybindings.Spell2, KinkyDungeonKeybindings.Spell3]; // ! @ #
				KinkyDungeonKeyWait = [KinkyDungeonKeybindings.Wait]; // Space and 5 (53)
			}
		}
		if (MouseIn(1275, 750, 350, 64)) {
			KinkyDungeonState = "Keybindings";

			KinkyDungeonKeybindingsTemp = {
				Down: 115,
				DownLeft: 122,
				DownRight: 99,
				Left: 97,
				Right: 100,
				Spell1: 49,
				Spell2: 50,
				Spell3: 51,
				Up: 119,
				UpLeft: 113,
				UpRight: 101,
				Wait: 120,
			};
		}
	} else if (KinkyDungeonState == "Game") {
		if (KinkyDungeonIsPlayer()) KinkyDungeonClickGame();
	} else if (KinkyDungeonState == "Keybindings") {
		if (MouseIn(1075, 750, 350, 64)) {
			KinkyDungeonState = "Menu";

			KinkyDungeonKeybindings = KinkyDungeonKeybindingsTemp;

			ServerAccountUpdate.QueueData({ KinkyDungeonKeybindings: KinkyDungeonKeybindings });
		}

		if (KinkyDungeonKeybindingCurrentKey > 0) {
			if (MouseIn(1075, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.Up = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1075, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.Down = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Left = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Right = KinkyDungeonKeybindingCurrentKey;


			if (MouseIn(675, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.UpLeft = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 350, 350, 64))
				KinkyDungeonKeybindingsTemp.UpRight = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(675, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.DownLeft = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 550, 350, 64))
				KinkyDungeonKeybindingsTemp.DownRight = KinkyDungeonKeybindingCurrentKey;


			if (MouseIn(1075, 450, 350, 64))
				KinkyDungeonKeybindingsTemp.Wait = KinkyDungeonKeybindingCurrentKey;


			if (MouseIn(675, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell1 = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1075, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell2 = KinkyDungeonKeybindingCurrentKey;
			if (MouseIn(1475, 200, 350, 64))
				KinkyDungeonKeybindingsTemp.Spell3 = KinkyDungeonKeybindingCurrentKey;

		}



	}
}

/**
 * Handles exit during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonExit() {
	CommonDynamicFunction(MiniGameReturnFunction + "()");
	
	if (MiniGameKinkyDungeonLevel > Math.max(KinkyDungeonRep, ReputationGet("Gaming")) || Math.max(KinkyDungeonRep, ReputationGet("Gaming")) > KinkyDungeonMaxLevel) {
		KinkyDungeonRep = Math.max(KinkyDungeonRep, MiniGameKinkyDungeonLevel);
		DialogSetReputation("Gaming", KinkyDungeonRep);
	}

	if (CurrentScreen == "ChatRoom" && KinkyDungeonState != "Menu" && (MiniGameKinkyDungeonLevel > 1 || KinkyDungeonState == "Lose")) {
		let Message = "KinkyDungeonExit";

			if (KinkyDungeonState == "Lose") {
				Message = "KinkyDungeonLose";

			let Dictionary = [
				{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
				{ Tag: "KinkyDungeonLevel", Text: String(MiniGameKinkyDungeonLevel)},
			];
			ChatRoomPublishCustomAction(Message, false, Dictionary);
			
		}
	}
}


 

/**
 * Handles key presses during the mini game. (Both keyboard and mobile)
 * @returns {void} - Nothing
 */
function KinkyDungeonKeyDown() {

	if (KinkyDungeonState == "Game")
		if (KinkyDungeonIsPlayer()) KinkyDungeonGameKeyDown();
	else if (KinkyDungeonState == "Keybindings") {
		KinkyDungeonKeybindingCurrentKey = KeyPress;
	}


}

"use strict";
var KinkyDungeonBackground = "BrickWall";
var KinkyDungeonPlayer = null;
var KinkyDungeonState = "Menu";


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

			ServerSend("AccountUpdate", { KinkyDungeonKeybindings: KinkyDungeonKeybindings });
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


/**
 * Converts a string into Kinky Game Data
 * @returns {void}
 */
 
function KinkyDungeonUnpackData(KinkyData) {
	if (CurrentScreen != "KinkyDungeon" || KinkyDungeonState != "Game" || !KinkyDungeonPlayerCharacter) return false;
	if (KinkyDungeonIsPlayer()) return false; // Prevent griefing
	let data = JSON.parse(KinkyData.replace(/\./g, "\""));
	
	if (!KinkyDungeonGameData) KinkyDungeonGameData = {};

	if (!data) return false;
	
	if (data.enemies) {
		KinkyDungeonGameData.enemies = data.enemies;
	}
	if (data.items) {
		KinkyDungeonGameData.items = data.items;
	}
	if (data.bullets) {
		KinkyDungeonGameData.bullets = data.bullets;
	}
	if (data.map) {
		KinkyDungeonGameData.map = data.map;
	}
	if (data.inventory) {
		KinkyDungeonGameData.inventory = data.inventory;
	}
	if (data.meta) {
		KinkyDungeonGameData.meta = data.meta;
	}
	
	KinkyDungeonUpdateFromData();
	KinkyDungeonNextDataLastTimeReceived = CommonTime();
	
}

function KinkyDungeonUpdateFromData() {
	if (!KinkyDungeonGameData.map || !KinkyDungeonGameData.inventory ||  !KinkyDungeonGameData.bullets ||  !KinkyDungeonGameData.items ||  !KinkyDungeonGameData.enemies) {
		KinkyDungeonGameData = null; // We need the full data before rendering anything!
		return false;
	}
	if (KinkyDungeonGameData.enemies) {
		KinkyDungeonEntities = [];
		let enemies = JSON.parse(KinkyDungeonGameData.enemies);
		
		for (let N = 0; N < enemies.length; N++) {
			let enemy = enemies[N].split('/');
			let i = 1;
			KinkyDungeonEntities.push({Enemy: {name: enemy[i++]}, stun: enemy[i++], x:enemy[i++], y:enemy[i++]}); // Push the enemy
		}
	}
	if (KinkyDungeonGameData.inventory) {
		KinkyDungeonInventory = [];
		let inventory = JSON.parse(KinkyDungeonGameData.inventory);
		
		CharacterReleaseTotal(KinkyDungeonPlayer);
		
		for (let N = 0; N < inventory.length; N++) {
			let item = inventory[N].split('/');
			let i = 1;
			let restraint = KinkyDungeonGetRestraintByName(item[i++]);
			KinkyDungeonAddRestraint(restraint, 0, true); // Add the item
			let createdrestraint = KinkyDungeonGetRestraintItem(restraint.Group);
			if (createdrestraint)
				createdrestraint.lock = ""; // Lock if applicable
		}
		KinkyDungeonUpdateStats(0);
		KinkyDungeonDressPlayer();
	}
	
	if (KinkyDungeonGameData.bullets) {
		KinkyDungeonBullets = [];
		let bullets = JSON.parse(KinkyDungeonGameData.bullets);
		
		for (let N = 0; N < bullets.length; N++) {
			let bullet = bullets[N].split('/');
			let i = 1;
			let name = bullet[i++];
			KinkyDungeonBullets.push({spriteID:name + CommonTime(), x:bullet[i], xx:bullet[i++], y:bullet[i], yy:bullet[i++], vx:bullet[i++], vy:bullet[i++],
				bullet:{name: name, width:bullet[i++], height:bullet[i++]}});
		}
	}
	if (KinkyDungeonGameData.items) {
		KinkyDungeonGroundItems = [];
		let items = JSON.parse(KinkyDungeonGameData.items);
		
		for (let N = 0; N < items.length; N++) {
			let item = items[N].split('/');
			let i = 1;
			KinkyDungeonGroundItems.push({name:item[i++], x:item[i++], y:item[i++]});
		}
	}
	
	if (KinkyDungeonGameData.map)
		KinkyDungeonGrid = KinkyDungeonGameData.map;
	if (KinkyDungeonGameData.meta) {
		KinkyDungeonUpdateLightGrid = true;
	
		KinkyDungeonGridWidth = Math.round(KinkyDungeonGameData.meta.w);
		KinkyDungeonGridHeight = Math.round(KinkyDungeonGameData.meta.h);
		KinkyDungeonPlayerEntity.x = Math.round(KinkyDungeonGameData.meta.x);
		KinkyDungeonPlayerEntity.y = Math.round(KinkyDungeonGameData.meta.y);
		
		if (KinkyDungeonGameData.meta.wp) KinkyDungeonStatWillpower = Math.round(KinkyDungeonGameData.meta.wp);
		if (KinkyDungeonGameData.meta.sp) KinkyDungeonStatStamina = Math.round(KinkyDungeonGameData.meta.sp);
		if (KinkyDungeonGameData.meta.ap) KinkyDungeonStatArousal = Math.round(KinkyDungeonGameData.meta.ap);
		if (KinkyDungeonGameData.meta.rk) KinkyDungeonRedKeys = Math.round(KinkyDungeonGameData.meta.rk);
		if (KinkyDungeonGameData.meta.gk) KinkyDungeonGreenKeys = Math.round(KinkyDungeonGameData.meta.gk);
		if (KinkyDungeonGameData.meta.bk) KinkyDungeonBlueKeys = Math.round(KinkyDungeonGameData.meta.bk);
		if (KinkyDungeonGameData.meta.bl) KinkyDungeonNormalBlades = Math.round(KinkyDungeonGameData.meta.bl);
		if (KinkyDungeonGameData.meta.eb) KinkyDungeonEnchantedBlades = Math.round(KinkyDungeonGameData.meta.eb);
		if (KinkyDungeonGameData.meta.lp) KinkyDungeonLockpicks = Math.round(KinkyDungeonGameData.meta.lp);
		if (KinkyDungeonGameData.meta.gp) KinkyDungeonGold = Math.round(KinkyDungeonGameData.meta.gp);
		if (KinkyDungeonGameData.meta.lv) MiniGameKinkyDungeonLevel = Math.round(KinkyDungeonGameData.meta.lv);
	}
}
 

/**
 * Turns the game state into a string that can be sent over
 * @returns {string} - String containing game data
 */
function KinkyDungeonPackData(IncludeMap, IncludeItems, IncludeInventory, IncludeStats) {
	let enemies = JSON.stringify(KinkyDungeonEntities, (key, value) => {
        if (CommonIsNumeric(key) && typeof value === "object") {
				if (value.Enemy) {
					return "E/" + value.Enemy.name + "/" + (value.stun ? value.stun : 0) + "/"+value.x+"/"+value.y;
				}
		}
        return value;
    });
	
	let items = IncludeItems ? JSON.stringify(KinkyDungeonGroundItems, (key, value) => {
        if (CommonIsNumeric(key) && typeof value === "object") {
				if (value.name) {
					return "G/" + value.name + "/"+value.x+"/"+value.y;
				}
		}
        return value;
    }) : "";
	
	let bullets = JSON.stringify(KinkyDungeonBullets, (key, value) => {
        if (CommonIsNumeric(key) && typeof value === "object") {
				if (value.bullet) {
					return "B/" + value.bullet.name + "/"+value.x+"/"+value.y + "/"+(Math.round(value.vx*10)/10)+"/"+(Math.round(value.vy*10)/10 + "/"+value.bullet.width + "/"+value.bullet.height);
				}
		}
        return value;
    });
	
	let map = IncludeMap ? KinkyDungeonGrid : "";
	
	let inventory = IncludeInventory ? JSON.stringify(KinkyDungeonInventory, (key, value) => {
        if (CommonIsNumeric(key) && typeof value === "object") {
				if (value.restraint) {
					return "I/" + value.restraint.name + "/l" + value.lock;
				}
		}
        return value;
    }) : "";
	
	let meta = {w: KinkyDungeonGridWidth, h: KinkyDungeonGridHeight, x:KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y,}
	
	if (IncludeStats) {
		meta.wp = Math.round(KinkyDungeonStatWillpower);
		meta.sp = Math.round(KinkyDungeonStatStamina);
		meta.ap = Math.round(KinkyDungeonStatArousal);
		meta.rk = KinkyDungeonRedKeys;
		meta.gk = KinkyDungeonGreenKeys;
		meta.bk = KinkyDungeonBlueKeys;
		meta.bl = KinkyDungeonNormalBlades;
		meta.eb = KinkyDungeonEnchantedBlades;
		meta.lp = KinkyDungeonLockpicks;
		meta.gp = KinkyDungeonGold;
		meta.lv = MiniGameKinkyDungeonLevel;
	}
	
	let result = {
		enemies: enemies,
		items: items,
		bullets: bullets,
		map: map,
		inventory: inventory,
		meta: meta,
	};
	let stringToSend = JSON.stringify(result).replace(/"/g, '.');
	//console.log(stringToSend);
	return stringToSend;
}

"use strict";

var MagicBackground = "Magic";
var MagicPerformer = null;
var MagicPerformerAppearance = null;

var MagicAssistant = null;
var MagicAssistantAppearance = null;

var MagicPlayerAppearance = null;

var MagicTrick = null;
var MagicTrickList = ["ChangeBinds", "Dance", "BindAsstant", "BoxTiedLight", "GetCoin", "BoxTiedHeavy", "MilkCan", "WaterCell", "Song", "AsstantChange"];
var MagicRestraintList = ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemArms", "ItemFeet", "ItemLegs", "ItemHead", "ItemMisc", "ItemDevices"];
var MagicTrickCounter = 0;
var MagicShowIncome = 0;
var MagicShowState = 1;

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Checks, if the magic show currently has the given state
 * 1 - No Show
 * 2 - Before Assist Redress
 * 3 - After Assist Redress
 * 4 - Assistant is bound
 * 5 - Assistant is released
 * 6 - To Sing a Song
 * 7 - To Bind for Change
 * 8 - After Change
 * @param {number} QState - The state that is queried
 * @returns {boolean} - Returns true, if the queried state matches with the current state of the magic show, flase otherwise
 */
function MagicShowIsState(QState) { return ((QState == MagicShowState) ? true : false) }

/**
 * Checks, if the magician's assistant has been released
 * @returns {boolean} - Returns true, if the assistant has been released, false otherwise
 */
function MagicAssistantIsReleased() { return (MagicShowIsState(4) && !MagicAssistant.IsRestrained()) }

/**
 * Checks, if the magician is bound by the minal required number of items (gag, arms, feet, legs, head)
 * @param {number} MinItem - The minimal number of items that must be used on the magician
 * @returns {boolean} - Returns true, if the required number of items is reached or exceeded, false otherwise
 */
function MagicRestrainPerformerMinItem(MinItem) { return MagicRestrainMinItem(MagicPerformer, MinItem) }

/**
 * Checks, if the magician's assistant is bound by the minal required number of items (gag, arms, feet, legs, head)
 * @param {number} MinItem - The minimal number of items that must be used on the magician's assistant
 * @returns {boolean} - Returns true, if the required number of items is reached or exceeded, false otherwise
 */
function MagicRestrainAssistantMinItem(MinItem) { return MagicRestrainMinItem(MagicAssistant, MinItem) }

/**
 * Checks wether the assistant is restrained and should redress
 * @returns {boolean} - Returns true, if the assistant should redress and is currently restrained
 */
function MagicAssistantIsDressRestrain() { return (MagicShowIsState(8) && MagicAssistant.IsRestrained()) }

/**
 * Checks wether the assistant is free and should redress
 * @returns {boolean} - Returns true, if the assistant should redress and is currently free
 */
function MagicAssistantIsntDressRestrain() { return (MagicShowIsState(8) && !MagicAssistant.IsRestrained()) }

/**
 * Checks, wether a given character is bound by the minal required number of items (gag, arms, feet, legs, head)
 * @param {Character} C - The character to check
 * @param {number} MinItem - The minimal required number of items
 * @returns {boolean} - - Returns true, if the required number of items is reached or exceeded, false otherwise
 */
function MagicRestrainMinItem(C, MinItem) {
	var CurItem = 0;
	var GagApplied = false;
	for (let E = 0; E < C.Appearance.length; E++) {
		if ((C.Appearance[E].Asset.Group.Name == "ItemMouth") || (C.Appearance[E].Asset.Group.Name == "ItemMouth2") || (C.Appearance[E].Asset.Group.Name == "ItemMouth3")) {
			GagApplied = true;
		}
		else if ((C.Appearance[E].Asset.Group.Name == "ItemArms") || (C.Appearance[E].Asset.Group.Name == "ItemFeet") || (C.Appearance[E].Asset.Group.Name == "ItemLegs") || (C.Appearance[E].Asset.Group.Name == "ItemHead") || (C.Appearance[E].Asset.Group.Name == "ItemMisc")|| (C.Appearance[E].Asset.Group.Name == "ItemHood")) {
			CurItem++
		}
	}
	return (CurItem + (GagApplied ? 1 : 0)) >= MinItem;
}

/**
 * Loads the room characters, saves their inventories and starts the show
 * @returns {void} - Nothing
 */
function MagicLoad() {
	// Default load
	if (MagicPerformer == null) {
		MagicPerformer = CharacterLoadNPC("NPC_Magic_Performer");
		MagicAssistant = CharacterLoadNPC("NPC_Magic_Assistant");
		MagicPlayerAppearance = Player.Appearance.slice();
		MagicAssistantDress();
		MagicPerformerAppearance = MagicPerformer.Appearance.slice();
		MagicAssistantAppearance = MagicAssistant.Appearance.slice();
		MagicPerformerAppearance.AllowItem = false;
		MagicAssistantAppearance.AllowItem = false;
		MagicShowState = 1;
	}
}

/**
 * Runs the magic screen, draws the player, the magician and the assistant as well as all required buttons
 * @returns {void} - Nothing
 */
function MagicRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(MagicPerformer, 750, 0, 1);
	DrawCharacter(MagicAssistant, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	//todo button
	//DrawButton(1885, 265, 90, 90, "", "White", "Icons/Magic.png");
}

/**
 * Handles the click events in the magic screen
 * @returns {void} - Nothing
 */
function MagicClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicPerformer);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicAssistant);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

////////////////////////////////////////////////////////////////////////////////////////////
//Tricks
////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Changes the dresses of the player and the assistants and progresses the show state
 * @returns {void} - Nothing
 */
function MagicTrickChangeDresses() {
	CharacterNaked(Player);
	CharacterNaked(MagicAssistant);
	CharacterDress(Player, MagicAssistantAppearance);
	CharacterDress(MagicAssistant, MagicPlayerAppearance);
	MagicShowState = 2;
}

/**
 * Changes the dresses of player and assistant back and goes back to state 1
 * @returns {void} - Nothing
 */
function MagicTrickChangeDressesBack() {
	CharacterNaked(Player);
	CharacterNaked(MagicAssistant);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
}

/**
 * Randomly dresses the assistant and sets the show's state to 3
 * @returns {void} - Nothing
 */
function MagicAssistantDress() {
	CharacterNaked(MagicAssistant);
	var ColorList = ["Default", "#aa8080", "#8080aa", "#aaaa80", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"];
	var Color = CommonRandomItemFromList("", ColorList);
	InventoryWear(MagicAssistant, "BunnyEars1", "HairAccessory1");
	InventoryWear(MagicAssistant, "BunnyCollarCuffs", "Cloth");
	InventoryWear(MagicAssistant, "BunnySuit", "Bra", Color);
	InventoryWear(MagicAssistant, "Panties15", "Panties");
	InventoryWear(MagicAssistant, "Pantyhose1", "Socks");
	InventoryWear(MagicAssistant, "Heels2", "Shoes", Color);
	MagicShowState = 3;
}

/**
 * Starts the magic show and sets all counters to 0
 * @returns {void} - Nothing
 */
function MagicShowStart() {
	MagicTrickCounter = 0;
	MagicShowIncome = 0;
}

/**
 * Adds money to the player's account. The longer she performs, the more money she earns
 * @returns {void} - Nothing
 */
function MagicShowIncomeAdd() {
	var I = (MagicTrickCounter < 15) ? MagicTrickCounter : 15;
	MagicShowIncome = MagicShowIncome + I;
}

/**
 * When the player leaves the show, she get's her money and is redressed in the things she wore at the start of the show
 * @returns {void} - Nothing
 */
function MagicShowPayoff() {
	MagicPerformer.CurrentDialog = MagicPerformer.CurrentDialog.replace("REPLACEMONEY", MagicShowIncome.toString());
	CharacterChangeMoney(Player, MagicShowIncome);
	CharacterNaked(MagicAssistant);
	CharacterNaked(Player);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
}

/**
 * Randomly selects the next magic trick and prepares the appropriate dialog
 * @returns {void} - Nothing
 */
function MagicSelectTrick() {
	//prepare tricks
	MagicPerformer.AllowItem = false;
	MagicAssistant.AllowItem = false;
	MagicTrickCounter++;
	MagicShowIncomeAdd();
	MagicShowState = 3;

	//select tricks
	/*todo more tricks
	hide assistant
	*/
	MagicTrick = CommonRandomItemFromList(MagicTrick, MagicTrickList);

	if (MagicTrick == "ChangeBinds") {
		MagicPerformer.Stage = "100";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "100");
		MagicPerformer.AllowItem = true;
	} else if (MagicTrick == "Dance") {
		MagicPerformer.Stage = "110";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "110");
	} else if (MagicTrick == "BindAsstant") {
		MagicPerformer.Stage = "120";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "120");
		MagicAssistant.AllowItem = true;
	} else if (MagicTrick == "BoxTiedLight") {
		MagicPerformer.Stage = "130";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "130");
	} else if (MagicTrick == "GetCoin") {
		MagicPerformer.Stage = "140";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "140");
	} else if (MagicTrick == "BoxTiedHeavy") {
		MagicPerformer.Stage = "150";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "150");
	} else if (MagicTrick == "MilkCan") {
		MagicPerformer.Stage = "160";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "160");
	} else if (MagicTrick == "WaterCell") {
		MagicPerformer.Stage = "170";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "170");
	} else if (MagicTrick == "Song") {
		MagicPerformer.Stage = "180";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "180");
		MagicAssistant.AllowItem = true;
	} else if (MagicTrick == "AsstantChange") {
		MagicPerformer.Stage = "190";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "190");
		MagicAssistant.AllowItem = true;
	}
}

/**
 * Copies the restraints currently on the magician randomly 
 * either to the player or the assistant and gets the appropriate dialog option
 * @returns {void} - Nothing
 */
function MagicTrickChangeBinds() {
	var T = ((Math.random() < 0.5) ? Player : MagicAssistant);
	MagicRestrainCopyTransfer(MagicPerformer, T);
	MagicPerformer.AllowItem = false;
	if (T == Player) {
		MagicPerformer.Stage = "101";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "101");
	} else {
		MagicPerformer.Stage = "103";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "103");
		MagicShowState = 4;
		MagicAssistant.AllowItem = true;
	}
}

/**
 * Copies the restraints from the assistant to the player and
 * picks the appropriate dialog options
 * @returns {void} - Nothing
 */
function MagicTrickBindAsstant() {
	MagicRestrainCopyTransfer(MagicAssistant, Player);
	MagicAssistant.AllowItem = false;
	MagicPerformer.Stage = "121";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "121");
}

/**
 * Binds the player lightly and places her in a wooden box
 * @returns {void} - Nothing
 */
function MagicTrickBoxTiedLight() {
	InventoryWear(Player, "NylonRope", "ItemFeet");
	InventoryWear(Player, "NylonRope", "ItemLegs");
	InventoryWear(Player, "NylonRope", "ItemArms");
	InventoryWear(Player, "ClothGag", "ItemMouth");
	InventoryWear(Player, "ClothBlindfold", "ItemHead");
	InventoryWear(Player, "WoodenBox", "ItemDevices");
	MagicPerformer.Stage = "131";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "131");
}

/**
 * Binds the player heavily and places her in a wooden box
 * @returns {void} - Nothing
 */
function MagicTrickBoxTiedHeavy() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "HempRope", "ItemArms");
	InventoryWear(Player, "ClothGag", "ItemMouth");
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	InventoryWear(Player, "WoodenBox", "ItemDevices");
	MagicPerformer.Stage = "151";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "151");
}

/**
 * Places the player in the water filled milk can
 * @returns {void} - Nothing
 */
function MagicTrickBoxMilkCan() {
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "MetalCuffs", "ItemArms");
	InventoryWear(Player, "HarnessBallGag", "ItemMouth");
	InventoryWear(Player, "MilkCan", "ItemDevices");
	MagicPerformer.Stage = "161";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "161");
}

/**
 * Places the player in the water torture cell
 * @returns {void} - Nothing
 */
function MagicTrickBoxWaterCell() {
	InventoryWear(Player, "HempRope", "ItemFeet"); 
	InventoryGet(Player, "ItemFeet").Property = { Type: "Suspension", SetPose: ["LegsClosed", "Suspension"], Difficulty: 6, OverrideHeight: { Height: -150, Priority: 41, HeightRatioProportion: 0 }, };
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "HempRope", "ItemArms");
	InventoryWear(Player, "WaterCell", "ItemDevices");
	MagicPerformer.Stage = "171";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "171");
}

/**
 * If the player chooses to keep the magic coins, add them to her account
 * @returns {void} - Nothing
 */
function MagicTrickGetCoin() {
	var MagicMoney = Math.floor(Math.random() * 6) + 1;
	MagicPerformer.CurrentDialog = MagicPerformer.CurrentDialog.replace("REPLACEMONEY", MagicMoney.toString());
	CharacterChangeMoney(Player, MagicMoney);
}

/**
 * If the player has to sing a song end the dialog and wait, what the player does with the assistant
 * @returns {void} - Nothing
 */
function MagicSongLeavePerformer() {
	MagicShowState = 6;
	DialogLeave()
}

/**
 * Bind the player and the assistant during the 'Sweet, sweet Gwendoline" song
 * @returns {void} - Nothing
 */
function MagicSongGwendoyn() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "LeatherArmbinder", "ItemArms");
	InventoryWear(Player, "ClothBlindfold", "ItemHead");
	InventoryWear(MagicAssistant, "HempRope", "ItemFeet");
	InventoryWear(MagicAssistant, "HempRope", "ItemLegs");
	InventoryWear(MagicAssistant, "LeatherArmbinder", "ItemArms");
	InventoryWear(MagicAssistant, "ClothBlindfold", "ItemHead");
	MagicShowState = 4;
}

/**
 * The player earns money with the performance of "Bad girl"
 * @returns {void} - Nothing
 */
function MagicSongBadGirl() {
	var MagicMoney = Math.floor(Math.random() * 6) + 6;
	MagicAssistant.CurrentDialog = MagicAssistant.CurrentDialog.replace("REPLACEMONEY", MagicMoney.toString());
	CharacterChangeMoney(Player, MagicMoney);
	MagicShowState = 4;
}

/**
 * Change the show's state after the assistant was released
 * @returns {void} - Nothing
 */
function MagicAssistantRelese() {
	MagicShowState = 5;
}

/**
 * Dress the assistant in the player's clothes
 * @returns {void} - Nothing
 */
function MagicTrickAsstantChange() {
	CharacterDress(MagicAssistant, MagicPlayerAppearance);
	CharacterRefresh(MagicAssistant);
	MagicShowState = 8;
	MagicPerformer.Stage = "191";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "191");
}

/**
 * Ends the show. Release everybody, dress everybody back to their clothes 
 * from the start and bring the player back to the mein hall
 * @returns {void} - Nothing
 */
function MagicTrickEndPerformance() {
	MagicPerformer.Stage = "0";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "0");
	DialogLeave();
	InventoryRemove(Player, "ItemDevices");
	CharacterRelease(MagicAssistant);
	CharacterNaked(MagicAssistant);
	CharacterNaked(Player);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
	CommonSetScreen("Room", "MainHall");
}

/**
 * Removes a defined set of restraints from the character. If the adult baby harness chains are removed,
 * mittens and harness are removed as well
 * @param {Character} C - The character whose items should be removed
 * @returns	{void} - Nothing
 */
function MagicRestrainRemove(C) {
	let itemArms = InventoryGet(C, "ItemArms");

	if ((itemArms != null) && (itemArms.Asset.Name === "MittenChain1")) {
		// If the arms are restrained by the adult baby harness chain, remove the harness and the mittens as well
		InventoryRemove(C, "ItemHands");
		InventoryRemove(C, "ItemTorso");
	}
	MagicRestraintList.forEach(group => InventoryRemove(C, group));
}

/**
 * Copies restraints from one character to another
 * @param {Character} FromC - The source for all restraints
 * @param {Character} ToC - The target of all restraints
 * @returns	{void} - Nothing
 */
function MagicRestrainCopyTransfer(FromC, ToC) {
	var chainFound = false;

	// Removes any previous appearance asset From second character
	MagicRestrainRemove(ToC);

	// Adds all appearance assets from the first character to the second
	for (var A = 0; A < FromC.Appearance.length; A++) {
		if ((FromC.Appearance[A].Asset != null) && (MagicRestraintList.indexOf(FromC.Appearance[A].Asset.Group.Name) >= 0)) {
			if (FromC.Appearance[A].Asset.Name === "MittenChain1") {
				chainFound = true;
			}
			InventoryWear(ToC, FromC.Appearance[A].Asset.Name, FromC.Appearance[A].Asset.Group.Name);
		}
	}
	if (chainFound) {
		// If the arms are restrained by the adult baby harness, add the harness and the mittens as well
		InventoryWear(ToC, InventoryGet(FromC, "ItemTorso").Asset.Name, "ItemTorso");
		InventoryWear(ToC, InventoryGet(FromC, "ItemHands").Asset.Name, "ItemHands");
	}

	// Removes any previous appearance asset From first
	MagicRestrainRemove(FromC);

	// Refreshes the second character and saves it if it's the player
	CharacterRefresh(ToC);
	CharacterRefresh(FromC);
	if (ToC.ID == 0) ServerPlayerAppearanceSync();
}
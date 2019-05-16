"use strict";

var MagicBackground = "Magic";
var MagicPerformer = null;
var MagicPerformerAppearance = null;

var MagicAssistant = null;
var MagicAssistantAppearance = null;

var MagicPlayerAppearance = null;

var MagicTrick = null;
var MagicTrickList = ["ChangeBinds", "Dance", "BindAsstant", "BoxTiedLight", "GetCoin", "BoxTiedHeavy", "MilkCan", "WaterCell", "Song", "AsstantChange"];
var MagicTrickCounter = 0;
var MagicShowIncome = 0;
var MagicShowState = 1;
// 1 No Show
// 2 Bevor Assist Redress
// 3 After Assist Redress
// 4 Assist is bind
// 5 Assist is release
// 6 To Sing a Song
// 7 to Bind for Change
// 8 After Change

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////
// functions for Dialogs
function MagicShowIsState(QState) { return ((QState == MagicShowState) ? true : false)}
function MagicAssistantIsReleased() {return (MagicShowIsState(4) && !MagicAssistant.IsRestrained())}
function MagicRestrainPerformerMinItem(MinItem) {return MagicRestrainMinItem(MagicPerformer, MinItem)}
function MagicRestrainAssistantMinItem(MinItem) {return MagicRestrainMinItem(MagicAssistant, MinItem)}
function MagicAssistantIsDressRestrain() {return (MagicShowIsState(8) && MagicAssistant.IsRestrained())}
function MagicAssistantIsntDressRestrain() {return (MagicShowIsState(8) && !MagicAssistant.IsRestrained())}

function MagicRestrainMinItem(C, MinItem) {
	var CurItem = 0;
	for(var E = 0; E < C.Appearance.length; E++)
	if ((C.Appearance[E].Asset.Group.Name == "ItemMouth") || (C.Appearance[E].Asset.Group.Name == "ItemArms") || (C.Appearance[E].Asset.Group.Name == "ItemFeet") || (C.Appearance[E].Asset.Group.Name == "ItemLegs") || (C.Appearance[E].Asset.Group.Name == "ItemHead") || (C.Appearance[E].Asset.Group.Name == "ItemMisc")) {
		CurItem++
	}
	return (CurItem >= MinItem) ? true : false;
}


// Loads the room characters with many restrains
function MagicLoad() {
	// Default load
	if (MagicPerformer == null) {
		MagicPerformer = CharacterLoadNPC("NPC_Magic_Performer");
		MagicAssistant = CharacterLoadNPC("NPC_Magic_Assistant");
		MagicPlayerAppearance = Player.Appearance.slice();
		CharacterNaked(MagicAssistant);
		InventoryWear(MagicAssistant, "BunnyEars1", "Hat");
		InventoryWear(MagicAssistant, "Corset2", "Bra");
		InventoryWear(MagicAssistant, "Panties15", "Panties");
		InventoryWear(MagicAssistant, "Stockings4", "Socks");
		InventoryWear(MagicAssistant, "Heels2", "Shoes");
		MagicPerformerAppearance = MagicPerformer.Appearance.slice();
		MagicAssistantAppearance = MagicAssistant.Appearance.slice();
		MagicPerformerAppearance.AllowItem = false;
		MagicAssistantAppearance.AllowItem = false;
		MagicShowState = 1;
	}
}

// Run the Magic, draw all 3 characters
function MagicRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(MagicPerformer, 750, 0, 1);
	DrawCharacter(MagicAssistant, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	//todo button
	//DrawButton(1885, 265, 90, 90, "", "White", "Icons/Magic.png");
}

// When the user clicks in the Magic
function MagicClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicPerformer);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicAssistant);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	//if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) {	InventoryWear(Player, "WaterCell", "ItemMisc");}
}

////////////////////////////////////////////////////////////////////////////////////////////
//Tricks
////////////////////////////////////////////////////////////////////////////////////////////
function MagicTrickChangeDresses(){
	CharacterNaked(Player);
	CharacterNaked(MagicAssistant);
	CharacterDress(Player, MagicAssistantAppearance);
	CharacterDress(MagicAssistant, MagicPlayerAppearance);
	MagicShowState = 2;
}

function MagicTrickChangeDressesBack(){
	CharacterNaked(Player);
	CharacterNaked(MagicAssistant);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
}

function MagicAssistantDress(){
	CharacterNaked(MagicAssistant);
	InventoryWear(MagicAssistant, "BunnyEars1", "Hat");
	InventoryWear(MagicAssistant, "Corset2", "Bra");
	InventoryWear(MagicAssistant, "Panties15", "Panties");
	InventoryWear(MagicAssistant, "Stockings4", "Socks");
	InventoryWear(MagicAssistant, "Heels2", "Shoes");
	MagicShowState = 3;
}

function MagicShowStart() {
	MagicTrickCounter = 0;
	MagicShowIncome = 0;
}

function MagicShowIncomeAdd() {
	var I = (MagicTrickCounter < 15) ? MagicTrickCounter : 15;
	MagicShowIncome = MagicShowIncome + I;
}

function MagicShowPayoff() {
	MagicPerformer.CurrentDialog = MagicPerformer.CurrentDialog.replace("REPLACEMONEY", MagicShowIncome.toString());
	CharacterChangeMoney(Player, MagicShowIncome);
	CharacterNaked(MagicAssistant);
	CharacterNaked(Player);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
}

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
	tied clothing
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
	}  else if (MagicTrick == "GetCoin") {
		MagicPerformer.Stage = "140";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "140");
	}  else if (MagicTrick == "BoxTiedHeavy") {
		MagicPerformer.Stage = "150";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "150");
	}  else if (MagicTrick == "MilkCan") {
		MagicPerformer.Stage = "160";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "160");
	}  else if (MagicTrick == "WaterCell") {
		MagicPerformer.Stage = "170";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "170");
	}  else if (MagicTrick == "Song") {
		MagicPerformer.Stage = "180";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "180");
		MagicAssistant.AllowItem = true;
	} else if (MagicTrick == "AsstantChange") {
		MagicPerformer.Stage = "190";
		MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "190");
		MagicAssistant.AllowItem = true;
	}
}

function MagicTrickChangeBinds(){
	var T = ((Math.random() < 0.5) ? Player : MagicAssistant);
	for(var E = 0; E < MagicPerformer.Appearance.length; E++)
		if ((MagicPerformer.Appearance[E].Asset.Group.Name == "ItemMouth") || (MagicPerformer.Appearance[E].Asset.Group.Name == "ItemArms") || (MagicPerformer.Appearance[E].Asset.Group.Name == "ItemFeet") || (MagicPerformer.Appearance[E].Asset.Group.Name == "ItemLegs") || (MagicPerformer.Appearance[E].Asset.Group.Name == "ItemHead") || (MagicPerformer.Appearance[E].Asset.Group.Name == "ItemMisc")) {
			InventoryWear(T, MagicPerformer.Appearance[E].Asset.Name, MagicPerformer.Appearance[E].Asset.Group.Name);
			MagicPerformer.Appearance.splice(E, 1);
			E--;
		}
	CharacterRefresh(T);
	CharacterRefresh(MagicPerformer);
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

function MagicTrickBindAsstant() {
	for(var E = 0; E < MagicAssistant.Appearance.length; E++)
	if ((MagicAssistant.Appearance[E].Asset.Group.Name == "ItemMouth") || (MagicAssistant.Appearance[E].Asset.Group.Name == "ItemArms") || (MagicAssistant.Appearance[E].Asset.Group.Name == "ItemFeet") || (MagicAssistant.Appearance[E].Asset.Group.Name == "ItemLegs") || (MagicAssistant.Appearance[E].Asset.Group.Name == "ItemHead") || (MagicAssistant.Appearance[E].Asset.Group.Name == "ItemMisc")) {
		InventoryWear(Player, MagicAssistant.Appearance[E].Asset.Name, MagicAssistant.Appearance[E].Asset.Group.Name);
		MagicAssistant.Appearance.splice(E, 1);
		E--;
	}
	CharacterRefresh(Player);
	CharacterRefresh(MagicAssistant);
	MagicAssistant.AllowItem = false;
	MagicPerformer.Stage = "121";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "121");
}

function MagicTrickBoxTiedLight() {
	InventoryWear(Player, "NylonRope", "ItemFeet");
	InventoryWear(Player, "NylonRope", "ItemLegs");
	InventoryWear(Player, "NylonRope", "ItemArms");
	InventoryWear(Player, "SmallClothGag", "ItemMouth");
	InventoryWear(Player, "ClothBlindfold", "ItemHead");
	InventoryWear(Player, "WoodenBox", "ItemMisc");
	MagicPerformer.Stage = "131";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "131");
}

function MagicTrickBoxTiedHeavy() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "HempRope", "ItemArms");
	InventoryWear(Player, "ClothOTMGag", "ItemMouth");
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	InventoryWear(Player, "WoodenBox", "ItemMisc");
	MagicPerformer.Stage = "151";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "151");
}

function MagicTrickBoxMilkCan() {
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "MetalCuffs", "ItemArms");
	InventoryWear(Player, "HarnessBallGag", "ItemMouth");
	InventoryWear(Player, "MilkCan", "ItemMisc");
	MagicPerformer.Stage = "161";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "161");
}

function MagicTrickBoxWaterCell() {
	InventoryWear(Player, "SuspensionHempRope", "ItemFeet");
	InventoryWear(Player, "HempRope", "ItemLegs");
	InventoryWear(Player, "HempRopeHarness", "ItemTorso");
	InventoryWear(Player, "HempRope", "ItemArms");
	InventoryWear(Player, "WaterCell", "ItemMisc");
	MagicPerformer.Stage = "171";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "171");
}

function MagicTrickGetCoin() {
	var MagicMoney = Math.floor(Math.random() * 6) + 1;
	MagicPerformer.CurrentDialog = MagicPerformer.CurrentDialog.replace("REPLACEMONEY", MagicMoney.toString());
	CharacterChangeMoney(Player, MagicMoney);
}

function MagicSongLeavePerformer(){
	MagicShowState = 6;
	DialogLeave()
}

function MagicSongGwendoyn(){
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

function MagicSongBadGirl(){
	var MagicMoney = Math.floor(Math.random() * 6) + 6;
	MagicAssistant.CurrentDialog = MagicAssistant.CurrentDialog.replace("REPLACEMONEY", MagicMoney.toString());
	CharacterChangeMoney(Player, MagicMoney);
	MagicShowState = 4;
}

function MagicAssistantRelese() {
	MagicShowState = 5;
}

function MagicTrickAsstantChange() {
	CharacterDress(MagicAssistant, MagicPlayerAppearance);
	CharacterRefresh(MagicAssistant);
	MagicShowState = 8;
	MagicPerformer.Stage = "191";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "191");
}


function MagicTrickEndPerformance() {
	MagicPerformer.Stage = "0";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "0");
	DialogLeave();
	InventoryRemove(Player, "ItemMisc");
	CharacterRelease(MagicAssistant);
	CharacterNaked(MagicAssistant);
	CharacterNaked(Player);
	CharacterDress(MagicAssistant, MagicAssistantAppearance);
	CharacterDress(Player, MagicPlayerAppearance);
	MagicShowState = 1;
	CommonSetScreen("Room", "MainHall");
}

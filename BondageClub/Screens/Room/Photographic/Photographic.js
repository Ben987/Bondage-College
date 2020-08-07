"use strict";

var PhotographicBackground = "grey";
var PhotographicSub = null;
var PhotographicGroupStarted = false;
var PhotographicCurrendGroup = null;
var PhotographicSubAppearance = null;
var PhotographicSelectText = "";

function PhotographicPlayerCanChangeCloth() {return Player.CanChange() && !Player.IsRestrained()}
function PhotographicPlayerHatAvailable() {return PhotographicAppearanceAvailable(Player, "Hat");}
function PhotographicPlayerGlovesAvailable() {return PhotographicAppearanceAvailable(Player, "Gloves");}
function PhotographicPlayerClothAvailable() {return PhotographicAppearanceAvailable(Player, "Cloth");}
function PhotographicPlayerClothLowerAvailable() {return PhotographicAppearanceAvailable(Player, "ClothLower");}
function PhotographicPlayerShoesAvailable() {return PhotographicAppearanceAvailable(Player, "Shoes");}
function PhotographicPlayerSocksAvailable() {return (PhotographicAppearanceAvailable(Player, "Socks")&&!PhotographicAppearanceAvailable(Player, "Shoes"));}
function PhotographicPlayerBraAvailable() {return (PhotographicAppearanceAvailable(Player, "Bra")&&!PhotographicAppearanceAvailable(Player, "Cloth"));}
function PhotographicPlayerPantiesAvailable() {return (PhotographicAppearanceAvailable(Player, "Panties")&&!PhotographicAppearanceAvailable(Player, "Cloth")&&!PhotographicAppearanceAvailable(Player, "ClothLower"));}

function PhotographicSubIsRestrained() {return PhotographicSub.IsRestrained()}
function PhotographicSubHatAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Hat");}
function PhotographicSubGlovesAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Gloves");}
function PhotographicSubClothAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Cloth");}
function PhotographicSubClothLowerAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "ClothLower");}
function PhotographicSubShoesAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Shoes");}
function PhotographicSubSocksAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Socks")&&!PhotographicAppearanceAvailable(PhotographicSub, "Shoes"));}
function PhotographicSubBraAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Bra")&&!PhotographicAppearanceAvailable(PhotographicSub, "Cloth"));}
function PhotographicSubPantiesAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Panties")&&!PhotographicAppearanceAvailable(PhotographicSub, "Cloth")&&!PhotographicAppearanceAvailable(PhotographicSub, "ClothLower"));}
function PhotographicSubCanAskForPhoto() {return Player.CanTalk() && !PhotographicSub.IsRestrained()}
function PhotographicSubCanWinkForPhoto() {return !Player.CanTalk() && !PhotographicSub.IsRestrained()}
function PhotographicSubCanKeel() {return PhotographicSub.CanKneel()}

function PhotographicIsRestrainedWithLock() { return (Player.IsRestrained() && InventoryCharacterHasLockedRestraint(Player)) };
function PhotographicIsRestrainedWithoutLock() { return (Player.IsRestrained() && !InventoryCharacterHasLockedRestraint(Player)) };

function PhotographicLoad() {
	if (PhotographicSub == null) {
		PhotographicSub = CharacterLoadNPC("NPC_Photographic_Sub");
		PhotographicSubAppearance = PhotographicSub.Appearance.slice();
		PhotographicSub.AllowItem = true;
	}
}

function PhotographicRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(PhotographicSub, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Camera.png");
	if (Player.CanKneel()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Kneel.png");
	DrawButton(1885, 505, 90, 90, "", Player.CanChange() ? "White" : "Pink", "Icons/Dress.png");
}

function PhotographicClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(PhotographicSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		CharacterRefresh(Player);
		CommonSetScreen("Room", "MainHall");
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanInteract()) PhotographicCanvasToPng(750);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475)  && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
}

function PhotographicCanvasToPng(x) {
	var PhotographicCanOld = document.getElementById("MainCanvas");
    var PhotographicCtx = PhotographicCanOld.getContext('2d');
	//Normal: 250 = Player, 750 = npc
	//Dialog: 0 = Player, 500 = npc
	var PhotographicImageData = PhotographicCtx.getImageData(x, 0, 500, 1000);
	var PhotographicCanNew = document.createElement('canvas');
	PhotographicCanNew.width = 500;
	PhotographicCanNew.height = 1000;
    var PhotographicNewCtx = PhotographicCanNew.getContext('2d');
    PhotographicNewCtx.putImageData(PhotographicImageData, 0, 0);
	var d = PhotographicCanNew.toDataURL("image/png");
	var w = window.open('about:blank','image from canvas');
	w.document.write("<img src='"+d+"' alt='from canvas'/>");
}

function PhotographicShotThePlayerPhoto() {
	PhotographicCanvasToPng(0);
}

function PhotographicPlayerClothRemove(Group) {
	InventoryRemove(Player, Group); 
}

function PhotographicAppearanceAvailable(C, Group) {
	for (let I = 0; I < C.Appearance.length; I++) {
		if (C.Appearance[I].Asset.Group.Name == Group) {
			return true;
		}
	}
	return false;
}

function PhotographicPlayerAssetAvailable(Asset, Group) {
	for (let I = Player.Inventory.length - 1; I > -1; I--)
		if ((Player.Inventory[I].Name == Asset) && (Player.Inventory[I].Group == Group)) {return true;}
	return false;	
}

function PhotographicPlayerRelease() {
	if (!PhotographicSub.IsRestrained()) {
		CharacterRelease(Player);
	} else {
		PhotographicSub.Stage = "0";
		PhotographicSub.CurrentDialog = DialogFind(PhotographicSub, "PhotographicSubTied");
	}
}

function PhotographicUseAsset(Asset,Group) {
	InventoryWear(Player, Asset, Group);
	CharacterRefresh(Player);
}

function PhotographicPlayerDressBack() {
	DialogLeave();
	CharacterAppearanceLoadCharacter(Player);
}

function PhotographicSubDressBack() {
	CharacterDress(PhotographicSub, PhotographicSubAppearance);
}

function PhotographicSubChangePose() {
	CharacterSetActivePose(PhotographicSub, (PhotographicSub.ActivePose == null) ? "Kneel" : null);
}


function PhotographicSubClothRemove(Group) {
	InventoryRemove(PhotographicSub, Group); 
}

function PhotographicStartInventoryPlayer(ItemGroup) {
	DialogLeaveItemMenu();
	for (let A = 0; A < AssetGroup.length; A++) {
		if (AssetGroup[A].Name == ItemGroup) {
			Player.FocusGroup = AssetGroup[A];
			DialogItemToLock = null;
			DialogFocusItem = null;
			DialogInventoryBuild(Player);
			break;
		}
	}
}


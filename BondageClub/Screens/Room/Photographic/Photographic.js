"use strict";

var PhotographicBackground = "grey";
var PhotographicSub = null;
var PhotographicPlayerAppearance = null;
var PhotographicGroupStarted = false;
var PhotographicCurrendGroup = null;
var PhotographicSubAppearance = null;

function PhotographicPlayerHatAvailable() {return PhotographicAppearanceAvailable(Player, "Hat");}
function PhotographicPlayerGlovesAvailable() {return PhotographicAppearanceAvailable(Player, "Gloves");}
function PhotographicPlayerClothAvailable() {return PhotographicAppearanceAvailable(Player, "Cloth");}
function PhotographicPlayerClothLowerAvailable() {return PhotographicAppearanceAvailable(Player, "ClothLower");}
function PhotographicPlayerShoesAvailable() {return PhotographicAppearanceAvailable(Player, "Shoes");}
function PhotographicPlayerSocksAvailable() {return (PhotographicAppearanceAvailable(Player, "Socks")&&!PhotographicAppearanceAvailable(Player, "Shoes"));}
function PhotographicPlayerBraAvailable() {return (PhotographicAppearanceAvailable(Player, "Bra")&&!PhotographicAppearanceAvailable(Player, "Cloth"));}
function PhotographicPlayerPantiesAvailable() {return (PhotographicAppearanceAvailable(Player, "Panties")&&!PhotographicAppearanceAvailable(Player, "Cloth")&&!PhotographicAppearanceAvailable(Player, "ClothLower"));}

function PhotographicSubHatAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Hat");}
function PhotographicSubGlovesAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Gloves");}
function PhotographicSubClothAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Cloth");}
function PhotographicSubClothLowerAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "ClothLower");}
function PhotographicSubShoesAvailable() {return PhotographicAppearanceAvailable(PhotographicSub, "Shoes");}
function PhotographicSubSocksAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Socks")&&!PhotographicAppearanceAvailable(PhotographicSub, "Shoes"));}
function PhotographicSubBraAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Bra")&&!PhotographicAppearanceAvailable(PhotographicSub, "Cloth"));}
function PhotographicSubPantiesAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Panties")&&!PhotographicAppearanceAvailable(PhotographicSub, "Cloth")&&!PhotographicAppearanceAvailable(Player, "ClothLower"));}


function PhotographicLoad() {
	if (PhotographicSub == null) {
		PhotographicSub =  CharacterLoadNPC("NPC_Photographic_Sub");
		PhotographicSubAppearance = PhotographicSub.Appearance.slice();
		PhotographicSub.AllowItem = true;
	}
	if (PhotographicPlayerAppearance == null) PhotographicPlayerAppearance = Player.Appearance.slice();
}

function PhotographicRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(PhotographicSub, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanInteract()) DrawButton(1885, 385, 90, 90, "", "White", "Screens/Room/Photographic/foto.png");
}

function PhotographicClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(PhotographicSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanInteract()) {CharacterAppearanceReturnRoom = "Photographic"; CommonSetScreen("Character", "Appearance");};//
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanInteract()) PhotographicCanvasToPng(750);
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

function PhotographicShotThePlayerPhoto(){
	//ToDo Check Sub ist tied
	PhotographicCanvasToPng(0);
}

function PhotographicPlayerClothRemove(Group){
	InventoryRemove(Player, Group); 
}

function PhotographicAppearanceAvailable(C, Group){
	for (var I = 0; I < C.Appearance.length; I++){
		if (C.Appearance[I].Asset.Group.Name == Group){
			return true;
		}
	}
	return false;
}

function PhotographicPlayerAssetAvailable(Asset, Group){
	for (var I = Player.Inventory.length - 1; I > -1; I--)
		if ((Player.Inventory[I].Name == Asset) && (Player.Inventory[I].Group == Group)) {return true;}
	return false;	
}

function PhotographicPlayerRelease(){
	CharacterRelease(Player);
}

function PhotographicUseAsset(Asset,Group){
	InventoryWear(Player, Asset, Group);
	CharacterRefresh(Player);
}

function PhotographicPlayerDressBack() {
	CharacterDress(Player, PhotographicPlayerAppearance);
}

function PhotographicSubDressBack() {
	CharacterDress(Player, PhotographicPlayerAppearance);
}

function PhotographicSubClothRemove(Group){
	InventoryRemove(PhotographicSub, Group); 
}

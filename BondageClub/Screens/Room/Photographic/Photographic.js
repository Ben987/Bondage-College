"use strict";

var PhotographicBackground = "grey";
var PhotographicSub = null;
var PhotographicPlayerAppearance = null;
var PhotographicGroupStarted = false;
var PhotographicCurrendGroup = null;
var PhotographicSubAppearance = null;
var PhotographicStartInventory = false;
var PhotographicSelectText = "";

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
function PhotographicSubPantiesAvailable() {return (PhotographicAppearanceAvailable(PhotographicSub, "Panties")&&!PhotographicAppearanceAvailable(PhotographicSub, "Cloth")&&!PhotographicAppearanceAvailable(Player, "ClothLower"));}
function PhotographicSubCanAskForPhoto() {return Player.CanTalk() && !PhotographicSub.IsRestrained()}
function PhotographicSubCanWinkForPhoto() {return !Player.CanTalk() && !PhotographicSub.IsRestrained()}

function PhotographicLoad() {
	if (PhotographicSub == null) {
		PhotographicSub = CharacterLoadNPC("NPC_Photographic_Sub");
		PhotographicSubAppearance = PhotographicSub.Appearance.slice();
		PhotographicSub.AllowItem = true;
	}
	if (PhotographicPlayerAppearance == null) PhotographicPlayerAppearance = Player.Appearance.slice();
		PhotographicStartInventory = false;
}

function PhotographicRun() {
	if (!PhotographicStartInventory){
		DrawCharacter(Player, 250, 0, 1);
		DrawCharacter(PhotographicSub, 750, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
		if (Player.CanChange()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
		if (Player.CanInteract()) DrawButton(1885, 385, 90, 90, "", "White", "Screens/Room/Photographic/foto.png");
	} else {//if (PhotographicStartInventory)
		DrawCharacter(Player, 0, 0, 1);
		DrawCharacter(PhotographicSub, 500, 0, 1);
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		var X = 1000;
		var Y = 125;
		// For each items in the inventory
		for(var A = 0; A < Player.Inventory.length; A++)
			if ((Player.Inventory[A] != null) && (Player.Inventory[A].Group != null) && (Player.Inventory[A].Group == Player.FocusGroup.Name)) {
				DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile) ? "cyan" : "white");
				var photoimagepath = "Assets/" + Player.Inventory[A].Asset.Group.Family + "/" + Player.Inventory[A].Group + "/Preview/" + Player.Inventory[A].Name + ".png";
				DrawImageResize( "Assets/" + Player.Inventory[A].Asset.Group.Family + "/" + Player.Inventory[A].Group + "/Preview/" + Player.Inventory[A].Name + ".png", X + 2, Y + 2, 221, 221);
				DrawTextFit(Player.Inventory[A].Name, X + 112, Y + 250, 221, "green");
				X = X + 250;
				if (X > 1800) {
					X = 1000;
					Y = Y + 300;
				}
			}
			
		// Draw the header and empty text if we need too
		if (PhotographicSelectText == "") PhotographicSelectText = TextGet("SelectItemUse");
		if ((X == 1000) && (Y == 125)) DrawText(TextGet("EmptyCategory"), 1500, 500, "White", "Black");
	}
}

function PhotographicClick() {
	if (!PhotographicStartInventory){
		if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(PhotographicSub);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange()) {CharacterAppearanceReturnRoom = "Photographic"; CommonSetScreen("Character", "Appearance");};//
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanInteract()) PhotographicCanvasToPng(750);
	} else {//if (PhotographicStartInventory)
		// The user can select a different body by clicking on the vendor
		if (Player.FocusGroup.Category == "Item")
			if ((MouseX >= 0) && (MouseX < 500) && (MouseY >= 0) && (MouseY < 1000))
				for(var A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
						for(var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if ((MouseX >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - Player.HeightModifier) && (MouseX - 500 <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - Player.HeightModifier))
								Player.FocusGroup = AssetGroup[A];
		// For each items in the inventory
		var X = 1000;
		var Y = 125;
		for(var A = 0; A < Player.Inventory.length; A++)
			if ((Player.Inventory[A] != null) && (Player.Inventory[A].Group != null) && (Player.Inventory[A].Group == Player.FocusGroup.Name)) {
				if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
					InventoryWear(Player, Player.Inventory[A].Name, Player.Inventory[A].Group);
				}
				X = X + 250;
				if (X > 1800) {
					X = 1000;
					Y = Y + 300;
				}
			}
		
		// Exit item select mode
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
			PhotographicStartInventory = false;
			PhotographicSub.Stage = "20";
			Player.FocusGroup = null;
			CharacterSetCurrent(PhotographicSub);
			PhotographicSub.CurrentDialog = TextGet("MoreItem");
			PhotographicBackground = "grey";
		}

	}
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
	if (!PhotographicSub.IsRestrained()){
		CharacterRelease(Player);
	} else {
		PhotographicSub.Stage = "0";
		PhotographicSub.CurrentDialog = DialogFind(PhotographicSub, "PhotographicSubTied");
	}
}

function PhotographicUseAsset(Asset,Group){
	InventoryWear(Player, Asset, Group);
	CharacterRefresh(Player);
}

function PhotographicPlayerDressBack() {
	CharacterDress(Player, PhotographicPlayerAppearance);
}

function PhotographicSubDressBack() {
	CharacterDress(PhotographicSub, PhotographicSubAppearance);
}

function PhotographicSubClothRemove(Group){
	InventoryRemove(PhotographicSub, Group); 
}

function PhotographicStartInventoryPlayer(ItemGroup) {
	PhotographicBackground = "greyDark";

	// Finds the asset group to shop with
	for (var A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == ItemGroup) {
			Player.FocusGroup = AssetGroup[A];
			break;
		}

	// If we have a group, we start the selection
	if (Player.FocusGroup != null) {
		CurrentCharacter = null;
		PhotographicStartInventory = true;
		//ShopText = TextGet("SelectItemBuy");
		PhotographicSelectText = TextGet("SelectItemUse");
	}

}


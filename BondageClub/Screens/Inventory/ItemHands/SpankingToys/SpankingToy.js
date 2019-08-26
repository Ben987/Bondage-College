"use strict";
const SpankingInventory =[
	{
		Name: "Crop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Flogger",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Cane",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 },{ Group: "Eyes", Name: "Wink", Timer: 5 }]
	},{
		Name: "HeartCrop",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }]
	},{
		Name: "Paddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }]
	},{
		Name: "WhipPaddle",
		Bonus: [{ Type: "KidnapDomination", Factor: 3 }], 
		ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Eyes", Name: "Wink", Timer: 5 }]
	}
];

var SpankingCurrentType = null;
let SpankingInventoryOffset = 0;
let nextButton = false;
let SpankingPlayerInventory;
// Loads the item extension properties
function InventoryItemHandsSpankingToysLoad() {
	SpankingPlayerInventory = SpankingInventory.filter(x => Player.Inventory.map(i => i.Name).includes("SpankingToys"+ x.Name));
	if(DialogFocusItem.Property == null) DialogFocusItem.Property = {Type: SpankingCurrentType};
	if(SpankingPlayerInventory.length >4) nextButton = true;
}


//item groups that called the funtion (just forwarding it to SpankingToysDraw()) *brute force, might be a better way to do this
//arms are for selecting
function InventoryItemHandsSpankingToysDraw() {
	// Draw the header and item
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if(nextButton) DrawButton(1775, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawRect(1387, 125, 225, 275, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
	DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");

	DrawText(DialogFind(Player, "SelectSpankingToysType"), 1500, 500, "white", "gray");
	//draw the buttons 4 at a time
	for(let I = SpankingInventoryOffset; (I < SpankingPlayerInventory.length) && (I < SpankingInventoryOffset +4); I++){
		let offset = I - SpankingInventoryOffset;
		DrawButton(1000 + offset*250, 550, 225, 225, "", ((DialogFocusItem.Property.Type == SpankingPlayerInventory[I].Name) ? "#888888" : "White"));
		DrawImage("Screens/Inventory/" + DialogFocusItem.Asset.Group.Name + "/" + DialogFocusItem.Asset.Name + "/" + SpankingPlayerInventory[I].Name + ".png", 1000 + offset*250, 550);
		DrawText(DialogFind(Player, "SpankingToysType" + SpankingPlayerInventory[I].Name), 1115 +offset*250, 800, "white", "gray");
	};
}

// Catches the item extension clicks
function InventoryItemHandsSpankingToysClick() {
	//menu buttons
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1775) && (MouseX <= 1865) && (MouseY >= 25) && (MouseY <= 110) && (nextButton)) SpankingInventoryOffset += 4;
	if(SpankingInventoryOffset > SpankingPlayerInventory.length) SpankingInventoryOffset = 0;

	//Item buttons
	
	for(let I = SpankingInventoryOffset; (I < SpankingPlayerInventory.length) && (I < SpankingInventoryOffset +4); I++){
		let nextItem = SpankingPlayerInventory[I].Name;
		let offset = I - SpankingInventoryOffset;
		if ((MouseX >= 1000 + offset*250) && (MouseX <= 1225 + offset*250) && (MouseY >= 550) && (MouseY <= 775)){
			if(DialogFocusItem.Property.Type != nextItem){
				InventorySpankingToySetType(nextItem);
			}
		}
	}
}


// Uses spanking toy type (cane, crop, flogger, heartcrop)
function InventorySpankingToySetType(NewType) {
	let C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	//set the type
	if (CurrentScreen == "ChatRoom") {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemHandsSpankingToysLoad(); 
	}
	DialogFocusItem.Property.Type = NewType;
	if(C.ID == 0)
		SpankingCurrentType = NewType;

	//update the character
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);

	let msg = "";
	if(C.ID == 0){
		//put on player
		msg = DialogFind(Player, "SpankingToysSetPlayer");
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("Item", (NewType)? NewType.toLowerCase() :"crop");
	} else {
		//put on other characters text
		msg = DialogFind(Player, "SpankingToysSetOthers");
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", C.Name);
		msg = msg.replace("Item", (NewType)? NewType.toLowerCase() :"crop");
	}
	ChatRoomPublishCustomAction(msg, true);
	//exit when done
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}
}


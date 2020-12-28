"use strict";

function InventoryItemPelvisFuturisticChastityBelt2Load() {
	InventoryItemPelvisFuturisticChastityBeltLoad()
}

function InventoryItemPelvisFuturisticChastityBelt2Draw() {
	InventoryItemPelvisFuturisticChastityBeltDraw()
	
}

function InventoryItemPelvisFuturisticChastityBelt2Click() {
	InventoryItemPelvisFuturisticChastityBeltClick()
}

function InventoryItemPelvisFuturisticChastityBelt2Exit() {
	InventoryItemPelvisFuturisticChastityBeltExit()
}


function InventoryItemPelvisFuturisticChastityBelt2Validate(C) { 
	return InventoryItemPelvisFuturisticChastityBeltValidate(C);
}

function InventoryItemPelvisFuturisticChastityBelt2NpcDialog(C, Option) { InventoryItemPelvisFuturisticChastityBeltNpcDialog(C, Option); }


function AssetsItemPelvisFuturisticChastityBelt2ScriptUpdatePlayer(data) {
	AssetsItemPelvisFuturisticChastityBeltScriptUpdatePlayer(data)
}
		
// Update data
function AssetsItemPelvisFuturisticChastityBelt2ScriptDraw(data) {
	AssetsItemPelvisFuturisticChastityBeltScriptDraw(data) 
}

function InventoryItemPelvisFuturisticChastityBelt2PublishAction(C, Option) {

	var msg = "FuturisticChastityBeltSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
} 
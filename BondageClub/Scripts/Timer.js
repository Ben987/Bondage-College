"use strict";
var CurrentTime = 0;
var TimerRunInterval = 20;
var TimerCycle = 0;
var TimerLastTime = CommonTime();

// Returns a string of the current remaining timer
function TimerToString(T) {
	var M = Math.floor(T / 60000).toString();
	var S = Math.floor((T % 60000) / 1000).toString();
	if (S.length == 1) S = "0" + S;
	return M + ":" + S;
}

// Check if we must remove items from a player or an NPC
function TimerInventoryRemove() {
	
	// Cycles through all items items for all offline characters (player + NPC)
	for (var C = 0; C < Character.length; C++)
		if ((Character[C].ID == 0) || (Character[C].MemberNumber == null))
			for (var A = 0; A < Character[C].Appearance.length; A++)
				if ((Character[C].Appearance[A].Property != null) && (Character[C].Appearance[A].Property.RemoveTimer != null))
					if ((typeof Character[C].Appearance[A].Property.RemoveTimer == "number") && (Character[C].Appearance[A].Property.RemoveTimer <= CurrentTime)) {

						// Remove an item from the character
						if ((Character[C].Appearance[A].Asset.Group.Category != null) && (Character[C].Appearance[A].Asset.Group.Category == "Item")) {
							InventoryRemove(Character[C], Character[C].Appearance[A].Asset.Group.Name);
							if (Character[C].ID == 0) ChatRoomCharacterUpdate(Character[C]);
							else ServerPrivateCharacterSync();
							return;
						}

						// Remove an expression (ex: blush)
						if (Character[C].Appearance[A].Asset.Group.AllowExpression != null) {
							CharacterSetFacialExpression(Character[C], Character[C].Appearance[A].Asset.Group.Name, null);
							delete Character[C].Appearance[A].Property.RemoveTimer;
							if (Character[C].ID == 0) ChatRoomCharacterUpdate(Character[C]);
							else ServerPrivateCharacterSync();
							return;
						}

					}

}

// Sets a remove timer in seconds for a specific item part / body part
function TimerInventoryRemoveSet(C, AssetGroup, Timer) {
	for (var E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.Group.Name == AssetGroup) {
			if (C.Appearance[E].Property == null) C.Appearance[E].Property = {};
			C.Appearance[E].Property.RemoveTimer = CurrentTime + Timer * 1000;
			break;
		}
	CharacterRefresh(C);
	ChatRoomCharacterUpdate(C);
}

// Main timer process
function TimerProcess() {

	// Increments the time from the last frame
	var TimeCurrent = CommonTime();
	TimerRunInterval = TimeCurrent - TimerLastTime;
	TimerLastTime = TimeCurrent;
	CurrentTime = CurrentTime + TimerRunInterval;

	// At each 100 cycles, we check to automatically remove inventory
	TimerCycle++;
	if (TimerCycle % 100 == 0) TimerInventoryRemove();

}
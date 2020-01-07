"use strict";
var CurrentTime = 0;
var TimerRunInterval = 20;
var TimerCycle = 0;
var TimerLastTime = CommonTime();

// Returns a string of the current remaining timer
function TimerToString(T) {
	var D = Math.floor(T / 86400000).toString();
	var H = Math.floor((T % 86400000) / 3600000).toString();
	var M = Math.floor((T % 3600000) / 60000).toString();
	var S = Math.floor((T % 60000) / 1000).toString();
	if (S.length == 1) S = "0" + S;
	if (M.length == 1) M = "0" + M;
	if (H.length == 1) H = "0" + H;
	return ((D != "0") ? D + ":" : "") + (((D != "0") || (H != "00")) ? H + ":" : "") + M + ":" + S;
}

// Returns a string of the current remaining timer
function TimerHourToString(T) {
	var M = T.getMinutes().toString();
	var H = T.getHours().toString();
	if (M.length == 1) M = "0" + M;
	return H + ":" + M;
}

// Check if we must remove items from a player or an NPC
function TimerInventoryRemove() {

	// Cycles through all items items for all offline characters (player + NPC)
	for (var C = 0; C < Character.length; C++)
		if ((Character[C].ID == 0) || (Character[C].MemberNumber == null))
			for (var A = 0; A < Character[C].Appearance.length; A++)
				if ((Character[C].Appearance[A].Property != null) && (Character[C].Appearance[A].Property.RemoveTimer != null))
					if ((typeof Character[C].Appearance[A].Property.RemoveTimer == "number") && (Character[C].Appearance[A].Property.RemoveTimer <= CurrentTime)) {

						// Remove any lock or timer
						delete Character[C].Appearance[A].Property.LockedBy;
						delete Character[C].Appearance[A].Property.LockMemberNumber;
						delete Character[C].Appearance[A].Property.RemoveTimer;
						delete Character[C].Appearance[A].Property.MaxTimer;
						delete Character[C].Appearance[A].Property.ShowTimer;
						delete Character[C].Appearance[A].Property.EnableRandomInput;
						delete Character[C].Appearance[A].Property.MemberNumberList;
						if (Character[C].Appearance[A].Property.Effect != null)
							for (var E = 0; E < Character[C].Appearance[A].Property.Effect.length; E++)
								if (Character[C].Appearance[A].Property.Effect[E] == "Lock")
									Character[C].Appearance[A].Property.Effect.splice(E, 1);

						// If we must remove the linked item from the character or the facial expression
						console.log(Character[C].Appearance[A].Property+(Character[C].Appearance[A].Asset.Group.Name));
						if ((Character[C].Appearance[A].Property.RemoveItem != null) && Character[C].Appearance[A].Property.RemoveItem && (Character[C].Appearance[A].Asset.Group.Category != null) && (Character[C].Appearance[A].Asset.Group.Category == "Item"))
							InventoryRemove(Character[C], Character[C].Appearance[A].Asset.Group.Name);
						else
							if (Character[C].Appearance[A].Asset.Group.AllowExpression != null)
								CharacterSetFacialExpression(Character[C], Character[C].Appearance[A].Asset.Group.Name, null);
							else
								CharacterRefresh(Character[C]);

						// Sync with the server and exit
						if (Character[C].ID == 0) ChatRoomCharacterUpdate(Character[C]);
						else ServerPrivateCharacterSync();
						return;

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

// On a random chance, the private room owner can beep the player anywhere in the club, she has 2 minutes to get back to her
function TimerPrivateOwnerBeep() {
	if ((Player.Owner != "") && (Player.Ownership == null) && (CurrentScreen != "Private") && (CurrentScreen != "ChatRoom") && (CurrentScreen != "InformationSheet") && (CurrentScreen != "FriendList") && (CurrentScreen != "Cell") && PrivateOwnerInRoom())
		if ((Math.floor(Math.random() * 500) == 1) && !LogQuery("OwnerBeepActive", "PrivateRoom") && !LogQuery("OwnerBeepTimer", "PrivateRoom") && !LogQuery("LockOutOfPrivateRoom", "Rule") && !LogQuery("Committed", "Asylum")) {
			ServerBeep.Timer = CurrentTime + 15000;
			ServerBeep.Message = DialogFind(Player, "BeepFromOwner");
			LogAdd("OwnerBeepActive", "PrivateRoom");
			LogAdd("OwnerBeepTimer", "PrivateRoom", CurrentTime + 120000);
			FriendListBeepLog.push({ MemberName: Player.Owner, ChatRoomName: DialogFind(Player, "YourRoom"), Sent: false, Time: new Date() });
		}
}

// Main timer process
function TimerProcess(Timestamp) {

	// Increments the time from the last frame
	TimerRunInterval = Timestamp - TimerLastTime;
	TimerLastTime = Timestamp;
	CurrentTime = CurrentTime + TimerRunInterval;

	// At each 100 cycles, we check for timed events
	TimerCycle++;
	if (TimerCycle % 100 == 0) {
		TimerInventoryRemove();
		TimerPrivateOwnerBeep();
	}

	// Launches the main again for the next frame
	requestAnimationFrame(MainRun);

}

// Convert milliseconds to written time
function TimermsToTime(s) {

	// Pad to 2 or 3 digits, default is 2
	function pad(n, z) {
	  z = z || 2;
	  return ('00' + n).slice(-z);
	}
  
	// Returns the formatted value
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
	
  }
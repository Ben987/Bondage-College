"use strict";
var CurrentTime = 0;
var TimerRunInterval = 20;
var TimerCycle = 0;
var TimerLastTime = CommonTime();
var TimerLastArousalProgress = 0;
var TimerLastArousalProgressCount = 0;
var TimerLastArousalDecay = 0;

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
						var LockName = Character[C].Appearance[A].Property.LockedBy;

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

						// If we're removing a lock and we're in a chatroom, send a chatroom message
						if (LockName && CurrentScreen === "ChatRoom") {
							var Dictionary = [
								{Tag: "DestinationCharacterName", Text: Character[C].Name, MemberNumber: Character[C].MemberNumber},
								{Tag: "FocusAssetGroup", AssetGroupName: Character[C].Appearance[A].Asset.Group.Name},
								{Tag: "LockName", AssetName: LockName}
							];
							ServerSend("ChatRoomChat", {Content: "TimerRelease", Type: "Action", Dictionary});
						}

						// If we must remove the linked item from the character or the facial expression
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
			C.Appearance[E].Property.RemoveTimer = Math.round(CurrentTime + Timer * 1000);
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

	// Arousal/Activity events only occur in allowed rooms
	if (ActivityAllowed()) {

		// Arousal can change every second, based on ProgressTimer
		if ((TimerLastArousalProgress + 1000 < CurrentTime) || (TimerLastArousalProgress - 1000 > CurrentTime)) {
			TimerLastArousalProgress = CurrentTime;
			TimerLastArousalProgressCount++;
			for (var C = 0; C < Character.length; C++) {

				// If the character is having an orgasm and the timer ran out, we move to the next orgasm stage
				if ((Character[C].ArousalSettings != null) && (Character[C].ArousalSettings.OrgasmTimer != null) && (Character[C].ArousalSettings.OrgasmTimer > 0)) {
					if (Character[C].ArousalSettings.OrgasmTimer < CurrentTime) {
						if ((Character[C].ArousalSettings.OrgasmStage == null) || (Character[C].ArousalSettings.OrgasmStage <= 1)) ActivityOrgasmStart(Character[C]);
						else ActivityOrgasmStop(Character[C], 20);
					}
				} else {

					// Depending on the character settings, we progress the arousal meter
					if ((Character[C].ArousalSettings != null) && (Character[C].ArousalSettings.Active != null) && ((Character[C].ArousalSettings.Active == "Automatic") || (Character[C].ArousalSettings.Active == "Hybrid"))) {

						// Activity impacts the progress slowly over time, if there's an activity running, vibrations are ignored
						if ((Character[C].ArousalSettings.ProgressTimer != null) && (typeof Character[C].ArousalSettings.ProgressTimer === "number") && !isNaN(Character[C].ArousalSettings.ProgressTimer) && (Character[C].ArousalSettings.ProgressTimer != 0)) {
							if (Character[C].ArousalSettings.ProgressTimer < 0) {
								Character[C].ArousalSettings.ProgressTimer++;
								ActivityTimerProgress(Character[C], -1);
							}
							else {
								Character[C].ArousalSettings.ProgressTimer--;
								ActivityTimerProgress(Character[C], 1);
							}
						} else if (Character[C].IsEgged()) {

							// If the character is egged, we find the highest intensity factor and affect the progress, low and medium vibrations have a cap
							var Factor = -1;
							for (var A = 0; A < Character[C].Appearance.length; A++) {
								var Item = Character[C].Appearance[A];
								var ZoneFactor = PreferenceGetZoneFactor(Character[C], Item.Asset.ArousalZone) - 2;
								if (InventoryItemHasEffect(Item, "Egged", true) && (Item.Property != null) && (Item.Property.Intensity != null) && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity >= 0) && (ZoneFactor >= 0) && (Item.Property.Intensity + ZoneFactor > Factor)){
									if ((Character[C].ArousalSettings.Progress < 95) || PreferenceGetZoneOrgasm(Character[C], Item.Asset.ArousalZone))
										Factor = Item.Property.Intensity + ZoneFactor;
								}
							}
							if ((Factor >= 4) && (TimerLastArousalProgressCount % 2 == 0)) ActivityTimerProgress(Character[C], 1);
							if ((Factor == 3) && (TimerLastArousalProgressCount % 3 == 0)) ActivityTimerProgress(Character[C], 1);
							if ((Factor == 2) && (TimerLastArousalProgressCount % 4 == 0) && (Character[C].ArousalSettings.Progress <= 95)) ActivityTimerProgress(Character[C], 1);
							if ((Factor == 1) && (TimerLastArousalProgressCount % 6 == 0) && (Character[C].ArousalSettings.Progress <= 65)) ActivityTimerProgress(Character[C], 1);
							if ((Factor == 0) && (TimerLastArousalProgressCount % 8 == 0) && (Character[C].ArousalSettings.Progress <= 35)) ActivityTimerProgress(Character[C], 1);

						}

					}
				}
			}
		}

		// Arousal decays by 1 naturally every 12 seconds, unless there's already a natural progression from an activity
		if ((TimerLastArousalDecay + 12000 < CurrentTime) || (TimerLastArousalDecay - 12000 > CurrentTime)) {
			TimerLastArousalDecay = CurrentTime;
			for (var C = 0; C < Character.length; C++)
				if ((Character[C].ArousalSettings != null) && (Character[C].ArousalSettings.Active != null) && ((Character[C].ArousalSettings.Active == "Automatic") || (Character[C].ArousalSettings.Active == "Hybrid")))
					if ((Character[C].ArousalSettings.Progress != null) && (typeof Character[C].ArousalSettings.Progress === "number") && !isNaN(Character[C].ArousalSettings.Progress) && (Character[C].ArousalSettings.Progress > 0)) 
						if ((Character[C].ArousalSettings.ProgressTimer == null) || (typeof Character[C].ArousalSettings.ProgressTimer !== "number") || isNaN(Character[C].ArousalSettings.ProgressTimer) || (Character[C].ArousalSettings.ProgressTimer == 0)) {

							// If the character is egged, we find the highest intensity factor
							var Factor = -1;
							for (var A = 0; A < Character[C].Appearance.length; A++) {
								var Item = Character[C].Appearance[A];
								var ZoneFactor = PreferenceGetZoneFactor(Character[C], Item.Asset.ArousalZone) - 2;
								if (InventoryItemHasEffect(Item, "Egged", true) && (Item.Property != null) && (Item.Property.Intensity != null) && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity >= 0) && (ZoneFactor >= 0) && (Item.Property.Intensity + ZoneFactor > Factor))
									if ((Character[C].ArousalSettings.Progress < 95) || PreferenceGetZoneOrgasm(Character[C], Item.Asset.ArousalZone))
										Factor = Item.Property.Intensity + ZoneFactor;
							}

							// No decay if there's a vibrating item running
							if (Factor < 0) ActivityTimerProgress(Character[C], -1);

						}
		}

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
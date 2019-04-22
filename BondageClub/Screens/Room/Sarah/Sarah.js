"use strict";
var SarahBackground = "";
var SarahStatus = "";
var AmandaStatus = "";
var Sarah = null;
var Amanda = null;
var Sophie = null;
var SarahInside = true;
var AmandaInside = false;
var SophieInside = false;
var SarahUnlockQuest = false;
var SarahCharacter = [];

// Returns TRUE if a dialog condition matches
function SarahStatusIs(QueryStatus) { return (QueryStatus == SarahStatus) }
function SarahAmandaStatusIs(QueryStatus) { return (QueryStatus == AmandaStatus) }
function SarahCanKissLover() { return (Player.CanTalk() && Sarah.CanTalk() && (Player.Lover == "NPC-Sarah")) }
function SarahCanKissNotLover() { return (Player.CanTalk() && Sarah.CanTalk() && (Player.Lover != "NPC-Sarah")) }
function SarahCanSpankOwner() { return (Player.CanInteract() && (Sarah.Owner == Player.Name)) }
function SarahCanSpankNotOwner() { return (Player.CanInteract() && (Sarah.Owner != Player.Name)) }
function SarahCanInviteToRoomFriend() { return (Player.CanWalk() && Sarah.CanWalk() && (Sarah.Owner != Player.Name) && (PrivateCharacter.length < PrivateCharacterMax) && LogQuery("RentRoom", "PrivateRoom")) }
function SarahCanInviteToRoomSlave() { return (Player.CanWalk() && Sarah.CanWalk() && (Sarah.Owner == Player.Name) && (PrivateCharacter.length < PrivateCharacterMax) && LogQuery("RentRoom", "PrivateRoom")) }
function SarahCanInviteAmandaToRoom() { return (Player.CanWalk() && Amanda.CanWalk() && (PrivateCharacter.length < PrivateCharacterMax) && (!SarahInside || (Amanda.Owner == Player.Name)) && LogQuery("RentRoom", "PrivateRoom")) }
function SarahCanInviteAmandaToRoomRefuse() { return (Player.CanWalk() && Amanda.CanWalk() && (PrivateCharacter.length < PrivateCharacterMax) && SarahInside && (Amanda.Owner != Player.Name) && LogQuery("RentRoom", "PrivateRoom")) }
function SarahCanKickAmandaOut() { return (Amanda.CanWalk() && (Player.Owner != "NPC-Amanda") && (!SarahInside || (Amanda.Owner == Player.Name))) }
function SarahCanKickAmandaOutRefuse() { return (Amanda.CanWalk() && (Player.Owner != "NPC-Amanda") && SarahInside && (Amanda.Owner != Player.Name)) }
function SarahShackled() { return (SarahInside && (Sarah != null) && (InventoryGet(Sarah, "ItemArms") != null) && (InventoryGet(Sarah, "ItemArms").Asset.Name == "FourLimbsShackles")) }
function SarahAmandaHasStrapon() { return (Player.CanInteract() && AmandaInside && (Amanda != null) && (InventoryGet(Amanda, "ItemPelvis") != null) && (InventoryGet(Amanda, "ItemPelvis").Asset.Name == "StraponPanties")) }
function SarahAmandaHasNoStrapon() { return (Player.CanInteract() && AmandaInside && (Amanda != null) && !Amanda.IsVulvaChaste()) }
function SarahKnowAmandaInRoom() { return (SarahInside && AmandaInside && (Sarah != null) && (Amanda != null) && !Sarah.CanInteract() && (!Sarah.IsBlind() || Amanda.CanTalk())) }
function SarahAmandaCanKiss() { return (AmandaInside && (Amanda != null) && Player.CanTalk() && Amanda.CanTalk() && (Player.Lover == "NPC-Amanda")) }

// Returns the correct label for Sarah's room
function SarahRoomLabel() {
	if (!SarahInside) return "ExploreClub";
	if ((SarahStatus != "") && (!SarahIntroDone) && (LogQuery("SarahWillBePunished", "NPC-SarahIntro") || LogQuery("SarahWillBePunished", "NPC-SarahIntro"))) return "SearchSarah";
	if ((SarahStatus != "") && (!SarahIntroDone) && !LogQuery("SarahWillBePunished", "NPC-SarahIntro") && !LogQuery("SarahWillBePunished", "NPC-SarahIntro")) return "ExploreClub";
	if (SarahIntroDone) return "SarahBedroom";
	return "ExploreClub";
}

// Sets Sarah and Amanda status
function SarahSetStatus() {
	
	// Sarah status depends on Bondage College imported data
	if (LogQuery("BondageCollege", "Import")) SarahStatus = "SchoolMate";
	if (LogQuery("SarahLover", "NPC-Sarah") && (Player.Lover == "NPC-Sarah")) SarahStatus = "Lover";
	if (LogQuery("SarahLover", "NPC-Sarah") && (Player.Lover != "NPC-Sarah")) SarahStatus = "ExLover";
	if (LogQuery("SarahCollared", "NPC-Sarah")) SarahStatus = "Owned";
	if (LogQuery("SarahCollaredWithCurfew", "NPC-Sarah")) SarahStatus = "Curfew";
	if (LogQuery("SarahWillBePunished", "NPC-SarahIntro")) SarahStatus = "WillBePunished";
	if (LogQuery("SarahCameWithPlayer", "NPC-SarahIntro")) SarahStatus = "CameWithPlayer";
	
	// Amanda status depends on Bondage College imported data
	if (LogQuery("BondageCollege", "Import")) AmandaStatus = "SchoolMate";
	if (LogQuery("AmandaLover", "NPC-Amanda") && (Player.Lover == "NPC-Amanda")) AmandaStatus = "Lover";
	if (LogQuery("AmandaLover", "NPC-Amanda") && (Player.Lover != "NPC-Amanda")) AmandaStatus = "ExLover";
	if (LogQuery("AmandaCollared", "NPC-Amanda")) AmandaStatus = "Owned";
	if (LogQuery("AmandaCollaredWithCurfew", "NPC-Amanda")) AmandaStatus = "Curfew";
	if (LogQuery("AmandaMistress", "NPC-Amanda") && (Player.Owner == "NPC-Amanda")) AmandaStatus = "Owner";
	if (LogQuery("AmandaMistress", "NPC-Amanda") && (Player.Owner != "NPC-Amanda")) AmandaStatus = "ExOwner";
	
	// They are not accessible if they already are in the private room
	for(var P = 0; P < PrivateCharacter.length; P++) {
		if (PrivateCharacter[P].Name.trim() == "Sarah") { SarahStatus = "InPrivateRoom"; SarahInside = false; }
		if (PrivateCharacter[P].Name.trim() == "Amanda") AmandaStatus = "InPrivateRoom";
	}
}

// Loads the Sarah room
function SarahLoad() {
	
	// Add the player if we need too
	if (SarahCharacter.length == 0)
		SarahCharacter.push(Player);

	// If Sarah is inside the room
	if (SarahInside && (SarahStatus != "InPrivateRoom")) {

		// If we must show the intro scene
		if (!SarahIntroDone) {
			CommonSetScreen("Cutscene", "SarahIntro");
			SarahIntroDone = true;
		} else if (Sarah == null) {

			// Creates Sarah and equips her like in the Bondage Club original story
			Sarah = CharacterLoadNPC("NPC_Sarah");
			Sarah.Name = "Sarah";
			Sarah.AllowItem = false;
			CharacterNaked(Sarah);
			InventoryRemove(Sarah, "Nipples");
			InventoryWear(Sarah, "PussyLight1", "Pussy", "#edd6b0");
			InventoryWear(Sarah, "Eyes1", "Eyes", "#b98364");
			InventoryWear(Sarah, "Mouth1", "Mouth", "Default");
			InventoryWear(Sarah, "Small", "BodyUpper", "White");
			InventoryWear(Sarah, "Small", "BodyLower", "White");
			InventoryWear(Sarah, "Default", "Hands", "White");
			InventoryWear(Sarah, "HairBack19", "HairBack", "#edd6b0");
			InventoryWear(Sarah, "HairFront11", "HairFront", "#edd6b0");
			InventoryWear(Sarah, "Bra2", "Bra", "#a02424");
			InventoryWear(Sarah, "Panties7", "Panties", "#a02424");
			InventoryWear(Sarah, "FourLimbsShackles", "ItemArms");
			InventoryWear(Sarah, "StuddedBlindfold", "ItemHead");
			InventoryAdd(Sarah, "StuddedBlindfold", "ItemHead");
			if ((SarahStatus == "Owned") || (SarahStatus == "Curfew")) {
				InventoryWear(Sarah, "SlaveCollar", "ItemNeck");
				Sarah.Owner = Player.Name;
			}
			CharacterSetActivePose(Sarah, "Kneel");
			AmandaIntroTime = CurrentTime + 400000;
			SarahCharacter.push(Sarah);
			
		}
	}

	// Loads Amanda if we need
	if (AmandaInside && (Amanda == null) && (AmandaStatus != "InPrivateRoom")) {

		// Creates Sarah and equips her like in the Bondage Club original story
		Amanda = CharacterLoadNPC("NPC_Amanda");
		Amanda.Name = "Amanda";
		Amanda.AllowItem = true;
		CharacterNaked(Amanda);
		InventoryRemove(Amanda, "Nipples");
		InventoryWear(Amanda, "PussyLight3", "Pussy", "#623123");
		InventoryWear(Amanda, "Eyes7", "Eyes", "#3f289f");
		InventoryWear(Amanda, "Eyes7", "Eyes", "#3f289f");
		InventoryWear(Amanda, "Mouth1", "Mouth", "Default");
		InventoryWear(Amanda, "Normal", "BodyUpper", "White");
		InventoryWear(Amanda, "Normal", "BodyLower", "White");
		InventoryWear(Amanda, "Default", "Hands", "White");
		InventoryWear(Amanda, "HairBack15", "HairBack", "#623123");
		InventoryWear(Amanda, "HairFront4", "HairFront", "#623123");
		InventoryAdd(Amanda, "StraponPanties", "ItemPelvis");
		InventoryWear(Amanda, "StraponPanties", "ItemPelvis");
		InventoryWear(Amanda, "HempRope", "ItemArms");
		InventoryWear(Amanda, "DuctTapeGag", "ItemMouth");
		if ((AmandaStatus == "Owned") || (AmandaStatus == "Curfew")) {
			InventoryWear(Amanda, "SlaveCollar", "ItemNeck");
			Amanda.Owner = Player.Name;
		}
		SophieIntroTime = CurrentTime + 600000;
		SarahCharacter.splice(1, 0, Amanda);

	}

}

// Loads the Amanda character
function AmandaLoad() {
	
	// If we must show the intro scene
	if (!AmandaIntroDone) {
		if (CurrentCharacter != null) DialogLeave();
		SarahIntroType = "AmandaExplore";
		CommonSetScreen("Cutscene", "SarahIntro");
		AmandaInside = true;
		AmandaIntroDone = true;
	}

}

// Check to load new characters
function SarahLoadNewCharacter() {
	
	// Amanda can be loaded if Sarah isn't there or after 10 minutes with Sarah.  She must not be in the player room.
	if (!AmandaInside && (AmandaStatus != "InPrivateRoom") && ((AmandaIntroTime <= CurrentTime) && (AmandaIntroTime > 0))) AmandaLoad();
	if (!AmandaInside && (AmandaStatus != "InPrivateRoom") && !AmandaIntroDone && !SarahInside) AmandaLoad();
	
}

// Make sure the background is proper
function SarahLoadBackground() {
	SarahBackground = "SarahBedroom0";
	SarahBackground = "SarahBedroom" + (SarahCharacter.length - 2).toString();
	if (!SarahInside || (Sarah == null) || !Sarah.IsKneeling()) SarahBackground = "SarahBedroom3";
}

// Run the main introduction room, draw all 3 characters
function SarahRun() {
	SarahLoadNewCharacter();
	SarahLoadBackground();
	for(var C = 0; C < SarahCharacter.length; C++)
		DrawCharacter(SarahCharacter[C], 1000 - (SarahCharacter.length * 250) + (C * 500), (SarahCharacter[C].IsKneeling()) ? -270 : 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function SarahClick() {
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	for(var C = 0; C < SarahCharacter.length; C++)
		if ((MouseX >= 1000 - (SarahCharacter.length * 250) + (C * 500)) && (MouseX < 1500 - (SarahCharacter.length * 250) + (C * 500)) && (MouseY >= 0) && (MouseY < 1000) && (MouseX < 1885))
			CharacterSetCurrent(SarahCharacter[C]);
}

// Increments the number of activities done with Sarah (after 10, Amanda comes in)
function SarahActivityRun() {
	if (AmandaIntroTime > 0) AmandaIntroTime = AmandaIntroTime - 60000;
	if (SophieIntroTime > 0) SophieIntroTime = SophieIntroTime - 60000;
	SarahLoadNewCharacter();
}

// Checks Sarah shackles
function SarahCheckShackles() {
	SarahActivityRun();
	IntroductionSetZone("ItemArms");
	Player.FocusGroup = null;
	DialogInventoryBuild(Sarah);
	Sarah.CurrentDialog = DialogFind(Sarah, "FoundWayToUnlock");
}

// Starts the Sarah unlock quest
function SarahStartUnlockQuest() {
	SarahUnlockQuest = true;
	DialogLeave();
}

// Unlocks Sarah from her predicament
function SarahUnlock() {
	CharacterRelease(Sarah);
	SarahUnlockQuest = false;
	Sarah.Stage = "200";
	CharacterSetActivePose(Sarah, null);
}

function SarahEvasion() {
	SarahUnlock();
	DialogLeave();
}

// When Sarah leaves the room
function SarahLeaveRoom() {
	for(var C = 1; C < SarahCharacter.length; C++)
		if (SarahCharacter[C].Name == "Sarah")
			SarahCharacter.splice(C, 1);
	SarahInside = false;
	DialogLeave();
}

// When Sarah transfers to the player room
function SarahTransferToRoom() {
	SarahLeaveRoom();
	CharacterRelease(Sarah);
	InventoryWear(Sarah, "CollegeOutfit1", "Cloth");
	InventoryWear(Sarah, "Socks4", "Socks");
	InventoryWear(Sarah, "Shoes2", "Shoes", "#222222");	
	InventoryAdd(Player, "StuddedBlindfold", "ItemHead");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(Sarah, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Submissive", 70);
	NPCTraitSet(C, "Violent", 50);
	NPCTraitSet(C, "Horny", 40);
	NPCTraitSet(C, "Dumb", 20);
	NPCTraitSet(C, "Playful", 90);
	C.Love = 20;
	if (Sarah.Owner == Player.Name) {
		NPCEventAdd(C, "NPCCollaring", CurrentTime);
		InventoryWear(C, "SlaveCollar", "ItemNeck");
		C.Owner = Player.Name;
		C.Love = 100;
	}
	if (Player.Lover == "NPC-Sarah") {
		C.Lover = Player.Name;
		C.Love = 100;
	}
	if (LogQuery("AmandaSarahLovers", "NPC-AmandaSarah")) C.Lover = "NPC-Amanda";
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
}

// When Sarah leaves the room
function SarahAmandaLeaveRoom() {
	for(var C = 1; C < SarahCharacter.length; C++)
		if (SarahCharacter[C].Name == "Amanda")
			SarahCharacter.splice(C, 1);
	AmandaInside = false;
	DialogLeave();
}

// When Amanda transfers to the room
function SarahTransferAmandaToRoom() {
	SarahAmandaLeaveRoom();
	CharacterRelease(Amanda);
	if ((InventoryGet(Amanda, "ItemPelvis") != null) && (InventoryGet(Amanda, "ItemPelvis").Asset.Name == "StraponPanties")) InventoryRemove(Amanda, "ItemPelvis");
	InventoryWear(Amanda, "CollegeOutfit1", "Cloth");
	InventoryWear(Amanda, "Socks4", "Socks");
	InventoryWear(Amanda, "Shoes1", "Shoes", "#222222");
	InventoryWear(Amanda, "Bra1", "Bra", "#bbbbbb");
	InventoryWear(Amanda, "Panties1", "Panties", "#bbbbbb");
	InventoryAdd(Player, "StraponPanties", "ItemPelvis");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(Amanda, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Peaceful", 70);
	NPCTraitSet(C, "Wise", 90);
	NPCTraitSet(C, "Serious", 30);
	NPCTraitSet(C, "Polite", 50);
	C.Love = 20;
	if (Amanda.Owner == Player.Name) {
		NPCEventAdd(C, "NPCCollaring", CurrentTime);
		InventoryWear(C, "SlaveCollar", "ItemNeck");
		C.Owner = Player.Name;
		C.Love = 100;
	}
	if (Player.Lover == "NPC-Amanda") {
		C.Lover = Player.Name;
		C.Love = 100;
	}
	if (Player.Owner == "NPC-Amanda") {
		NPCEventAdd(C, "PlayerCollaring", CurrentTime);
		NPCEventAdd(C, "LastGift", CurrentTime);
		C.Love = 100;
	}
	if (LogQuery("AmandaSarahLovers", "NPC-AmandaSarah")) C.Lover = "NPC-Sarah";
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
}
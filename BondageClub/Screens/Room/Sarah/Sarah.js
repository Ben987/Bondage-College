"use strict";
var SarahBackground = "SarahBedroom";
var SarahStatus = "";
var Sarah = null;
var SarahActivityCount = 0;
var SarahUnlockQuest = false;
var SarahLeft = false;

// Returns TRUE if a dialog condition matches
function SarahStatusIs(QueryStatus) { return (QueryStatus == SarahStatus) }
function SarahCanKissLover() { return (Player.CanTalk() && Sarah.CanTalk() && (Player.Lover == "NPC-Sarah")) }
function SarahCanKissNotLover() { return (Player.CanTalk() && Sarah.CanTalk() && (Player.Lover != "NPC-Sarah")) }
function SarahCanSpankOwner() { return (Player.CanInteract() && (Sarah.Owner == Player.Name)) }
function SarahCanSpankNotOwner() { return (Player.CanInteract() && (Sarah.Owner != Player.Name)) }
function SarahCanInviteToRoomFriend() { return (Player.CanWalk() && Sarah.CanWalk() && (Sarah.Owner != Player.Name) && (PrivateCharacter.length < PrivateCharacterMax)) }
function SarahCanInviteToRoomSlave() { return (Player.CanWalk() && Sarah.CanWalk() && (Sarah.Owner == Player.Name) && (PrivateCharacter.length < PrivateCharacterMax)) }

// Sets Sarah status
function SarahSetStatus() {
	if (LogQuery("BondageCollege", "Import")) SarahStatus = "SchoolMate";
	if (LogQuery("SarahLover", "NPC-Sarah") && (Player.Lover == "NPC-Sarah")) SarahStatus = "Lover";
	if (LogQuery("SarahLover", "NPC-Sarah") && (Player.Lover != "NPC-Sarah")) SarahStatus = "ExLover";
	if (LogQuery("SarahCollared", "NPC-Sarah")) SarahStatus = "Owned";
	if (LogQuery("SarahCollaredWithCurfew", "NPC-Sarah")) SarahStatus = "Curfew";
	if (LogQuery("SarahWillBePunished", "NPC-Sarah")) SarahStatus = "WillBePunished";
	if (LogQuery("SarahCameWithPlayer", "NPC-Sarah")) SarahStatus = "CameWithPlayer";
}

// Loads the Sarah room
function SarahLoad() {

	// If we must show the intro scene
	if (!SarahIntroDone)
		CommonSetScreen("Cutscene", "SarahIntro");
	else if (Sarah == null) {

			// Creates Sarah and equips her like in the Bondage Club original story
			Sarah = CharacterLoadNPC("NPC_Sarah");
			Sarah.Name = "Sarah";
			Sarah.AllowItem = false;
			CharacterNaked(Sarah);
			InventoryWear(Sarah, "Eyes1", "Eyes", "#b98364");
			InventoryWear(Sarah, "Mouth1", "Mouth", "Default");
			InventoryWear(Sarah, "Small", "BodyUpper", "White");
			InventoryWear(Sarah, "Small", "BodyLower", "White");
			InventoryWear(Sarah, "Default", "Hands", "White");
			InventoryWear(Sarah, "HairBack19", "HairBack", "#edd6b0");
			InventoryWear(Sarah, "HairFront11", "HairFront", "#edd6b0");
			InventoryWear(Sarah, "Bra1", "Bra", "#a02424");
			InventoryWear(Sarah, "Panties1", "Panties", "#a02424");
			InventoryWear(Sarah, "FourLimbsShackles", "ItemArms");
			InventoryWear(Sarah, "StuddedBlindfold", "ItemHead");
			if ((SarahStatus == "Owned") || (SarahStatus == "Curfew")) {
				InventoryWear(Sarah, "SlaveCollar", "ItemNeck");
				Sarah.Owner = Player.Name;
			}
			CharacterSetActivePose(Sarah, "Kneel");

	}

}

// Run the main introduction room, draw all 3 characters
function SarahRun() {
	DrawCharacter(Player, 500, 0, 1);
	if (!SarahLeft) DrawCharacter(Sarah, 1000, (Sarah.IsKneeling()) ? -270 : 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function SarahClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !SarahLeft) CharacterSetCurrent(Sarah);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// Increments the number of activities done with Sarah (after 10, Amanda comes in)
function SarahActivityRun() {
	SarahActivityCount++;
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
	SarahBackground = "SarahBedroomLeft";
	Sarah.Stage = "200";
	CharacterSetActivePose(Sarah, null);
}

// When Sarah leaves the room
function SarahLeaveRoom() {
	SarahLeft = true;
	DialogLeave();
}

// When Sarah transfers to the player room
function SarahTransferToRoom() {
	SarahLeaveRoom();
	CharacterRelease(Sarah);
	InventoryWear(Sarah, "CollegeOutfit1", "Cloth");
	InventoryWear(Sarah, "Socks4", "Socks");
	InventoryWear(Sarah, "Shoes2", "Shoes");	
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(Sarah, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Submissive", 70);
	NPCTraitSet(C, "Violent", 50);
	NPCTraitSet(C, "Horny", 40);
	NPCTraitSet(C, "Dumb", 20);
	NPCTraitSet(C, "Playful", 90);
	if (Sarah.Owner == Player.Name) {
		InventoryWear(Sarah, "SlaveCollar", "ItemNeck");
		C.Owner = Player.Name;
		C.Love = 100;
	} else C.Love = 20;
	NPCTraitDialog(C);
	NPCEventAdd(C, "NPCCollaring", CurrentTime);
	ServerPrivateCharacterSync();
}
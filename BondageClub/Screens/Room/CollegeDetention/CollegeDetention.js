"use strict";
var CollegeDetentionBackground = "CollegeDetention";
var CollegeDetentionYuki = null;
var CollegeDetentionYukiLove = 0;
var CollegeDetentionYukiWillReleaseAt = 0;

// Returns TRUE if the dialog option should be shown
function CollegeDetentionCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }
function CollegeDetentionYukiLoveIs(LoveLevel) { return (CollegeDetentionYukiLove >= parseInt(LoveLevel)) }
function CollegeDetentionGetSleepingPills() { InventoryAdd(Player, "RegularSleepingPill", "ItemMouth") }
function CollegeDetentionYukiWillRelease() { return (CollegeDetentionYukiWillReleaseAt < CurrentTime) }

// Fully dress-up Yuki
function CollegeDetentionYukiClothes() {
	CharacterNaked(CollegeDetentionYuki);
	InventoryWear(CollegeDetentionYuki, "TeacherOutfit1", "Cloth", "Default");
	InventoryWear(CollegeDetentionYuki, "PussyDark3", "Pussy", "#333333");
	InventoryWear(CollegeDetentionYuki, "Eyes1", "Eyes", "#a57b78");
	InventoryWear(CollegeDetentionYuki, "Glasses1", "Glasses", "#333333");
	InventoryWear(CollegeDetentionYuki, "Mouth1", "Mouth", "Default");
	InventoryWear(CollegeDetentionYuki, "H0920", "Height", "Default");
	InventoryWear(CollegeDetentionYuki, "Small", "BodyUpper", "Asian");
	InventoryWear(CollegeDetentionYuki, "Small", "BodyLower", "Asian");
	InventoryWear(CollegeDetentionYuki, "Default", "Hands", "Asian");
	InventoryWear(CollegeDetentionYuki, "HairBack6", "HairBack", "#603022");
	InventoryWear(CollegeDetentionYuki, "HairFront4", "HairFront", "#603022");
	InventoryWear(CollegeDetentionYuki, "Ribbons2", "HairAccessory1", "#111111");
	InventoryWear(CollegeDetentionYuki, "Bra1", "Bra", "#2222AA");
	InventoryWear(CollegeDetentionYuki, "Panties11", "Panties", "#2222AA");
	InventoryWear(CollegeDetentionYuki, "Socks5", "Socks", "#444458");
	InventoryWear(CollegeDetentionYuki, "Shoes2", "Shoes", "#111111");
}

// Generates Yuki
function CollegeDetentionLoad() {

	// Generates a full Yuki model based on the Bondage College template
	if (CollegeDetentionYuki == null) {

		// Do not generate her if she's already in the private room
		if (PrivateCharacter.length > 1)
			for (var P = 1; P < PrivateCharacter.length; P++)
				if (PrivateCharacter[P].Name == "Yuki")
					return;
		
		// Generates the model
		CollegeDetentionYuki = CharacterLoadNPC("NPC_CollegeDetention_Yuki");
		CollegeDetentionYuki.AllowItem = false;
		CollegeDetentionYuki.Name = "Yuki";
		CollegeDetentionYuki.GoneAway = false;
		CollegeDetentionYukiClothes();
		CharacterRefresh(CollegeDetentionYuki);

	}

}

// Runs the room (shows the player and Yuki)
function CollegeDetentionRun() {
	DrawCharacter(Player, 500, 0, 1);
	if ((CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) DrawCharacter(CollegeDetentionYuki, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

// When the user clicks in the room
function CollegeDetentionClick() {
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) CharacterSetCurrent(CollegeDetentionYuki);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// When Yuki love towards the player changes, it can also trigger an event.  When a good or bad move is done, her expression will change quickly.
function CollegeDetentionYukiLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeDetentionYukiLove = CollegeDetentionYukiLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) < 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Eyes", "Dazed");
		TimerInventoryRemoveSet(CollegeDetentionYuki, "Eyes", 2);
		if (CollegeDetentionYukiLove <= -5) {
			CollegeDetentionYuki.Stage = "1000";
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiHadEnough");
		}
	}
	if ((LoveChange != null) && (parseInt(LoveChange) > 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Blush", "Low");
		TimerInventoryRemoveSet(CollegeDetentionYuki, "Blush", 2);
		if (CollegeDetentionYukiLove > 10) {
			CollegeDetentionYuki.Stage = "2000";
			CollegeDetentionYukiLove = 0;
			CollegeDetentionYukiWillReleaseAt = 0;
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiPropose");
		}
	}
}

// Dress back the player and Yuki
function CollegeDetentionDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeDetentionYuki);
	CollegeEntranceWearStudentClothes(Player);
	CollegeDetentionYukiClothes();
}

// Strips both the player and Yuki
function CollegeDetentionBothNaked() {
	CharacterNaked(Player);
	CharacterNaked(CollegeDetentionYuki);
}

// When the player pleases Yuki, it's a race against the clock to make her orgasm
function CollegeDetentionPleaseYuki(Factor) {
	CollegeDetentionYukiWillReleaseAt++;
	CollegeDetentionYukiLove = CollegeDetentionYukiLove + parseInt(Factor);
	if (CollegeDetentionYukiLove >= 6) {
		CollegeDetentionYuki.Stage = "2100";
		CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "Orgasm");
		return;
	}
	if (CollegeDetentionYukiWillReleaseAt >= 6) {
		CollegeDetentionYuki.Stage = "2200";
		CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "NoOrgasm");
		return;
	}
}

// When Yuki restrains the player
function CollegeDetentionRestrainPlayer(Type) {
	if (Type == "Arms") InventoryWearRandom(Player, "ItemArms", 4);
	if (Type == "Legs") { InventoryWearRandom(Player, "ItemFeet", 4); InventoryWearRandom(Player, "ItemLegs", 4); }
	if (Type == "Mouth") { InventoryWearRandom(Player, "ItemMouth", 4); CollegeDetentionYukiWillReleaseAt = CurrentTime + 120000; }
}

// When the plater invites Yuki to her room
function CollegeDetentionInviteToPrivateRoom() {
	CollegeDetentionDressBack();
	InventoryAdd(Player, "Ribbons2", "HairAccessory1");
	InventoryAdd(Player, "Ribbons2", "HairAccessory2");
	InventoryAdd(Player, "RegularSleepingPill", "ItemMouth");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeDetentionYuki, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 20);
	NPCTraitSet(C, "Horny", 80);
	NPCTraitSet(C, "Rude", 60);
	NPCTraitSet(C, "Serious", 40);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeDetentionYuki.GoneAway = true;
}
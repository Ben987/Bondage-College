var C013_BondageClub_Entrance_CurrentStage = 0;
var C013_BondageClub_Entrance_WithSarah = false;
var C013_BondageClub_Entrance_HasInvitation = false;
var C013_BondageClub_Entrance_IsCollared = false;
var C013_BondageClub_Entrance_BeltProblem = false;
var C013_BondageClub_Entrance_EggProblem = false;
var C013_BondageClub_Entrance_NoProblem = false;

// Chapter 13 Bondage Club - Load the entrance parameters
function C013_BondageClub_Entrance_LoadParams() {
	C013_BondageClub_Entrance_HasInvitation = GameLogQuery("", "", "BondageClubInvitation");
	C013_BondageClub_Entrance_WithSarah = GameLogQuery("", "", "VisitBondageClubWithSarah");
	C013_BondageClub_Entrance_IsCollared = (PlayerHasLockedInventory("Collar") && (Common_PlayerOwner != ""));
	C013_BondageClub_Entrance_BeltProblem = PlayerHasLockedInventory("ChastityBelt");
	C013_BondageClub_Entrance_EggProblem = (PlayerHasLockedInventory("VibratingEgg") && !PlayerHasLockedInventory("ChastityBelt"));
	C013_BondageClub_Entrance_NoProblem = (!PlayerHasLockedInventory("VibratingEgg") && !PlayerHasLockedInventory("ChastityBelt"));
}

// Chapter 13 Bondage Club - Entrance Load
function C013_BondageClub_Entrance_Load() {
	
	// Loads the entrance interactions 
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C013_BondageClub_Entrance_LoadParams();

	// No leaving from the entrance
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 13 Bondage Club - Entrance Load
function C013_BondageClub_Entrance_Run() {
	BuildInteraction(C013_BondageClub_Entrance_CurrentStage);
}

// Chapter 13 Bondage Club - Entrance Click
function C013_BondageClub_Entrance_Click() {
	ClickInteraction(C013_BondageClub_Entrance_CurrentStage);
}

// Chapter 13 Bondage Club - When Sarah is assigned to be punished
function C013_BondageClub_Entrance_SarahPunished() {
	GameLogSpecificAdd(CurrentChapter, "Player", "SarahWillBePunished");
}

// Chapter 13 Bondage Club - Unlock a specific item
function C013_BondageClub_Entrance_UnlockItem(ItemType) {
	PlayerUnlockInventory(ItemType);
	C013_BondageClub_Entrance_LoadParams();
}

// Chapter 13 Bondage Club - Ends the Bondage College and loads the Bondage Club game engine, exports a few items
function C013_BondageClub_Entrance_EnterClub() {

	// We export a special string for Sarah to use in the Bondage Club later
	var Sarah = "";
	if (Common_PlayerLover == "Sarah") Sarah = "SarahLover";
	if ((ActorGetValue(ActorOwner) == "Player") && !GameLogQuery("", "Sarah", "CurfewStay")) Sarah = "SarahCollared";
	if ((ActorGetValue(ActorOwner) == "Player") && GameLogQuery("", "Sarah", "CurfewStay")) Sarah = "SarahCollaredWithCurfew";
	if (C013_BondageClub_Entrance_WithSarah && GameLogQuery(CurrentChapter, "", "SarahWillBePunished")) Sarah = "SarahWillBePunished";
	if (C013_BondageClub_Entrance_WithSarah && !GameLogQuery(CurrentChapter, "", "SarahWillBePunished")) Sarah = "SarahCameWithPlayer";

	// Exports all items and Sarah's data
	localStorage.setItem("BondageClubImportSource", "BondageCollege");
	localStorage.setItem("BondageCollegeExportSarah", Sarah);
	localStorage.setItem("BondageCollegeExportBallGag", (PlayerHasInventory("BallGag")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportClothGag", (PlayerHasInventory("ClothGag")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportTapeGag", (PlayerHasInventory("TapeGag")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportRope", (PlayerHasInventory("Rope")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportCuffs", (PlayerHasInventory("Cuffs")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportArmbinder", (PlayerHasInventory("Armbinder")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportChastityBelt", (PlayerHasInventory("ChastityBelt")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportCollar", (PlayerHasInventory("Collar")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportCrop", (PlayerHasInventory("Crop")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportCuffsKey", (PlayerHasInventory("CuffsKey")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportSleepingPill", (PlayerHasInventory("SleepingPill")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportVibratingEgg", (PlayerHasInventory("VibratingEgg")) ? "true" : "false");
	window.location = "BondageClub/index.html";

}

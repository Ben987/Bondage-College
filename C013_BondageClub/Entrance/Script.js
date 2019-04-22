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

// Chapter 13 Bondage Club - Ends the Bondage College and loads the Bondage Club game engine, exports a few items
function C013_BondageClub_Entrance_EnterClub() {

	// Save Amanda status
	var AmandaSarah = "";
	var Amanda = "";
	CurrentActor = "Amanda";
	if (GameLogQuery("C012_AfterClass", CurrentActor, "DatingSarah")) AmandaSarah = "AmandaSarahLovers";
	if (Common_PlayerLover == "Amanda") Amanda = "AmandaLover";
	if ((ActorGetValue(ActorOwner) == "Player") && !GameLogQuery("", "Amanda", "CurfewStay")) Amanda = "AmandaCollared";
	if ((ActorGetValue(ActorOwner) == "Player") && GameLogQuery("", "Amanda", "CurfewStay")) Amanda = "AmandaCollaredWithCurfew";
	if (Common_PlayerOwner == "Amanda") Amanda = "AmandaMistress";

	// Save Sarah status
	var Sarah = "";
	CurrentActor = "Sarah";
	if (Common_PlayerLover == "Sarah") Sarah = "SarahLover";
	if ((ActorGetValue(ActorOwner) == "Player") && !GameLogQuery("", "Sarah", "CurfewStay")) Sarah = "SarahCollared";
	if ((ActorGetValue(ActorOwner) == "Player") && GameLogQuery("", "Sarah", "CurfewStay")) Sarah = "SarahCollaredWithCurfew";
	
	// Save Sarah intro status
	var SarahIntro = "";
	if (C013_BondageClub_Entrance_WithSarah && GameLogQuery(CurrentChapter, "", "SarahWillBePunished")) SarahIntro = "SarahWillBePunished";
	if (C013_BondageClub_Entrance_WithSarah && !GameLogQuery(CurrentChapter, "", "SarahWillBePunished")) SarahIntro = "SarahCameWithPlayer";

	// Save Sidney status
	var Sidney = "";
	CurrentActor = "Sidney";
	if (Common_PlayerLover == "Sidney") Sidney = "SidneyLover";
	if ((ActorGetValue(ActorOwner) == "Player") && !GameLogQuery("", "Sidney", "CurfewStay")) Sidney = "SidneyCollared";
	if ((ActorGetValue(ActorOwner) == "Player") && GameLogQuery("", "Sidney", "CurfewStay")) Sidney = "SidneyCollaredWithCurfew";
	if (Common_PlayerOwner == "Sidney") Sidney = "SidneyMistress";

	// Save Jennifer status
	var Jennifer = "";
	CurrentActor = "Jennifer";
	if (Common_PlayerLover == "Jennifer") Jennifer = "JenniferLover";
	if ((ActorGetValue(ActorOwner) == "Player") && !GameLogQuery("", "Jennifer", "CurfewStay")) Jennifer = "JenniferCollared";
	if ((ActorGetValue(ActorOwner) == "Player") && GameLogQuery("", "Jennifer", "CurfewStay")) Jennifer = "JenniferCollaredWithCurfew";
	if (Common_PlayerOwner == "Jennifer") Jennifer = "JenniferMistress";

	// Exports all items and Sarah's data
	localStorage.setItem("BondageClubImportSource", "BondageCollege");
	localStorage.setItem("BondageCollegeExportName", Common_PlayerName);
	localStorage.setItem("BondageCollegeExportLover", Common_PlayerLover);
	localStorage.setItem("BondageCollegeExportOwner", Common_PlayerOwner);
	localStorage.setItem("BondageCollegeExportLockedCollar", (PlayerHasLockedInventory("Collar")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportLockedChastityBelt", (PlayerHasLockedInventory("ChastityBelt")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportLockedVibratingEgg", (PlayerHasLockedInventory("VibratingEgg")) ? "true" : "false");
	localStorage.setItem("BondageCollegeExportAmandaSarah", AmandaSarah);
	localStorage.setItem("BondageCollegeExportSarahIntro", SarahIntro);
	localStorage.setItem("BondageCollegeExportAmanda", Amanda);
	localStorage.setItem("BondageCollegeExportSarah", Sarah);
	localStorage.setItem("BondageCollegeExportSidney", Sidney);
	localStorage.setItem("BondageCollegeExportJennifer", Jennifer);
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
var SaveGameVersion = "12A";
var SaveChapter = "";
var SaveScreen = "";
var SaveMaxSlot = 9;

// Opens the save menu for a specific chapter
function SaveMenu(NextChapter, NextScreen) {
	SaveChapter = NextChapter;
	SaveScreen = NextScreen;
	SetScene("C999_Common", "GameSave");
}

// Returns the save state summary
function SaveStateGetSummary(SlotNumber) {

	// Fetch the data
	var SN = SlotNumber.toString();	
	var Summary = "@" + GetText("NoSaveOnSlot") + " " + SN;
	if (localStorage.getItem("SaveGameVersion" + SN))
		if (localStorage.getItem("SaveGameVersion" + SN) == SaveGameVersion) {
			var SaveStatePlayerName = localStorage.getItem("Common_PlayerName" + SN);
			var SaveStateChapter = localStorage.getItem("CurrentChapter" + SN).substr(1, 3);
			var SaveStateDateTime = localStorage.getItem("SaveGameDateTime" + SN);
			while (SaveStateChapter.substr(0, 1) == "0")
				SaveStateChapter = SaveStateChapter.substr(1, 100);
			Summary = "@" + SaveStatePlayerName.substr(0, 10) + " - " + GetText("Chapter") + " " + SaveStateChapter + "|" + SaveStateDateTime;
		}
		
	// Returns the summary
	return Summary;

}

// Show some info on the slots to load or save
function SaveStateSlotSummary() {

	// If the current stage is loaded
	if ((CurrentStage != null) && (CurrentText != null))
		if (CurrentStage[1][StageInteractionText] == "@Slot 1") {

			// For each save slots, we load the summary
			var Slot = 1;
			while (Slot <= SaveMaxSlot) {
				CurrentStage[Slot][StageInteractionText] = SaveStateGetSummary(Slot);
				Slot++;
			}
	
		}

}

// Save the game state on a specific slot
function SaveState(SlotNumber) {
	
	// Save the current state of the game and the transitional variables
	var SN = SlotNumber.toString();	
	localStorage.setItem("SaveGameVersion" + SN, SaveGameVersion);
	localStorage.setItem("SaveGameDateTime" + SN, GetFormatDate());
	localStorage.setItem("CurrentChapter" + SN, SaveChapter);
	localStorage.setItem("CurrentScreen" + SN, SaveScreen);
	localStorage.setItem("Common_PlayerName" + SN, Common_PlayerName);
	localStorage.setItem("Common_PlayerOwner" + SN, Common_PlayerOwner);
	localStorage.setItem("Common_PlayerLover" + SN, Common_PlayerLover);
	localStorage.setItem("Common_PlayerCloth" + SN, Common_PlayerCloth);	
	localStorage.setItem("PlayerInventory" + SN, JSON.stringify(PlayerInventory));
	localStorage.setItem("PlayerLockedInventory" + SN, JSON.stringify(PlayerLockedInventory));
	localStorage.setItem("PlayerSkill" + SN, JSON.stringify(PlayerSkill));
	localStorage.setItem("Actor" + SN, JSON.stringify(Actor));
	localStorage.setItem("GameLog" + SN, JSON.stringify(GameLog));
	localStorage.setItem("CurrentTime" + SN, CurrentTime.toString());

	// Reload the summaries
	CurrentStage[1][StageInteractionText] = "@Slot 1";
	SaveStateSlotSummary();

}

// Load the game state on a specific slot
function LoadState(SlotNumber) {

	// If the save file is for the current version, we load
	var SN = SlotNumber.toString();	
	if (localStorage.getItem("SaveGameVersion" + SN))
		if (localStorage.getItem("SaveGameVersion" + SN) == SaveGameVersion) {

			// Load the game state
			CurrentChapter = localStorage.getItem("CurrentChapter" + SN);
			CurrentScreen = localStorage.getItem("CurrentScreen" + SN);
			Common_PlayerName = localStorage.getItem("Common_PlayerName" + SN);
			Common_PlayerOwner = localStorage.getItem("Common_PlayerOwner" + SN);
			Common_PlayerLover = localStorage.getItem("Common_PlayerLover" + SN);
			PlayerInventory = JSON.parse(localStorage.getItem("PlayerInventory" + SN));
			PlayerLockedInventory = JSON.parse(localStorage.getItem("PlayerLockedInventory" + SN));
			Actor = JSON.parse(localStorage.getItem("Actor" + SN));
			GameLog = JSON.parse(localStorage.getItem("GameLog" + SN));
			PlayerSkill = JSON.parse(localStorage.getItem("PlayerSkill" + SN));
			CurrentTime = parseFloat(localStorage.getItem("CurrentTime" + SN));
			
			// Makes sure the owner and lover aren't null from previous saves
			if (Common_PlayerOwner == null) Common_PlayerOwner = "";
			if (Common_PlayerLover == null) Common_PlayerLover = "";

			// You can start with different clothes on chapter 12
			if (CurrentChapter == "C012_AfterClass") {
				Common_PlayerCloth = localStorage.getItem("Common_PlayerCloth" + SN);
				if (Common_PlayerCloth == null) Common_PlayerCloth = "Clothed";	
				PlayerClothes(Common_PlayerCloth);
			}

			// Make sure the actor array is wide enough (to remove when save games will be reset)
			for (var A = 0; L < Actor.length; A++)
				if (Actor[L].length < 11)
					Actor[L] = [Actor[L][0], Actor[L][1], Actor[L][2], Actor[L][3], Actor[L][4], Actor[L][5], Actor[L][6], Actor[L][7], Actor[L][8], false, ""];

			// Make sure the game log array is wide enough (to remove when save games will be reset) 
			for (var L = 0; L < GameLog.length; L++)
				if (GameLog[L].length < 4)
					GameLog[L] = [GameLog[L][0], GameLog[L][1], GameLog[L][2], 0];

			// Starts the game
			LoadRestrainStatus();
			SetScene(CurrentChapter, CurrentScreen);

		}

}
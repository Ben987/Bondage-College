var SaveGameVersion = "8A";
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
	var Summary = GetText("NoSaveOnSlot") + " " + SN;
	if (localStorage.getItem("SaveGameVersion" + SN))
		if (localStorage.getItem("SaveGameVersion" + SN) == SaveGameVersion) {
			var SaveStatePlayerName = localStorage.getItem("Common_PlayerName" + SN);
			var SaveStateChapter = localStorage.getItem("CurrentChapter" + SN);
			var SaveStateDateTime = localStorage.getItem("SaveGameDateTime" + SN);
			Summary = SaveStatePlayerName.substr(0, 10) + " - " + GetText("Chapter") + " " + SaveStateChapter.substring(2, 4) + "|" + SaveStateDateTime;
		}
		
	// Returns the summary
	return Summary;

}

// Show some info on the slots to load or save
function SaveStateSlotSummary() {

	// If the current stage is loaded
	if ((CurrentStage != null) && (CurrentText != null))
		if (CurrentStage[1][StageInteractionText] == "Slot 1") {

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
	localStorage.setItem("PlayerInventory" + SN, JSON.stringify(PlayerInventory));
	localStorage.setItem("PlayerLockedInventory" + SN, JSON.stringify(PlayerLockedInventory));
	localStorage.setItem("Actor" + SN, JSON.stringify(Actor));
	localStorage.setItem("Common_PlayerCrime" + SN, Common_PlayerCrime);
	localStorage.setItem("Common_ClubStatus" + SN, Common_ClubStatus);

	// Reload the summaries
	CurrentStage[1][StageInteractionText] = "Slot 1";
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
			PlayerInventory = JSON.parse(localStorage.getItem("PlayerInventory" + SN));
			PlayerLockedInventory = JSON.parse(localStorage.getItem("PlayerLockedInventory" + SN));
			Actor = JSON.parse(localStorage.getItem("Actor" + SN));
			Common_PlayerCrime = localStorage.getItem("Common_PlayerCrime" + SN);
			Common_ClubStatus = localStorage.getItem("Common_ClubStatus" + SN);
			LoadRestrainStatus();
			SetScene(CurrentChapter, CurrentScreen);
			
			// Fix to make old save games from version 8A compatible (adds the actor pose)
			for (var A = 0; A < Actor.length; A++)
				if (Actor[A].length == 8)
					Actor[A] = [Actor[A][0], Actor[A][1], Actor[A][2], Actor[A][3], Actor[A][4], Actor[A][5], Actor[A][6], Actor[A][7], ""];

		}

}
var C012_AfterClass_Dorm_Guest = [];
var C012_AfterClass_Dorm_GuestVisible = [];
var C012_AfterClass_Dorm_PlayerPos = 0;
var C012_AfterClass_Dorm_PlayerGrounded = false;
var C012_AfterClass_Dorm_AmandaAndSarahInBed = false;
var C012_AfterClass_Dorm_SidneyExitTime = 0;
var C012_AfterClass_Dorm_SidneyReturnTime = 0;
var C012_AfterClass_Dorm_SarahExitTime = 0;

// Sets the correct punishment pose depending on the player Mistess
function C012_AfterClass_Dorm_SetPunishmentPose() {
	if (GameLogQuery(CurrentChapter, "", "EventGrounded")) {
		if (Common_PlayerOwner == "Sidney") Common_PlayerPose = "TwoRopesPunishment";
		if (Common_PlayerOwner == "Amanda") Common_PlayerPose = "HogtiePunishment";
		if (Common_PlayerOwner == "Jennifer") Common_PlayerPose = "FoldPunishment";
		if (CurrentScreen != "Dorm") {
			if (CurrentScreen == Common_PlayerOwner) OverridenIntroText = GetText("StillGrounded");
			else OverridenIntroText = GetText("StillGroundedByOther");
			if ((CurrentActor != "") && ActorIsGagged()) OverridenIntroText = GetText("StillGroundedGagged");
		}
	}
}

// Draw the other actors that are not the current actor in he background
function C012_AfterClass_Dorm_DrawOtherActors() {
	var Pos = 0;
	for (var A = 0; A < C012_AfterClass_Dorm_Guest.length; A++)
		if (CurrentActor != C012_AfterClass_Dorm_Guest[A]) {
			if (Pos == 0) DrawActor(C012_AfterClass_Dorm_Guest[A], 500, -30, 0.75);
			if (Pos == 1) DrawActor(C012_AfterClass_Dorm_Guest[A], 850, -30, 0.75);
			if (Pos == 2) DrawActor(C012_AfterClass_Dorm_Guest[A], 675, -30, 0.75);
			Pos++;
		}
}

// Check if we must stop the scene for leaving guests
function C012_AfterClass_Dorm_LeavingGuest() {

	// Sidney will leave at 20:00, it ends any grounding event
	if ((C012_AfterClass_Dorm_Guest.indexOf("Sidney") >= 0) && (CurrentTime >= C012_AfterClass_Dorm_SidneyExitTime) && (CurrentTime <= C012_AfterClass_Dorm_SidneyReturnTime) && !GameLogQuery(CurrentChapter, "Sidney", "BackFromRockShow") && !ActorSpecificIsRestrained("Sidney") && !GameLogQuery(CurrentChapter, "Sidney", "KickedOutFromDorm")) {
		C012_AfterClass_Dorm_Guest.splice("Sidney");		
		if ((CurrentScreen == "Dorm") && (!C012_AfterClass_Dorm_PlayerGrounded || (Common_PlayerOwner == "Sidney"))) {
			C012_AfterClass_Sidney_CurrentStage = 400;
			if (C012_AfterClass_Dorm_PlayerGrounded && (Common_PlayerOwner == "Sidney")) GameLogSpecificAddTimer(CurrentChapter, "Sidney", "EventGrounded", 1);
			SetScene(CurrentChapter, "Sidney");
			ActorSetCloth("Shorts");
			if (C012_AfterClass_Dorm_PlayerGrounded && (Common_PlayerOwner == "Sidney")) OverridenIntroText = GetText("GroundingEndForLeaving");
		} else C012_AfterClass_Dorm_CalGuest();
	}

	// Sarah will leave at 21:00, it cancels the bed with Amanda event
	if ((C012_AfterClass_Dorm_Guest.indexOf("Sarah") >= 0) && (CurrentTime >= C012_AfterClass_Dorm_SarahExitTime) && !GameLogQuery(CurrentChapter, "Sarah", "BackFromBondageClub") && !ActorSpecificIsRestrained("Sarah") && !GameLogQuery(CurrentChapter, "Sarah", "KickedOutFromDorm")) {		
		GameLogSpecificAddTimer(CurrentChapter, "Player", "AmandaAndSarahInBed", 1);
		C012_AfterClass_Dorm_Guest.splice("Sarah");
		if ((CurrentScreen == "Dorm") && !C012_AfterClass_Dorm_PlayerGrounded) {
			C012_AfterClass_Sarah_CurrentStage = 400;
			SetScene(CurrentChapter, "Sarah");
			ActorSetCloth("BrownDress");
		} else C012_AfterClass_Dorm_CalGuest();
	}
	
}

// Set the guest list in the dorm
function C012_AfterClass_Dorm_CalGuest() {

	// Build an array of everyone that's in the player dorm room
	C012_AfterClass_Dorm_LeavingGuest();
	C012_AfterClass_Dorm_Guest = [];
	if (GameLogQuery(CurrentChapter, "Sidney", "EnterDormFromPub") && !GameLogQuery(CurrentChapter, "Sidney", "KickedOutFromDorm") && ((CurrentTime <= C012_AfterClass_Dorm_SidneyExitTime) || (CurrentTime >= C012_AfterClass_Dorm_SidneyReturnTime) || GameLogQuery(CurrentChapter, "Sidney", "BackFromRockShow") || ActorSpecificIsRestrained("Sidney"))) 
		if (!GameLogQuery(CurrentChapter, "Sidney", "LoverBreakUp") || (ActorSpecificGetValue("Sidney", ActorOwner) == "Player"))
			C012_AfterClass_Dorm_Guest.push("Sidney");
	if ((GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromPool") || GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromRoommates")) && !GameLogQuery(CurrentChapter, "Jennifer", "KickedOutFromDorm")) 
		C012_AfterClass_Dorm_Guest.push("Jennifer");
	if ((GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromLibrary") || GameLogQuery(CurrentChapter, "Amanda", "EnterDormFromRoommates")) && !GameLogQuery(CurrentChapter, "Amanda", "KickedOutFromDorm") && !GameLogQuery(CurrentChapter, "Amanda", "LeaveDormEarly"))
		if (!GameLogQuery(CurrentChapter, "Amanda", "LoverBreakUp") || (ActorSpecificGetValue("Amanda", ActorOwner) == "Player"))
			C012_AfterClass_Dorm_Guest.push("Amanda");
	if (GameLogQuery(CurrentChapter, "Sarah", "EnterDormFromRoommates") && !GameLogQuery(CurrentChapter, "Sarah", "KickedOutFromDorm") && ((CurrentTime <= C012_AfterClass_Dorm_SarahExitTime) || GameLogQuery(CurrentChapter, "Sarah", "BackFromBondageClub") || ActorSpecificIsRestrained("Sarah"))) 
		C012_AfterClass_Dorm_Guest.push("Sarah");

	// Build an array of everyone that's visible (standing up)
	C012_AfterClass_Dorm_GuestVisible = [];
	for (var A = 0; A < C012_AfterClass_Dorm_Guest.length; A++)
		if (((C012_AfterClass_Dorm_Guest[A] != "Sarah") && (C012_AfterClass_Dorm_Guest[A] != "Amanda")) || !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed"))
			C012_AfterClass_Dorm_GuestVisible.push(C012_AfterClass_Dorm_Guest[A]);
	C012_AfterClass_Dorm_PlayerPos = 525 - C012_AfterClass_Dorm_GuestVisible.length * 100;

}

// Chapter 12 - After Class Dorm Load
function C012_AfterClass_Dorm_Load() {
	
	// Set the timer limits
	StartTimer(24 * 60 * 60 * 1000, "C012_AfterClass", "Outro");
	ActorSpecificSetPose("Amanda", "");
	ActorSpecificSetPose("Sarah", "");
	if ((ActorSpecificGetValue("Sidney", ActorPose) != "Pig") || !ActorSpecificHasInventory("Sidney", "TwoRopes")) ActorSpecificSetPose("Sidney", "");
	ActorSpecificSetPose("Jennifer", "");
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = true;
	C012_AfterClass_Bed_Partner = "";

	// Loads the actor CSV text in advance
	ReadCSV("CurrentText", CurrentChapter, "Sidney", "Text", GetWorkingLanguage());
	ReadCSV("CurrentText", CurrentChapter, "Amanda", "Text", GetWorkingLanguage());
	ReadCSV("CurrentText", CurrentChapter, "Sarah", "Text", GetWorkingLanguage());
	ReadCSV("CurrentText", CurrentChapter, "Jennifer", "Text", GetWorkingLanguage());

	// Owners will not stay naked
	if ((Common_PlayerOwner == "Sidney") && (ActorSpecificGetValue("Sidney", ActorCloth) == "Naked")) ActorSpecificSetCloth("Sidney", "Shorts");
	if ((Common_PlayerOwner == "Amanda") && (ActorSpecificGetValue("Amanda", ActorCloth) == "Naked")) ActorSpecificSetCloth("Amanda", "Clothed");
	if ((Common_PlayerOwner == "Jennifer") && (ActorSpecificGetValue("Jennifer", ActorCloth) == "Naked")) ActorSpecificSetCloth("Jennifer", "Clothed");

	// Calculates the time when Sidney will leave and return
	C012_AfterClass_Dorm_SidneyExitTime = 20 * 60 * 60 * 1000;
	if (GameLogQuery(CurrentChapter, "Sidney", "CurfewStay")) C012_AfterClass_Dorm_SidneyExitTime = 999 * 60 * 60 * 1000;
	C012_AfterClass_Dorm_SidneyReturnTime = 999 * 60 * 60 * 1000;
	if (GameLogQuery(CurrentChapter, "Sidney", "Curfew24")) C012_AfterClass_Dorm_SidneyReturnTime = 24 * 60 * 60 * 1000;
	if (GameLogQuery(CurrentChapter, "Sidney", "Curfew22")) C012_AfterClass_Dorm_SidneyReturnTime = 22 * 60 * 60 * 1000;
	if (GameLogQuery(CurrentChapter, "Sidney", "CurfewStay")) C012_AfterClass_Dorm_SidneyReturnTime = 12 * 60 * 60 * 1000;

	// Sarah never returns from the Bondage Club on her own
	C012_AfterClass_Dorm_SarahExitTime = 21 * 60 * 60 * 1000;
	if (GameLogQuery(CurrentChapter, "Sarah", "CurfewStay")) C012_AfterClass_Dorm_SarahExitTime = 999 * 60 * 60 * 1000;

	// If the player is grounded, the dorm is mostly deactivated until the timer runs out
	C012_AfterClass_Dorm_PlayerGrounded = GameLogQuery(CurrentChapter, "", "EventGrounded");
	C012_AfterClass_Dorm_AmandaAndSarahInBed = GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed");
	Common_PlayerPose = "";
	if ((Common_PlayerPose == "") && GameLogQuery(CurrentChapter, "", "EventSpanked") && !Common_PlayerRestrained && !Common_PlayerGagged && Common_PlayerNaked) Common_PlayerPose = "Spanked";
	C012_AfterClass_Dorm_SetPunishmentPose();

	// Resets the other locations from the Dorm
	C012_AfterClass_Pub_CurrentStage = 0;
	C012_AfterClass_Pool_CurrentStage = 0;
	C012_AfterClass_Roommates_CurrentStage = 0;
	C012_AfterClass_Sidney_CurrentStage = 0;
	C012_AfterClass_Amanda_CurrentStage = 0;
	C012_AfterClass_Sarah_CurrentStage = 0;
	C012_AfterClass_Jennifer_CurrentStage = 0;
	C012_AfterClass_Dorm_CalGuest();
}

// Chapter 12 - After Class Dorm Run
function C012_AfterClass_Dorm_Run() {
	
	// Check if we must stop the scene for leaving guests
	C012_AfterClass_Dorm_LeavingGuest();

	// If Amanda and Sarah gets off the bed
	if (C012_AfterClass_Dorm_AmandaAndSarahInBed && !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed")) {
		C012_AfterClass_Dorm_CalGuest();
		C012_AfterClass_Dorm_AmandaAndSarahInBed = false;
	}
	
	// If grounding is over, we go to the owner
	if (C012_AfterClass_Dorm_PlayerGrounded && !GameLogQuery(CurrentChapter, "", "EventGrounded") && (C012_AfterClass_Sidney_CurrentStage != 400)) {
		if (Common_PlayerOwner == "Sidney") C012_AfterClass_Sidney_CurrentStage = 3915;
		if (Common_PlayerOwner == "Amanda") C012_AfterClass_Amanda_CurrentStage = 3915;
		if (Common_PlayerOwner == "Jennifer") C012_AfterClass_Jennifer_CurrentStage = 3915;
		SetScene(CurrentChapter, Common_PlayerOwner);
		LeaveIcon = "";
	}

	// If the player owner wants to start a random activity with the player
	if (!C012_AfterClass_Dorm_PlayerGrounded && (Common_PlayerOwner != "") && (C012_AfterClass_Dorm_Guest.indexOf(Common_PlayerOwner) >= 0) && !GameLogQuery(CurrentChapter, Common_PlayerOwner, "EventGeneric") && !GameLogQuery(CurrentChapter, Common_PlayerOwner, "EventGenericNext"))
		if ((Common_PlayerOwner != "Amanda") || !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed")) {
			if (Common_PlayerOwner == "Sidney") C012_AfterClass_Sidney_CurrentStage = 450;
			if (Common_PlayerOwner == "Amanda") C012_AfterClass_Amanda_CurrentStage = 450;
			if (Common_PlayerOwner == "Jennifer") C012_AfterClass_Jennifer_CurrentStage = 450;
			SetScene(CurrentChapter, Common_PlayerOwner);
			LeaveIcon = "";
		}

	// If Sarah wants to start a random activity with the player as an owner
	if (!C012_AfterClass_Dorm_PlayerGrounded && (C012_AfterClass_Dorm_Guest.indexOf("Sarah") >= 0) && (ActorSpecificGetValue("Sarah", ActorOwner) == "Player") && !GameLogQuery(CurrentChapter, "Sarah", "EventGenericNext") && !GameLogQuery(CurrentChapter, "Sarah", "StopEvents") && !GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed")) {
		CurrentActor = "Sarah";
		if (ActorIsGagged()) C012_AfterClass_Sarah_CurrentStage = 2200;
		else if (ActorIsRestrained()) C012_AfterClass_Sarah_CurrentStage = 2100;
		else C012_AfterClass_Sarah_CurrentStage = 2000;
		SetScene(CurrentChapter, "Sarah");
		LeaveIcon = "";
	}
		
	// Make sure we are still in the dorm after the previous events
	if (CurrentScreen == "Dorm") {
		
		// The "spanked" pose will fade out after time
		if (Common_PlayerPose == "Spanked" && !GameLogQuery(CurrentChapter, "", "EventSpanked")) Common_PlayerPose = "";

		// Draw the background and the actors
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
		if (GameLogQuery(CurrentChapter, "Player", "AmandaAndSarahInBed")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/AmandaSarahBed.png", 300, 100);
		DrawTransparentPlayerImage(C012_AfterClass_Dorm_PlayerPos - 210, 0, 0.6667);
		for (var A = 0; A < C012_AfterClass_Dorm_GuestVisible.length; A++)
			DrawActor(C012_AfterClass_Dorm_GuestVisible[A], C012_AfterClass_Dorm_PlayerPos - 10 + A * 200, 0, 0.6667);
		
		// Draw the room icons
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 0) && (MouseY < 150)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Wardrobe_Active.png", 1075, 25);
		else DrawImage(CurrentChapter + "/" + CurrentScreen + "/Wardrobe_Inactive.png", 1075, 25);
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 150) && (MouseY < 300)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Bed_Active.png", 1075, 175);
		else DrawImage(CurrentChapter + "/" + CurrentScreen + "/Bed_Inactive.png", 1075, 175);
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 300) && (MouseY < 450)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save_Active.png", 1075, 325);
		else DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save_Inactive.png", 1075, 325);
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 450) && (MouseY < 600)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Exit_Active.png", 1075, 475);
		else DrawImage(CurrentChapter + "/" + CurrentScreen + "/Exit_Inactive.png", 1075, 475);

	}
	
}

// Chapter 12 - After Class Dorm Click
function C012_AfterClass_Dorm_Click() {

	// No clicking if the player is grounded
	if (!GameLogQuery(CurrentChapter, "", "EventGrounded")) {

		// Checks if the user clicks on any regular item
		InventoryClick(GetClickedInventory(), CurrentChapter, CurrentScreen);
		
		// Opens the other screens of the dorm
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 0) && (MouseY < 150)) SetScene(CurrentChapter, "Wardrobe");
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 150) && (MouseY < 300)) SetScene(CurrentChapter, "Bed");
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 300) && (MouseY < 450)) SaveMenu(CurrentChapter, "Dorm");
		if ((MouseX >= 1050) && (MouseX < 1200) && (MouseY >= 450) && (MouseY < 600)) SetScene(CurrentChapter, "DormExit");
		if ((MouseX >= C012_AfterClass_Dorm_PlayerPos - 100) && (MouseX < C012_AfterClass_Dorm_PlayerPos + 100) && (MouseY >= 0) && (MouseY <= 600)) InventoryClick("Player", CurrentChapter, CurrentScreen);
	
	}

	// When the player clicks on another actor
	if ((MouseX >= C012_AfterClass_Dorm_PlayerPos + 100) && (MouseX < C012_AfterClass_Dorm_PlayerPos + 300) && (MouseY >= 0) && (MouseY <= 600) && (C012_AfterClass_Dorm_GuestVisible.length >= 1)) SetScene(CurrentChapter, C012_AfterClass_Dorm_GuestVisible[0]);
	if ((MouseX >= C012_AfterClass_Dorm_PlayerPos + 300) && (MouseX < C012_AfterClass_Dorm_PlayerPos + 500) && (MouseY >= 0) && (MouseY <= 600) && (C012_AfterClass_Dorm_GuestVisible.length >= 2)) SetScene(CurrentChapter, C012_AfterClass_Dorm_GuestVisible[1]);
	if ((MouseX >= C012_AfterClass_Dorm_PlayerPos + 500) && (MouseX < C012_AfterClass_Dorm_PlayerPos + 700) && (MouseY >= 0) && (MouseY <= 600) && (C012_AfterClass_Dorm_GuestVisible.length >= 3)) SetScene(CurrentChapter, C012_AfterClass_Dorm_GuestVisible[2]);
	if ((MouseX >= C012_AfterClass_Dorm_PlayerPos + 700) && (MouseX < C012_AfterClass_Dorm_PlayerPos + 900) && (MouseY >= 0) && (MouseY <= 600) && (C012_AfterClass_Dorm_GuestVisible.length >= 4)) SetScene(CurrentChapter, C012_AfterClass_Dorm_GuestVisible[3]);

}
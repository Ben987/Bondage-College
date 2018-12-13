// Actor variables
var CurrentActor;
var Actor = [];
var ActorName = 0;
var ActorLove = 1;
var ActorSubmission = 2;
var ActorInventory = 3;
var ActorOrgasmCount = 4;
var ActorBondageCount = 5;
var ActorLastBondageChapter = 6;
var ActorCloth = 7;
var ActorPose = 8;
var ActorHideName = 9;
var ActorOwner = 10;

// Make sure the current actor is loaded (create it if not)
function ActorLoad(ActorToLoad, ActorLeaveScreen) {
	
	// Keep the actor leave screen
	LeaveIcon = "Leave";
	LeaveScreen = ActorLeaveScreen;

	// Sets if the actor is the player lover, submissive or Mistress
	CurrentActor = ActorToLoad;
	Common_ActorIsLover = (CurrentActor == Common_PlayerLover);
	Common_ActorIsOwner = (CurrentActor == Common_PlayerOwner);
	Common_ActorIsOwned = (ActorGetValue(ActorOwner) == "Player");

	// Load the actor if it's not already loaded
	for (var L = 0; L < Actor.length; L++)
		if (Actor[L][ActorName] == ActorToLoad)
			return;
	Actor[Actor.length] = [ActorToLoad, 0, 0, [], 0, 0, "", "Clothed", "", false, ""];

}

// Return a value from the current actor data
function ActorGetValue(ValueType) {
	for (var L = 0; L < Actor.length; L++)
		if (CurrentActor == Actor[L][ActorName])
			return Actor[L][ValueType];	
}

// Return a value from a specific actor data
function ActorSpecificGetValue(SpecificActorName, ValueType) {
	for (var L = 0; L < Actor.length; L++)
		if (SpecificActorName == Actor[L][ActorName])
			return Actor[L][ValueType];	
}

// Change positively or negatively the current actor attitude toward the player
function ActorChangeAttitude(LoveAttitude, SubAttitude) {
	
	// If we need to make a change to the attitude, we apply it
	if ((LoveAttitude != 0) || (SubAttitude != 0))
		for (var L = 0; L < Actor.length; L++)
			if (CurrentActor == Actor[L][ActorName]) {
				Actor[L][ActorLove] = Actor[L][ActorLove] + parseInt(LoveAttitude);
				Actor[L][ActorSubmission] = Actor[L][ActorSubmission] + parseInt(SubAttitude);
				if (Actor[L][ActorLove] > 99) Actor[L][ActorLove] = 99;
				if (Actor[L][ActorLove] < -99) Actor[L][ActorLove] = -99;
				if (Actor[L][ActorSubmission] > 99) Actor[L][ActorSubmission] = 99;
				if (Actor[L][ActorSubmission] < -99) Actor[L][ActorSubmission] = -99;
			}	

}

// Change positively or negatively a specific actor attitude toward the player
function ActorSpecificChangeAttitude(SpecificActorName, LoveAttitude, SubAttitude) {
	
	// If we need to make a change to the attitude, we apply it
	if ((LoveAttitude != 0) || (SubAttitude != 0))
		for (var L = 0; L < Actor.length; L++)
			if (SpecificActorName == Actor[L][ActorName]) {
				Actor[L][ActorLove] = Actor[L][ActorLove] + parseInt(LoveAttitude);
				Actor[L][ActorSubmission] = Actor[L][ActorSubmission] + parseInt(SubAttitude);
			}	

}

// Add an orgasm to the actor count and logs the event
function ActorAddOrgasm() {	
	for (var L = 0; L < Actor.length; L++)
		if (CurrentActor == Actor[L][ActorName])
			Actor[L][ActorOrgasmCount]++;
	GameLogAdd("Orgasm");
}

// Validates that a specific interaction stage is available for the player
function ActorInteractionAvailable(LoveReq, SubReq, VarReq, InText, ForIntro) {
	
	// Make sure the love / sub level is match (both positive and negative)
	VarReq = VarReq.trim();
	InText = InText.trim();
	if ((parseInt(LoveReq) > 0) && (parseInt(ActorGetValue(ActorLove)) < parseInt(LoveReq))) return false;
	if ((parseInt(SubReq) > 0) && (parseInt(ActorGetValue(ActorSubmission)) < parseInt(SubReq))) return false;
	if ((parseInt(LoveReq) < 0) && (parseInt(ActorGetValue(ActorLove)) > parseInt(LoveReq))) return false;
	if ((parseInt(SubReq) < 0) && (parseInt(ActorGetValue(ActorSubmission)) > parseInt(SubReq))) return false;
	
	// Checks if there's a custom script variable or a common variable to process
	if ((VarReq != "") && (VarReq.substr(0, 7) == "Common_") && (window[VarReq] == false)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 8) == "!Common_") && (window[VarReq.substr(1)] == true)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 7) != "Common_") && (VarReq.substr(0, 1) != "!") && (window[CurrentChapter + "_" + CurrentScreen + "_" + VarReq] == false)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 7) != "Common_") && (VarReq.substr(0, 1) == "!") && (window[CurrentChapter + "_" + CurrentScreen + "_" + VarReq.substr(1)] == true)) return false;
	
	// Check if the player is gagged, only interactions that starts with ( or @ are allowed
	if ((InText.substr(0, 1) != "(") && (InText.substr(0, 1) != "@") && Common_PlayerGagged && !ForIntro) return false;
	
	// Since nothing blocks, we allow it
	return true;

}

// Add inventory to the current actor
function ActorAddInventory(NewInventory) {

	// Find the current actor and adds the inventory if it's not already the case
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(NewInventory) == -1) {
				Actor[A][ActorInventory].push(NewInventory);
				if (Actor[A][ActorLastBondageChapter] != CurrentChapter) {
					Actor[A][ActorLastBondageChapter] = CurrentChapter;
					Actor[A][ActorBondageCount]++;
					GameLogAdd("Bondage");
				}
			}

}

// Add 1 to the bondage count of a specific actor
function ActorSpecificAddBondage(SpecificActor) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == SpecificActor) {
			Actor[A][ActorBondageCount]++;
			GameLogSpecificAdd(CurrentChapter, SpecificActor, "Bondage");
		}
}

// Returns the number of times that all actors were tied up during any chapter
function ActorGetTotalBondageCount() {
	var total = 0;
	for (var A = 0; A < Actor.length; A++)
		total = total + Actor[A][ActorBondageCount];
	return total;
}

// Remove inventory from the current actor
function ActorRemoveInventory(RemInventory) {

	// Find the current actor and adds the inventory if it's not already the case
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(RemInventory) >= 0)
				Actor[A][ActorInventory].splice(Actor[A][ActorInventory].indexOf(RemInventory), 1);

}

// Returns true if the current actor has the queried inventory
function ActorHasInventory(QueryInventory) {

	// Cycles to find the correct actor and checks if the inventory is in the list
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(QueryInventory) >= 0)
				return true;
	return false;

}

// Sets the clothes for the current actor
function ActorSetCloth(NewCloth) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			Actor[A][ActorCloth] = NewCloth;
}

// Sets the clothes for a specific actor
function ActorSpecificSetCloth(SpecificActor, NewCloth) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == SpecificActor)
			Actor[A][ActorCloth] = NewCloth;
}

// Set the pose for the current actor
function ActorSetPose(NewPose) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			Actor[A][ActorPose] = NewPose;
}

// Sets the pose for a specified actor (also works for the player if needed)
function ActorSpecificSetPose(SpecificActor, NewPose) {
	if (SpecificActor == "Player") {
		Common_PlayerPose = NewPose;
	} else {
		for (var A = 0; A < Actor.length; A++)
			if (Actor[A][ActorName] == SpecificActor)
				Actor[A][ActorPose] = NewPose;
	}
}

// Returns TRUE if the actor (or player) is in visible bondage
function ActorSpecificInBondage(SpecificActor) {
	if (SpecificActor == "Player") {
		return (Common_PlayerRestrained || Common_PlayerGagged);
	} else {
		for (var A = 0; A < Actor.length; A++)
			if (Actor[A][ActorName] == SpecificActor)
				return (ActorSpecificHasInventory(SpecificActor, "Rope") || ActorSpecificHasInventory(SpecificActor, "TwoRopes") || ActorSpecificHasInventory(SpecificActor, "Armbinder") || ActorSpecificHasInventory(SpecificActor, "Cuffs") || ActorSpecificHasInventory(SpecificActor, "Manacles") || ActorSpecificHasInventory(SpecificActor, "BallGag") || ActorSpecificHasInventory(SpecificActor, "TapeGag") || ActorSpecificHasInventory(SpecificActor, "ClothGag") || ActorSpecificHasInventory(SpecificActor, "PantieGag") || ActorSpecificHasInventory(SpecificActor, "SockGag"));
	}
}

// Returns TRUE if a specific actor (or player) is restrained
function ActorSpecificIsRestrained(SpecificActor) {
	if (SpecificActor == "Player") {
		return (Common_PlayerRestrained);
	} else {
		for (var A = 0; A < Actor.length; A++)
			if (Actor[A][ActorName] == SpecificActor)
				return (ActorSpecificHasInventory(SpecificActor, "Rope") || ActorSpecificHasInventory(SpecificActor, "TwoRopes") || ActorSpecificHasInventory(SpecificActor, "Armbinder") || ActorSpecificHasInventory(SpecificActor, "Cuffs") || ActorSpecificHasInventory(SpecificActor, "Manacles"));
	}
}

// Returns true if the actor is restrained (if there's no actor, we return the player status)
function ActorIsRestrained() {
	if (CurrentActor == "")
		return Common_PlayerRestrained;
	else
		return (ActorHasInventory("Rope") || ActorHasInventory("TwoRopes") || ActorHasInventory("Armbinder") || ActorHasInventory("Cuffs") || ActorHasInventory("Manacles"));
}

// Returns true if the actor is gagged (if there's no actor, we return the player status)
function ActorIsGagged() {
	if (CurrentActor == "")
		return Common_PlayerGagged;
	else
		return (ActorHasInventory("BallGag") || ActorHasInventory("TapeGag") || ActorHasInventory("ClothGag") || ActorHasInventory("PantieGag") || ActorHasInventory("SockGag"));
}

// Returns true if the actor is chaste (if there's no actor, we return the player status)
function ActorIsChaste() {
	if (CurrentActor == "")
		return Common_PlayerChaste;
	else
		return (ActorHasInventory("ChastityBelt"));
}

// Unties the actor and returns the rope to the player
function ActorUntie() {
	if (ActorHasInventory("TwoRopes")) { PlayerAddInventory("Rope", 1); ActorRemoveInventory("TwoRopes"); }
	if (ActorHasInventory("Rope")) { PlayerAddInventory("Rope", 1); ActorRemoveInventory("Rope"); }
	if (ActorHasInventory("Armbinder")) { PlayerAddInventory("Armbinder", 1); ActorRemoveInventory("Armbinder"); }
}

// Ungag the actor and returns the item if possible
function ActorUngag() {
	if (ActorHasInventory("BallGag")) { ActorRemoveInventory("BallGag"); PlayerAddInventory("BallGag", 1); }
	if (ActorHasInventory("ClothGag")) { ActorRemoveInventory("ClothGag"); PlayerAddInventory("ClothGag", 1); }
	if (ActorHasInventory("TapeGag")) ActorRemoveInventory("TapeGag");
	if (ActorHasInventory("PantieGag")) { ActorRemoveInventory("PantieGag"); PlayerAddInventory("PantieGag", 1); }
	if (ActorHasInventory("SockGag")) { ActorRemoveInventory("SockGag"); PlayerAddInventory("SockGag", 1); }
}

// Remove the blindfold from the actor and return it to the player
function ActorUnblindfold() {
	if (ActorHasInventory("Blindfold")) { ActorRemoveInventory("Blindfold"); PlayerAddInventory("Blindfold", 1); }
}

// Tries to apply a restrain on the current actor
function ActorApplyRestrain(RestrainName) {
	
	// The rope can be applied twice, the item becomes "TwoRopes"
	if ((RestrainName == "Rope") && ActorHasInventory("Rope") && !ActorHasInventory("TwoRopes") && PlayerHasInventory("Rope")) RestrainName = "TwoRopes";

	// If there's no text or the player is restrained, we assume we cannot apply the restrain
	var RestrainText = GetText(RestrainName);
	if ((RestrainText.substr(0, 20) != "MISSING TEXT FOR TAG") && (RestrainText != "") && !Common_PlayerRestrained && (PlayerHasInventory(RestrainName) || RestrainName == "TwoRopes") && !ActorHasInventory(RestrainName)) {

		// Second rope 
		if (RestrainName == "TwoRopes") {
			PlayerRemoveInventory("Rope", 1);
			ActorAddInventory("TwoRopes");
			CurrentTime = CurrentTime + 60000;			
		}
	
		// Regular restrains
		if ((RestrainName == "Rope") || (RestrainName == "Cuffs") || (RestrainName == "Armbinder")) {
			if (!ActorIsRestrained()) {
				PlayerRemoveInventory(RestrainName, 1);
				ActorAddInventory(RestrainName);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Collar (only available in the Kinbaku club for now)
		if ((RestrainName == "Collar") && (CurrentChapter == "C101_KinbakuClub")) {
			PlayerRemoveInventory("Collar", 1);
			ActorAddInventory("Collar");
			CurrentTime = CurrentTime + 60000;
		}

		// Regular gags (gags can be swapped)
		if ((RestrainName == "BallGag") || (RestrainName == "TapeGag") || (RestrainName == "ClothGag")) {
			ActorUngag();
			PlayerRemoveInventory(RestrainName, 1);
			ActorAddInventory(RestrainName);
			CurrentTime = CurrentTime + 60000;
		}

		// Mouth filling before regular gags (only available in the Kinbaku club for now)
		if (((RestrainName == "PantieGag") || (RestrainName == "SockGag")) && !(ActorHasInventory("BallGag") || ActorHasInventory("ClothGag") || ActorHasInventory("TapeGag")) && (CurrentChapter == "C101_KinbakuClub")) {
			PlayerRemoveInventory(RestrainName, 1);
			ActorAddInventory(RestrainName);
			CurrentTime = CurrentTime + 60000;
		}


		// Blindfold (only available in the Kinbaku club for now)
		if ((RestrainName == "Blindfold") && (CurrentChapter == "C101_KinbakuClub")) {
			PlayerRemoveInventory("Blindfold", 1);
			ActorAddInventory("Blindfold");
			CurrentTime = CurrentTime + 60000;
		}

		// Vaginal items (cannot be used if the actor is chaste)
		if ((RestrainName == "ChastityBelt") || (RestrainName == "VibratingEgg")) {
			if (!ActorIsChaste()) {
				PlayerRemoveInventory(RestrainName, 1);
				ActorAddInventory(RestrainName);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Anal items (cannot be used if the actor is chaste) (only available in the Kinbaku club for now)
		if ((RestrainName == "ChastityBelt") || (RestrainName == "ButtPlug")) {
			if (!ActorIsChaste()) {
				PlayerRemoveInventory(RestrainName, 1);
				ActorAddInventory(RestrainName);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Cuffs key
		if (RestrainName == "CuffsKey") {
			if (ActorHasInventory("Cuffs")) {
				ActorRemoveInventory("Cuffs");
				PlayerAddInventory("Cuffs", 1);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Show the text on the screen and jumps 1 minute
		OverridenIntroText = RestrainText;

	}

}

// Returns true if the queried actor has the queried inventory
function ActorSpecificHasInventory(QueryActor, QueryInventory) {

	// Cycles to find the correct actor and checks if the inventory is in the list
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == QueryActor)
			if (Actor[A][ActorInventory].indexOf(QueryInventory) >= 0)
				return true;
	return false;

}

// Clear all inventory from an actor (expect the egg, plug, chastitybelt and collar)
function ActorSpecificClearInventory(QueryActor, Recover) {	
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == QueryActor) {
			var HadEgg = ActorSpecificHasInventory(QueryActor, "VibratingEgg");
			var HadPlug = ActorSpecificHasInventory(QueryActor, "ButtPlug");
			var HadCollar = ActorSpecificHasInventory(QueryActor, "Collar");
			var HadBelt = ActorSpecificHasInventory(QueryActor, "ChastityBelt");
			while (Actor[A][ActorInventory].length > 0) {
				if ((Actor[A][ActorInventory][0] != "VibratingEgg") && (Actor[A][ActorInventory][0] != "ButtPlug") && (Actor[A][ActorInventory][0] != "TwoRopes") && (Actor[A][ActorInventory][0] != "Collar") && (Actor[A][ActorInventory][0] != "ChastityBelt") && (Actor[A][ActorInventory][0] != "TapeGag") && Recover)
					PlayerAddInventory(Actor[A][ActorInventory][0], 1);
				if ((Actor[A][ActorInventory][0] == "TwoRopes") && Recover)
					PlayerAddInventory("Rope", 1);
				Actor[A][ActorInventory].splice(0, 1);
			}
			if (HadEgg) Actor[A][ActorInventory].push("VibratingEgg");
			if (HadPlug) Actor[A][ActorInventory].push("ButtPlug");
			if (HadCollar) Actor[A][ActorInventory].push("Collar");
			if (HadBelt) Actor[A][ActorInventory].push("ChastityBelt");
		}
}

// Returns the actor image file to use
function ActorSpecificGetImage(QueryActor) {
	
	// The image file name is constructed from the inventory
	var ActorImage = QueryActor;
	if (ActorSpecificHasInventory(QueryActor, "Cuffs")) ActorImage = ActorImage + "_Cuffs";
	if (ActorSpecificHasInventory(QueryActor, "Rope")) ActorImage = ActorImage + "_Rope";
	if (ActorSpecificHasInventory(QueryActor, "Armbinder")) ActorImage = ActorImage + "_Armbinder";
	if (ActorSpecificHasInventory(QueryActor, "BallGag")) ActorImage = ActorImage + "_BallGag";
	if (ActorSpecificHasInventory(QueryActor, "TapeGag")) ActorImage = ActorImage + "_TapeGag";
	return ActorImage;

}

// Change specific actor  actors name on screen
function ActorSpecificConcealment(SpecificActor, Hidden) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == SpecificActor)
			Actor[A][ActorHideName] = Hidden;
}
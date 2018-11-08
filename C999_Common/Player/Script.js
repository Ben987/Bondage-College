var C999_Common_Player_ActiveTab = "";
var C999_Common_Player_MainActors = ["Amanda", "Sarah", "Sidney", "Jennifer", "Mildred", "Yuki", "Julia", "Sophie"];

// Chapter Common - Player Load
function C999_Common_Player_Load() {
	C999_Common_Player_ActiveTab = "Profile";
	LeaveIcon = "Leave";
	LoadText();
	PlayerSkillShowLevelUp = 0;
}

// Returns the title for the player based on actor interactions
function C999_Common_Player_GetTitle() {

	// Get the total love and domme level
	var Love = 0;
	var Domme = 0;
	for (var A = 0; A < Actor.length; A++) {
		Love = Love + Actor[A][ActorLove];
		Domme = Domme + Actor[A][ActorSubmission];
	}

	// Return a fitting title (level 3)
	if ((Love >= 20) && (Domme >= 20)) return GetText("LoveDomme3");
	if ((Love >= 20) && (Domme <= -20)) return GetText("LoveSub3");
	if ((Love <= -20) && (Domme >= 20)) return GetText("HateDomme3");
	if ((Love <= -20) && (Domme <= -20)) return GetText("HateSub3");
	if (Love >= 30) return GetText("Love3");
	if (Domme >= 30) return GetText("Domme3");
	if (Love <= -30) return GetText("Hate3");
	if (Domme <= -30) return GetText("Sub3");
	
	// Return a fitting title (level 2)
	if ((Love >= 12) && (Domme >= 12)) return GetText("LoveDomme2");
	if ((Love >= 12) && (Domme <= -12)) return GetText("LoveSub2");
	if ((Love <= -12) && (Domme >= 12)) return GetText("HateDomme2");
	if ((Love <= -12) && (Domme <= -12)) return GetText("HateSub2");
	if (Love >= 16) return GetText("Love2");
	if (Domme >= 16) return GetText("Domme2");
	if (Love <= -16) return GetText("Hate2");
	if (Domme <= -16) return GetText("Sub2");

	// Return a fitting title (level 1)
	if ((Love >= 5) && (Domme >= 5)) return GetText("LoveDomme1");
	if ((Love >= 5) && (Domme <= -5)) return GetText("LoveSub1");
	if ((Love <= -5) && (Domme >= 5)) return GetText("HateDomme1");
	if ((Love <= -5) && (Domme <= -5)) return GetText("HateSub1");
	if (Love >= 7) return GetText("Love1");
	if (Domme >= 7) return GetText("Domme1");
	if (Love <= -7) return GetText("Hate1");
	if (Domme <= -7) return GetText("Sub1");

	// No title
	return GetText("NoTitle");

}

// Chapter Common - Player Run
function C999_Common_Player_Run() {

	// Paints the player picture
	DrawPlayerImage(0, 0);

	// Draw the main frame
	DrawRect(599, 0, 1, 600, "Black");
	DrawRect(0, 0, 599, 600, "White");

	// Draw the profile tab (show the player name, title and skills)
	if (C999_Common_Player_ActiveTab == "Profile") {

		// Shows the basic info
		DrawText(GetText("Profile"), 100, 25, "black");
		DrawRect(200, 0, 200, 50, "black");
		DrawRect(201, 0, 198, 49, "silver");
		DrawText(GetText("Relationships"), 300, 25, "white");
		DrawRect(400, 0, 200, 50, "black");
		DrawRect(401, 0, 198, 49, "silver");
		DrawText(GetText("KinbakuClub"), 500, 25, "white");
		DrawText(GetText("Name") + " " + Common_PlayerName, 300, 90, "black");
		DrawText(GetText("Title") + " " + C999_Common_Player_GetTitle(), 300, 130, "black");

		// Shows the current lover and owner
		if (Common_PlayerLover != "") DrawText(GetText("Lover") + " " + Common_PlayerLover, 300, 170, "black");
		else DrawText(GetText("Lover") + " " + GetText("NoLover"), 300, 170, "black");
		if (Common_PlayerOwner != "") DrawText(GetText("Owner") + " " + Common_PlayerOwner, 300, 210, "black");
		else DrawText(GetText("Owner") + " " + GetText("NoOwner"), 300, 210, "black");

		// List the skills
		DrawText(GetText("Skills"), 200, 270, "black");
		DrawText(GetText("Level"), 500, 270, "black");
		DrawRect(30, 290, 539, 1, "Black");
		for (var S = 0; S < PlayerSkill.length; S++) {
			DrawText(GetText("Skill" + PlayerSkill[S][PlayerSkillName]), 200, 320 + S * 40, "black");
			DrawText(PlayerSkill[S][PlayerSkillLevel].toString(), 500, 320 + S * 40, "black");
		}

	}

	// Draw the relationships tab (show all known main actors and their relationship with the player)
	if (C999_Common_Player_ActiveTab == "Relationships") {
		DrawRect(0, 0, 200, 50, "black");
		DrawRect(0, 0, 199, 49, "silver");
		DrawText(GetText("Profile"), 100, 25, "white");
		DrawText(GetText("Relationships"), 300, 25, "black");
		DrawRect(400, 0, 200, 50, "black");
		DrawRect(401, 0, 198, 49, "silver");
		DrawText(GetText("KinbakuClub"), 500, 25, "white");
		var Pos = 0;
		for (var A = 0; A < Actor.length; A++) {
			CurrentActor = Actor[A][ActorName];
			if (C999_Common_Player_MainActors.indexOf(CurrentActor) >= 0) {
				DrawActorStats(300, Pos * 60 + 90);
				Pos++;
			}
		}
		CurrentActor = "";
	}

	// Draw the kinbaku club relationships tab (show all known kinbaku club actors and their relationship with the player)
	if (C999_Common_Player_ActiveTab == "KinbakuClub") {
		DrawRect(0, 0, 200, 50, "black");
		DrawRect(0, 0, 199, 49, "silver");
		DrawText(GetText("Profile"), 100, 25, "white");
		DrawRect(200, 0, 200, 50, "black");
		DrawRect(201, 0, 198, 49, "silver");
		DrawText(GetText("Relationships"), 300, 25, "white");
		DrawText(GetText("KinbakuClub"), 500, 25, "black");
		var Pos = 0;
		for (var A = 0; A < Actor.length; A++) {
			CurrentActor = Actor[A][ActorName];
			if (C999_Common_Player_MainActors.indexOf(CurrentActor) < 0) {
				DrawActorStats(300, Pos * 60 + 90);
				Pos++;
			}
		}
		CurrentActor = "";
	}
	
}

// Chapter Common - Player Click
function C999_Common_Player_Click() {
	
	// Can allow to click on inventory from the player screen
	InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
	
	// Tab navigation
	if ((MouseX >= 1) && (MouseX <= 199) && (MouseY >= 1) && (MouseY <= 49)) C999_Common_Player_ActiveTab = "Profile";
	if ((MouseX >= 201) && (MouseX <= 399) && (MouseY >= 1) && (MouseY <= 49)) C999_Common_Player_ActiveTab = "Relationships";
	if ((MouseX >= 401) && (MouseX <= 599) && (MouseY >= 1) && (MouseY <= 49)) C999_Common_Player_ActiveTab = "KinbakuClub";

}
// Chapter 101 - Club Room 4 Load
function C101_KinbakuClub_ClubRoom4_Load() {
	if (PlayerHasLockedInventory("Blindfold")) SetScene(CurrentChapter, "BlindMansBuff");
	//LeaveIcon = "Wait";
}

// Chapter  101 - Club Room 4 Run
function C101_KinbakuClub_ClubRoom4_Run() {

	// Draw the background image 
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/ClubRoom4.jpg", 0, 0);

	// Draw movement arrows
	if (!PlayerHasLockedInventory("Manacles")) {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/ClubRoom4ArrowLeft.jpg", 20, 525);
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/ClubRoom4ArrowRight.jpg", 1090, 525);
	}
	
	// Draw the player when she is a slave
	if (PlayerHasLockedInventory("Manacles")) {
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/SlavesPlayer.png", 280, 185);
		if (PlayerHasLockedInventory("BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/SlavesPlayerBallGag.png", 322, 230);
		if (PlayerHasLockedInventory("ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/SlavesPlayerClothGag.png", 320, 273);
		if (PlayerHasLockedInventory("TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/SlavesPlayerTapeGag.png", 325, 275);
		if (PlayerHasLockedInventory("ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/SlavesPlayerChastityBelt.png", 310, 410);
	}

	// Draw Chloe when she is a slave

	// Draw a twin when she is a slave
	if (C101_KinbakuClub_SlaveTwin_TwinCaptured) {

		if (!C101_KinbakuClub_SlaveTwin_Kneeling) {
			// Legs
			var TwinLegs = "";
			if (C101_KinbakuClub_SlaveTwin_TiedLegs) TwinLegs = "Tied";
			if (!C101_KinbakuClub_SlaveTwin_TiedLegs) TwinLegs = "Untied";
			if (C101_KinbakuClub_SlaveTwin_Barefoot) TwinLegs = TwinLegs + "BareFeet";
			if (!C101_KinbakuClub_SlaveTwin_Barefoot) TwinLegs = TwinLegs + "Shoes";
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinLegs" + TwinLegs + ".png", 700, 270);

			// Chastity belt
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinChastityBelt.png", 710, 270);

			// Torso
			var TwinTorso = "Uniform";
			if (ActorSpecificGetValue(C101_KinbakuClub_SlaveTwin_KidnappedTwin, ActorCloth) == "Underwear") TwinTorso = "Underwear";
			if (!ActorSpecificIsRestrained(C101_KinbakuClub_SlaveTwin_KidnappedTwin)) TwinTorso = TwinTorso + "NoBondage";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Rope")) {
				if (C101_KinbakuClub_SlaveTwin_TiedAsymmetric) TwinTorso = TwinTorso + "AsymmetricTie";
				if (C101_KinbakuClub_SlaveTwin_TiedElbowsTouching) TwinTorso = TwinTorso + "ElbowTie";
				if (!C101_KinbakuClub_SlaveTwin_TiedAsymmetric && !C101_KinbakuClub_SlaveTwin_TiedElbowsTouching) TwinTorso = TwinTorso + "BoxTie";
			}
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Cuffs")) TwinTorso = TwinTorso + "Cuffs";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Armbinder")) TwinTorso = TwinTorso + "Armbinder";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Manacles")) TwinTorso = TwinTorso + "Manacles";
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/Twin" + TwinTorso + ".png", 675, 40);

			// Extras
			if (C101_KinbakuClub_SlaveTwin_Blushing) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinBlush.png", 728, 110);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Blindfold")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinBlindfold.png", 725, 96);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinBallGag.png", 730, 75);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinClothGag.png", 727, 119);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinTapeGag.png", 738, 123);
			if (!C101_KinbakuClub_SlaveTwin_SkirtRemoved) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinSkirt.png", 689, 252);
		}

		if (C101_KinbakuClub_SlaveTwin_Kneeling) {
			// Legs
			var TwinLegs = "Shoes";
			if (C101_KinbakuClub_SlaveTwin_UniformRemoved) TwinLegs = "BareFeet";
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingLegs" + TwinLegs + ".png", 690, 420);

			// Chastity belt
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "ChastityBelt")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingChastityBelt.png", 705, 430);

			// Torso
			var TwinTorso = "Uniform";
			if (ActorSpecificGetValue(C101_KinbakuClub_SlaveTwin_KidnappedTwin, ActorCloth) == "Underwear") TwinTorso = "Underwear";
			if (!ActorSpecificIsRestrained(C101_KinbakuClub_SlaveTwin_KidnappedTwin)) TwinTorso = TwinTorso + "NoBondage";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Rope")) {
				if (C101_KinbakuClub_SlaveTwin_TiedAsymmetric) TwinTorso = TwinTorso + "AsymmetricTie";
				if (C101_KinbakuClub_SlaveTwin_TiedElbowsTouching) TwinTorso = TwinTorso + "ElbowTie";
				if (!C101_KinbakuClub_SlaveTwin_TiedAsymmetric && !C101_KinbakuClub_SlaveTwin_TiedElbowsTouching) TwinTorso = TwinTorso + "BoxTie";
			}
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Cuffs")) TwinTorso = TwinTorso + "Cuffs";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Armbinder")) TwinTorso = TwinTorso + "Armbinder";
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Manacles")) TwinTorso = TwinTorso + "Manacles";
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneeling" + TwinTorso + ".png", 677, 180);

			// Extras
			if (ActorSpecificGetValue(C101_KinbakuClub_SlaveTwin_KidnappedTwin, ActorCloth) == "Underwear" && ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "ChastityBelt") && !ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Rope")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingChastityBelt.png", 705, 430);
			if (C101_KinbakuClub_SlaveTwin_Blushing) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingBlush.png", 734, 291);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "Blindfold")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingBlindfold.png", 730, 277);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "BallGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingBallGag.png", 734, 259);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "ClothGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingClothGag.png", 732, 296);
			if (ActorSpecificHasInventory(C101_KinbakuClub_SlaveTwin_KidnappedTwin, "TapeGag")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingTapeGag.png", 744, 302);
			if (!C101_KinbakuClub_SlaveTwin_SkirtRemoved) {
				if (C101_KinbakuClub_SlaveTwin_SkirtPullDown) DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingSkirtPulledDown.png", 691, 510);
				if (!C101_KinbakuClub_SlaveTwin_SkirtPullDown) {
					if (ActorSpecificGetValue(C101_KinbakuClub_SlaveTwin_KidnappedTwin, ActorCloth) == "Underwear") DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingSkirtUnderwear.png", 695, 416);
					else DrawImage(CurrentChapter + "/" + CurrentScreen + "/TwinKneelingSkirt.png", 695, 416);
				}
			}
		}
	}

	// Draw Erica's mistory slave when she is the player's slave

}

// Chapter 101 - Club Room 4 Click
function C101_KinbakuClub_ClubRoom4_Click() {

	// When the player is not trapped in manacles and
	if (!PlayerHasLockedInventory("Manacles")) {
		// Click on any regular item
		InventoryClick(GetClickedInventory(), "C101_KinbakuClub", "ClubRoom4");
		// Clicks to change clubroom scene
		if ((MouseX >= 15) && (MouseX <= 115) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom2");
		if ((MouseX >= 1085) && (MouseX <= 1185) && (MouseY >= 520) && (MouseY <= 580)) SetScene(CurrentChapter, "ClubRoom3");
		// Clicks to look in the bag
		if ((MouseX >= 20) && (MouseX <= 155) && (MouseY >= 430) && (MouseY <= 515)) {
			SetScene(CurrentChapter, "Slaves");
			C101_KinbakuClub_Slaves_CurrentStage = 0;
		}
	}

	// When the player is manacled and clicks on themself
	if (PlayerHasLockedInventory("Manacles")) {
		if ((MouseX >= 280) && (MouseX <= 425) && (MouseY >= 180) && (MouseY <= 599)) {
			SetScene(CurrentChapter, "Slaves");
			C101_KinbakuClub_Slaves_CurrentStage = 120;
		}
	}
	
	// When Chloe is a slave and the user clicks on her

	// When a twin is a slave and the user clicks on her
	if (C101_KinbakuClub_SlaveTwin_KidnappedTwin) {
		if ((MouseX >= 680) && (MouseX <= 830) && (MouseY >= 40) && (MouseY <= 590)) {
			SetScene(CurrentChapter, "SlaveTwin");
			C101_KinbakuClub_Slaves2_CurrentStage = 0;
		}
	}

	// When Erica's mystery slave is the player's and the user clicks on her

}
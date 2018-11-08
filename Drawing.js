// The main game canvas where everything will be drawn
var MainCanvas;

// A bank of all the chached images
var CacheImage = {};

// Icons bank and paths
var Icons = new function () {
    this.Path = GetPath("Icons");
    this.Fight = new function (parent) {
        this.Path = GetPath("C999_Common", "Fights", "Icons");
        this.Punch = GetIconPath(this.Path, "Punch");
        this.Rope = GetIconPath(this.Path, "Rope");
        this.TennisBall = GetIconPath(this.Path, "TennisBall");
    }(this);
    this.Race = new function (parent) {
        this.Path = GetPath("C999_Common", "Races", "Icons");
        this.ElbowBound = GetIconPath(this.Path, "ElbowBound");
        this.KneeBound = GetIconPath(this.Path, "KneeBound");
    }(this);
    this.Navigation = new function (parent) {
        this.Path = GetPath("Icons", "Navigation");
        this.ArrowLeftActive = GetIconPath(this.Path, "ArrowLeftActive");
        this.ArrowRightActive = GetIconPath(this.Path, "ArrowRightActive");
        this.ArrowUpActive = GetIconPath(this.Path, "ArrowUpActive");
        this.ArrowDownActive = GetIconPath(this.Path, "ArrowDownActive");
        this.ArrowLeftInactive = GetIconPath(this.Path, "ArrowLeftInactive");
        this.ArrowRightInactive = GetIconPath(this.Path, "ArrowRightInactive");
        this.ArrowUpInactive = GetIconPath(this.Path, "ArrowUpInactive");
        this.ArrowDownInactive = GetIconPath(this.Path, "ArrowDownInactive");
    }(this);
}();

// Returns the image file or build it from the source
function DrawGetImage(Source) {

    // Search in the cache to find the image
    if (!CacheImage[Source]) {
        var img = new Image;
        img.src = Source;
        CacheImage[Source] = img;
    }

    // returns the final image
    return CacheImage[Source];
}
		
// Draw a zoomed image from a source to the canvas
function DrawImageZoom(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	MainCanvas.drawImage(DrawGetImage(Source), SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
}

// Draw a zoomed image from a source to the canvas and mirrors it from left to right
function DrawImageZoomMirror(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	MainCanvas.save();
    MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(DrawGetImage(Source), X * -1, Y, Width * -1, Height);
    MainCanvas.restore();
}

// Draw an image from a source to the canvas
function DrawImage(Source, X, Y) {
	MainCanvas.drawImage(DrawGetImage(Source), X, Y);
}

// Draw an image from a source to the canvas
function DrawImageMirror(Source, X, Y) {
	MainCanvas.save();
    MainCanvas.scale(-1, 1);
	MainCanvas.drawImage(DrawGetImage(Source), X * -1, Y);
    MainCanvas.restore();
}

// Draw a text in the canvas
function DrawText(Text, X, Y, Color) {

	// Replace the COMMON_PLAYERNAME keyword with the player name
	Text = Text.replace("COMMON_PLAYERNAME", Common_PlayerName);

	// Replace the COMMON_NUMBER keyword with a number generated while playing the game
	Text = Text.replace("COMMON_NUMBER", Common_Number);

	// Remove the timing tag if present
	if (Text.indexOf("ADD_MINUTES:") >= 0)
		Text = Text.substring(0, Text.indexOf("ADD_MINUTES:"));

	// Font is fixed for now, color can be set
	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = Color;
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";

	// Split the text on two lines if there's a |
	if (Text.indexOf("|") == -1)
		MainCanvas.fillText(Text, X, Y);
	else {
		MainCanvas.fillText(Text.substring(0, Text.indexOf("|")), X, Y - 19);
		MainCanvas.fillText(Text.substring(Text.indexOf("|") + 1, 1000), X, Y + 19);
	}					

}

// Draw a button
function DrawButton(Left, Top, Width, Height, Label) {

	// Draw the button rectangle
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = 'white'; 
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();	
	MainCanvas.lineWidth = '2';
	MainCanvas.strokeStyle = 'black';
	MainCanvas.stroke();
	MainCanvas.closePath();
	
	// Draw the text
	DrawText(Label, Left + Width / 2, Top + Height / 2, "black");
	
}

// Draw a basic rectangle
function DrawRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = Color; 
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();	
	MainCanvas.closePath();		
}

// Draw a basic circle
function DrawCircle(CenterX, CenterY, Radius, LineWidth, LineColor) {
	MainCanvas.beginPath();
	MainCanvas.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	MainCanvas.lineWidth = LineWidth;
	MainCanvas.strokeStyle = LineColor;
	MainCanvas.stroke();	
}

// Draw --- if zero, +value in green if positive, -value in red if negative
function DrawPosNegValue(Value, X, Y) {	
	if (Value == 0) DrawText("---", X, Y, "black");
	if (Value > 0) DrawText("+" + Value.toString(), X, Y, "#00BB00");
	if (Value < 0) DrawText(Value.toString(), X, Y, "#BB0000");	
}

// Draw the current actor stats toward the player
function DrawActorStats(Left, Top) {
	
	// Draw the actor name and icon
	if (ActorGetValue(ActorHideName)) DrawText("Unknown", Left - 200, Top + 17, "black");
	else DrawText(CurrentActor, Left - 200, Top + 17, "black");
	if (CurrentActor == Common_PlayerLover) DrawImage("Icons/Lover.png", Left - 110, Top);
	else DrawImage("Icons/Heart.png", Left - 110, Top);
	if (ActorGetValue(ActorOwner) == "Player") DrawImage("Icons/Collared.png", Left - 10, Top);
	else if (CurrentActor == Common_PlayerOwner) DrawImage("Icons/Owner.png", Left - 10, Top);
	else DrawImage("Icons/Submission.png", Left - 10, Top);
	DrawImage("Icons/Orgasm.png", Left + 90, Top);
	DrawImage("Icons/Bondage.png", Left + 190, Top);
	DrawPosNegValue(ActorGetValue(ActorLove), Left - 50, Top + 17);
	DrawPosNegValue(ActorGetValue(ActorSubmission), Left + 50, Top + 17);
	DrawText(ActorGetValue(ActorOrgasmCount).toString(), Left + 150, Top + 17, "black");
	DrawText(ActorGetValue(ActorBondageCount).toString(), Left + 250, Top + 17, "black");

}

// Draw the intro box
function DrawIntro(Intro, CurrentStagePosition, LoveLevel, SubLevel) {

	// Draw the top box and stats
	DrawRect(0, 0, 599, 150, "White");	
	if (CurrentActor != "") {
		DrawRect(30, 60, 539, 1, "Black");
		DrawActorStats(300, 15);
	}
	
	// Find the correct intro text
	var ShowText = "";
	if (OverridenIntroText != "")
		ShowText = OverridenIntroText
	else
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ShowText = Intro[I][IntroText];

	// Draw the intro
	if (CurrentActor != "") DrawText(ShowText, 300, 105, "black");
	else DrawText(ShowText, 300, 75, "black");
				
}

// Draw a selectable option on the screen
function DrawOption(OptionText, Left, Top) {

	// Draw the rectangle and text
	if (OptionText.substr(0, 1) == "@") OptionText = OptionText.substr(1);
	DrawRect(Left, Top, 299, 89, "White");	
	if ((MouseX >= Left) && (MouseX <= Left + 299) && (MouseY >= Top) && (MouseY <= Top + 89) && !IsMobile) DrawText(OptionText, Left + 150, Top + 45, "#00BB00");
	else DrawText(OptionText, Left + 150, Top + 45, "#BB0000");	
	
}

// Draw all the possible interactions 
function DrawInteraction(Stage, CurrentStagePosition, LoveLevel, SubLevel) {

	// Find all the correct interactions for the current stage
	var Pos = 0;
	for (var S = 0; S < Stage.length; S++)
		if (Stage[S][StageNumber] == CurrentStagePosition) 
			if (ActorInteractionAvailable(Stage[S][StageLoveReq], Stage[S][StageSubReq], Stage[S][StageVarReq], Stage[S][StageInteractionText], false)) {
				
				// Draw the box and interaction
				DrawOption(Stage[S][StageInteractionText], (Pos % 2) * 300, 151 + (Math.round((Pos - 1) / 2) * 90));
				Pos = Pos + 1;			
				
			}
		
}

// Find the current image file 
function FindImage(Intro, CurrentStagePosition) {
	
	// The image file is a column in the intro CSV file
	var ImageName = "";
	if (OverridenIntroImage != "")
		ImageName = OverridenIntroImage;
	else
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ImageName = Intro[I][IntroImage];
	return ImageName;

}

// Build the full character / object interaction screen
function BuildInteraction(CurrentStagePosition) {

	// Make sure the CSV files for interactions are loaded
	if ((CurrentIntro != null) && (CurrentStage != null)) {

		// Paints the background image depending on the current stage
		var ImageName = FindImage(CurrentIntro, CurrentStagePosition);
		if ((ImageName !== undefined) && (ImageName.trim() != "")) DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + ImageName, 600, 0);

		// Build all the options for interaction
		DrawRect(0, 0, 600, 600, "Black");
		DrawIntro(CurrentIntro, CurrentStagePosition, 0, 0);
		DrawInteraction(CurrentStage, CurrentStagePosition, 0, 0);

	}

}

// Get the player image file name
function GetPlayerIconImage() {

	// The file name changes if the player is gagged or blinks at specified intervals
	var Image = "Player";
	var seconds = new Date().getTime();
	if (PlayerHasLockedInventory("BallGag") == true) Image = Image + "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) Image = Image + "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) Image = Image + "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) Image = Image + "_DoubleOpenGag";
    if (PlayerHasLockedInventory("Blindfold") == true) Image = Image + "_Blindfold";
	if (Math.round(seconds / 500) % 15 == 0) Image = Image + "_Blink";
	return Image;

}

// Draw all the inventory icons
function DrawInventory() {

	// Draw the player icon
	if (((MouseX >= 1) && (MouseX <= 74) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile))
		DrawImage("Icons/" + GetPlayerIconImage() + "_Active.png", 0, 601);
	else
		DrawImage("Icons/" + GetPlayerIconImage() + "_Inactive.png", 0, 601);
	
	// Draw an arrow over the player head if there's a skill level up
	if (PlayerSkillShowLevelUp > 0) DrawImage("Icons/SkillLevelUp.png", 0, 601);
	
	// Scroll in the full inventory to draw the icons and quantity, draw a padlock over the item if it's locked
	var Pos = 1;
	for (var I = 0; I < PlayerInventory.length; I++) {

		// First inventory tab
		if (PlayerInventoryTab == 0) {

			// 11 positions for the items
			if (Pos <= 11) {
				var ImgState = "Inactive";
				if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";		
				DrawImage("Icons/" + PlayerInventory[I][PlayerInventoryName] + "_" + ImgState + ".png", 1 + Pos * 75, 601);
				DrawText(PlayerInventory[I][PlayerInventoryQuantity].toString(), Pos * 75 + 64, 661, "#000000");
				if (PlayerHasLockedInventory(PlayerInventory[I][PlayerInventoryName]))
					DrawImage("Icons/Lock_" + ImgState + ".png", Pos * 75, 600)
			}

			// the last position is for the next tab
			if (Pos == 12) {
				var ImgState = "Inactive";
				if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";
				DrawImage("Icons/SecondInventoryTab_" + ImgState + ".png", 1 + Pos * 75, 601);
			}
			
		};
		
		// Second inventory tab
		if ((Pos >= 12) && (PlayerInventoryTab == 1)) {		
			var ImgState = "Inactive";
			if (((MouseX >= 1 + (Pos - 11) * 75) && (MouseX <= 74 + (Pos - 11) * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";		
			DrawImage("Icons/" + PlayerInventory[I][PlayerInventoryName] + "_" + ImgState + ".png", 1 + (Pos - 11) * 75, 601);
			DrawText(PlayerInventory[I][PlayerInventoryQuantity].toString(), (Pos - 11) * 75 + 64, 661, "#000000");
			if (PlayerHasLockedInventory(PlayerInventory[I][PlayerInventoryName]))
				DrawImage("Icons/Lock_" + ImgState + ".png", (Pos - 11) * 75, 600)
		};

		// Jumps to the next position
		Pos = Pos + 1;
		
	}

	// Scroll in the locked inventory also to find items that were not loaded
	for (var I = 0; I < PlayerLockedInventory.length; I++) 
		if (!PlayerHasInventory(PlayerLockedInventory[I])) {

			// First inventory tab
			if (PlayerInventoryTab == 0) {

				// 11 positions for the items
				if (Pos <= 11) {
					if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) {
						DrawImage("Icons/" + PlayerLockedInventory[I] + "_Active.png", 1 + Pos * 75, 601);
						DrawImage("Icons/Lock_Active.png", Pos * 75, 600);
					}
					else {
						DrawImage("Icons/" + PlayerLockedInventory[I] + "_Inactive.png", 1 + Pos * 75, 601);				
						DrawImage("Icons/Lock_Inactive.png", Pos * 75, 600);
					}
				}

				// the last position is for the next tab
				if (Pos == 12) {
					var ImgState = "Inactive";
					if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";
					DrawImage("Icons/SecondInventoryTab_" + ImgState + ".png", 1 + Pos * 75, 601);
				}

			}
			
			// Second inventory tab
			if ((Pos >= 12) && (PlayerInventoryTab == 1)) {		
				if (((MouseX >= 1 + (Pos - 11) * 75) && (MouseX <= 74 + (Pos - 11) * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) {
					DrawImage("Icons/" + PlayerLockedInventory[I] + "_Active.png", 1 + (Pos - 11) * 75, 601);
					DrawImage("Icons/Lock_Active.png", (Pos - 11) * 75, 600);
				}
				else {
					DrawImage("Icons/" + PlayerLockedInventory[I] + "_Inactive.png", 1 + (Pos - 11) * 75, 601);				
					DrawImage("Icons/Lock_Inactive.png", (Pos - 11) * 75, 600);
				}
			};

			// Jumps to the next position
			Pos = Pos + 1;

		};
		
	// On the second tab, we put an arrow to go back to the first tab
	if ((Pos >= 12) && (PlayerInventoryTab == 1)) {
		var ImgState = "Inactive";
		if (((MouseX >= 1 + (Pos - 11) * 75) && (MouseX <= 74 + (Pos - 11) * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";
		DrawImage("Icons/FirstInventoryTab_" + ImgState + ".png", 1 + (Pos - 11) * 75, 601);
	}

}

// Build the bottom bar menu
function BuildBottomBar() {

	// Paints the background depending on the current stage
	DrawRect(0, 600, 1200, 1, "black");
	DrawRect(0, 601, 1200, 74, "white");
	DrawRect(975, 600, 1, 675, "black");
	DrawInventory();

	// Draw the leave icon and clock
	if (LeaveIcon != "") {
		DrawImage("Icons/Clock.png", 985, 621);
		DrawText(msToTime(CurrentTime), 1073, 637, "black");
		if (((MouseX >= 1125) && (MouseX <= 1200) && (MouseY >= 600) && (MouseY <= 675)) || (IsMobile)) DrawImage("Icons/" + LeaveIcon + "_Active.png", 1125, 600);
		else DrawImage("Icons/" + LeaveIcon + "_Inactive.png", 1125, 600);
	} else {
		DrawImage("Icons/Clock.png", 1010, 621);
		DrawText(msToTime(CurrentTime), 1110, 637, "black");
	}

}

// Returns the name of the image file to use to draw the player
function DrawGetPlayerImageName(IncludePose) {
	
	// Get the first part of the image
	var ImageCloth = "Clothed";
	if (Common_PlayerUnderwear) ImageCloth = "Underwear";
	if (Common_PlayerNaked) ImageCloth = "Naked";
	if ((Common_PlayerUnderwear || Common_PlayerNaked) && PlayerHasLockedInventory("ChastityBelt")) ImageCloth = "ChastityBelt";
	if (Common_PlayerCostume != "") ImageCloth = Common_PlayerCostume
	
	// Second part is the type of bondage
	var ImageBondage = "_NoBondage";	
	if (PlayerHasLockedInventory("Cuffs") == true) ImageBondage = "_Cuffs";
	if (PlayerHasLockedInventory("Rope") == true) ImageBondage = "_Rope";
	if (PlayerHasLockedInventory("Armbinder") == true) ImageBondage = "_Armbinder";

	// Third part is the collar, which only shows for certain clothes
	var ImageCollar = "";
	if ((ImageCloth == "Underwear") || (ImageCloth == "Naked") || (ImageCloth == "ChastityBelt") || (ImageCloth == "Damsel") || (ImageCloth == "Tennis") || (ImageCloth == "Judo") || (ImageCloth == "RedBikini")) {
		if (PlayerHasLockedInventory("Collar")) ImageCollar = "_Collar";
		else ImageCollar = "_NoCollar";
	}
	
	// Fourth part is the gag
	var ImageGag = "_NoGag";
	if (PlayerHasLockedInventory("BallGag") == true) ImageGag = "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) ImageGag = "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) ImageGag = "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) ImageGag = "_DoubleOpenGag";

	// Fifth part is the blindfold
	var ImageBlindfold = "";	
    if (PlayerHasLockedInventory("Blindfold") == true) ImageBlindfold = "_Blindfold";

	// Sixth part is the pose
	var ImagePose = "";
    if ((Common_PlayerPose != "") && IncludePose) ImagePose = "_" + Common_PlayerPose;

	// Return the constructed name
	return ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ImagePose;

}

// Draw the regular player image (600x600) (can zoom if an X and Y are provided)
function DrawPlayerImage(X, Y) {
	if ((Common_PlayerCostume == "Tennis") || (Common_PlayerCostume == "Judo") || (Common_PlayerCostume == "Teacher") || (Common_PlayerCostume == "BlackDress") || (Common_PlayerCostume == "WhiteLingerie") || (Common_PlayerCostume == "RedBikini")) {
		DrawRect(600, 0, 1200, 600, "White");
		DrawTransparentPlayerImage(600, 0, 1);
	} else {
		if ((X == 0) && (Y == 0)) DrawImage("C999_Common/Player/" + DrawGetPlayerImageName(false) + ".jpg", 600, 0);
		else DrawImageZoom("C999_Common/Player/" + DrawGetPlayerImageName(false) + ".jpg", X, Y, 600, 600, 600, 0, 1200, 1200);
	}	
}

// Draw the transparent player image (600x900) with a zoom if required
function DrawTransparentPlayerImage(X, Y, Zoom) {
	DrawImageZoom("Actors/Player/" + DrawGetPlayerImageName(true) + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
}

// Draw the transparent actor over the current background
function DrawActor(ActorToDraw, X, Y, Zoom) {
	
	// Validate first if we must draw the transparent player image
	if (ActorToDraw == "Player") {
		DrawTransparentPlayerImage(X, Y, Zoom);		
	} else {

		// First, we retrieve the current clothes
		var ImageCloth = ActorSpecificGetValue(ActorToDraw, ActorCloth);
		if (ImageCloth == "") ImageCloth = "Clothed";
		if (((ImageCloth == "Underwear") || (ImageCloth == "Naked")) && ActorSpecificHasInventory(ActorToDraw, "ChastityBelt")) ImageCloth = "ChastityBelt";

		// Second part is the type of bondage
		var ImageBondage = "_NoBondage";	
		if (ActorSpecificHasInventory(ActorToDraw, "Cuffs")) ImageBondage = "_Cuffs";
		if (ActorSpecificHasInventory(ActorToDraw, "Rope")) ImageBondage = "_Rope";
		if (ActorSpecificHasInventory(ActorToDraw, "TwoRopes")) ImageBondage = "_TwoRopes";
		if (ActorSpecificHasInventory(ActorToDraw, "ThreeRopes")) ImageBondage = "_ThreeRopes";
		if (ActorSpecificHasInventory(ActorToDraw, "Armbinder")) ImageBondage = "_Armbinder";

		// Third part is the collar, which only shows for certain clothes
		var ImageCollar = "";
		if ((ImageCloth == "Underwear") || (ImageCloth == "Naked") || (ImageCloth == "ChastityBelt") || (ImageCloth == "Damsel") || (ImageCloth == "Shorts") || (ImageCloth == "Swimsuit") || (ImageCloth == "Tennis") || (ImageCloth == "BrownDress")) {
			if (ActorSpecificHasInventory(ActorToDraw, "Collar")) ImageCollar = "_Collar";
		}

		// Fourth part is the gag
		var ImageGag = "_NoGag";
		if (ActorSpecificHasInventory(ActorToDraw, "BallGag")) ImageGag = "_BallGag";
		if (ActorSpecificHasInventory(ActorToDraw, "TapeGag")) ImageGag = "_TapeGag";
		if (ActorSpecificHasInventory(ActorToDraw, "ClothGag")) ImageGag = "_ClothGag";

		// Fifth part is the blindfold
		var ImageBlindfold = "";	
		if (ActorSpecificHasInventory(ActorToDraw, "Blindfold")) ImageBlindfold = "_Blindfold";

		// Fourth part is the pose
		var ImagePose = "";
		if (ActorSpecificGetValue(ActorToDraw, ActorPose) != "") ImagePose = "_" + ActorSpecificGetValue(ActorToDraw, ActorPose);

		// Draw the full image from all parts
		DrawImageZoom("Actors/" + ActorToDraw + "/" + ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ImagePose + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
		
	}

}

// Draw the current interaction actor (if there's no actor, we draw the player)
function DrawInteractionActor() {
	if (CurrentActor == "") {
		DrawTransparentPlayerImage(600, 0, 1);
	} else {
		if (ActorHasInventory("TwoRopes") || ActorHasInventory("ThreeRopes")) DrawActor(CurrentActor, 600, -250, 1);
		else DrawActor(CurrentActor, 600, 0, 1);
	}
}

// Draw a ramdom image of the player as transition from chapter to chapter
function DrawPlayerTransition() {
	var ImgRnd = (Math.round(new Date().getTime() / 5000) % 8) + 1;
	DrawImage("Actors/PlayerTransition/Player0" + ImgRnd.toString() + ".png", 900, 0);
}

// Returns a the path to a icon.  IconName can be preceeded by additional paths.
function GetIconPath(IconName) {
    return GetPath.apply(undefined, arguments) + ".png";
}

// Returns a the path to an icon for the current screen.  IconName can be preceeded by additional paths.
function GetIconScreenPath(IconName) {
    return GetIconPath(GetPath.apply(undefined, [CurrentChapter, CurrentScreen].concat(Array.from(arguments))));
}
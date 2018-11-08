var C012_AfterClass_Pool_CurrentStage = 0;
var C012_AfterClass_Pool_IntroText = "";
var C012_AfterClass_Pool_CurrentActor = "";
var C012_AfterClass_Pool_HasSports = false;
var C012_AfterClass_Pool_SwimCount = 0;
var C012_AfterClass_Pool_JenniferAvail = false;
var C012_AfterClass_Pool_BullyPose = "BullyRight";
var C012_AfterClass_Pool_SwimTimeWithJennifer = 0;

// Chapter 12 After Class - Check who's in the Pool
function C012_AfterClass_Pool_WhoInIsPool() {
	C012_AfterClass_Pool_JenniferAvail = (GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyMet") && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromPool") && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromRoommates") && (CurrentTime >= 19 * 60 * 60 * 1000) && (CurrentTime < 22 * 60 * 60 * 1000));
}

// Chapter 12 After Class - Pool Load
function C012_AfterClass_Pool_Load() {
	
	// Loads the scene to search in the wardrobe
	LoadInteractions();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	C012_AfterClass_Pool_HasSports = (PlayerGetSkillLevel("Sports") > 0);

	// If we must put the previous text or previous actor back
	if (C012_AfterClass_Pool_IntroText != "") { OverridenIntroText = C012_AfterClass_Pool_IntroText; C012_AfterClass_Pool_IntroText = ""; }
	if (C012_AfterClass_Pool_CurrentActor != "") ActorLoad(C012_AfterClass_Pool_CurrentActor, "");
	if (C012_AfterClass_Pool_CurrentStage <= 99) C012_AfterClass_Pool_WhoInIsPool();

	// No leaving from the Pool
	LeaveIcon = "";
	LeaveScreen = "";

}

// Chapter 12 After Class - Pool Run
function C012_AfterClass_Pool_Run() {
	
	// Standard interactions 
	BuildInteraction(C012_AfterClass_Pool_CurrentStage);
	
	// Renders a different image if Jennifer is in the pool
	if ((C012_AfterClass_Pool_CurrentStage == 0) && C012_AfterClass_Pool_JenniferAvail) OverridenIntroImage = "PoolJenniferSwim.jpg";
	else if ((C012_AfterClass_Pool_CurrentStage >= 200) && PlayerHasLockedInventory("Collar")) OverridenIntroImage = "PoolSwimWithJenniferCollar.jpg";
	else OverridenIntroImage = "";

	// Renders the showering scene for the player
	if (C012_AfterClass_Pool_CurrentStage == 101) DrawActor("Player", 650, -30, 0.9);
	
	// Renders the Jennifer/Bully scene
	if ((C012_AfterClass_Pool_CurrentStage >= 110) && (C012_AfterClass_Pool_CurrentStage <= 199)) {
		DrawActor("Jennifer", 725, 0, 1);
		DrawImageZoom("C012_AfterClass/Pool/" + C012_AfterClass_Pool_BullyPose + ".png", 0, 0, 600, 900, 500, 0, 600, 900);
	}

}

// Chapter 12 After Class - Pool Click
function C012_AfterClass_Pool_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Pool_CurrentStage);

	// The player can click on herself in most stages
	var ClickInv = GetClickedInventory();
	if (ClickInv == "Player") {
		C012_AfterClass_Pool_IntroText = OverridenIntroText;
		C012_AfterClass_Pool_CurrentActor = CurrentActor; 
		InventoryClick(ClickInv, CurrentChapter, CurrentScreen);
	}

}

// Chapter 12 After Class - When the player leaves the Pool
function C012_AfterClass_Pool_Leave() {
	CurrentTime = CurrentTime + 290000;
	C012_AfterClass_Dorm_LeavingGuest();
	SetScene(CurrentChapter, "Dorm");
}

// Chapter 12 After Class - Wait for a while and recalculate who's in the Pool
function C012_AfterClass_Pool_Wait() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Pool_WhoInIsPool();
}

// Chapter 12 After Class - Swim - Adds a counter and can raise sports level after 5 counters
function C012_AfterClass_Pool_Swim() {
	CurrentTime = CurrentTime + 290000;	
	C012_AfterClass_Pool_SwimCount++;
	if ((C012_AfterClass_Pool_SwimCount >= 5) && !GameLogQuery(CurrentChapter, "", "LearnToSwim")) {
		GameLogSpecificAdd(CurrentChapter, "", "LearnToSwim");
		PlayerAddSkill("Sports", 1);
		C012_AfterClass_Pool_HasSports = true;
		OverridenIntroText = GetText("LearnSwim");
	}
}

// Chapter 12 After Class - When the player searches, 2 ropes can be found
function C012_AfterClass_Pool_Search() {
	CurrentTime = CurrentTime + 50000;
	if (!GameLogQuery(CurrentChapter, "Player", "PoolFindRope")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "PoolFindRope");
		OverridenIntroText = GetText("FindRope");
		PlayerAddInventory("Rope", 2);
	}
}

// Chapter 12 After Class - When the player searches the shower, a cloth gag can be found
function C012_AfterClass_Pool_SearchShower() {
	if (!GameLogQuery(CurrentChapter, "Player", "PoolFindClothGag")) {
		GameLogSpecificAdd(CurrentChapter, "Player", "PoolFindClothGag");
		OverridenIntroText = GetText("FindClothGag");
		PlayerAddInventory("ClothGag", 1);
	}	
}

// Chapter 12 After Class - When the player enters the shower, it can trigger the Jennifer event between 19 and 22
function C012_AfterClass_Pool_EnterShower() {
	CurrentTime = CurrentTime + 50000;
	Common_PlayerPose = "";
	if (!GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyMet") && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromPool") && !GameLogQuery(CurrentChapter, "Jennifer", "EnterDormFromRoommates") && (CurrentTime >= 19 * 60 * 60 * 1000) && (CurrentTime < 22 * 60 * 60 * 1000)) {
		GameLogSpecificAdd(CurrentChapter, "Jennifer", "PoolBullyMet")
		OverridenIntroText = GetText("BullyIntro");
		C012_AfterClass_Pool_CurrentStage = 110;
		ActorLoad("Jennifer", "");
		ActorSetCloth("Swimsuit");
		ActorSetPose("ScaredLeft");
		LeaveIcon = "";
	}
}

// Chapter 12 After Class - When the player goes back to the pool
function C012_AfterClass_Pool_EnterPool() {
	CurrentTime = CurrentTime + 50000;
	CurrentActor = "";
	C012_AfterClass_Pool_WhoInIsPool();
}

// Chapter 12 After Class - When the player showers, it adds 5 minutes
function C012_AfterClass_Pool_Shower() {
	CurrentTime = CurrentTime + 290000;
	Common_PlayerPose = "Showering";
}

// Chapter 12 After Class - When the player starts to swim with Jennifer
function C012_AfterClass_Pool_SwimWithJennifer() {
	if (!GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyChat")) {
		GameLogSpecificAdd(CurrentChapter, "Jennifer", "PoolBullyChat");
		if (!GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyVictory") && !GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyDefeat")) C012_AfterClass_Pool_CurrentStage = 200;
		else if (GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyDefeat")) C012_AfterClass_Pool_CurrentStage = 210;
		else if (GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyVictory")) C012_AfterClass_Pool_CurrentStage = 220;
		else C012_AfterClass_Pool_CurrentStage = 230;
	}
	ActorLoad("Jennifer", "Dorm");
	LeaveIcon = "";
}

// Chapter 12 After Class - Unloads Jennifer from the pool scene
function C012_AfterClass_Pool_UnloadJennifer() {
	CurrentActor = "";
}

// Chapter 12 After Class - When Jennifer and the bully face the player
function C012_AfterClass_Pool_FaceFront() {
	ActorSetPose("ScaredFront");
	C012_AfterClass_Pool_BullyPose = "BullyFront";
}

// Chapter 12 After Class - When Jennifer and the bully face each other
function C012_AfterClass_Pool_FaceEachOther() {
	ActorSetPose("ScaredLeft");
	C012_AfterClass_Pool_BullyPose = "BullyRight";
}

// Chapter 12 After Class - When the player starts a fight with the bully
function C012_AfterClass_Pool_Fight() {
	SetScene(CurrentChapter, "PoolBullyFight");
}

// Chapter 12 After Class - The player can get a collar from the bully after defeating her
function C012_AfterClass_Pool_GetCollar() {
	PlayerAddInventory("Collar", 1);
}

// Chapter 12 After Class - When the player and Jennifer swims together
function C012_AfterClass_Pool_SwimTogether() {
	C012_AfterClass_Pool_SwimTimeWithJennifer++;
	CurrentTime = CurrentTime + 290000;
	if (C012_AfterClass_Pool_SwimTimeWithJennifer % 6 == 5) ActorChangeAttitude(1, 0);
}

// Chapter 12 After Class - Tests if Jennifer wants to go back to the player dorm
function C012_AfterClass_Pool_TestGoDorm() {
	if ((ActorGetValue(ActorLove) >= 5) || (ActorGetValue(ActorSubmission) >= 10) || GameLogQuery(CurrentChapter, "Jennifer", "PoolBullyVictory")) {
		OverridenIntroText = GetText("AcceptDorm");
		ActorSetCloth("Clothed");
		C012_AfterClass_Pool_CurrentStage = 240;
	}
}

// Chapter 12 After Class - When the player leaves for the dorm with Jennifer
function C012_AfterClass_Pool_LeaveWithJennifer() {
	GameLogAdd("EnterDormFromPool");
	C012_AfterClass_Pool_JenniferAvail = false;
	OverridenIntroImage = "";
	C012_AfterClass_Pool_CurrentActor = "";
	C012_AfterClass_Pool_Leave();
}
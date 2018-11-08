var C012_AfterClass_Wardrobe_CurrentStage = 0;
var C012_AfterClass_Wardrobe_CostumeHeroine = false;
var C012_AfterClass_Wardrobe_CostumeVillain = false;
var C012_AfterClass_Wardrobe_CostumeDamsel = false;
var C012_AfterClass_Wardrobe_CostumeTennis = false;
var C012_AfterClass_Wardrobe_CostumeJudo = false;
var C012_AfterClass_Wardrobe_CostumeTeacher = false;

// Chapter 12 After Class - Wardrobe Load
function C012_AfterClass_Wardrobe_Load() {
	
	// Loads the scene to search in the wardrobe
	LeaveIcon = "Leave";
	LeaveScreen = "Dorm";
	LoadInteractions();
	
	// Sets which costume are available based on what happened in the day
	C012_AfterClass_Wardrobe_CostumeHeroine = GameLogQuery("C008_DramaClass", "Player", "RoleHeroine");
	C012_AfterClass_Wardrobe_CostumeVillain = GameLogQuery("C008_DramaClass", "Player", "RoleVillain");
	C012_AfterClass_Wardrobe_CostumeDamsel = GameLogQuery("C008_DramaClass", "Player", "RoleDamsel");
	C012_AfterClass_Wardrobe_CostumeTennis = (GameLogQuery("C007_LunchBreak", "Jennifer", "Lunch") || GameLogQuery("C012_AfterClass", "Jennifer", "Running"));
	C012_AfterClass_Wardrobe_CostumeJudo = GameLogQuery("C005_GymClass", "Jennifer", "Judo");
	C012_AfterClass_Wardrobe_CostumeTeacher = GameLogQuery("C011_LiteratureClass", "Player", "ClassLeader");

}

// Chapter 12 After Class - Wardrobe Run
function C012_AfterClass_Wardrobe_Run() {
	BuildInteraction(C012_AfterClass_Wardrobe_CurrentStage);
}

// Chapter 12 After Class - Wardrobe Click
function C012_AfterClass_Wardrobe_Click() {	

	// Regular interactions
	ClickInteraction(C012_AfterClass_Wardrobe_CurrentStage);

}

// Chapter 12 After Class - When the player changes clothes
function C012_AfterClass_Wardrobe_Change(NewCloth) {
	
	// Cannot select the same clothes
	if (NewCloth != Common_PlayerCloth) {

		// Cannot be done if restrained
		if (!Common_PlayerRestrained) {
			
			// Changing might be blocked by the player Mistress, if so we jump to a very angry Owner
			if (GameLogQuery(CurrentChapter, "", "EventBlockChanging") && (C012_AfterClass_Dorm_Guest.indexOf(Common_PlayerOwner) >= 0)) {
				CurrentTime = CurrentTime + 50000;
				if (Common_PlayerOwner == "Sidney") C012_AfterClass_Sidney_CurrentStage = 3800;
				if (Common_PlayerOwner == "Amanda") C012_AfterClass_Amanda_CurrentStage = 3800;
				if (Common_PlayerOwner == "Jennifer") C012_AfterClass_Jennifer_CurrentStage = 3800;
				SetScene(CurrentChapter, Common_PlayerOwner);
				ActorSetPose("Angry");
				LeaveIcon = "";
			} else {
				PlayerClothes(NewCloth);
				SetScene(CurrentChapter, "Dorm");
				CurrentTime = CurrentTime + 50000;
			}
			
		} else OverridenIntroText = GetText("CannotChange");
	
	} else OverridenIntroText = GetText("AlreadyWearingThat");

}
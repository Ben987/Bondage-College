"use strict";
var MovieStudioBackground = "MovieStudio";
var MovieStudioDirector = null;
var MovieStudioCurrentMovie = "";
var MovieStudioCurrentScene = "";
var MovieStudioCurrentRole = "";
var MovieStudioActor1 = null;
var MovieStudioActor2 = null;
var MovieStudioTimer = null;
var MovieStudioMeter = 0;
var MovieStudioDecay = 0;
var MovieStudioActivity = [];
var MovieStudioMoney = 0;
var MovieStudioOriginalClothes = null;

/**
 * The player can play in a movie if she doesn't have any locked restraints
 * @returns {boolean} - TRUE if the player can play in a movie
 */
function MovieStudioCanPlayInMovie() { return !InventoryCharacterHasLockedRestraint(Player) }

/**
 * Returns TRUE if the player can receive the camera as a payment
 * @returns {boolean} - TRUE if the player can get the camera
 */
function MovieStudioCanGetCamera() { return !InventoryAvailable(Player, "Camera1", "ClothAccessory") }

/**
 * When the player fails the movie, we jump back to the director
 * @param {number} Factor - The number to add or substract from the meter
 * @returns {void} - Nothing
 */
function MovieStudioFail() {
	MovieStudioMeter = -100;
	MovieStudioCurrentMovie = "";
	MovieStudioBackground = "MovieStudio";
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null, true);
	MovieStudioDirector.CurrentDialog = DialogFind(MovieStudioDirector, "FailIntro" + Math.floor(Math.random() * 4).toString());
	MovieStudioDirector.Stage = "Fail";
	CharacterSetCurrent(MovieStudioDirector);
}

/**
 * Change the movie quality meter value, the director stops everything if the meter drops to -100
 * @param {number} Factor - The number to add or substract from the meter
 * @returns {void} - Nothing
 */
function MovieStudioChangeMeter(Factor) {
	MovieStudioMeter = MovieStudioMeter + Factor;
	if (MovieStudioMeter > 100) MovieStudioMeter = 100;
	if (MovieStudioMeter <= -100) MovieStudioFail();
}

/**
 * Process the movie meter decay over time, 
 * @returns {void} - Nothing
 */
function MovieStudioProcessDecay() {
	if (MovieStudioDecay < CurrentTime) {
		let Decay = Math.ceil((CurrentTime - MovieStudioDecay) / 3000);
		MovieStudioDecay = CurrentTime + 3000;
		MovieStudioChangeMeter(Decay * -1);
	}
	if (CurrentTime >= MovieStudioTimer) {
		if (MovieStudioMeter < 0) return MovieStudioFail();
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "2", "");
			MovieStudioActor1 = null;
			MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Maid");
			MovieStudioActor1.CurrentDialog = TextGet("InterviewMaidIntro" + (InventoryIsWorn(Player, "X-Cross", "ItemDevices") ? "Cross" : "NoCross") + Math.floor(Math.random() * 2).toString());
			MovieStudioActor1.Stage = "0";
			MovieStudioActor1.Friendship = "0";
			CharacterSetCurrent(MovieStudioActor1);
			return;
		}
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioProgress(MovieStudioCurrentMovie, "3", "");
			MovieStudioActor2 = null;
			MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_Mistress");
			MovieStudioActor2.CurrentDialog = TextGet("InterviewMistressIntro" + Math.floor(Math.random() * 4).toString());
			MovieStudioActor2.Stage = "0";
			MovieStudioActor1.Stage = "300";
			CharacterSetCurrent(MovieStudioActor2);
			return;
		}
		if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3")) {
			MovieStudioMoney = MovieStudioMoney + Math.floor(MovieStudioMeter / 10);
			MovieStudioDirector.Stage = "1030";
			CharacterSetCurrent(MovieStudioDirector);
			MovieStudioDirector.CurrentDialog = TextGet("InterviewDirectorSuccess" + Math.floor(Math.random() * 4).toString());
			MovieStudioCurrentMovie = "";
			MovieStudioCurrentScene = "";
			MovieStudioBackground = "MovieStudio"
			return;
		}
	}
}

/**
 * Loads the Movie Studio introduction room screen and saves the player clothes
 * @returns {void} - Nothing
 */
function MovieStudioLoad() {
	if (MovieStudioOriginalClothes == null) MovieStudioOriginalClothes = Player.Appearance.slice(0);
	if (MovieStudioDirector == null) {		
		MovieStudioDirector = CharacterLoadNPC("NPC_MovieStudio_Director");
		InventoryWear(MovieStudioDirector, "Beret1", "Hat");
		InventoryWear(MovieStudioDirector, "SunGlasses1", "Glasses");
		InventoryWear(MovieStudioDirector, "AdmiralTop", "Cloth");
		InventoryWear(MovieStudioDirector, "AdmiralSkirt", "ClothLower");
		MovieStudioDirector.AllowItem = false;
	}
}

/**
 * Runs and draws the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioRun() {
	
	// If there's no movie going on, the player can chat with the director.
	if (MovieStudioCurrentMovie == "") {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(MovieStudioDirector, 1000, 0, 1);
		if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
		DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
		return;
	}
	
	// In the interview first & second scene, the player can check a drawer and a X Cross
	if ((MovieStudioCurrentMovie == "Interview") && ((MovieStudioCurrentScene == "1") || (MovieStudioCurrentScene == "2"))) {
		DrawCharacter(MovieStudioActor1, 250, 0, 1);
		if (InventoryIsWorn(Player, "X-Cross", "ItemDevices")) {
			DrawCharacter(Player, 1250, 0, 1);
		} else {			
			DrawCharacter(Player, 750, 0, 1);
			DrawCharacter(MovieStudioActor2, 1250, 0, 1);
		}
	}

	// In the interview third scene, all three characters are available
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3")) {
		DrawCharacter(MovieStudioActor1, 250, 0, 1);
		DrawCharacter(Player, 750, 0, 1);
		DrawCharacter(MovieStudioActor2, 1250, 0, 1);
	}
	
	// If there's a movie, we draw the progress meter on the right and the wait button
	if (MovieStudioCurrentMovie != "") {
		MovieStudioProcessDecay();
		DrawRect(1873, 198, 54, 604, "White");
		DrawRect(1875, 200, 50, 300, "Green");
		DrawRect(1875, 500, 50, 300, "Red");
		DrawRect(1875, 499 + MovieStudioMeter * -3, 50, 3, "White");
		DrawButton(1855, 25, 90, 90, "", "White", "Icons/Wait.png", TextGet("Wait"));
		DrawText(TextGet("Scene" + MovieStudioCurrentScene.toString()), 1900, 900, "White", "Black");
		DrawText(TimermsToTime(MovieStudioTimer - CurrentTime), 1900, 960, "White", "Black");
	}

}

/**
 * Handles clicks in the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioClick() {
	if ((MovieStudioCurrentMovie == "") && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((MovieStudioCurrentMovie == "") && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MovieStudioDirector);
	if ((MovieStudioCurrentMovie == "") && MouseIn(1885, 25, 90, 90) && Player.CanWalk()) { MovieStudioOriginalClothes = null; CommonSetScreen("Room", "MainHall"); }
	if ((MovieStudioCurrentMovie == "") && MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1") && MouseIn(250, 0, 500, 1000) && !InventoryIsWorn(Player, "X-Cross", "ItemDevices")) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "1") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "2") && InventoryIsWorn(Player, "DusterGag", "ItemMouth") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3") && MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor1);
	if ((MovieStudioCurrentMovie == "Interview") && (MovieStudioCurrentScene == "3") && MouseIn(1250, 0, 500, 1000)) CharacterSetCurrent(MovieStudioActor2);
	if ((MovieStudioCurrentMovie != "") && MouseIn(1855, 25, 90, 90)) { MovieStudioChangeMeter(-20); MovieStudioTimer = MovieStudioTimer - 60000; }
}

/**
 * When the player needs to dress back in her original clothes after the play
 * @returns {void} - Nothing
 */
function MovieStudioPlayerDressBack() {
	Player.Appearance = MovieStudioOriginalClothes.slice(0);
	CharacterRelease(Player);
}

/**
 * When the player needs to change clothes for a role in the movie
 * @param {string} Cloth - The clothes to wear
 * @returns {void} - Nothing
 */
function MovieStudioChange(Cloth) {
	if (Cloth == "Journalist") {
		CharacterNaked(Player);
		InventoryWear(Player, "Camera1", "ClothAccessory", "Default");
		InventoryWear(Player, "TeacherOutfit1", "Cloth", "Default");
		InventoryWear(Player, "Glasses1", "Glasses", "#333333");
		InventoryWear(Player, "Socks5", "Socks", "#444458");
		InventoryWear(Player, "Shoes2", "Shoes", "#111111");
		InventoryRemove(Player, "ItemHead");
		InventoryRemove(Player, "ItemArms");
		InventoryRemove(Player, "ItemHands");
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemBoots");
	}
}

/**
 * When the movie scene progresses, we assign the new values
 * @param {string} Movie - The movie type
 * @param {string} Scene - The scene in the movie
 * @param {string} Role - Optional - The role the player is taking
 * @returns {void} - Nothing
 */
function MovieStudioProgress(Movie, Scene, Role) {
	if (Role == "Journalist") MovieStudioMoney = 15;
	MovieStudioTimer = CurrentTime + 600000;
	MovieStudioMeter = 0;
	MovieStudioDecay = CurrentTime + 5000;
	MovieStudioActivity = [];
	MovieStudioCurrentMovie = Movie;
	MovieStudioCurrentScene = Scene;
	if (Role != "") MovieStudioCurrentRole = Role;
	if ((Movie == "Interview") && (Scene == "1")) {
		MovieStudioBackground = CommonRandomItemFromList("", ["BDSMRoomRed", "BDSMRoomBlue", "BDSMRoomPurple"]);
		MovieStudioActor1 = CharacterLoadNPC("NPC_MovieStudio_Interview_Drawer");
		MovieStudioActor1.FixedImage = "Screens/Room/MovieStudio/Drawer.png";
		MovieStudioActor1.Stage = "0";
		MovieStudioActor1.AllowItem = false;
		MovieStudioActor2 = CharacterLoadNPC("NPC_MovieStudio_Interview_XCross");
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
		MovieStudioActor2.Stage = "0";
		MovieStudioActor2.AllowItem = false;
	}
	if (CurrentCharacter != null) DialogLeave();
}

/**
 * When an activity is done
 * @param {string} Activity - The activity name
 * @returns {void} - Nothing
 */
function MovieStudioDoActivity(Activity) {

	// Each activity takes 30 seconds, we check the number of times it was done and if it was done on the last time
	MovieStudioTimer = MovieStudioTimer - 30000;
	let Count = 0;
	let LastCount = false;
	for (let A = 0; A < MovieStudioActivity.length; A++) {
		if (MovieStudioActivity[A] == Activity) Count++;
		LastCount = (MovieStudioActivity[A] == Activity);
	}

	// It raises the meter the first time and second time as long as it's not a direct repeat.  Over 3 times it decreases the meter.
	if (Count == 0) MovieStudioChangeMeter(20);
	if ((Count == 1) && !LastCount) MovieStudioChangeMeter(10);
	if (Count <= 1) CharacterSetFacialExpression(Player, "Blush", "Low", 5);
	if (Count >= 3) MovieStudioChangeMeter(-10);
	if (Count >= 4) CurrentCharacter.CurrentDialog = TextGet("OtherActivity" + Math.floor(Math.random() * 4).toString());
	MovieStudioActivity.push(Activity);

	// Some activities will dress/restrain the player or another actor
	if (Activity == "DressCatsuit") { CharacterNaked(Player); InventoryWear(Player, "Catsuit", "Suit", "#202020"); InventoryWear(Player, "Catsuit", "SuitLower", "#202020"); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "DressLingerie") { CharacterNaked(Player); InventoryWear(Player, "CorsetBikini1", "Bra", "#202020"); InventoryWear(Player, "Stockings1", "Socks"); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "DressNaked") { CharacterNaked(Player); InventoryWear(Player, "Glasses1", "Glasses", "#333333"); }
	if (Activity == "InterviewWearCorset") InventoryWear(Player, "LatexCorset1", "Bra");
	if (Activity == "InterviewWearBoots") InventoryWear(Player, "BalletHeels", "ItemBoots");
	if (Activity == "InterviewWearCuffs") { InventoryWear(Player, "LeatherCuffs", "ItemArms"); InventoryWear(Player, "LeatherLegCuffs", "ItemLegs"); InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet"); }
	if (Activity == "InterviewWearCollar") InventoryWear(Player, "BordelleCollar", "ItemNeck");
	if (Activity == "InterviewCrossRestrain") { InventoryWear(Player, "X-Cross", "ItemDevices"); MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/Empty.png"; }
	if (Activity == "InterviewRestrainMaid") { 
		InventoryWear(Player, "LeatherCuffs", "ItemArms"); 
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "DusterGag", "ItemMouth");
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		var Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(Player);
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
		MovieStudioActor2.Stage = "20";
	}
	if (Activity == "InterviewDustOutfit") { InventoryWear(MovieStudioActor1, "MaidOutfit2", "Cloth"); InventoryRemove(MovieStudioActor1, "Bra"); }
	if (Activity == "InterviewMaidStrip") { CharacterNaked(MovieStudioActor1); InventoryWear(MovieStudioActor1, "MaidHairband1", "Hat"); }
	if (Activity == "InterviewRestrainForOral") { 
		InventoryWear(Player, "LeatherCuffs", "ItemArms"); 
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		var Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterSetActivePose(Player, "Kneel", true);
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/XCross.png";
	}
	if (Activity == "InterviewMaidCuffPlayer") {
		InventoryWear(Player, "LeatherCuffs", "ItemArms"); 
		InventoryWear(Player, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(Player, "LeatherAnkleCuffs", "ItemFeet");
		InventoryRemove(Player, "ItemDevices");
		var Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(Player);
	}
	if (Activity == "InterviewMaidTighten") {
		var Cuffs = InventoryGet(Player, "ItemArms");
		Cuffs.Property.Type = "Elbow";
		Cuffs.Property.SetPose = ["BackElbowTouch"];
		CharacterRefresh(Player);
	}
	if ((Activity == "InterviewMaidOral1") || (Activity == "InterviewMaidOral2") || (Activity == "InterviewMaidOral3") || (Activity == "InterviewMaidOral4") || (Activity == "InterviewMaidOral5")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 10);
	}
	if (Activity == "InterviewMaidKneel") {
		CharacterSetActivePose(MovieStudioActor1, "Kneel", true);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}
	if (Activity == "InterviewMaidDusterGag") InventoryWear(MovieStudioActor1, "DusterGag", "ItemMouth");
	if (Activity == "InterviewMaidCuffs") {
		InventoryWear(MovieStudioActor1, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor1, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(MovieStudioActor1, "LeatherAnkleCuffs", "ItemFeet");
		var Cuffs = InventoryGet(MovieStudioActor1, "ItemArms");
		Cuffs.Property = {};
		Cuffs.Property.Type = "Wrist";
		Cuffs.Property.SetPose = ["BackBoxTie"];
		Cuffs.Property.Effect = ["Block", "Prone", "Lock"];
		CharacterRefresh(MovieStudioActor1);
	}
	if (Activity == "InterviewMaidBreast") { InventoryWear(MovieStudioActor1, "MaidOutfit2", "Cloth"); InventoryRemove(MovieStudioActor1, "Bra"); }
	if (Activity == "InterviewMaidCross") {
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Low", 10);
		InventoryRemove(MovieStudioActor1, "ItemArms");
		InventoryWear(MovieStudioActor1, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor1, "X-Cross", "ItemDevices");
		MovieStudioActor2.FixedImage = "Screens/Room/MovieStudio/Empty.png";
	}
	if (Activity == "InterviewMistressUngagPlayer") InventoryRemove(Player, "ItemMouth");
	if (Activity == "InterviewMistressReleasePlayer") { CharacterRelease(Player); CharacterSetActivePose(Player, null, true); }
	if (Activity == "InterviewMistressChangePlayerBack") MovieStudioChange("Journalist");
	if (Activity == "InterviewMistressTakePicture") {
		InventoryWear(Player, "Camera1", "ClothAccessory", "Default");
		CharacterRelease(MovieStudioActor1);
		CharacterFullRandomRestrain(MovieStudioActor1, "ALL");
		MovieStudioActor1.Stage = "310";
	}
	if (Activity == "InterviewMistressPrepareDungeon") MovieStudioActor1.Stage = "320";
	if (Activity == "InterviewMaidRestainedNew") { CharacterRelease(MovieStudioActor1); CharacterFullRandomRestrain(MovieStudioActor1, "ALL"); }
	if (Activity == "InterviewMistressFinalRestrainPlayer") { CharacterRelease(Player); CharacterFullRandomRestrain(Player, "ALL"); MovieStudioActor1.Stage = "330"; }
	if (Activity == "InterviewMistressFinalPlayerNew") { CharacterRelease(Player); CharacterFullRandomRestrain(Player, "ALL"); }
	if (Activity == "InterviewMistressStripBoth") {
		CharacterSetActivePose(Player, null, true);
		CharacterRelease(Player);
		CharacterNaked(Player);
		InventoryRemove(Player, "ItemBoots");
		CharacterSetActivePose(MovieStudioActor1, null, true);
		CharacterRelease(MovieStudioActor1);
		CharacterNaked(MovieStudioActor1);
		InventoryWear(MovieStudioActor1, "MaidHairband1", "Hat");
		MovieStudioActor1.Stage = "400";
	}
	if (Activity == "InterviewMaidRestainedHug") {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Horny", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Horny", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Horny", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Horny", 5);
	}
	if (Activity == "InterviewMaidRestainedSpank") {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 10);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 10);
	}
	if (Activity == "InterviewMistressSpankPlayer") { CharacterSetFacialExpression(Player, "Eyes", "Closed", 5); CharacterSetFacialExpression(Player, "Eyes2", "Closed", 5); }
	if (Activity == "InterviewMistressMasturbatePlayer") {
		CharacterSetFacialExpression(Player, "Blush", "High", 10);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 10);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 10);
	}
	if (Activity == "InterviewMistressPunishPlayer") {
		let PunishmentList = Player.IsVulvaChaste() ? ["ClubSlave", "Bondage"] : ["ClubSlave", "Bondage", "Chastity"];
		let Punishment = CommonRandomItemFromList("", PunishmentList);
		Punishment = "ClubSlave"; // TO REMOVE
		MovieStudioActor2.Stage = "Punishment" + Punishment;
		MovieStudioActor2.CurrentDialog = DialogFind(MovieStudioActor2, "PunishmentIntro" + Punishment);
	}
	if (Activity == "InterviewMistressGagBoth") { InventoryWearRandom(Player, "ItemMouth"); InventoryWearRandom(MovieStudioActor1, "ItemMouth"); MovieStudioActor1.Stage = "410"; }
	if (Activity == "InterviewMistressGetCamera") InventoryWear(MovieStudioActor2, "Camera1", "ClothAccessory", "Default");
	if (Activity == "InterviewMistressHood") { InventoryWear(Player, "LeatherHood", "ItemHood"); InventoryWear(Player, "Camera1", "ClothAccessory", "Default"); }
	if (Activity == "InterviewMistressOnCross") {
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes", "Angry", 60);
		CharacterSetFacialExpression(MovieStudioActor2, "Eyes2", "Angry", 60);
		InventoryWear(MovieStudioActor2, "LeatherCuffs", "ItemArms");
		InventoryWear(MovieStudioActor2, "LeatherLegCuffs", "ItemLegs");
		InventoryWear(MovieStudioActor2, "LeatherAnkleCuffs", "ItemFeet");
		InventoryWear(MovieStudioActor2, "X-Cross", "ItemDevices");
		MovieStudioActor2.Stage = "500";
		DialogLeave();
	}
	if (Activity == "InterviewMaidNoWeapon") { InventoryRemove(Player, "ItemHands"); InventoryRemove(MovieStudioActor1, "ItemHands"); DialogLeave(); }
	if (Activity == "InterviewMaidGetCrop") {
		InventoryWear(Player, "SpankingToys", "ItemHands");
		InventoryGet(Player, "ItemHands").Property = { Type: "Crop" };
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "SpankingToys", "ItemHands");
		InventoryGet(MovieStudioActor1, "ItemHands").Property = { Type: "Crop" };
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if (Activity == "InterviewMaidGetWhip") {
		InventoryWear(Player, "SpankingToys", "ItemHands");
		InventoryGet(Player, "ItemHands").Property = { Type: "Whip" };
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "SpankingToys", "ItemHands");
		InventoryGet(MovieStudioActor1, "ItemHands").Property = { Type: "Whip" };
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if (Activity == "InterviewMaidGetProd") {
		InventoryWear(Player, "SpankingToys", "ItemHands");
		InventoryGet(Player, "ItemHands").Property = { Type: "CattleProd" };
		CharacterRefresh(Player);
		InventoryWear(MovieStudioActor1, "SpankingToys", "ItemHands");
		InventoryGet(MovieStudioActor1, "ItemHands").Property = { Type: "CattleProd" };
		CharacterRefresh(MovieStudioActor1);
		DialogLeave();
	}
	if ((Activity == "InterviewMaidTurnTablesKiss") || (Activity == "InterviewMistressMasturbate") || (Activity == "InterviewMistressMakeOut") || (Activity == "InterviewMistressTease")) {
		CharacterSetFacialExpression(Player, "Blush", "Medium", 5);
		CharacterSetFacialExpression(Player, "Eyes", "Lewd", 5);
		CharacterSetFacialExpression(Player, "Eyes2", "Lewd", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Lewd", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Lewd", 5);
	}
	if (Activity == "InterviewMistressGag") InventoryWearRandom(MovieStudioActor2, "ItemMouth");
	if (Activity == "InterviewMistressUngag") InventoryRemove(MovieStudioActor2, "ItemMouth");
	if ((Activity == "InterviewMistressSpank") || (Activity == "InterviewMistressCrop") || (Activity == "InterviewMistressWhip") || (Activity == "InterviewMistressProd")) {
		CharacterSetFacialExpression(MovieStudioActor1, "Blush", "Medium", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes", "Closed", 5);
		CharacterSetFacialExpression(MovieStudioActor1, "Eyes2", "Closed", 5);
	}

	// Check for decay
	MovieStudioProcessDecay();

}

/**
 * Changes a parameter for an actor
 * @param {string} Param - The parameter to change
 * @returns {void} - Nothing
 */
function MovieStudioChangeParameter(Name, Param, Value) {
	let Actor = null;
	if (Name == "Actor1") Actor = MovieStudioActor1;
	if (Actor == null) return;
	if (Param == "Friendship") Actor.Friendship = Value;
}

/**
 * Tests if an activity can be done
 * @param {string} Activity - The activity to test
 * @returns {boolean} - Returns TRUE if the activity can be done
 */
function MovieStudioCanDoActivity(Activity) {
	if (Activity == "InterviewTakePicture") return InventoryIsWorn(Player, "Camera1", "ClothAccessory");
	if (Activity == "InterviewOpenFirstDrawer") return (InventoryGet(Player, "Cloth") != null);
	if (Activity == "InterviewOpenSecondDrawer") return (InventoryGet(Player, "Cloth") == null);
	if (Activity == "InterviewWearCorset") return !InventoryIsWorn(Player, "LatexCorset1", "Bra");
	if (Activity == "InterviewWearBoots") return !InventoryIsWorn(Player, "BalletHeels", "ItemBoots");
	if (Activity == "InterviewWearCuffs") return (InventoryGet(Player, "ItemArms") == null);
	if (Activity == "InterviewWearCollar") return (InventoryGet(Player, "ItemNeck") == null);
	if (Activity == "InterviewCrossRestrain") return InventoryIsWorn(Player, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidCuffPlayer") return !InventoryIsWorn(Player, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidDusterGag") return !InventoryIsWorn(MovieStudioActor1, "DusterGag", "ItemMouth");
	if (Activity == "InterviewMaidCuffs") return !InventoryIsWorn(MovieStudioActor1, "LeatherCuffs", "ItemArms");
	if (Activity == "InterviewMaidBreast") return InventoryIsWorn(MovieStudioActor1, "MaidOutfit1", "Cloth");
	if (Activity == "InterviewMaidFriendship0") return (MovieStudioActor1.Friendship == "0");
	if (Activity == "InterviewMaidFriendship1") return (MovieStudioActor1.Friendship == "1");
	if (Activity == "InterviewMaidFriendship2") return (MovieStudioActor1.Friendship == "2");
	if (Activity == "InterviewMaidFriendshipRestrained3") return ((MovieStudioActor1.Friendship == "3") && Player.IsRestrained());
	if (Activity == "InterviewMaidFriendshipUnrestrained3") return ((MovieStudioActor1.Friendship == "3") && !Player.IsRestrained());
	if (Activity == "InterviewMaidFriendship4") return (MovieStudioActor1.Friendship == "4");
	if (Activity == "InterviewMaidNoWeapon") return (InventoryGet(Player, "ItemHands") != null);
	if (Activity == "InterviewMaidGetCrop") return ((InventoryGet(Player, "ItemHands") == null) || (InventoryGet(Player, "ItemHands").Property.Type != "Crop"));
	if (Activity == "InterviewMaidGetWhip") return ((InventoryGet(Player, "ItemHands") == null) || (InventoryGet(Player, "ItemHands").Property.Type != "Whip"));
	if (Activity == "InterviewMaidGetProd") return ((InventoryGet(Player, "ItemHands") == null) || (InventoryGet(Player, "ItemHands").Property.Type != "CattleProd"));
	if (Activity == "InterviewMistressGag") return (InventoryGet(MovieStudioActor2, "ItemMouth") == null);
	if (Activity == "InterviewMistressCrop") return ((InventoryGet(Player, "ItemHands") != null) && (InventoryGet(Player, "ItemHands").Property.Type == "Crop"));
	if (Activity == "InterviewMistressWhip") return ((InventoryGet(Player, "ItemHands") != null) && (InventoryGet(Player, "ItemHands").Property.Type == "Whip"));
	if (Activity == "InterviewMistressProd") return ((InventoryGet(Player, "ItemHands") != null) && (InventoryGet(Player, "ItemHands").Property.Type == "CattleProd"));
}

/**
 * Adds the camera to the player inventory
 * @returns {void} - Nothing
 */
function MovieStudioGetCamera() {
	InventoryAdd(Player, "Camera1", "ClothAccessory");
	InventoryWear(Player, "Camera1", "ClothAccessory", "Default");
}

/**
 * Adds the movie salary to the player
 * @returns {void} - Nothing
 */
function MovieStudioGetMoney() {
	CharacterChangeMoney(Player, MovieStudioMoney);
	MovieStudioDirector.CurrentDialog = DialogFind(MovieStudioDirector, "MovieSalary").replace("SALARYAMOUNT", (MovieStudioMoney).toString());
}
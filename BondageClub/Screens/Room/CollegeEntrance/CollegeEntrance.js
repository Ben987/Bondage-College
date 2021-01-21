"use strict";
var CollegeEntranceBackground = "CollegeEntrance";
var CollegeEntranceStudent = null;

/**
 * Checks if the player can go to the tennis court
 * @returns {boolean} - Returns true if the player can go to the tennis court
 */
function CollegeEntranceCanGoTennis() { return (Player.CanWalk() && Player.CanTalk() && !Player.IsRestrained() && CollegeEntranceIsWearingTennisClothes()) }
/**
 * Checks if the player can go inside the college
 * @returns {boolean} - Returns true if the player can go inside the college
 */
function CollegeEntranceCanGoInside() { return (Player.CanWalk() && Player.CanTalk() && !Player.IsRestrained() && CollegeEntranceIsWearingCollegeClothes()) }
/**
 * Checks if the player can go to the detention room
 * @returns {boolean} - Returns true if the player can go to the detention room
 */
function CollegeEntranceCanGoDetention() { return (Player.CanWalk() && Player.CanTalk() && !Player.IsRestrained() && CollegeEntranceIsWearingCollegeClothes()) }
/**
 * Checks if the player can go to the teacher room
 * @returns {boolean} - Returns true if the player can go to the teacher room
 */
function CollegeEntranceCanGoTeacher() { return (Player.CanWalk() && Player.CanTalk() && !Player.IsRestrained() && CollegeEntranceIsWearingCollegeClothes() && LogQuery("TeacherKey", "College")) }

/**
 * Loads the college entrance room and its student NPC
 * @returns {void} - Nothing
 */
function CollegeEntranceLoad() {
	if (CollegeEntranceStudent == null) {
		CollegeEntranceStudent = CharacterLoadNPC("NPC_CollegeEntrance_Student");
		CollegeEntranceWearStudentClothes(CollegeEntranceStudent);
		CollegeEntranceStudent.AllowItem = false;
	}
}

/**
 * Runs and draws the college entrance room with the player and the student
 * @returns {void} - Nothing
 */
function CollegeEntranceRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CollegeEntranceStudent, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 131, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	DrawButton(1885, 237, 90, 90, "", Player.CanChange() ? "White" : "Pink", "Icons/Dress.png", TextGet("Dress"));
	DrawButton(1885, 343, 90, 90, "", CollegeEntranceCanGoTennis() ? "White" : "Pink", "Icons/Tennis.png", TextGet("Tennis"));
	DrawButton(1885, 449, 90, 90, "", CollegeEntranceCanGoInside() ? "White" : "Pink", "Icons/Coffee.png", TextGet("Cafeteria"));
	DrawButton(1885, 555, 90, 90, "", CollegeEntranceCanGoInside() ? "White" : "Pink", "Icons/Theater.png", TextGet("Theater"));
	DrawButton(1885, 661, 90, 90, "", CollegeEntranceCanGoInside() ? "White" : "Pink", "Icons/Chess.png", TextGet("Chess"));
	DrawButton(1885, 767, 90, 90, "", CollegeEntranceCanGoDetention() ? "White" : "Pink", "Icons/Cage.png", TextGet("Detention"));
	DrawButton(1885, 873, 90, 90, "", CollegeEntranceCanGoTeacher() ? "White" : "Pink", "Icons/Couch.png", TextGet("Teacher"));
}

/**
 * Handles clicks in the college entrance room
 * @returns {void} - Nothing
 */
function CollegeEntranceClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(CollegeEntranceStudent);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 131, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 237, 90, 90) && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(1885, 343, 90, 90) && CollegeEntranceCanGoTennis()) CommonSetScreen("Room", "CollegeTennis");
	if (MouseIn(1885, 449, 90, 90) && CollegeEntranceCanGoInside()) CommonSetScreen("Room", "CollegeCafeteria");
	if (MouseIn(1885, 555, 90, 90) && CollegeEntranceCanGoInside()) CommonSetScreen("Room", "CollegeTheater");
	if (MouseIn(1885, 661, 90, 90) && CollegeEntranceCanGoInside()) CommonSetScreen("Room", "CollegeChess");	
	if (MouseIn(1885, 767, 90, 90) && CollegeEntranceCanGoDetention()) CommonSetScreen("Room", "CollegeDetention");
	if (MouseIn(1885, 873, 90, 90) && CollegeEntranceCanGoTeacher()) CommonSetScreen("Room", "CollegeTeacher");
}

/**
 * Changes a given character into college student clothes
 * @param {Character} C - Character to dress as a college student
 * @returns {void} - Nothing
 */
function CollegeEntranceWearStudentClothes(C) {
	if ((typeof C === "string") && (C == "Player")) C = Player;
	InventoryWear(C, "CollegeOutfit1", "Cloth", "Default");
	InventoryWear(C, "Socks4", "Socks", "#AAAAAA");
	InventoryRemove(C, "ClothLower");
	InventoryRemove(C, "Wings");
	InventoryRemove(C, "TailStraps");
	InventoryRemove(C, "Gloves");
	InventoryRemove(C, "HairAccessory1");
	InventoryRemove(C, "HairAccessory2");
	InventoryRemove(C, "HairAccessory3");
	InventoryRemove(C, "ClothAccessory");
}

/**
 * Checks if the player is wearing tennis clothes
 * @returns {boolean} - Returns TRUE if the player is wearing tennis clothes
 */
function CollegeEntranceIsWearingTennisClothes() {
	if ((InventoryGet(Player, "Cloth") == null) || (InventoryGet(Player, "Cloth").Asset.Name != "TennisShirt1")) return false;
	if ((InventoryGet(Player, "ClothLower") == null) || (InventoryGet(Player, "ClothLower").Asset.Name != "TennisSkirt1")) return false;
	if ((InventoryGet(Player, "Shoes") == null) || ((InventoryGet(Player, "Shoes").Asset.Name != "Sneakers1") && (InventoryGet(Player, "Shoes").Asset.Name != "Sneakers2"))) return false;
	if (InventoryGet(Player, "Wings") != null) return false;
	if (InventoryGet(Player, "TailStraps") != null) return false;
	return true;
}

/**
 * Checks if the player is wearing college clothes
 * @returns {boolean} - Returns TRUE if the player is wearing college clothes
 */
function CollegeEntranceIsWearingCollegeClothes() {
	let CurrentClothes = InventoryGet(Player, "Cloth");
	if (CurrentClothes == null) return false;
	else {
		if (CurrentClothes.Asset.Name != "CollegeOutfit1") return false;
		let CurrColor = CurrentClothes.Color;
		if (typeof CurrColor == "string" && CurrColor != "Default") return false;
		else if (Array.isArray(CurrColor)) {
			if (CurrColor[0] != "Default"
				|| !(CurrColor[1] == "#202020" || CurrColor[1] == "Default")
				|| CurrColor[2] != "Default")
				return false;
		}
	}
	if (InventoryGet(Player, "Socks") == null) return false;
	if (InventoryGet(Player, "Shoes") == null) return false;
	if (InventoryGet(Player, "Wings") != null) return false;
	if (InventoryGet(Player, "TailStraps") != null) return false;
	return true;
}

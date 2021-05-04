"use strict";
var PandoraBackground = "Pandora/Ground/Entrance";
var PandoraCurrentRoom = null;
var PandoraPreviousRoom = null;
var PandoraRoom = [];
var PandoraDirectionList = ["South", "North", "East", "West"];
var PandoraDirectionListFrom = ["North", "South", "West", "East"];
var PandoraSeachMode = false;
var PandoraSeachSquare = null;
var PandoraMessage = null;
var PandoraParty = [];
var PandoraFightCharacter = null;
var PandoraRandomNPCList = ["Member", "Mistress", "Slave", "Maid", "Guard"];
var PandoraMoveDirectionTimer = { Direction: "", Timer: 0 };
var PandoraTargetRoom = null;
var PandoraClothes = "Random";
var PandoraWillpower = 20;
var PandoraMaxWillpower = 20;

/**
 * NPC Dialog functions
 * @returns {boolean} - TRUE if the dialog option will be available to the player
 */
function PandoraCanStartRecruit() { return ((CurrentCharacter.Recruit == null) || (CurrentCharacter.Recruit == 0)); }
function PandoraCanRecruit() { return (CurrentCharacter.Recruit + (InfiltrationPerksActive("Recruiter") ? 0.25 : 0) >= CurrentCharacter.RecruitOdds); }
function PandoraCharacterCanJoin() { return ((PandoraParty.length == 0) || (PandoraParty[0].Name != CurrentCharacter.Name)); }
function PandoraCharacterCanLeave() { return ((PandoraParty.length == 1) && (PandoraParty[0].Name == CurrentCharacter.Name) && ((PandoraCurrentRoom.Character == null) || (PandoraCurrentRoom.Character.length <= 1))); }
function PandoraOdds75() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.25)); }
function PandoraOdds50() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.50)); }
function PandoraOdds25() { return ((CurrentCharacter.RandomOdds == null) || (CurrentCharacter.RandomOdds > 0.75)); }
function PandoraCostumeIs(Costume) { return (PandoraClothes == Costume); }
function PandoraQuizIs(Number) { return ((CurrentCharacter.QuizLog != null) && (CurrentCharacter.QuizLog[CurrentCharacter.QuizLog.length - 1].toString() == Number.toString())) }

/**
 * Loads the Pandora's Box screen
 * @returns {void} - Nothing
 */
function PandoraLoad() {
}

/**
 * Returns the color of the direction buttons, it can change if the direction was recently navigated to
 * @returns {void} - Nothing
 */
function PandoraDirectionButtonColor(Direction) {
	if ((PandoraMoveDirectionTimer.Timer >= CommonTime()) && (PandoraMoveDirectionTimer.Direction === Direction))
		return (PandoraCurrentRoom.DirectionMap.indexOf(Direction) >= 0) ? "#80FF80" : "#408040";
	else
		return (PandoraCurrentRoom.DirectionMap.indexOf(Direction) >= 0) ? "White" : "#BF8080";
}

/**
 * Runs and draws all Pandora's Box screens
 * @returns {void} - Nothing
 */
function PandoraRun() {

	// Gets the current room & background
	if ((PandoraRoom.length == 0) || (PandoraCurrentRoom == null)) return;
	PandoraBackground = "Pandora/" + PandoraCurrentRoom.Floor + "/" + PandoraCurrentRoom.Background;

	// In search mode
	if (PandoraSeachMode) {
		DrawButton(1885, 885, 90, 90, "", "White", "Icons/Search.png", TextGet("SearchStop"));
		let Radius = InfiltrationPerksActive("Investigation") ? 150 : 100;
		if (PandoraSeachSquare != null) DrawEmptyRect(PandoraSeachSquare.X - Radius, PandoraSeachSquare.Y - Radius, Radius * 2, Radius * 2, "Cyan", 3);
		return;
	}

	// Draws up to 4 characters in the room, including the player
	let Pos = 690 - (PandoraCurrentRoom.Character.length + PandoraParty.length) * 230;
	DrawCharacter(Player, Pos, 0, 1);
	let AllowMove = true;
	for (let C = 0; C < PandoraParty.length; C++)
		DrawCharacter(PandoraParty[C], Pos + ((C + 1) * 460), 0, 1);
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++) {
		DrawCharacter(PandoraCurrentRoom.Character[C], Pos + ((C + 1 + PandoraParty.length) * 460), 0, 1);
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false)) AllowMove = false;
	}

	// If we allow moving, we draw the paths
	if (AllowMove) {
		for (let P = 0; P < PandoraCurrentRoom.Path.length; P++)
			DrawButton(1885, 25 + P * 115, 90, 90, "", "White", "Icons/" + PandoraCurrentRoom.Direction[P] + ".png", TextGet("Path" + PandoraCurrentRoom.Direction[P]));
		DrawButton(1842, 620, 90, 90, "", PandoraDirectionButtonColor("North"), "Icons/North.png", TextGet("DirectionNorth"));
		DrawButton(1785, 735, 90, 90, "", PandoraDirectionButtonColor("West"), "Icons/West.png", TextGet("DirectionWest"));
		DrawButton(1842, 850, 90, 90, "", PandoraDirectionButtonColor("South"), "Icons/South.png", TextGet("DirectionSouth"));
		DrawButton(1900, 735, 90, 90, "", PandoraDirectionButtonColor("East"), "Icons/East.png", TextGet("DirectionEast"));
	}

	// If we must draw a message in the middle of the screen
	if ((PandoraMessage != null) && (PandoraMessage.Timer != null) && (PandoraMessage.Text != null) && (PandoraMessage.Timer >= CommonTime())) {
		DrawRect(500, 465, 1000, 70, "black");
		DrawRect(502, 467, 996, 66, "white");
		DrawTextWrap(PandoraMessage.Text, 500, 465, 1000, 70, "black");
	}

	// Draw the willpower / max
	DrawProgressBar(1785, 954, 205, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
	DrawText(PandoraWillpower.toString(), 1888, 973, "black", "white");

}

/**
 * Handles clicks in all Pandora's screen
 * @returns {void} - Nothing
 */
function PandoraClick() {

	// Checks if we clicked on the player
	if (PandoraRoom.length == 0) return;

	// If there's a message running, we do not allow any clicks
	if ((PandoraMessage != null) && (PandoraMessage.Timer != null) && (PandoraMessage.Text != null) && (PandoraMessage.Timer >= CommonTime()))
		return;

	// In search mode, we can click anywhere on the screen
	if (PandoraSeachMode) {
		if (MouseIn(0, 0, 1850, 1000)) {
			PandoraSeachSquare = { X: MouseX, Y: MouseY };
			let Radius = InfiltrationPerksActive("Investigation") ? 150 : 100;
			if ((PandoraCurrentRoom.ItemX != null) && (PandoraCurrentRoom.ItemY != null) && MouseIn(PandoraCurrentRoom.ItemX - Radius, PandoraCurrentRoom.ItemY - Radius, Radius * 2, Radius * 2)) {
				InfiltrationTarget.Found = true;
				PandoraSeachMode = false;
				PandoraMsgBox(TextGet("FoundItem").replace("TargetName", InfiltrationTarget.Name));
			}
		}
		if (MouseIn(1885, 885, 90, 90)) PandoraSeachMode = false;
		return;
	}

	// Checks if we clicked on a character
	let Pos = 690 - (PandoraCurrentRoom.Character.length + PandoraParty.length) * 230;
	if (MouseIn(Pos, 0, 500, 1000)) return CharacterSetCurrent(Player);
	let AllowMove = true;
	for (let C = 0; C < PandoraParty.length; C++)
		if (MouseIn(Pos + ((C + 1) * 460), 0, 500, 1000))
			return CharacterSetCurrent(PandoraParty[C]);
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++) {
		if (MouseIn(Pos + ((C + 1 + PandoraParty.length) * 460), 0, 500, 1000)) return CharacterSetCurrent(PandoraCurrentRoom.Character[C]);
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false)) AllowMove = false;
	}

	// If we allow moving, we can switch room
	if (AllowMove) {
		for (let P = 0; P < PandoraCurrentRoom.Path.length; P++)
			if (MouseIn(1900, 25 + P * 115, 90, 90)) {
				if (PandoraCurrentRoom.Path[P].Floor == "Exit") return CommonSetScreen("Room", "Infiltration");
				if (PandoraCurrentRoom.Path[P].Floor == "Search") {
					if ((InfiltrationTarget.Found == null) || (InfiltrationTarget.Found == false)) {
						PandoraSeachSquare = null;
						PandoraSeachMode = true;
					} else PandoraMsgBox(TextGet("AlreadyFound").replace("TargetName", InfiltrationTarget.Name));
					return;
				}
				return PandoraEnterRoom(PandoraCurrentRoom.Path[P]);
			}
		if (MouseIn(1842, 620, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("North") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("North")], "North");
		if (MouseIn(1785, 735, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("West") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("West")], "West");
		if (MouseIn(1842, 850, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("South") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("South")], "South");
		if (MouseIn(1900, 735, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("East") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("East")], "East");
	}

}

/**
 * Handles the key pressed in Pandora's Box, allow WASD to move around
 * @returns {void} - Nothing
 */
function PandoraKeyDown() {
	let AllowMove = true;
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if ((PandoraCurrentRoom.Character[C].AllowMove != null) && (PandoraCurrentRoom.Character[C].AllowMove == false))
			AllowMove = false;
	if (AllowMove) {
		if (((KeyPress == 87) || (KeyPress == 119)) && (PandoraCurrentRoom.DirectionMap.indexOf("North") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("North")], "North");
		if (((KeyPress == 65) || (KeyPress == 97)) && (PandoraCurrentRoom.DirectionMap.indexOf("West") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("West")], "West");
		if (((KeyPress == 83) || (KeyPress == 115)) && (PandoraCurrentRoom.DirectionMap.indexOf("South") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("South")], "South");
		if (((KeyPress == 68) || (KeyPress == 100)) && (PandoraCurrentRoom.DirectionMap.indexOf("East") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("East")], "East");
	}
}

/**
 * Prepares a text popup for Pandora's Box
 * @returns {void} - Nothing
 */
function PandoraMsgBox(Text) {
	PandoraMessage = { Timer: CommonTime() + 3000, Text: Text };
}

/**
 * Generates a random NPC for Pandora's Box missions, clear the cache if it was generated before
 * @param {string} Group - The main group for that NPC (Random, Entrance, Underground)
 * @param {string} Type - The NPC function within Pandora's (Guard, Mistress, Slave, Maid, etc.)
 * @param {string} Name - The name to give to that NPC, can be RANDOM for a fully random name
 * @param {boolean} AllowItem - TRUE if we allow using items on her by default
 * @returns {object} - The NPC character to return
 */
function PandoraGenerateNPC(Group, Type, Name, AllowItem) {
	CharacterDelete("NPC_Pandora_" + Group + Type);
	delete CommonCSVCache["Screens/Room/Pandora/Dialog_NPC_Pandora_" + Group + Type + ".csv"];
	let NPC = CharacterLoadNPC("NPC_Pandora_" + Group + Type);
	if (Name == "RANDOM") CharacterRandomName(NPC);
	else NPC.Name = Name;
	CharacterRelease(NPC);
	NPC.Stage = "0";
	NPC.AllowItem = AllowItem;
	NPC.AllowMove = false;
	PandoraDress(NPC, Type);
	return NPC;
}

/**
 * Dress a character in the Rival Club fashion
 * @returns {void} - Nothing
 */
function PandoraDress(C, Type) {

	// The maids have a red outfit
	if (Type == "Maid") {
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "MaidOutfit2", "Cloth", "#804040");
		InventoryWear(C, "MaidHairband1", "Hat", "#804040");
		if (InventoryGet(C, "Socks") == null) InventoryWear(C, "Socks3", "Socks", "#804040");
		else InventoryGet(C, "Socks").Color = "#804040";
		if (InventoryGet(C, "Bra") == null) InventoryWear(C, "Bra1", "Bra", "#222222");
		else InventoryGet(C, "Bra").Color = "#222222";
		if (InventoryGet(C, "Panties") == null) InventoryWear(C, "Panties1", "Panties", "#222222");
		else InventoryGet(C, "Panties").Color = "#222222";
		if (InventoryGet(C, "Shoes") == null) InventoryWear(C, "Shoes1", "Shoes", "#222222");
		else InventoryGet(C, "Shoes").Color = "#222222";
		InventoryWear(C, "MaidCollar", "ItemNeck", "#804040");
		CharacterRefresh(C, false);
		return;
	}

	// The guards are wearing a police hat and latex
	if (Type == "Guard") {
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "PoliceWomanHat", "Hat", "Default");
		InventoryWear(C, "CorsetShirt", "Cloth", "Default");
		InventoryWear(C, "LatexPants1", "ClothLower", "Default");
		InventoryWear(C, "DeluxeBoots", "Shoes", "#222222");
		InventoryWear(C, "LatexSocks1", "Shoes", "#222222");
		CharacterRefresh(C, false);
		return;
	}

	// The guards are wearing a police hat and latex
	if (Type == "Slave") {
		CharacterNaked(C);
		InventoryWear(C, "StrictPostureCollar", "ItemNeck", "#FFD700");
		InventoryWear(C, "MetalChastityBelt", "ItemPelvis", "#FFD700");
		CharacterRefresh(C, false);
		return;
	}

	// The Mistress wear gold uniforms
	if (Type == "Mistress") {
		InventoryRemove(C, "ClothAccessory");
		InventoryWear(C, "MistressGloves", "Gloves", "#FFD700");
		InventoryWear(C, "MistressBoots", "Shoes", "#FFD700");
		InventoryWear(C, "MistressTop", "Cloth", "#FFD700");
		InventoryWear(C, "MistressBottom", "ClothLower", "#FFD700");
		CharacterRefresh(C, false);
		return;
	}

	// Since no defined type is found, we fully randomize the clothes and appearance
	CharacterAppearanceFullRandom(C);
	CharacterRefresh(C, false);

}

/**
 * When the players enters a new room, we keep the previous room
 * @param {object} Room - The room to step into
 * @returns {void} - Nothing
 */
function PandoraEnterRoom(Room, Direction) {

	// Shoes the incoming direction for a little while
	if ((Direction != null) && (Direction != "")) PandoraMoveDirectionTimer = { Direction: Direction, Timer: CommonTime() + 1500 };

	// Sets the new room and keep the previous
	PandoraPreviousRoom = PandoraCurrentRoom;
	PandoraCurrentRoom = Room;

	// 33% odds of removing a previous random NPC if she can walk
	if (PandoraCurrentRoom.Character.length >= 1)
		if ((PandoraCurrentRoom.Character[0].AccountName.indexOf("NPC_Pandora_Random") == 0) && (Math.random() > 0.667) && PandoraCurrentRoom.Character[0].CanWalk()) {
			let Char = PandoraCurrentRoom.Character[0];
			PandoraCurrentRoom.Character = [];
			CharacterDelete(Char);
			Char = null;
			return;
		}

	// 5% odds of spawning a new random NPC in the room
	if ((PandoraCurrentRoom.Background.indexOf("Entrance") < 0) && (PandoraCurrentRoom.Character.length == 0) && (Math.random() > 0.95)) {
		let Type = CommonRandomItemFromList("", PandoraRandomNPCList);
		let Char = PandoraGenerateNPC("Random", Type, "RANDOM", (Type === "Slave"));
		Char.Type = Type;
		Char.Recruit = 0;
		Char.RecruitOdds = (Type === "Slave") ? 1 : 0.75;
		Room.Character.push(Char);
	}

	// If we enter a room with a maid that's not bound, she can intercept the player if the mission is almost completed
	if ((PandoraCurrentRoom.Character.length == 1) && (PandoraCurrentRoom.Character[0].AccountName.indexOf("Maid") >= 0) && PandoraCurrentRoom.Character[0].CanInteract()) {
		let StartDialog = "";
		if ((InfiltrationMission == "Retrieve") && (InfiltrationTarget.Found)) StartDialog = InfiltrationMission + ((PandoraClothes == "Maid") ? "Maid" : "Random") + "0";
		if ((InfiltrationMission == "Rescue") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name)) StartDialog = InfiltrationMission + ((PandoraClothes == "Guard") ? "Guard" : "Random") + "0";
		if ((InfiltrationMission == "Kidnap") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name) && PandoraParty[0].CanTalk()) StartDialog = InfiltrationMission + "Random" + "0";
		if (StartDialog != "") {
			CharacterRelease(PandoraCurrentRoom.Character[0]);
			PandoraCurrentRoom.Character[0].RandomOdds = Math.random() + 0.2 - (InfiltrationDifficulty * 0.1);
			PandoraCurrentRoom.Character[0].AllowMove = false;
			PandoraCurrentRoom.Character[0].Stage = StartDialog;
		}
	}

	// If we enter a room with a guard that's not bound, she can intercept the player
	if ((PandoraCurrentRoom.Character.length == 1) && (PandoraCurrentRoom.Character[0].AccountName.indexOf("RandomGuard") >= 0) && PandoraCurrentRoom.Character[0].CanInteract()) {
		let ArrestDialog = "";
		if (!PandoraCurrentRoom.Character[0].AllowMove && (SkillGetLevel(Player, "Infiltration") >= Math.floor(Math.random() * 10))) ArrestDialog = "InfiltrationArrest";
		if ((InfiltrationMission == "Kidnap") && (PandoraParty.length == 1) && (PandoraParty[0].Name == InfiltrationTarget.Name) && PandoraParty[0].CanTalk()) ArrestDialog = "KidnapArrest";
		if ((PandoraParty.length == 1) && (PandoraParty[0].AccountName.indexOf("RandomGuard") >= 0)) ArrestDialog = "GuardArrest";
		if (ArrestDialog != "") {
			CharacterRelease(PandoraCurrentRoom.Character[0]);
			PandoraCurrentRoom.Character[0].AllowMove = false;
			PandoraCurrentRoom.Character[0].Stage = ArrestDialog;
		}
	}
	
}

/**
 * Generates random rooms linked on the entry room
 * @param {object} EntryRoom - The room object that's leading to that floor
 * @param {string} The entry direction
 * @param {number} The room level, the higher it goes, the higher the chances it will be a dead-end
 * @returns {void} - Nothing
 */
function PandoraGenerateRoom(EntryRoom, DirectionFrom, RoomLevel) {

	// Over 100, the dungeon layout is always invalid
	if (PandoraRoom.length >= 100) return;

	// The higher the room level, the less paths there will be
	let PathCount = 0;
	if (EntryRoom.Background.indexOf("Entrance") == 0) PathCount = 2 + Math.floor(Math.random() * 3);
	if (EntryRoom.Background.indexOf("Tunnel") == 0) PathCount = 1;
	if (EntryRoom.Background.indexOf("Fork") == 0) PathCount = 1 + Math.floor(Math.random() * 3);

	// Generates all paths
	let Path = [];
	for (let P = 0; P < PathCount; P++) {

		// Generates a valid path that's not already used
		let Continue = false;
		let PathNum;
		while (!Continue) {
			PathNum = Math.floor(Math.random() * 4);
			if (EntryRoom.Background.indexOf("Tunnel") == 0) PathNum = PandoraDirectionListFrom.indexOf(DirectionFrom);
			Continue = ((PandoraDirectionList.indexOf(DirectionFrom) != PathNum) && (Path.indexOf(PathNum) < 0));
		}
		Path.push(PathNum);

		// Generates a background for the room, tries not to repeat it and do not allow the same background as the previous room
		let RoomBack;
		Continue = false;
		while (!Continue) {
			RoomBack = "Cell";
			let DeadEndOdds = (RoomLevel - InfiltrationDifficulty) * 0.2;
			if (RoomLevel <= 2) DeadEndOdds = 0;
			let TunnelOdds = 0.25 + (RoomLevel * 0.1);
			if (TunnelOdds > 0.75) TunnelOdds = 0.75;
			if (Math.random() >= DeadEndOdds) RoomBack = (Math.random() >= TunnelOdds) ? "Fork" : "Tunnel";
			RoomBack = RoomBack + Math.floor(Math.random() * 7);
			Continue = (RoomBack !== EntryRoom.Background);
			if (Continue)
				for (let R = 0; R < PandoraRoom.length; R++)
					if ((PandoraRoom[R].Background == RoomBack) && (Math.random() >= 0.25)) {
						Continue = false;
						break;
					}
		}

		// Creates the room
		let Room = {};
		Room.Character = [];
		Room.Floor = EntryRoom.Floor;
		Room.Background = RoomBack;
		Room.Path = [];
		Room.PathMap = [];
		Room.PathMap.push(EntryRoom);
		Room.Direction = [];
		Room.DirectionMap = [];
		Room.DirectionMap.push(PandoraDirectionList[PathNum]);
		PandoraRoom.push(Room);
		EntryRoom.PathMap.push(Room);
		EntryRoom.DirectionMap.push(PandoraDirectionListFrom[PathNum]);

		// Creates sub-rooms if it's not a dead end room
		if (RoomBack.indexOf("Cell") == 0) {
			if ((InfiltrationMission == "Retrieve") || (InfiltrationMission == "Steal")) {
				let SearchRoom = { Floor: "Search" };
				Room.Path.push(SearchRoom);
				Room.Direction.push("Search");
			}
		} else PandoraGenerateRoom(Room, PandoraDirectionListFrom[PathNum], RoomLevel + 1);

	}

}

/**
 * Loads the Pandora's Box screen
 * @param {string} FloorName - The name of the floor in which we must generate rooms
 * @param {object} EntryRoom - The room object that's leading to that floor
 * @param {string} The entry direction
 * @param {string} The opposite direction
 * @returns {void} - Nothing
 */
function PandoraGenerateFloor(FloorName, EntryRoom, DirectionFrom, DirectionTo) {

	// Always create the same entrance room
	let Room = {};
	Room.Character = [];
	Room.Floor = FloorName;
	Room.Background = "Entrance";
	Room.Path = [];
	Room.Path.push(EntryRoom);
	Room.PathMap = [];
	Room.Direction = [];
	Room.Direction.push(DirectionFrom);
	Room.DirectionMap = [];
	PandoraRoom.push(Room);
	EntryRoom.Path.push(Room);
	EntryRoom.Direction.push(DirectionTo);

	// Starts the room generation
	PandoraGenerateRoom(Room, DirectionFrom, 1);

}

/**
 * Clears all the rooms and generates the main hall with an introduction maid
 * @returns {void} - Nothing
 */
function PandoraBuildMainHall() {

	// Creates the ground entrance room with a maid
	PandoraParty = [];
	let Room = {};
	let Char = PandoraGenerateNPC("Entrance", "Maid", "RANDOM", false);
	if (SkillGetLevel(Player, "Infiltration") >= 9) Char.Stage = "30";
	else if (SkillGetLevel(Player, "Infiltration") >= 6) Char.Stage = "20";
	else if (SkillGetLevel(Player, "Infiltration") >= 3) Char.Stage = "10";
	Room.Character = [];
	Room.Character.push(Char);
	Room.Floor = "Ground";
	Room.Background = "Entrance";
	Room.PathMap = [];
	let ExitRoom = { Floor: "Exit" };
	Room.DirectionMap = [];

	// Generates the floors and sets the starting room, there's a min-max number of rooms based on difficulty
	let MinRoom = 15;
	let MaxRoom = 24;
	if (InfiltrationDifficulty == 1) { MinRoom = 25; MaxRoom = 39; }
	if (InfiltrationDifficulty == 2) { MinRoom = 40; MaxRoom = 54; }
	if (InfiltrationDifficulty == 3) { MinRoom = 55; MaxRoom = 74; }
	if (InfiltrationDifficulty == 4) { MinRoom = 75; MaxRoom = 99; }
	PandoraRoom = [];
	while ((PandoraRoom.length < MinRoom) || (PandoraRoom.length > MaxRoom)) {
		PandoraRoom = [];
		Room.Path = [];
		Room.Path.push(ExitRoom);
		Room.Direction = [];
		Room.Direction.push("Exit");
		PandoraRoom.push(Room);
		PandoraGenerateFloor("Underground", Room, "StairsUp", "StairsDown");
	}
	PandoraCurrentRoom = Room;
	PandoraPreviousRoom = null;
	PandoraTargetRoom = null;

	// Pick a random cell room for the final target, generates special NPCs if needed
	while (PandoraTargetRoom == null) {
		Room = PandoraRoom[Math.floor(Math.random() * PandoraRoom.length)];
		if (Room.Background.indexOf("Cell") == 0) {
			if ((InfiltrationMission == "Retrieve") || (InfiltrationMission == "Steal")) {
				Room.ItemX = 50 + Math.floor(Math.random() * 1700);
				Room.ItemY = 50 + Math.floor(Math.random() * 900);
			}
			if (InfiltrationMission == "Rescue") {
				let Victim = PandoraGenerateNPC("Rescue", "Victim", InfiltrationTarget.Name, true);
				if (Math.random() >= 0.333) CharacterRandomUnderwear(Victim);
				else if (Math.random() >= 0.5) CharacterNaked(Victim);
				CharacterFullRandomRestrain(Victim, "LOT", true);
				Room.Character.push(Victim);
				let Guard = PandoraGenerateNPC("Rescue", "Guard", "RANDOM", false);
				Room.PathMap[0].Character.push(Guard);
			}
			if (InfiltrationMission == "Kidnap") {
				let Target = PandoraGenerateNPC("Kidnap", "Target", InfiltrationTarget.Name, true);
				Room.Character.push(Target);
			}
			PandoraTargetRoom = Room;
		}
	}

}

/**
 * Removes the current character from the room and deletes that NPC from the array
 * @returns {void} - Nothing
 */
function PandoraRemoveCurrentCharacter() {
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].ID == CurrentCharacter.ID) {
			PandoraCurrentRoom.Character.splice(C, 1);
			break;
		}
	CharacterDelete(CurrentCharacter.AccountName);
	DialogLeave();
}

/**
 * Flags the current character to allow moves and exits any dialog with her
 * @returns {void} - Nothing
 */
function PandoraCharacterAllowMove() {
	CurrentCharacter.AllowMove = true;
	DialogLeave();
}

/**
 * When the current character joins the player's party
 * @returns {void} - Nothing
 */
function PandoraCharacterJoin() {
	CurrentCharacter.AllowMove = true;
	if (PandoraParty.length == 1)
		PandoraCurrentRoom.Character.push(PandoraParty[0]);
	PandoraParty = [];
	PandoraParty.push(CurrentCharacter);
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].ID == CurrentCharacter.ID) {
			PandoraCurrentRoom.Character.splice(C, 1);
			break;
		}
}

/**
 * When the current character leaves the player's party
 * @returns {void} - Nothing
 */
function PandoraCharacterLeave() {
	PandoraCurrentRoom.Character.push(CurrentCharacter);
	PandoraParty = [];
}

/**
 * When the current character starts to fight against the player
 * @returns {void} - Nothing
 */
function PandoraCharacterFight() {
	PandoraFightCharacter = CurrentCharacter;
	let Difficulty = (InfiltrationDifficulty * 2) + Math.floor(Math.random() * 3);
	KidnapStart(CurrentCharacter, PandoraBackground, Difficulty, "PandoraCharacterFightEnd()");
}

/**
 * Resolves the fight between the player and the current character
 * @returns {void} - Nothing
 */
function PandoraCharacterFightEnd() {
	CharacterSetCurrent(PandoraFightCharacter);
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CurrentCharacter.KidnapMaxWillpower - CurrentCharacter.KidnapWillpower)));
	PandoraWillpower = Player.KidnapWillpower;
	if (InfiltrationPerksActive("Recovery")) {
		PandoraWillpower = PandoraWillpower + Math.round(PandoraMaxWillpower / 10);
		if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
	}
	CurrentCharacter.Stage = (KidnapVictory) ? "100" : "200";
	CharacterRelease(KidnapVictory ? Player : CurrentCharacter);
	CurrentCharacter.AllowItem = KidnapVictory;
	if (KidnapVictory) CurrentCharacter.AllowMove = true;
	CommonSetScreen("Room", "Pandora");
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (KidnapVictory) ? "FightVictory" : "FightDefeat");
}

/**
 * When the mission fails, we go back to the infiltration room
 * @returns {void} - Nothing
 */
function PandoraMissionFail() {
	InfiltrationTarget.Fail = true;
	CharacterRelease(Player);
	CommonSetScreen("Room", "Infiltration");
	DialogLeave();
}

/**
 * When the player must walk back to the previous room he entered from
 * @returns {void} - Nothing
 */
function PandoraWalkBack() {
	if (PandoraPreviousRoom == null) return;
	PandoraCurrentRoom = PandoraPreviousRoom;
	PandoraPreviousRoom = null;
	DialogLeave();
}

/**
 * When the player must strips the current character
 * @returns {void} - Nothing
 */
function PandoraCharacterNaked() {
	CharacterNaked(CurrentCharacter);
}

/**
 * When the player changes in the clothes of someone else (type)
 * @param {string} Type - The type of character to dress as (ex: Guard)
 * @returns {void} - Nothing
 */
function PandoraPlayerClothes(Type) {
	PandoraDress(Player, Type);
	PandoraClothes = Type;
}

/**
 * The player can only try once to recruit a random NPC, the odds are set when conversation starts
 * @returns {void} - Nothing
 */
function PandoraStartRecruit() {
	CurrentCharacter.Recruit = Math.random();
}

/**
 * Increases the infiltration skill on some events
 * @param {string} Progress - The progression factor
 * @returns {void} - Nothing
 */
function PandoraInfiltrationChange(Progress) {
	let P = parseInt(Progress);
	if (InfiltrationDifficulty == 1) P = Math.round(P * 1.5);
	if (InfiltrationDifficulty == 2) P = Math.round(P * 2.25);
	if (InfiltrationDifficulty == 3) P = Math.round(P * 3);
	if (InfiltrationDifficulty == 4) P = Math.round(P * 4);
	SkillProgress("Infiltration", P);
}

/**
 * Checks if the player can bring the NPC to her private room
 * @returns {boolean} - Returns true if the player can
 */
function PandoraCanJoinPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")); }

/**
 * When a random NPC joins the player private room, we add that character and exits the dialog
 * @returns {void} - Nothing
 */
function PandoraCharacterJoinPrivateRoom() {
	CurrentScreen = "Private";
	PrivateAddCharacter(CurrentCharacter, (CurrentCharacter.Type === "Slave") ? "Submissive" : null);
	CurrentScreen = "Pandora";
	PandoraRemoveCurrentCharacter();
}

/**
 * Checks if the mission is the one provided in the parameter
 * @param {string} Type - The mission type
 * @returns {boolean} - Returns TRUE if it's the current mission
 */
function PandoraMissionIs(Type) { return (InfiltrationMission === Type); }

/**
 * Checks if the perk specified is currently selected
 * @param {string} Type - The perk type
 * @returns {boolean} - Returns TRUE if it's selected
 */
function PandoraHasPerk(Type) { return InfiltrationPerksActive(Type); }

/**
 * Prepares an information text based on the bribe amount provided
 * @param {string} Amount - The bribe amount
 * @param {string} Type - The perk type
 * @returns {void} - Nothing
 */
function PandoraBribeInfo(Amount, Type) {
	let Money = parseInt(Amount);
	CharacterChangeMoney(Player, Money * -1);
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "BribeInfo" + InfiltrationMission + Type);
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("LevelName", TextGet("LevelName" + PandoraTargetRoom.Floor));
	let Room = PandoraTargetRoom;
	while (Room.PathMap[0].Background.indexOf("Entrance") != 0)
		Room = Room.PathMap[0];
	let Dir = Room.DirectionMap[0];
	Dir = PandoraDirectionListFrom[PandoraDirectionList.indexOf(Dir)];
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("FirstDirection", TextGet("FirstDirection" + Dir));
}

/**
 * Some dialog activities can boost the recruitment odds
 * @returns {void} - Nothing
 */
function PandoraRecruitBoost() {
	if (CurrentCharacter.RecruitOdds >= 0.75)
		CurrentCharacter.RecruitOdds = CurrentCharacter.RecruitOdds - 0.05;
}

/**
 * Starts the player punishment process and jumps to the punishment Dominatrix
 * @returns {void} - Nothing
 */
function PandoraPunishmentIntro() {
	let IntroText;
	if (SkillGetLevel(Player, "Infiltration") >= 8) IntroText = DialogFind(CurrentCharacter, "Punishment8");
	else if (SkillGetLevel(Player, "Infiltration") >= 5) IntroText = DialogFind(CurrentCharacter, "Punishment5");
	else if (SkillGetLevel(Player, "Infiltration") >= 2) IntroText = DialogFind(CurrentCharacter, "Punishment2");
	else IntroText = DialogFind(CurrentCharacter, "Punishment0");
	PandoraBackground = "Pandora/Underground/Cell" + Math.floor(Math.random() * 7).toString();
	let Dominatrix = PandoraGenerateNPC("Punishment", "Mistress", "RANDOM", false);
	CharacterSetCurrent(Dominatrix);
	CurrentCharacter.CurrentDialog = IntroText;
}

/**
 * Puts the player in lots of random restraints
 * @returns {void} - Nothing
 */
function PandoraRestrainPlayer() {
	CharacterFullRandomRestrain(Player, "LOT", true);
}

/**
 * When the player purchases a drink from the maid, she can heal by the money value
 * @returns {void} - Nothing
 */
function PandoraBuyMaidDrink(Money) {
	Money = parseInt(Money);
	CharacterChangeMoney(Player, Money * -1);
	if (CurrentCharacter.DrinkValue == null) CurrentCharacter.DrinkValue = 0;
	if (Money > CurrentCharacter.DrinkValue) {
		PandoraWillpower = PandoraWillpower + Money - CurrentCharacter.DrinkValue;
		if (PandoraWillpower > PandoraMaxWillpower) PandoraWillpower = PandoraMaxWillpower;
		CurrentCharacter.DrinkValue = Money;
	}
}

/**
 * Generates new random odds for a character, based on Pandora's difficulty
 * @returns {void} - Nothing
 */
function PandoraCharacterGenerateRandomOdds() {
	CurrentCharacter.RandomOdds = Math.random() + 0.2 - (InfiltrationDifficulty * 0.1);
}

/**
 * Starts the guard quiz, the player needs 5 good answers to be let go
 * @returns {void} - Nothing
 */
function PandoraQuizStart() {
	CurrentCharacter.QuizLog = [];
	CurrentCharacter.QuizFail = 0;
	PandoraQuizNext();
}

/**
 * Generates questions that guards will challenge the player with
 * @returns {void} - Nothing
 */
function PandoraQuizNext() {
	let Question = Math.floor(Math.random() * 11); 
	while (CurrentCharacter.QuizLog.indexOf(Question) >= 0)
		Question = Math.floor(Math.random() * 11); 
	CurrentCharacter.QuizLog.push(Question);
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "QuizQuestion" + Question.toString());
}

/**
 * When the player gives an answer to the guard quiz, the guard will give a visual hint if the answer is incorrect
 * @returns {void} - Nothing
 */
function PandoraQuizAnswer(Answer) {
	if (Answer != "1") {
		CurrentCharacter.QuizFail++;
		CharacterSetFacialExpression(CurrentCharacter, "Blush", "Low", 3);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes", "Angry", 3);
		CharacterSetFacialExpression(CurrentCharacter, "Eyes2", "Angry", 3);
	}
	if (CurrentCharacter.QuizLog.length >= 5) {
		CurrentCharacter.Stage = (CurrentCharacter.QuizFail >= 2) ? "Arrest" : "30";
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, (CurrentCharacter.QuizFail >= 2) ? "QuizFail" : "QuizSuccess");
	} else PandoraQuizNext();
}

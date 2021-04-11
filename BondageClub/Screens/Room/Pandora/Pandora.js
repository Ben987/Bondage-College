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

/**
 * Loads the Pandora's Box screen
 * @returns {void} - Nothing
 */
function PandoraLoad() {
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
		if (PandoraSeachSquare != null) DrawEmptyRect(PandoraSeachSquare.X - 100, PandoraSeachSquare.Y - 100, 200, 200, "Cyan", 3);
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
		DrawButton(1827, 655, 90, 90, "", (PandoraCurrentRoom.DirectionMap.indexOf("North") >= 0) ? "White" : "Silver", "Icons/North.png", TextGet("DirectionNorth"));
		DrawButton(1770, 770, 90, 90, "", (PandoraCurrentRoom.DirectionMap.indexOf("West") >= 0) ? "White" : "Silver", "Icons/West.png", TextGet("DirectionWest"));
		DrawButton(1885, 770, 90, 90, "", (PandoraCurrentRoom.DirectionMap.indexOf("East") >= 0) ? "White" : "Silver", "Icons/East.png", TextGet("DirectionEast"));
		DrawButton(1827, 885, 90, 90, "", (PandoraCurrentRoom.DirectionMap.indexOf("South") >= 0) ? "White" : "Silver", "Icons/South.png", TextGet("DirectionSouth"));
	}
	
	// If we must draw a message in the middle of the screen
	if ((PandoraMessage != null) && (PandoraMessage.Timer != null) && (PandoraMessage.Text != null) && (PandoraMessage.Timer >= CommonTime())) {
		DrawRect(500, 465, 1000, 70, "black");
		DrawRect(502, 467, 996, 66, "white");
		DrawTextWrap(PandoraMessage.Text, 500, 465, 1000, 70, "black");
	}

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
		if (MouseIn(0, 0, 1800, 1000)) {
			PandoraSeachSquare = { X: MouseX, Y: MouseY };
			if ((PandoraCurrentRoom.ItemX != null) && (PandoraCurrentRoom.ItemY != null) && MouseIn(PandoraCurrentRoom.ItemX - 100, PandoraCurrentRoom.ItemY - 100, 200, 200)) {
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
		if (MouseIn(1827, 655, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("North") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("North")]);
		if (MouseIn(1770, 770, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("West") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("West")]);
		if (MouseIn(1885, 770, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("East") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("East")]);
		if (MouseIn(1827, 885, 90, 90) && (PandoraCurrentRoom.DirectionMap.indexOf("South") >= 0)) return PandoraEnterRoom(PandoraCurrentRoom.PathMap[PandoraCurrentRoom.DirectionMap.indexOf("South")]);
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
 * Dress a character in the Rival Club fashion
 * @returns {void} - Nothing
 */
function PandoraDress(C, Type) {
	
	// The maids have a red outfit
	if (Type == "Maid") {
		InventoryWear(C, "MaidOutfit" + (Math.floor(Math.random() * 2) + 1).toString(), "Cloth", "#804040");
		InventoryWear(C, "MaidHairband1", "Hat", "#804040");
		InventoryGet(C, "Socks").Color = "#804040";
		InventoryGet(C, "Bra").Color = "#222222";
		InventoryGet(C, "Panties").Color = "#222222";
		InventoryGet(C, "Shoes").Color = "#222222";
	}

	// The guards are wearing a police hat and latex
	if (Type == "Guard") {
		InventoryWear(C, "PoliceWomanHat", "Hat", "Default");
		InventoryWear(C, "CorsetShirt", "Cloth", "Default");
		InventoryWear(C, "LatexPants1", "ClothLower", "Default");
		InventoryWear(C, "DeluxeBoots", "Shoes", "#222222");
		InventoryWear(C, "LatexSocks1", "Shoes", "#222222");
		InventoryRemove(C, "ClothAccessory");
	}
	
	// Refresh the character
	CharacterRefresh(C, false);
	
}


/**
 * When the players enters a new room, we keep the previous room
 * @param {object} Room - The room to step into
 * @returns {void} - Nothing
 */
function PandoraEnterRoom(Room) {
	
	// Sets the new room and keep the previous
	PandoraPreviousRoom = PandoraCurrentRoom;
	PandoraCurrentRoom = Room;
	
	// 33% odds of removing a previous random NPC
	if (PandoraCurrentRoom.Character.length == 1)
		if ((PandoraCurrentRoom.Character[0].AccountName == "NPC_Pandora_RandomMember") && (Math.random() > 0.667)) {
			let Char = PandoraCurrentRoom.Character[0];
			PandoraCurrentRoom.Character = [];
			CharacterDelete(Char);
			Char = null;
			return;
		}	
	
	// 3% odds of spawning a new random NPC in the room
	if ((PandoraCurrentRoom.Background.indexOf("Entrance") < 0) && (PandoraCurrentRoom.Character.length == 0) && (Math.random() > 0.97)) {
		let Char = CharacterLoadNPC("NPC_Pandora_RandomMember");
		CharacterRandomName(Char);
		CharacterAppearanceFullRandom(Char);
		Char.AllowItem = false;
		Char.AllowMove = false;
		Char.Stage = "0";
		Room.Character.push(Char);
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
			if (RoomLevel == 1) RoomBack = (Math.random() >= 0.4) ? "Fork" : "Tunnel";
			if ((RoomLevel == 2) && (Math.random() >= 0.25)) RoomBack = (Math.random() >= 0.55) ? "Fork" : "Tunnel";
			if ((RoomLevel == 3) && (Math.random() >= 0.5)) RoomBack = (Math.random() >= 0.7) ? "Fork" : "Tunnel";
			if ((RoomLevel == 4) && (Math.random() >= 0.75)) RoomBack = (Math.random() >= 0.85) ? "Fork" : "Tunnel";
			RoomBack = RoomBack + Math.floor(Math.random() * 6);
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
	
	// Creates the ground entrance room
	PandoraParty = [];
	PandoraRoom = [];
	let Room = {};
	let Char = CharacterLoadNPC("NPC_Pandora_EntranceMaid");
	PandoraDress(Char, "Maid");
	Char.AllowItem = false;
	Char.AllowMove = false;
	Room.Character = [];
	Room.Character.push(Char);
	Room.Floor = "Ground";
	Room.Background = "Entrance";
	Room.Path = [];
	Room.PathMap = [];
	PandoraRoom.push(Room);
	
	// Creates the exit room in the entrance
	let ExitRoom = { Floor: "Exit" };
	Room.Path.push(ExitRoom);
	Room.Direction = [];
	Room.Direction.push("Exit");
	Room.DirectionMap = [];
	
	// Generates the floors and sets the starting room
	PandoraGenerateFloor("Underground", Room, "StairsUp", "StairsDown");
	PandoraCurrentRoom = Room;
	PandoraPreviousRoom = null;

	// Picks a random cell room for the final target
	let RoomFound = false;
	while (!RoomFound) {
		Room = PandoraRoom[Math.floor(Math.random() * PandoraRoom.length)];
		if (Room.Background.indexOf("Cell") == 0) {
			if ((InfiltrationMission == "Retrieve") || (InfiltrationMission == "Steal")) {
				Room.ItemX = 50 + Math.floor(Math.random() * 1700);
				Room.ItemY = 50 + Math.floor(Math.random() * 900);
			}
			if (InfiltrationMission == "Rescue") {
				let Victim = CharacterLoadNPC("NPC_Pandora_RescueVictim");
				Victim.Name = InfiltrationTarget.Name;
				if (Math.random() >= 0.333) CharacterRandomUnderwear(Victim);
				else if (Math.random() >= 0.5) CharacterNaked(Victim);
				CharacterFullRandomRestrain(Victim, "LOT", true);
				Victim.AllowItem = true;
				Victim.Stage = "0";
				Room.Character.push(Victim);
				let Guard = CharacterLoadNPC("NPC_Pandora_RescueGuard");
				PandoraDress(Guard, "Guard");
				Guard.AllowItem = false;
				Guard.AllowMove = false;
				Guard.Stage = "0";				
				Room.PathMap[0].Character.push(Guard);
			}
			if (InfiltrationMission == "Kidnap") {
				let Target = CharacterLoadNPC("NPC_Pandora_KidnapTarget");
				Target.Name = InfiltrationTarget.Name;
				Target.AllowItem = false;
				Target.Stage = "0";
				Room.Character.push(Target);
			}
			RoomFound = true;
		}
	}
	
	
}

/**
 * Removes the current character from the room and deletes that NPC from the array
 * @returns {void} - Nothing
 */
function PandoraRemoveCurrentCharacter() {
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].AccountName == CurrentCharacter.AccountName) {
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
	PandoraParty.push(CurrentCharacter);
	if (CurrentCharacter.Name == InfiltrationTarget.Name) InfiltrationTarget.Found = true;
	for (let C = 0; C < PandoraCurrentRoom.Character.length; C++)
		if (PandoraCurrentRoom.Character[C].AccountName == CurrentCharacter.AccountName) {
			PandoraCurrentRoom.Character.splice(C, 1);
			break;
		}
}

/**
 * When the current character starts to fight against the player
 * @returns {void} - Nothing
 */
function PandoraCharacterFight() {
	PandoraFightCharacter = CurrentCharacter;
	KidnapStart(CurrentCharacter, PandoraBackground, InfiltrationDifficulty + Math.floor(Math.random() * 3), "PandoraCharacterFightEnd()");
}

/**
 * Resolves the fight between the player and the current character
 * @returns {void} - Nothing
 */
function PandoraCharacterFightEnd() {
	CharacterSetCurrent(PandoraFightCharacter);
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CurrentCharacter.KidnapMaxWillpower - CurrentCharacter.KidnapWillpower)));
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
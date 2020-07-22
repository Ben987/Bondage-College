"use strict";
var CafeBackground = "MaidCafe";
var CafeMaid = null;
var CafeIsMaid = false;
var CafeIsHeadMaid = false;
var CafeVibeIncreased = false;
var CafeEnergyDrinkPrice = 5;
var CafeGlassMilkPrice = 5;
var CafeCupcakePrice = 5;
var CafeAskedFor = null;
var CafePrice = 0;

// Returns TRUE if
function CafeMaidCanServe() { return (!CafeMaid.IsRestrained() && !Player.IsRestrained()) }
function CafeMaidCannotServe() { return (CafeMaid.IsRestrained()) }
function CafePlayerCannotConsume() { return (!CafeMaid.IsRestrained() && Player.IsRestrained()) }
function CafeOnlineDrinkCompleted() { return (MaidQuartersOnlineDrinkCount >= 5) }
function CafeIsGaggedHeadMaid() { return (!Player.CanTalk() && CafeIsHeadMaid && !Player.IsBlind()) }
function CafeIsGaggedSeniorMaid() { return (!Player.CanTalk() && !CafeIsHeadMaid && ReputationGet("Maid") >= 50 && !Player.IsBlind()) }
function CafeIsGaggedMaid() { return (!Player.CanTalk() && !CafeIsHeadMaid && ReputationGet("Maid") > 50 && !Player.IsBlind()) }
function CafeIsMaidChoice() { return (ReputationGet("Maid") >= 50 && !CafeIsHeadMaid) }
function CafeIsMaidNoChoice() { return (ReputationGet("Maid") < 50 && !CafeIsHeadMaid) }
function CafeCanDildo() { return (!Player.IsVulvaChaste() && InventoryGet(Player, "ItemVulva") == null) }
function CafeEquired(Type) { return (Type == CafeAskedFor) }

// Loads the Cafe room
function CafeLoad() {
	CafeMaid = CharacterLoadNPC("NPC_Cafe_Maid");
	CafeIsMaid = LogQuery("JoinedSorority", "Maid");
	CafeIsHeadMaid = LogQuery("LeadSorority", "Maid");
	CafeMaid.AllowItem = CafeIsHeadMaid;
}

// Run the Cafe room and draw characters
function CafeRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CafeMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the Cafe room
function CafeClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) {
		if (MaidQuartersMaid != null) {
			if ((MaidQuartersMaid.Stage == "285" || MaidQuartersMaid.Stage == "286") && (InventoryGet(Player, "ItemMisc").Asset.Name == "WoodenMaidTrayFull" || InventoryGet(Player, "ItemMisc").Asset.Name == "WoodenMaidTray")) {
				if (!CafeMaid.IsRestrained()) {
					CafeMaid.Stage = "100";
					CafeMaid.AllowItem = false;
				}
				else CafeMaid.Stage = "90";
			}
			else CafeMaid.Stage = "0";
		}
		CharacterSetCurrent(CafeMaid);
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
}

// Player asks for a special, is told the rpice
function CafeEquirePrice(Item) {
	CafeAskedFor = Item;
	if (CafeAskedFor == "EnergyDrink") CafePrice = CafeEnergyDrinkPrice;
	if (CafeAskedFor == "GlassMilk") CafePrice = CafeGlassMilkPrice;
	if (CafeAskedFor == "Cupcake") CafePrice = CafeCupcakePrice;
	CafeMaid.CurrentDialog = CafeMaid.CurrentDialog.replace("REPLACEMONEY", CafePrice.toString());

}

// Player consumes a speciality
function CafeConsumeSpeciiality() {
	if (Player.Money < CafePrice)  {
		CafeMaid.CurrentDialog = DialogFind(CafeMaid, "NotEnoughMoney");
	}
	else {
		CharacterChangeMoney(Player, CafePrice * -1);
		if (!LogQuery("ModifierDuration", "SkillModifier")) LogAdd("ModifierLevel", "SkillModifier", 0)
			SkillModifier = LogValue("ModifierLevel", "SkillModifier");

		if (CafeAskedFor == "EnergyDrink") {
			if (SkillModifier >= SkillModifierMax) CafeMaid.CurrentDialog = DialogFind(CafeMaid, "EnergyDrinkLimit");
			else SkillModifier++;
			LogAdd("ModifierDuration", "SkillModifier", CurrentTime + 3600000); // affects lasts 1 hour
			LogAdd("ModifierLevel", "SkillModifier", SkillModifier); // alters the skill modifier level
		}

		if (CafeAskedFor == "GlassMilk") {
			if (SkillModifier <= SkillModifierMin) CafeMaid.CurrentDialog = DialogFind(CafeMaid, "GlassMilkLimit");
			else SkillModifier = SkillModifier - 2;
			LogAdd("ModifierDuration", "SkillModifier", CurrentTime + 3600000); // affects lasts 1 hour
			LogAdd("ModifierLevel", "SkillModifier", SkillModifier); // alters the skill modifier level
		}

		if (CafeAskedFor == "Cupcake") {

		}
	}
}

// Cafe maid applies chosen bondage
function CafeServiceBound(Style) {
	var RandomNumber = 0;
	var RandomColor = null;
	RandomColor = null;
	var Bondage = null;
	var Form = null;
	Form = null;

	CharacterRelease(Player)

	if (Style == "Shibari") {

		// Base items
		RandomNumber = Math.floor(Math.random() * 3);
		if (RandomNumber >= 0) Bondage = "NylonRope";
		if (RandomNumber >= 1) Bondage = "HempRope";
		InventoryWear(Player, Bondage, "ItemArms", null, 20);
		if (RandomNumber >= 0) Bondage = "NylonRope";
		if (RandomNumber >= 1) Bondage = "HempRope";
		if (RandomNumber >= 2) Bondage = "MermaidRopeTie";
		InventoryWear(Player, Bondage, "ItemLegs");
		RandomNumber = Math.floor(Math.random() * 4);
		if (RandomNumber >= 0) Bondage = "ClothGag";
		if (RandomNumber >= 1) Bondage = "WiffleGag";
		if (RandomNumber >= 2) Bondage = "BambooGag";
		if (RandomNumber >= 3) Bondage = "ChopstickGag";
		if (RandomNumber <= 1) RandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		InventoryWear(Player, Bondage, "ItemMouth", RandomColor);

		// Gag Sub Types
		if (Bondage == "ClothGag") {
			RandomNumber = Math.floor(Math.random() * 4);
			if (RandomNumber >= 1) Form = "Cleave";
			if (RandomNumber >= 2) Form = "OTM";
			if (RandomNumber >= 3) Form = "OTN";
			DialogExtendItem(InventoryGet(Player, "ItemMouth"));
			InventoryItemMouthClothGagSetType(Form);
		}
	}

	if (Style == "Tape") {

		// Base items
		RandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		InventoryWear(Player, "DuctTape", "ItemArms", RandomColor, 15);
		InventoryWear(Player, "DuctTape", "ItemHands", RandomColor, 15);
		InventoryWear(Player, "DuctTape", "ItemLegs", RandomColor, 10);
		InventoryWear(Player, "DuctTape", "ItemMouth", RandomColor, 10);

		// Legs Sub Type
		RandomNumber = Math.floor(Math.random() * 4);
		if (RandomNumber >= 1) Form = "HalfLegs";
		if (RandomNumber >= 2) Form = "MostLegs";
		if (RandomNumber >= 3) Form = "CompleteLegs";
		if (RandomNumber >= 1) {
			Player.FocusGroup = { Name: "ItemLegs" };
			DialogExtendItem(InventoryGet(Player, "ItemLegs"));
			InventoryItemLegsDuctTapeSetPose(Form);
		}

		// Gag Sub Type
		RandomNumber = Math.floor(Math.random() * 10);
		if (RandomNumber >= 2) Form = "Crossed";
		if (RandomNumber >= 4) Form = "Full";
		if (RandomNumber >= 5) Form = "Double";
		if (RandomNumber >= 8) Form = "Cover";
		if (RandomNumber >= 2) {
			Player.FocusGroup = { Name: "ItemMouth" };
			DialogExtendItem(InventoryGet(Player, "ItemMouth"));
			InventoryItemMouthDuctTapeSetType(Form);
		}
	}

	if (Style == "Leather") {

		// Arms
		RandomNumber = Math.floor(Math.random() * 3);
		if (RandomNumber >= 0) Bondage = "LeatherArmbinder";
		if (RandomNumber >= 1) Bondage = "LeatherCuffs";
		if (RandomNumber >= 2) Bondage = "Bolero";
		if (RandomNumber >= 2) RandomColor = "#191919";
		else RandomColor = null;
		InventoryWear(Player, Bondage, "ItemArms", RandomColor, 15);

		if (Bondage == "LeatherCuffs") {
			RandomNumber = Math.floor(Math.random() * 3);
			if (RandomNumber >= 0) Form = "Wrist";
			if (RandomNumber >= 1) Form = "Elbow";
			if (RandomNumber >= 3) Form = "Both";
			Player.FocusGroup = { Name: "ItemArms" };
			DialogExtendItem(InventoryGet(Player, "ItemArms"));
			InventoryItemArmsLeatherCuffsSetPose(Form);
		}

		// Legs
		RandomNumber = Math.floor(Math.random() * 3);
		if (RandomNumber >= 0) Bondage = "LeatherBelt";
		if (RandomNumber >= 1) Bondage = "LeatherLegCuffs";
		if (RandomNumber >= 2) Bondage = "LegBinder";
		if (RandomNumber >= 2) RandomColor = "#111111";
		else RandomColor = null;
		InventoryWear(Player, Bondage, "ItemLegs", RandomColor);

		if (Bondage == "LeatherLegCuffs") {
			DialogExtendItem(InventoryGet(Player, "ItemLegs"));
			InventoryItemLegsLeatherLegCuffsSetPose("Closed");
		}

		// Gag
		RandomNumber = Math.floor(Math.random() * 5);
		if (RandomNumber >= 0) Bondage = "HarnessBallGag";
		if (RandomNumber >= 1) Bondage = "HarnessPanelGag";
		if (RandomNumber >= 2) Bondage = "NeckCorsetGag";
		if (RandomNumber >= 3) Bondage = "PlugGag";
		if (RandomNumber >= 4) Bondage = "MuzzleGag";
		if (RandomNumber >= 4) RandomColor = "#292929";
		InventoryWear(Player, Bondage, "ItemMouth", RandomColor);

		// Locks
		InventoryFullLockRandom(Player);
	}

	if (Style == "Latex") {

		RandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

		// Arms
		RandomNumber = Math.floor(Math.random() * 4);
		if (RandomNumber >= 0) Bondage = "StraitLeotard";
		if (RandomNumber >= 1) Bondage = "Bolero";
		if (RandomNumber >= 2) Bondage = "StraitDress";
		if (RandomNumber >= 3) Bondage = "StraitDressOpen";
		InventoryWear(Player, Bondage, "ItemArms", RandomColor, 20);

		// Legs
		if (Bondage == "Bolero" || Bondage == "StraitLeotard") {
			RandomNumber = Math.floor(Math.random() * 3);
			if (RandomNumber >= 1) Bondage = "LegBinder";
			if (RandomNumber >= 2) Bondage = "HobbleSkirt";
			InventoryWear(Player, Bondage, "ItemLegs", RandomColor);
		}

		// Gag
		RandomNumber = Math.floor(Math.random() * 6);
		if (RandomNumber >= 0) Bondage = "HarnessBallGag";
		if (RandomNumber >= 1) Bondage = "CarrotGag";
		if (RandomNumber >= 2) Bondage = "MuzzleGag";
		if (RandomNumber >= 3) Bondage = "NeckCorsetGag";
		if (RandomNumber >= 4) Bondage = "DildoGag";
		if (RandomNumber >= 5) Bondage = "PumpGag";
		InventoryWear(Player, Bondage, "ItemMouth", RandomColor);

		if (Bondage == "PumpGag") {
			RandomNumber = Math.floor(Math.random() * 4);
			if (RandomNumber >= 0) Form = 1;
			if (RandomNumber >= 1) Form = 2;
			if (RandomNumber >= 2) Form = 3;
			if (RandomNumber >= 3) Form = 4;
			DialogExtendItem(InventoryGet(Player, "ItemMouth"));
			InventoryItemMouthPumpGagSetPump(Form);
			CharacterLoadEffect(Player);
		}
	}

	if (Style == "Heavy") {
		
		// Arms
		RandomNumber = Math.floor(Math.random() * 4);
		if (RandomNumber >= 0) Bondage = "LeatherArmbinder";
		if (RandomNumber >= 1) Bondage = "StraitJacket";
		if (RandomNumber >= 2) Bondage = "BitchSuit";
		if (RandomNumber >= 3) Bondage = "StraitDressOpen";
		if (RandomNumber >= 2) RandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		InventoryWear(Player, Bondage, "ItemArms", RandomColor, 20);
		
		if (Bondage == "StraitJacket") {
			DialogExtendItem(InventoryGet(Player, "ItemArms"));
			InventoryItemArmsStraitJacketSetPose("Snug")
		}

		// Legs
		if (Bondage != "BitchSuit") {
			RandomNumber = Math.floor(Math.random() * 4);
			if (RandomNumber >= 0) Bondage = "LeatherLegCuffs";
			if (RandomNumber >= 1) Bondage = "LeatherBelt";
			if (RandomNumber >= 2) Bondage = "LegBinder";
			if (RandomNumber >= 3) Bondage = "HobbleSkirt";
			if (RandomNumber >= 2) RandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
			else RandomColor = null;
			InventoryWear(Player, Bondage, "ItemLegs", RandomColor);

			if (Bondage == "LeatherLegCuffs") {
				DialogExtendItem(InventoryGet(Player, "ItemLegs"));
				InventoryItemLegsLeatherLegCuffsSetPose("Closed");
			}
		}

		// Gag
		RandomNumber = Math.floor(Math.random() * 7);
		if (RandomNumber >= 0) Bondage = "HarnessPanelGag";
		if (RandomNumber >= 1) Bondage = "PumpGag";
		if (RandomNumber >= 2) Bondage = "MuzzleGag";
		if (RandomNumber >= 3) Bondage = "NeckCorsetGag";
		if (RandomNumber >= 4) Bondage = "PlugGag";
		if (RandomNumber >= 5) Bondage = "DildoGag";
		if (RandomNumber >= 6) Bondage = "HarnessBallGag1";
		InventoryWear(Player, Bondage, "ItemMouth");

		if (Bondage == "PumpGag") {
			RandomNumber = Math.floor(Math.random() * 2);
			if (RandomNumber >= 0) Form = 3;
			if (RandomNumber >= 1) Form = 4;
			DialogExtendItem(InventoryGet(Player, "ItemMouth"));
			InventoryItemMouthPumpGagSetPump(Form);
			CharacterLoadEffect(Player);
		}

		if (Bondage == "PlugGag") {
			DialogExtendItem(InventoryGet(Player, "ItemMouth"));
			InventoryItemMouthPlugGagSetType("Plug");
		}

		// Head
		RandomNumber = Math.floor(Math.random() * 15);
		if (RandomNumber >= 4) Bondage = "LeatherBlindfold";
		if (RandomNumber >= 5) Bondage = "StuddedBlindfold";
		if (RandomNumber >= 6) Bondage = "SmallBlindfold";
		if (RandomNumber >= 7) Bondage = "FullBlindfold";
		if (RandomNumber >= 8) Bondage = "LeatherHood";
		if (RandomNumber >= 9) Bondage = "LeatherHoodOpenEyes";
		if (RandomNumber >= 10) Bondage = "LeatherHoodOpenMouth";
		if (RandomNumber >= 11) Bondage = "LeatherHoodSensDep";
		if (RandomNumber >= 12) Bondage = "LeatherHoodSealed";
		if (RandomNumber >= 8) InventoryWear(Player, Bondage, "ItemHood");
		if (RandomNumber >= 4 && RandomNumber < 8) InventoryWear(Player, Bondage, "ItemHead");
		
		// Locks
		InventoryFullLockRandom(Player);
	}

	CharacterRefresh(Player);
}

// Player is bound securely for serving
function CafeRamdomBound () {
	if (InventoryGet(Player, "ItemArms") == null) DialogWearRandomItem("ItemArms");
	if (InventoryGet(Player, "ItemLegs") == null) DialogWearRandomItem("ItemLegs");
	if (InventoryGet(Player, "ItemMouth") == null) DialogWearRandomItem("ItemMouth");
	InventorySetDifficulty(Player, "ItemArms", 17);
	CafeRefillTray();
}

// The maid re stocks players serving tray
function CafeRefillTray() {
	if (MaidQuartersOnlineDrinkCount >= 4) ReputationProgress("Maid", 4);								// bonus rep on refill if served enough
	MaidQuartersOnlineDrinkValue = MaidQuartersOnlineDrinkValue + (MaidQuartersOnlineDrinkCount * 3)	// top up equiverlant to basic pay for serving a tray + a small bonus
	MaidQuartersOnlineDrinkCount = 0;																	// Refill try ready to serve again.
	MaidQuartersOnlineDrinkCustomer = [];																// Allow serving the previous customers again.
	InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");											// Make sure tray is not empty.
}

// Maid uses toy on Player
function CafeGivenDildo() {
	InventoryWear(Player, "InflatableVibeDildo", "ItemVulva");
}

// Maid turns player's Vibe up to moderate
function CafeTurnDildoUp() {
	DialogExtendItem(InventoryGet(Player, "ItemVulva"));
	InventoryItemVulvaInflatableVibeDildoSetIntensity(1);
	CafeVibeIncreased = true;
}
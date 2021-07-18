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

/**
 * CHecks, if the player can be served
 * @returns {boolean} - Returns true, if the player can be served, false otherwise
 */
function CafeMaidCanServe() { return (!CafeMaid.IsRestrained() && !Player.IsRestrained()); }

/**
 * Checks, if the maid from the cafe can serve the player
 * @returns {boolean} - Returns true, if the maid is able to serve, false otherwise
 */
function CafeMaidCannotServe() { return (CafeMaid.IsRestrained()); }

/**
 * Checks, if the player is able to consume a dring
 * @returns {boolean} - Returns true, if player and maid are unrestrained, false otherwise
 */
function CafePlayerCannotConsume() { return (!CafeMaid.IsRestrained() && Player.IsRestrained()); }

/**
 * CHecks, if the player has completed the only serving task
 * @returns {boolean} - Returns true, if the player is done, false otherwise
 */
function CafeOnlineDrinkCompleted() { return (MaidQuartersOnlineDrinkCount >= 5); }

/**
 * Checks, if the player is a head maid and gagged
 * @returns {boolean} - Returns true, if the player is a head maid and gagged
 */
function CafeIsGaggedHeadMaid() { return (!Player.CanTalk() && CafeIsHeadMaid && !Player.IsBlind()); }

/**
 * Checks if the player is gagged and an experienced maid (reputation higher than 50)
 * @returns {boolean} - Returns true, if the player is gagged and a senior maid, false otherwise
 */
function CafeIsGaggedSeniorMaid() { return (!Player.CanTalk() && !CafeIsHeadMaid && ReputationGet("Maid") >= 50 && !Player.IsBlind()); }

/**
 * Checks if the player is gagged and an ordinary maid
 * @returns {boolean} - Returns true if the player is gagged and an ordinary maid, false otherwise
 */
function CafeIsGaggedMaid() { return (!Player.CanTalk() && !CafeIsHeadMaid && ReputationGet("Maid") > 50 && !Player.IsBlind()); }

/**
 * Checks if the player is an experinced maid, but no head maid
 * @returns {boolean} - Returns true, if the player is no head maid and has a reputation of more than 50, false otherwise
 */
function CafeIsMaidChoice() { return (ReputationGet("Maid") >= 50 && !CafeIsHeadMaid); }

/**
 * Checks, if the player is an ordinary maid
 * @returns {boolean} - Returns true if the player is no head maid and has a reputation of less than 50
 */
function CafeIsMaidNoChoice() { return (ReputationGet("Maid") < 50 && !CafeIsHeadMaid); }

/**
 * Checks, if a dildo can be applied to the player
 * @returns {boolean} - Returns true, if a dildo can be applied, false otherwise
 */
function CafeCanDildo() { return (!Player.IsVulvaChaste() && InventoryGet(Player, "ItemVulva") == null); }

/**
 * Checks, if the player aked for a certain speciality
 * @param {string} Type - The type of cafe speciality
 * @returns {boolean} - Returns true, if the player asked for a given speciality, false otherwise
 */
function CafeEquired(Type) { return (Type == CafeAskedFor); }

//
/**
 * Loads the Cafe room and initializes the NPCs. This function is called dynamically
 * @returns {void} - Nothing
 */
function CafeLoad() {
	CafeMaid = CharacterLoadNPC("NPC_Cafe_Maid");
	CafeIsMaid = LogQuery("JoinedSorority", "Maid");
	CafeIsHeadMaid = LogQuery("LeadSorority", "Maid");
	CafeMaid.AllowItem = CafeIsHeadMaid;
}

/**
 * Run the Cafe room and draw characters. This function is called dynamically at short intervals.
 * Don't use expensive loops or functions from here
 * @returns {void} - Nothing
 */
function CafeRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CafeMaid, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function CafeClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) {
		if (MaidQuartersMaid != null) {
			if ((MaidQuartersMaid.Stage == "285" || MaidQuartersMaid.Stage == "286") && InventoryGet(Player, "ItemMisc") && (InventoryGet(Player, "ItemMisc").Asset.Name == "WoodenMaidTrayFull" || InventoryGet(Player, "ItemMisc").Asset.Name == "WoodenMaidTray")) {
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
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the player asks for a special, she is told the price
 * @param {string} Item - The special the player asks for
 */
function CafeEquirePrice(Item) {
	CafeAskedFor = Item;
	if (CafeAskedFor == "EnergyDrink") CafePrice = CafeEnergyDrinkPrice;
	if (CafeAskedFor == "GlassMilk") CafePrice = CafeGlassMilkPrice;
	if (CafeAskedFor == "Cupcake") CafePrice = CafeCupcakePrice;
	CafeMaid.CurrentDialog = CafeMaid.CurrentDialog.replace("REPLACEMONEY", CafePrice.toString());

}

/**
 * The player consumes a speciality. The money is subtracted and the effect applied
 * @returns {void} - Nothing
 */
function CafeConsumeSpeciiality() {
	if (Player.Money < CafePrice)  {
		CafeMaid.CurrentDialog = DialogFind(CafeMaid, "NotEnoughMoney");
	}
	else {
		CharacterChangeMoney(Player, CafePrice * -1);
		if (!LogQuery("ModifierDuration", "SkillModifier")) LogAdd("ModifierLevel", "SkillModifier", 0);
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
			// No effect
		}
	}
}

//
/**
 * The cafe maid applies chosen bondage
 * @param {"Shibari" | "Tape" | "Leather" | "Latex" | "Heavy"} Style - The style of bondage chosen by the player
 * @returns {void} - Nothing
 */
function CafeServiceBound(Style) {
	var RandomNumber = 0;
	var RandomColor = null;
	var Bondage = null;
	var Form = null;
	var Option = null;

	CharacterRelease(Player);

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
			TypedItemSetRandomOption(Player, "ItemMouth");
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
        Player.FocusGroup = AssetGroupGet("Female3DCG", "ItemLegs");
        DialogExtendItem(InventoryGet(Player, "ItemLegs"));
        Option = CommonRandomItemFromList(null, InventoryItemLegsDuctTapeOptions);
        ExtendedItemSetType(Player, InventoryItemLegsDuctTapeOptions, Option);

        // Gag Sub Type
		TypedItemSetRandomOption(Player, "ItemMouth");
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
			TypedItemSetRandomOption(Player, "ItemArms");
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
            Player.FocusGroup = AssetGroupGet("Female3DCG", "ItemLegs");
			DialogExtendItem(InventoryGet(Player, "ItemLegs"));
			const Option = InventoryItemLegsLeatherLegCuffsOptions.find(O => O.Name === "Closed");
			ExtendedItemSetType(Player, InventoryItemLegsLeatherLegCuffsOptions, Option);
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
			TypedItemSetRandomOption(Player, "ItemMouth");
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
			TypedItemSetRandomOption(Player, "ItemArms");
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
                Player.FocusGroup = AssetGroupGet("Female3DCG", "ItemLegs");
				DialogExtendItem(InventoryGet(Player, "ItemLegs"));
				const Option = InventoryItemLegsLeatherLegCuffsOptions.find(O => O.Name === "Closed");
				ExtendedItemSetType(Player, InventoryItemLegsLeatherLegCuffsOptions, Option);
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
			TypedItemSetRandomOption(Player, "ItemMouth");
		}

		if (Bondage == "PlugGag") {
			TypedItemSetRandomOption(Player, "ItemMouth");
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
	Player.FocusGroup = undefined;
}

/**
 * Make sure the player is bound securely for serving
 * @returns {void} - Nothing
 */
function CafeRamdomBound() {
	if (InventoryGet(Player, "ItemArms") == null) DialogWearRandomItem("ItemArms");
	if (InventoryGet(Player, "ItemLegs") == null) DialogWearRandomItem("ItemLegs");
	if (InventoryGet(Player, "ItemMouth") == null) DialogWearRandomItem("ItemMouth");
	InventorySetDifficulty(Player, "ItemArms", 17);
	CafeRefillTray();
}

/**
 * The maid re-stocks the player's serving tray
 * @returns {void} - Nothing
 */
function CafeRefillTray() {
	if (MaidQuartersOnlineDrinkCount >= 4) ReputationProgress("Maid", 4);								// bonus rep on refill if served enough
	MaidQuartersOnlineDrinkValue = MaidQuartersOnlineDrinkValue + (MaidQuartersOnlineDrinkCount * 3);	// top up equiverlant to basic pay for serving a tray + a small bonus
	MaidQuartersOnlineDrinkCount = 0;																	// Refill try ready to serve again.
	MaidQuartersOnlineDrinkCustomer = [];																// Allow serving the previous customers again.
	InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");											// Make sure tray is not empty.
}

/**
 * The maid uses toy on the player
 * @returns {void} - Nothing
 */
function CafeGivenDildo() {
	InventoryWear(Player, "InflatableVibeDildo", "ItemVulva");
}

/**
 * Maid turns player's Vibe up to moderate
 * @returns {void} - Nothing
 */
function CafeTurnDildoUp() {
	DialogExtendItem(InventoryGet(Player, "ItemVulva"));
	InventoryItemButtInflVibeButtPlugSetIntensity(1);
	CafeVibeIncreased = true;
}

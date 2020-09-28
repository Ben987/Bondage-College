"use strict";
var PlayerAuctionBackground = "SlaveMarketDark";
var PlayerAuctionCustomer = null;
var PlayerAuctionBidCurrent = -1;
var PlayerAuctionBidTime = 0;
var PlayerAuctionBidNextTime = 0;
var PlayerAuctionBidAmount = 0;
var PlayerAuctionPlead = 0;
var PlayerAuctionSilenceMode = false;
var PlayerAuctionEnd = false;

/**
 * Sets when the next bid will occur. It varies from 5 to 15 seconds, the auction gets slower and there are less bids the higher the price is.
 * @returns {void} - Nothing
 */
function PlayerAuctionSetNextBidTime() {
	PlayerAuctionSilenceMode = false;
	var Rep = (200 - (ReputationGet("Dominant") * -1)) / 200;
	if (PlayerAuctionBidAmount == 0) PlayerAuctionBidNextTime = CurrentTime + 3000 + (Math.random() * 3000);
	if ((PlayerAuctionBidAmount > 0) && (PlayerAuctionBidAmount < 50)) PlayerAuctionBidNextTime = (Math.random() >= 0.12 * Rep) ? CurrentTime + 3000 + (Math.random() * 5000) : -1;
	if ((PlayerAuctionBidAmount >= 50) && (PlayerAuctionBidAmount < 100)) PlayerAuctionBidNextTime = (Math.random() >= 0.24 * Rep) ? CurrentTime + 5000 + (Math.random() * 8000) : -1;
	if ((PlayerAuctionBidAmount >= 100) && (PlayerAuctionBidAmount < 200)) PlayerAuctionBidNextTime = (Math.random() >= 0.36 * Rep) ? CurrentTime + 5000 + (Math.random() * 10000) : -1;
	if ((PlayerAuctionBidAmount >= 200) && (PlayerAuctionBidAmount < 300)) PlayerAuctionBidNextTime = (Math.random() >= 0.48 * Rep) ? CurrentTime + 5000 + (Math.random() * 10000) : -1;
	if (PlayerAuctionBidAmount >= 300) PlayerAuctionBidNextTime = (Math.random() >= 0.60 * Rep) ? CurrentTime + 8000 + (Math.random() * 7000) : -1;
}

/**
 * Creates a new customer to buy the player
 * @returns {void} - Nothing
 */
function PlayerAuctionAddCustomer(Index) {
	var Customer = CharacterLoadNPC("NPC_Customer_" + Index.toString());
	CharacterAppearanceFullRandom(Customer);
	if (Math.random() > 0.85) { CharacterArchetypeClothes(Customer, "Mistress"); Customer.Archetype = "Mistress"; }
	else if (Math.random() > 0.9) { CharacterArchetypeClothes(Customer, "Maid"); Customer.Archetype = "Maid"; }
	PlayerAuctionCustomer.push(Customer);
}

/**
 * Loads the player auction mini game by setting the global variables and loading the NPCs required
 * @returns {void} - Nothing
 */
function PlayerAuctionLoad() {
	PlayerAuctionCustomer = [];
	PlayerAuctionAddCustomer(0);
	PlayerAuctionAddCustomer(1);
	PlayerAuctionAddCustomer(2);
	PlayerAuctionBidCurrent = -1;
	PlayerAuctionBidTime = CurrentTime;
	PlayerAuctionSetNextBidTime();
	PlayerAuctionBidAmount = 0;
	PlayerAuctionPlead = 0;
	PlayerAuctionSilenceMode = false;
	PlayerAuctionEnd = false;
}

/**
 * Runs the player auction mini game by drawing the characters and related text on screen.
 * @returns {void} - Nothing
 */
function PlayerAuctionRun() {

	// Draw the characters
	DrawCharacter(SlaveMarketMistress, -25, 100, 0.9);
	DrawCharacter(Player, 375, 100, 0.9);
	DrawCharacter(PlayerAuctionCustomer[0], 775, 100, 0.9);
	DrawCharacter(PlayerAuctionCustomer[1], 1175, 100, 0.9);
	DrawCharacter(PlayerAuctionCustomer[2], 1575, 100, 0.9);
	
	// Draw the bid info
	DrawText(TextGet("CurrentBid") + " " + PlayerAuctionBidAmount.toString() + "$", 600, 75, "White", "Black");
	if (PlayerAuctionBidCurrent == -1) DrawText(TextGet("HighestBidder") + " " + TextGet("Nobody"), 600, 125, "White", "Black");
	else DrawText(TextGet("HighestBidder") + " " + TextGet("Customer" + PlayerAuctionBidCurrent.toString()), 600, 125, "White", "Black");

	// If we must draw the "I bid X$" bubble
	if ((PlayerAuctionBidTime >= CurrentTime - 3000) && (PlayerAuctionBidCurrent != -1)) {
		var X = 800 + PlayerAuctionBidCurrent * 400;
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", X, 16);
		DrawText(TextGet("IBid") + " " + PlayerAuctionBidAmount + "$", X + 225, 53, "Black", "Gray");
	}

	// If we must draw the "Do I hear $" bubble
	if ((PlayerAuctionBidTime <= CurrentTime - 4000) && (PlayerAuctionBidTime >= CurrentTime - 9000) && !PlayerAuctionSilenceMode) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 0, 16);
		DrawText(TextGet("DoIHear") + " " + (PlayerAuctionBidAmount + 10).toString() + "$ ?", 200, 53, "Black", "Gray");
	}

	// If we must draw the "Silence!  X$ ?" bubble
	if ((PlayerAuctionBidTime >= CurrentTime - 9000) && PlayerAuctionSilenceMode) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 0, 16);
		DrawText(TextGet("Silence") + " " + (PlayerAuctionBidAmount + 10).toString() + "$ ?", 200, 53, "Black", "Gray");
	}

	// If we must draw the "Going once" bubble
	if ((PlayerAuctionBidTime <= CurrentTime - 9000) && (PlayerAuctionBidTime >= CurrentTime - 12000)) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 0, 16);
		DrawText(TextGet("GoingOnce"), 200, 53, "Black", "Gray");
	}

	// If we must draw the "Going twice" bubble
	if ((PlayerAuctionBidTime <= CurrentTime - 12000) && (PlayerAuctionBidTime >= CurrentTime - 15000)) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 0, 16);
		DrawText(TextGet("GoingTwice"), 200, 53, "Black", "Gray");
	}

	// The auction ends after 15 seconds
	if (PlayerAuctionBidTime <= CurrentTime - 15000) {
		PlayerAuctionEnd = true;
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 0, 16);
		DrawText(TextGet("Sold"), 200, 53, "Black", "Gray");
	}

	// If a new bid happens, we raise the amount and there's a 90% chance of another bid
	if ((CurrentTime >= PlayerAuctionBidNextTime) && (PlayerAuctionBidNextTime != -1)) {
		PlayerAuctionSetNextBidTime();
		if (PlayerAuctionBidCurrent == -1) PlayerAuctionBidCurrent = Math.floor(Math.random() * 3);
		else if (PlayerAuctionBidCurrent == 0) PlayerAuctionBidCurrent = (Math.random() > 0.5) ? 1 : 2;
		else if (PlayerAuctionBidCurrent == 1) PlayerAuctionBidCurrent = (Math.random() > 0.5) ? 0 : 2;
		else PlayerAuctionBidCurrent = (Math.random() > 0.5) ? 0 : 1;
		PlayerAuctionBidAmount = PlayerAuctionBidAmount + 10;
		PlayerAuctionBidTime = CurrentTime;
	}

	// Draw the buttons
	if ((PlayerAuctionPlead <= 1) && !PlayerAuctionEnd && (PlayerAuctionBidTime <= CurrentTime - 4000) && (PlayerAuctionBidTime >= CurrentTime - 15000)) DrawButton(500, 800, 200, 65, TextGet("Plead"), "White");
	if (PlayerAuctionEnd) DrawButton(500, 800, 200, 65, TextGet("Return"), "White");

}

/**
 * Handles click events during the player auction minigame. The player can plead or end the auction.
 * @returns {void} - Nothing
 */
function PlayerAuctionClick() {

	// Twice per auction, the player can try to influence the buyers, on the second time she gets gagged
	if (MouseIn(500, 800, 200, 65) && (PlayerAuctionPlead <= 1) && !PlayerAuctionEnd && (PlayerAuctionBidTime <= CurrentTime - 4000) && (PlayerAuctionBidTime >= CurrentTime - 15000)) {
		PlayerAuctionSetNextBidTime();
		PlayerAuctionPlead++;
		PlayerAuctionSilenceMode = true;
		if (PlayerAuctionPlead >= 2) {
			InventoryWearRandom(Player, "ItemMouth");
			InventoryWearRandom(Player, "ItemArms");
		}
		PlayerAuctionBidTime = CurrentTime - 3001;
	}

	// When the auction can end
	if (MouseIn(500, 800, 200, 65) && PlayerAuctionEnd) CommonDynamicFunction(MiniGameReturnFunction + "()");

}
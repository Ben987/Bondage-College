"use strict";
var SlaveAuctionBackground = "SlaveMarketDark";
var SlaveAuctionVendor = null;
var SlaveAuctionSlave = null;
var SlaveAuctionCustomerLeft = null;
var SlaveAuctionCustomerRight = null;
var SlaveAuctionBidCurrent = ""; 
var SlaveAuctionBidTime = 0;
var SlaveAuctionBidNextTime = 0;
var SlaveAuctionBidAmount = 0;
var SlaveAuctionEnd = false;

// The next bid will occur between 5 and 15 seconds, the auction gets slower and there's less biddings when the price is high
function SlaveAuctionSetNextBidTime() {
	if (SlaveAuctionBidAmount == 0) SlaveAuctionBidNextTime = CurrentTime + 3000 + (Math.random() * 3000);
	if ((SlaveAuctionBidAmount > 0) && (SlaveAuctionBidAmount < 50)) SlaveAuctionBidNextTime = (Math.random() >= 0.04) ? CurrentTime + 3000 + (Math.random() * 5000) : -1;
	if ((SlaveAuctionBidAmount >= 50) && (SlaveAuctionBidAmount < 100)) SlaveAuctionBidNextTime = (Math.random() >= 0.08) ? CurrentTime + 5000 + (Math.random() * 8000) : -1;
	if ((SlaveAuctionBidAmount >= 100) && (SlaveAuctionBidAmount < 200)) SlaveAuctionBidNextTime = (Math.random() >= 0.12) ? CurrentTime + 5000 + (Math.random() * 10000) : -1;
	if (SlaveAuctionBidAmount >= 200) SlaveAuctionBidNextTime = (Math.random() >= 0.16) ? CurrentTime + 8000 + (Math.random() * 7000) : -1;
}

// Loads the slave auction mini game
function SlaveAuctionLoad() {
	SlaveAuctionCustomerLeft = CharacterLoadNPC("NPC_Customer_Left");
	CharacterAppearanceFullRandom(SlaveAuctionCustomerLeft);
	SlaveAuctionCustomerRight = CharacterLoadNPC("NPC_Customer_Right");
	CharacterAppearanceFullRandom(SlaveAuctionCustomerRight);
	SlaveAuctionBidCurrent = "";
	SlaveAuctionBidTime = CurrentTime;
	SlaveAuctionSetNextBidTime();
	SlaveAuctionBidAmount = 0;
	SlaveAuctionEnd = false;
}

// Run the slave auction mini game
function SlaveAuctionRun() {

	// Draw the characters
	DrawCharacter(SlaveAuctionCustomerLeft, -25, 100, 0.9);
	DrawCharacter(Player, 375, 100, 0.9);
	DrawCharacter(SlaveAuctionSlave, 775, 100, 0.9);
	DrawCharacter(SlaveAuctionVendor, 1175, 100, 0.9);
	DrawCharacter(SlaveAuctionCustomerRight, 1575, 100, 0.9);
	
	// Draw the bid info over the slave
	DrawText(TextGet("CurrentBid") + " " + SlaveAuctionBidAmount.toString() + "$", 1000, 75, "White", "Black");
	if (SlaveAuctionBidCurrent == "") DrawText(TextGet("HighestBidder") + " " + TextGet("Nobody"), 1000, 125, "White", "Black");
	else if (SlaveAuctionBidCurrent == "Player") DrawText(TextGet("HighestBidder") + " " + TextGet("You"), 1000, 125, "White", "Black");
	else DrawText(TextGet("HighestBidder") + " " + TextGet("SomeoneElse"), 1000, 125, "White", "Black");
	DrawText(TextGet("YourMoney") + " " + Player.Money.toString() + "$", 1000, 175, "White", "Black");
	
	// If we must draw the "I bid X$" bubble
	if ((SlaveAuctionBidTime >= CurrentTime - 3000) && (SlaveAuctionBidCurrent != "")) {		
		var X = -25;
		if (SlaveAuctionBidCurrent == "Player") X = 375;
		if (SlaveAuctionBidCurrent == "Right") X = 1575;
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", X, 16);
		DrawText(TextGet("IBid") + " " + SlaveAuctionBidAmount + "$", X + 225, 53, "Black", "Gray");
	}

	// If we must draw the "Do I hear $" bubble
	if ((SlaveAuctionBidTime <= CurrentTime - 4000) && (SlaveAuctionBidTime >= CurrentTime - 9000)) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1175, 16);
		DrawText(TextGet("DoIHear") + " " + (SlaveAuctionBidAmount + 10).toString() + "$ ?", 1400, 53, "Black", "Gray");
	}

	// If we must draw the "Going once" bubble
	if ((SlaveAuctionBidTime <= CurrentTime - 9000) && (SlaveAuctionBidTime >= CurrentTime - 12000)) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1175, 16);
		DrawText(TextGet("GoingOnce"), 1400, 53, "Black", "Gray");
	}

	// If we must draw the "Going twice" bubble
	if ((SlaveAuctionBidTime <= CurrentTime - 12000) && (SlaveAuctionBidTime >= CurrentTime - 15000)) {
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1175, 16);
		DrawText(TextGet("GoingTwice"), 1400, 53, "Black", "Gray");
	}

	// The auction ends after 15 seconds
	if (SlaveAuctionBidTime <= CurrentTime - 15000) {
		SlaveAuctionEnd = true;
		DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Bubble.png", 1175, 16);
		DrawText(TextGet("Sold"), 1400, 53, "Black", "Gray");
	}

	// If a new bid happens, we raise the amount and there's a 90% chance of another bid
	if ((CurrentTime >= SlaveAuctionBidNextTime) && (SlaveAuctionBidNextTime != -1)) {
		SlaveAuctionSetNextBidTime();
		if ((SlaveAuctionBidCurrent == "") || (SlaveAuctionBidCurrent == "Player")) SlaveAuctionBidCurrent = (Math.random() >= 0.5) ? "Right" : "Left";
		else SlaveAuctionBidCurrent = (SlaveAuctionBidCurrent == "Left") ? "Right" : "Left";
		SlaveAuctionBidAmount = SlaveAuctionBidAmount + 10;
		SlaveAuctionBidTime = CurrentTime;
	}

	// Draw the buttons
	if (!SlaveAuctionEnd && (SlaveAuctionBidCurrent != "Player") && (Player.Money >= SlaveAuctionBidAmount + 10)) DrawButton(800, 235, 175, 65, TextGet("Bid"), "White");
	if ((SlaveAuctionBidCurrent != "Player") || SlaveAuctionEnd) DrawButton(1025, 235, 175, 65, TextGet((SlaveAuctionEnd) ? "Return" : "GiveUp"), "White");

}

// When the player clicks on the slave auction screen, she can bid or end the auction
function SlaveAuctionClick() {
	if (!SlaveAuctionEnd && (SlaveAuctionBidCurrent != "Player") && (Player.Money >= SlaveAuctionBidAmount + 10) && (MouseX >= 800) && (MouseX < 975) && (MouseY >= 235) && (MouseY < 300)) {
		SlaveAuctionSetNextBidTime();
		SlaveAuctionBidCurrent = "Player";
		SlaveAuctionBidAmount = SlaveAuctionBidAmount + 10;
		SlaveAuctionBidTime = CurrentTime;
	}
	if (((SlaveAuctionBidCurrent != "Player") || SlaveAuctionEnd) && (MouseX >= 1025) && (MouseX < 1200) && (MouseY >= 235) && (MouseY < 300))
		CommonDynamicFunction(MiniGameReturnFunction + "()");
}
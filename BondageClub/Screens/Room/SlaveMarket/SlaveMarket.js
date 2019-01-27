"use strict";
var SlaveMarketBackground = "SlaveMarket";
var SlaveMarketAuctioneer = null;
var SlaveMarketTrader = null;

// Loads the Slave Market room
function SlaveMarketLoad() {
	SlaveMarketAuctioneer = CharacterLoadNPC("NPC_SlaveMarket_Auctioneer");
	SlaveMarketAuctioneer.AllowItem = false;
	SlaveMarketTrader = CharacterLoadNPC("NPC_SlaveMarket_Trader");
	SlaveMarketTrader.AllowItem = false;
}

// Run the Slave Market
function SlaveMarketRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(SlaveMarketAuctioneer, 750, 0, 1);
	DrawCharacter(SlaveMarketTrader, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the Slave Market
function SlaveMarketClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(SlaveMarketAuctioneer);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(SlaveMarketTrader);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}
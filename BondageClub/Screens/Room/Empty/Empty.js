"use strict";
var EmptyBackground = "MainHall";
var EmptyCharacter = [];
var EmptyCharacterOffset = 0;

// When used in struggle mode
function EmptyStruggleSuccess() { return (!Player.IsRestrained() && Player.CanTalk() && (CurrentTime < ManagementTimer)) }
function EmptyStruggleFail() { return (CurrentTime >= ManagementTimer) }
function EmptyStruggleProgress() { return ((Player.IsRestrained() || !Player.CanTalk()) && (CurrentTime < ManagementTimer)) }
function EmptySlaveMarketReadyForBondageTraining() { return (Player.CanInteract() && !CurrentCharacter.CanTalk() && CurrentCharacter.IsBlind() && !CurrentCharacter.CanInteract() && !CurrentCharacter.CanWalk()) }

// Loads the empty room screen
function EmptyLoad() {
}

// Run the empty room screen
function EmptyRun() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		DrawCharacter(EmptyCharacter[C], 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset, 0, 1);
}

// When the user clicks in the empty room screen
function EmptyClick() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		if ((MouseX >= 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseX < 1500 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseY >= 0) && (MouseY < 1000)) 
			CharacterSetCurrent(EmptyCharacter[C]);
}

// Returns to the main hall
function EmptyManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// Locks the player in a cell for 5 minutes
function EmptyManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}

// Release the player from the item applied by the shop vendor
function EmptyShopRelease() {
	InventoryRemove(Player, ShopDemoItemGroup);
	DialogChangeReputation("Dominant", -1);
}

// Release the player from the item applied by the shop vendor
function EmptyShopEnd(Sold) {
	Sold = (Sold == "true");
	ShopVendor.Stage = (Sold) ? "33" : "34";
	if (Sold) CharacterChangeMoney(Player, ShopDemoItemPayment);
	DialogLeave();
	CommonSetScreen("Room", "Shop");
	CharacterSetCurrent(ShopVendor);
	ShopVendor.CurrentDialog = DialogFind(ShopVendor, (Sold) ? "ItemSold" : "ItemNotSold").replace("MoneyAmount", ShopDemoItemPayment.toString());
	CharacterAppearanceFullRandom(ShopCustomer, false);
	CharacterRandomName(ShopCustomer)
}

// When the slave market training starts
function EmptySlaveMarketTrainingStart(TrainingType) {
	CurrentCharacter.CurrentTraining = parseInt(TrainingType);
}

// Returns TRUE if the intensity level matches the level to test
function EmptySlaveMarketTrainingLevelIs(TestLevel) {
	if ((TestLevel == "Lowest") && (CurrentCharacter.TrainingIntensity <= 1)) return true;
	if ((TestLevel == "Low") && (CurrentCharacter.TrainingIntensity >= 2) && (CurrentCharacter.TrainingIntensity <= 3)) return true;
	if ((TestLevel == "Perfect") && (CurrentCharacter.TrainingIntensity >= 4) && (CurrentCharacter.TrainingIntensity <= 6)) return true;
	if ((TestLevel == "High") && (CurrentCharacter.TrainingIntensity >= 7) && (CurrentCharacter.TrainingIntensity <= 8)) return true;
	if ((TestLevel == "Highest") && (CurrentCharacter.TrainingIntensity >= 9)) return true;
	return false;
}

// When the training progresses
function EmptySlaveMarketTrainingProgress(Intensity) {
	
	// Intensity of activity gets added minus from 0 to 3 of random decay
	CurrentCharacter.TrainingIntensity = CurrentCharacter.TrainingIntensity + parseInt(Intensity) - Math.floor(Math.random() * 4);
	if (CurrentCharacter.TrainingIntensity < 0) CurrentCharacter.TrainingIntensity = 0;
	if (CurrentCharacter.TrainingIntensity > 10) CurrentCharacter.TrainingIntensity = 10;
	CurrentCharacter.TrainingCount++;
	
	// Between 4 and 6 intensity is the sweet spot where training is successful
	if (CurrentCharacter.TrainingIntensity <= 3) CurrentCharacter.TrainingCountLow++;
	if ((CurrentCharacter.TrainingIntensity >= 4) && (CurrentCharacter.TrainingIntensity <= 6)) CurrentCharacter.TrainingCountPerfect++;
	if (CurrentCharacter.TrainingIntensity >= 7) CurrentCharacter.TrainingCountHigh++;
	
	// When training is over, we take a different path depending if it was too soft, too rough or perfect
	if (CurrentCharacter.TrainingCount == 10) {
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "TrainingEnd");
		if (CurrentCharacter.CurrentTraining != CurrentCharacter.ExpectedTraining) CurrentCharacter.Stage = "1930";
		else if ((CurrentCharacter.TrainingCountPerfect >= CurrentCharacter.TrainingCountHigh) && (CurrentCharacter.TrainingCountPerfect >= CurrentCharacter.TrainingCountLow)) CurrentCharacter.Stage = "1900";
		else if (CurrentCharacter.TrainingCountHigh >= CurrentCharacter.TrainingCountLow) CurrentCharacter.Stage = "1910";
		else CurrentCharacter.Stage = "1920";
	}

}

// When the slave market training ends
function EmptySlaveMarketTrainingEnd(Status) {
	var Money = CurrentCharacter.TrainingCountPerfect * 3;
	DialogLeave();
	if (Status != "Success") DialogChangeReputation("Dominant", -2);
	else CharacterChangeMoney(Player, Money);
	CommonSetScreen("Room", "SlaveMarket");
	SlaveMarketMistress.CurrentDialog = DialogFind(SlaveMarketMistress, "Training" + Status).replace("MoneyAmount", Money.toString());
	SlaveMarketMistress.Stage = (Status == "Success") ? "42" : "43";
	CharacterDelete("NPC_SlaveMarket_SlaveToTrain");
	delete CommonCSVCache["Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_SlaveToTrain.csv"];
	CharacterSetCurrent(SlaveMarketMistress);
}

"use strict";
var EmptyBackground = "MainHall";
var EmptyCharacter = [];
var EmptyCharacterOffset = 0;

/**
 * Checks if the player struggled successfully within the allowed time
 * @returns {boolean} - Returns TRUE if the player managed to struggle out in time
 */
function EmptyStruggleSuccess() { return (!Player.IsRestrained() && Player.CanTalk() && (CurrentTime < ManagementTimer)) }
/**
 * Checks if the player has not managed to struggle out in time
 * @returns {boolean} - Returns TRUE if the player has failed to struggle out.
 */
function EmptyStruggleFail() { return (CurrentTime >= ManagementTimer) }
/**
 * Checks if the player is in struggle mode.
 * @returns {boolean} - Returns TRUE if the player still has time to try to struggle out.
 */
function EmptyStruggleProgress() { return ((Player.IsRestrained() || !Player.CanTalk()) && (CurrentTime < ManagementTimer)) }
/**
 * Checks if the player can do a bondage training.
 * @returns {boolean} - Whether the player is ready to do a bondage training or not.
 */
function EmptySlaveMarketReadyForBondageTraining() { return (Player.CanInteract() && !CurrentCharacter.CanTalk() && CurrentCharacter.IsBlind() && !CurrentCharacter.CanInteract() && !CurrentCharacter.CanWalk()) }

/**
 * Loads the empty room screen. Does nothing, required for future use and because it is called dynamically when loading the screen.
 * @returns {void} - Nothing
 */
function EmptyLoad() {
}

/**
 * Runs and draws the empty room screen, it will place each character inside the room evenly
 * @returns {void} - Nothing
 */
function EmptyRun() {
	for (let C = 0; C < EmptyCharacter.length; C++)
		DrawCharacter(EmptyCharacter[C], 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset, 0, 1);
}

/**
 * Handles clicks in the empty room screen
 * @returns {void} - Nothing
 */
function EmptyClick() {
	for (let C = 0; C < EmptyCharacter.length; C++)
		if ((MouseX >= 1000 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseX < 1500 - EmptyCharacter.length * 250 + C * 500 + EmptyCharacterOffset) && (MouseY >= 0) && (MouseY < 1000)) 
			CharacterSetCurrent(EmptyCharacter[C]);
}

/**
 * Used to return the player to the main hall from the empty room when in the management room
 * @returns {void} - Nothing
 */
function EmptyManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * Triggered when management sends the player in a cell for 5 minutes with full restraints on
 * @returns {void} - Nothing
 */
function EmptyManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}

/**
 * Releases the player from the item applied by the shop vendor at the start of the job
 * @returns {void} - Nothing
 */
function EmptyShopRelease() {
	InventoryRemove(Player, ShopDemoItemGroup);
	DialogChangeReputation("Dominant", -1);
}

/**
 * Releases the player from the item she was trying to sell, and sets the following dialog.
 * @param {string} Sold - Whether or not the item was sold, "true" if sold
 * @returns {void} - Nothing
 */
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

/**
 * Starts the slave training
 * @param {number} TrainingType - The type of training to do
 * @returns {void} - Nothing
 */
function EmptySlaveMarketTrainingStart(TrainingType) {
	CurrentCharacter.CurrentTraining = parseInt(TrainingType);
}

/**
 * Checks if the intensity of the training is on par with the required level
 * @param {string} TestLevel - Required level of intensity
 * @returns {boolean} - Returns TRUE if the intensity level matches the level to test
 */
function EmptySlaveMarketTrainingLevelIs(TestLevel) {
	if ((TestLevel == "Lowest") && (CurrentCharacter.TrainingIntensity <= 1)) return true;
	if ((TestLevel == "Low") && (CurrentCharacter.TrainingIntensity >= 2) && (CurrentCharacter.TrainingIntensity <= 3)) return true;
	if ((TestLevel == "Perfect") && (CurrentCharacter.TrainingIntensity >= 4) && (CurrentCharacter.TrainingIntensity <= 6)) return true;
	if ((TestLevel == "High") && (CurrentCharacter.TrainingIntensity >= 7) && (CurrentCharacter.TrainingIntensity <= 8)) return true;
	if ((TestLevel == "Highest") && (CurrentCharacter.TrainingIntensity >= 9)) return true;
	return false;
}

/**
 * Handles progressing through the slave market training
 * @param {number} Intensity - Intensity of the activity performed
 * @returns {void} - Nothing
 */
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

/**
 * Triggered when the slave market training ends
 * @param {string} Status - The status the game ended with, "Success" if won
 * @returns {void} - Nothing
 */
function EmptySlaveMarketTrainingEnd(Status) {
	var Money = CurrentCharacter.TrainingCountPerfect * 3;
	DialogLeave();
	if (Status != "Success") DialogChangeReputation("Dominant", -1);
	else {
		CharacterChangeMoney(Player, Money);
		IntroductionJobProgress("DomTrainer");
	}
	CommonSetScreen("Room", "SlaveMarket");
	SlaveMarketMistress.CurrentDialog = DialogFind(SlaveMarketMistress, "Training" + Status).replace("MoneyAmount", Money.toString());
	SlaveMarketMistress.Stage = (Status == "Success") ? "42" : "43";
	CharacterDelete("NPC_SlaveMarket_SlaveToTrain");
	delete CommonCSVCache["Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_SlaveToTrain.csv"];
	CharacterSetCurrent(SlaveMarketMistress);
}

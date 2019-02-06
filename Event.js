var EventLastRandomType = "";
var EventActivityCurrent = "";
var EventActivityCount = 0;
var EventActivityMaxCount = 0;
var EventList = ["Naked", "Underwear", "SchoolUniform", "RedBikini", "BlackDress", "WhiteLingerie", "Tennis", "FullBondage", "BondageHug", "Restrain", "Gag", "Release", "ConfiscateKeys", "ConfiscateCrop", "VibratingEgg", "Tickle", "Slap", "Masturbate", "Crop", "PushUp", "SitUp"];
var EventPunishmentList = ["Grounded", "Belted", "Spanked", "SleepBoundAndGagged", "Humiliated"];

// Returns TRUE if the event is accepted
function EventRandomChance(EventChanceModifier) {

	// Odds are 50% by default and we can add a modifier based on love/sub levels
	var EventChance = Math.floor(Math.random() * 100);
	if (EventChanceModifier == "Love") EventChance = EventChance + ActorGetValue(ActorLove);
	if (EventChanceModifier == "Hate") EventChance = EventChance - ActorGetValue(ActorLove);
	if (EventChanceModifier == "Dom") EventChance = EventChance + ActorGetValue(ActorSubmission);
	if (EventChanceModifier == "Sub") EventChance = EventChance - ActorGetValue(ActorSubmission);
	return (EventChance >= 50);

}

// Apply a submissive event on the player
function EventPlayerSubmissive(EventType) {
	OverridenIntroText = "";
	LeaveIcon = "";
	return parseInt(EventType);
}

// Sets the timer for the next generic event, the next one will be available between 5 and 10 minutes, the next forced one will be between 20 and 40 minutes
function EventSetGenericTimer() {
	GameLogAddTimer("EventGeneric", CurrentTime + 300000 + Math.floor(Math.random() * 300000));
	GameLogAddTimer("EventGenericNext", CurrentTime + 1200000 + Math.floor(Math.random() * 1200000));
}


// Draws a punishment event for the player at random
function EventRandomPlayerPunishment() {

	// Until we find a proper event
	OverridenIntroText = "";
	var Result = 0;
	while (Result == 0) {

		// Draw a punishment type at random
		var PunishmentType = EventPunishmentList[Math.floor(Math.random() * EventPunishmentList.length)];
		
		// If the event is valid for that actor
		var PunishmentStage = GetText("Punishment" + PunishmentType);
		if (IsNumeric(PunishmentStage)) {
		
			// Check if the event can be done
			if (PunishmentType == "Grounded") Result = parseInt(PunishmentStage);
			if ((PunishmentType == "Spanked") && !GameLogQuery(CurrentChapter, "", "EventSpanked")) Result = parseInt(PunishmentStage);
			if ((PunishmentType == "Belted") && !Common_PlayerChaste && PlayerHasInventory("ChastityBelt")) Result = parseInt(PunishmentStage);
			if ((PunishmentType == "SleepBoundAndGagged") && !GameLogQuery(CurrentChapter, "", "EventSleepBoundAndGagged")) Result = parseInt(PunishmentStage);
			if ((PunishmentType == "Humiliated") && !GameLogQuery(CurrentChapter, "", "EventHumiliated")) Result = parseInt(PunishmentStage);

		}

	}

	// Returns the punishment type which will become the dialog number
	return Result;		

}

// Draws a submissive event for the player at random (Launch from a Mistress Actor)
function EventRandomPlayerSubmissive() {

	// Until we find a proper event
	var Result = 0;
	while (Result == 0) {
	
		// Draw an event type at random, make sure it doesn't repeat
		var EventType = EventLastRandomType;
		while (EventType == EventLastRandomType)
			EventType = EventList[Math.floor(Math.random() * EventList.length)];
		
		// If the event is valid for that actor
		var EventStage = GetText("Event" + EventType);
		if (IsNumeric(EventStage)) {

			// Most event have requirements to work
			if ((EventType == "Naked") && !Common_PlayerRestrained && !Common_PlayerNaked) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Underwear") && !Common_PlayerRestrained && !Common_PlayerUnderwear && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "SchoolUniform") && !Common_PlayerRestrained && (!Common_PlayerClothed || (Common_PlayerCostume != ""))) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "RedBikini") && !Common_PlayerRestrained && (Common_PlayerCostume != "RedBikini") && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "WhiteLingerie") && !Common_PlayerRestrained && (Common_PlayerCostume != "WhiteLingerie") && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "BlackDress") && !Common_PlayerRestrained && (Common_PlayerCostume != "BlackDress")) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Tennis") && !Common_PlayerRestrained && (Common_PlayerCostume != "Tennis") && ((GameLogQuery("C007_LunchBreak", "Jennifer", "Lunch") || GameLogQuery("C012_AfterClass", "Jennifer", "Running")))) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "FullBondage") && !Common_PlayerRestrained && !Common_PlayerGagged) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Restrain") && !Common_PlayerRestrained) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Gag") && !Common_PlayerGagged) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Release") && Common_PlayerRestrained) { Result = EventPlayerSubmissive(EventStage); PlayerReleaseBondage(); }
			if ((EventType == "VibratingEgg") && PlayerHasInventory("VibratingEgg") && !PlayerHasLockedInventory("VibratingEgg") && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "ConfiscateKeys") && PlayerHasInventory("CuffsKey")) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "ConfiscateCrop") && PlayerHasInventory("Crop")) Result = EventPlayerSubmissive(EventStage);
			if (EventType == "BondageHug") Result = EventPlayerSubmissive(EventStage);
			if (EventType == "Tickle") Result = EventPlayerSubmissive(EventStage);
			if (EventType == "Slap") Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Masturbate") && !Common_PlayerChaste && !GameLogQuery(CurrentChapter, "Player", "NextPossibleOrgasm")) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "Crop") && (PlayerHasInventory("Crop") || GameLogQuery("", Common_PlayerOwner, "HasCrop"))) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "PushUp") && !Common_PlayerRestrained && !Common_PlayerGagged && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);
			if ((EventType == "SitUp") && !Common_PlayerRestrained && !Common_PlayerGagged && !Common_PlayerChaste) Result = EventPlayerSubmissive(EventStage);

		}

	}

	// Returns the event type which will become the dialog number
	EventLastRandomType = EventType;
	return Result;
	
}

// Log the end of an event, if it's the first time, it can change the actor attitude
function EventLogEnd() {
	if (!GameLogQuery(CurrentChapter, CurrentActor, "Activity" + EventActivityCurrent)) {
		if (EventActivityLove > 0) ActorChangeAttitude(1, 0);
		if (EventActivityLove < 0) ActorChangeAttitude(-1, 0);
		GameLogAdd("Activity" + EventActivityCurrent);
	}
	EventActivityCurrent = "";
}

		
// When an activity event is registered
function EventDoActivity(EventActivityType, EventLoveFactor, EventCurrentStage, EventEndStage, EventBonusStage) {
	
	// If it's a new activity
	if (EventActivityCurrent != EventActivityType) {
		
		// Reset the count and sets the pose
		ActorSetPose(EventActivityType);
		EventActivityCurrent = EventActivityType;
		EventActivityCount = 0;
		EventActivityLove = 0;
		
		// The number of times the activity will be done depends on the love or hate
		if ((EventActivityType == "Tickle") || (EventActivityType == "Masturbate")) EventActivityMaxCount = 5 + Math.floor(ActorGetValue(ActorLove) / 10);
		else EventActivityMaxCount = 5 - Math.floor(ActorGetValue(ActorLove) / 10);
		if (EventActivityMaxCount < 4) EventActivityMaxCount = 4;
		if (EventActivityMaxCount > 8) EventActivityMaxCount = 8;
		
	}
	
	// Increments the activity
	EventActivityCount++;
	EventActivityLove = EventActivityLove + EventLoveFactor;
	
	// If a bonus event can be achieved
	if ((EventActivityCount >= 3) && (EventBonusStage > 0)) {
		
		// 20% bonus chance (+20% if masturbated with an egg)
		var BonusChance = Math.floor(Math.random() * 100);
		if ((EventActivityType == "Masturbate") && PlayerHasLockedInventory("VibratingEgg")) BonusChance = BonusChance + 20;
		
		// If we have the bonus, we log and jump to that stage
		if (BonusChance >= 80) {
			EventLogEnd();
			OverridenIntroText = "";
			return EventBonusStage;
		}

	}
	
	// When the activity is over
	if (EventActivityCount >= EventActivityMaxCount) {
		
		// Log the activity and ends it
		EventLogEnd()
		if (EventActivityLove > 0) OverridenIntroText = GetText("ActivityEndGood");
		if (EventActivityLove == 0) OverridenIntroText = GetText("ActivityEndFair");
		if (EventActivityLove < 0) OverridenIntroText = GetText("ActivityEndBad");
		ActorSetPose("");
		return EventEndStage;
		
	}
	
	// FALSE means the activity isn't over
	return EventCurrentStage;
	
}
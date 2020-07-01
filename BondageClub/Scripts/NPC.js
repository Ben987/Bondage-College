"use strict";
var NPCTrait = [
	["Dominant", "Submissive"],
	["Violent", "Peaceful"],
	["Horny", "Frigid"],
	["Rude", "Polite"],
	["Wise", "Dumb"],
	["Serious", "Playful"],
]

// Sets a specific trait for a NPC
function NPCTraitSet(C, TraitName, TraitValue) {
	var ReverseName = NPCTraitReverse(TraitName);
	for (var T = 0; T < C.Trait.length; T++)
		if ((C.Trait[T].Name == TraitName) || (C.Trait[T].Name == ReverseName))
			C.Trait.splice(T, 1);
	C.Trait.push({ Name: TraitName, Value: TraitValue });
}

// Generate random traits for a NPC (70% odds for each traits, can switch on both sides, strength is from 1 to 100)
function NPCTraitGenerate(C) {
	C.Trait = [];
	while (C.Trait.length == 0) {
		for (var T = 0; T < NPCTrait.length; T++)
			if (Math.random() >= 0.3) {
				var NewTrait = {
					Name: NPCTrait[T][Math.floor(Math.random() * 2)],
					Value: Math.floor(Math.random() * 100) + 1
				}
				C.Trait.push(NewTrait);
			}
	}
}

// Returns the opposite trait of a specified trait
function NPCTraitReverse(Trait) {
	for (var T = 0; T < NPCTrait.length; T++)
		if (NPCTrait[T][1] != null) {
			if (NPCTrait[T][0] == Trait) return NPCTrait[T][1];
			if (NPCTrait[T][1] == Trait) return NPCTrait[T][0];
		}
	return "No opposite found";
}

// Returns the weight value of the option (The higher the value, the higher the chances the option will be picked, an opposite trait will always result as an option that's not picked)
function NPCTraitGetOptionValue(Dialog, NPCTrait) {
	if ((Dialog != null) && (NPCTrait != null)) {
		var Value = 0;
		var DialogTrait = Dialog.split("|");
		for (var T = 0; T < DialogTrait.length; T++)
			for (var N = 0; N < NPCTrait.length; N++)
				if (NPCTrait[N].Name.trim() == DialogTrait[T].trim())
					Value = Value + NPCTrait[N].Value;
				else
					if (NPCTrait[N].Name.trim() == NPCTraitReverse(DialogTrait[T].trim()))
						Value = Value - 10000;
		return Value;
	} else return 0;
}

// Finds and keep the best possible option for a NPC dialog
function NPCTraitKeepBestOption(C, Group) {

	// For each dialog option of that group
	var Best = -1;
	var Pos = -1;
	for (var D = 0; D < C.Dialog.length; D++)
		if ((C.Dialog[D].Group != null) && (C.Dialog[D].Group == Group)) {
			var Value = NPCTraitGetOptionValue(C.Dialog[D].Trait, C.Trait);
			if (Value > Best) { Best = Value; Pos = D; }
		}

	// If we found the best possibility, we remove all the others
	if (Pos >= 0)
		for (var D = 0; D < C.Dialog.length; D++)
			if ((D != Pos) && (C.Dialog[D].Group != null) && (C.Dialog[D].Group == Group)) {
				C.Dialog.splice(D, 1)
				Pos--;
				D--;
			}

}

// Picks the dialog group option that fits mosts with the NPC traits
function NPCTraitDialog(C) {

	// For each dialog option
	for (var D = 0; D < C.Dialog.length; D++) {
		if (C.Dialog[D].Group != null) NPCTraitKeepBestOption(C, C.Dialog[D].Group)
		if (C.Dialog[D].Function != null) C.Dialog[D].Function = C.Dialog[D].Function.replace("MainHall", "");
	}

}

// Sets the arousal stats for an NPC if it's not already done
function NPCArousal(C) {

	// Generates new data if there isn't any
	if (C.ArousalSettings == null) {

		// Resets to the default settings in automatic mode
		PreferenceInit(C);
		var Dominant = NPCTraitGet(C, "Dominant");
		var Horny = NPCTraitGet(C, "Horny");

		// Generates love/hate for all activities
		for (var P = 0; P < C.ArousalSettings.Activity.length; P++) {

			// Picks a random love factor for the activity (highest values have less chances)
			var LoveSelf = Math.round((Math.random() * 4) + 0.5, 0);

			// Horny NPC have higher love for sexual activities
			if (Horny + 125 > Math.random() * 250) LoveSelf = LoveSelf + 1;
			if (Horny + 125 < Math.random() * 250) LoveSelf = LoveSelf - 1;

			// Dominant NPC usually prefer to do activities on others
			var LoveOther = LoveSelf;
			if (Dominant + 125 > Math.random() * 250) LoveSelf = LoveSelf - 1;
			if (Dominant + 125 > Math.random() * 250) LoveOther = LoveOther + 1;
			if (Dominant + 125 < Math.random() * 250) LoveSelf = LoveSelf + 1;
			if (Dominant + 125 < Math.random() * 250) LoveOther = LoveOther - 1;

			// 0 and 4 are the limits
			if (LoveSelf < 0) LoveSelf = 0;
			if (LoveOther < 0) LoveOther = 0;
			if (LoveSelf > 4) LoveSelf = 4;
			if (LoveOther > 4) LoveOther = 4;

			// Sets the final values
			C.ArousalSettings.Activity[P].Self = LoveSelf;
			C.ArousalSettings.Activity[P].Other = LoveOther;

		}

		// Picks a random zone that's sure to trigger an orgasm, each girl has a perfect zone
		var OrgasmZones = ["ItemBreast", "ItemVulva", "ItemButt"];
		var Orgasm = CommonRandomItemFromList("", OrgasmZones);

		// Generates love/hate for all regions randomly
		for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++) {
			if (C.ArousalSettings.Zone[Z].Name == Orgasm) {
				C.ArousalSettings.Zone[Z].Factor = 4;
				C.ArousalSettings.Zone[Z].Orgasm = true;
			} else {
				C.ArousalSettings.Zone[Z].Factor = Math.round((Math.random() * 4) + 0.5, 0);
				if ((OrgasmZones.indexOf(C.ArousalSettings.Zone[Z].Name) >= 0) && (Math.random() > 0.5)) C.ArousalSettings.Zone[Z].Orgasm = true;
			}
		}

	}

	// Forces the automatic meter and resets it
	C.ArousalSettings.Active = "Automatic";
	C.ArousalSettings.Progress = 0;
	C.ArousalSettings.ProgressTimer = 0;

}

// Returns the trait value of an NPC
function NPCTraitGet(C, TraitType) {

	// For each NPC trait
	var Reverse = NPCTraitReverse(TraitType);
	for (var T = 0; T < C.Trait.length; T++) {
		if (TraitType == C.Trait[T].Name) return C.Trait[T].Value;
		if (Reverse == C.Trait[T].Name) return C.Trait[T].Value * -1;
	}
	return 0;

}

// Adds a new event in the NPC log
function NPCEventAdd(C, EventName, EventValue) {
	if (C.Event == null) C.Event = [];
	for (var E = 0; E < C.Event.length; E++)
		if (C.Event[E].Name == EventName) {
			C.Event[E].Value = EventValue;
			return;
		}
	var NewEvent = {
		Name: EventName,
		Value: EventValue
	}
	C.Event.push(NewEvent);
}

// Deletes a NPC event from the log
function NPCEventDelete(C, EventName) {
	if (C.Event == null) C.Event = [];
	for (var E = 0; E < C.Event.length; E++)
		if (C.Event[E].Name == EventName)
			C.Event.splice(E, 1);
}

// Returns the NPC event value (0 if the event isn't logged)
function NPCEventGet(C, EventName) {
	if (C.Event != null)
		for (var E = 0; E < C.Event.length; E++)
			if (C.Event[E].Name == EventName)
				return C.Event[E].Value;
	return 0;
}

// For longer events, the serious trait will dictate the time (1 day if playful, 3 days if nothing, 7 days if serious)
function NPCLongEventDelay(C) {
	var T = NPCTraitGet(C, "Serious");
	if (T > 0) return 604800000;
	if (T < 0) return 86400000;
	return 259200000;
}

// For longer lover events, the horny / frigid trait comes into play (1 week if horny, 2 weeks if nothing, 4 weeks if frigid)
function NPCLongLoverEventDelay(C) {
	var T = NPCTraitGet(C, "Horny");
	if (T > 0) return 604800000;
	if (T < 0) return 2419200000;
	return 1209600000;
}

// Sets the love factor for an NPC
function NPCLoveChange(C, LoveFactor) {
	LoveFactor = parseInt(LoveFactor);
	if (C.Love == null) C.Love = LoveFactor;
	else C.Love = C.Love + LoveFactor;
	if (C.Love < -100) C.Love = -100;
	if (C.Love > 100) C.Love = 100;
}

// Raises the love factor progressively with interaction time
function NPCInteraction() {
	if ((CurrentCharacter != null) && (CurrentCharacter.ID != 0))
		if (CurrentTime >= NPCEventGet(CurrentCharacter, "LastInteraction")) {
			NPCEventAdd(CurrentCharacter, "LastInteraction", CurrentTime + 20000);
			if (CurrentCharacter.Love < 60) NPCLoveChange(CurrentCharacter, 1);
		}
}
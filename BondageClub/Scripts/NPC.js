"use strict";
var NPCTrait = [
	["Dominant", "Submissive"],
	["Violent", "Peaceful"],
	["Horny", "Frigid"],
	["Rude", "Polite"],
	["Wise", "Dumb"],
	["Serious", "Playful"],
]

// Generate random traits for a NPC (70% odds for each traits, can switch on both sides, strength is from 1 to 100)
function NPCTraitGenerate(C) {
	C.Trait = [];
	for(var T = 0; T < NPCTrait.length; T++)
		if (Math.random() >= 0.3) {
			var NewTrait = {
				Name: NPCTrait[T][Math.floor(Math.random() * 2)],
				Value: Math.floor(Math.random() * 100) + 1
			}
			C.Trait.push(NewTrait);
		}
}

// Returns the opposite trait of a specified trait
function NPCTraitReverse(Trait) {
	for(var T = 0; T < NPCTrait.length; T++) 
		if (NPCTrait[T][1] != null)	{
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
		for(var T = 0; T < DialogTrait.length; T++)
			for(var N = 0; N < NPCTrait.length; N++)
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
	for(var D = 0; D < C.Dialog.length; D++)
		if ((C.Dialog[D].Group != null) && (C.Dialog[D].Group == Group)) {
			var Value = NPCTraitGetOptionValue(C.Dialog[D].Trait, C.Trait);
			if (Value > Best) { Best = Value; Pos = D; }
		}

	// If we found the best possibility, we remove all the others
	if (Pos >= 0)
		for(var D = 0; D < C.Dialog.length; D++)	
			if ((D != Pos) && (C.Dialog[D].Group != null) && (C.Dialog[D].Group == Group)) {
				C.Dialog.splice(D, 1)
				Pos--;
				D--;
			}

}

// Picks the dialog group option that fits mosts with the NPC traits
function NPCTraitDialog(C) {
	
	// For each dialog option
	for(var D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Group != null)
			NPCTraitKeepBestOption(C, C.Dialog[D].Group)
	
}

// Returns the trait value of an NPC
function NPCTraitGet(C, TraitType) {

	// For each NPC trait
	var Reverse = NPCTraitReverse(TraitType);
	for(var T = 0; T < C.Trait.length; T++) {
		if (TraitType == C.Trait[T].Name) return C.Trait[T].Value;
		if (Reverse == C.Trait[T].Name) return C.Trait[T].Value * -1;
	}
	return 0;

}
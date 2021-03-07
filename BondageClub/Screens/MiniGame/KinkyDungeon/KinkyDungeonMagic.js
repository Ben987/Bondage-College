var KinkyDungeonManaCost = 10 // The base mana cost of a spell, multiplied by the spell's level


var KinkyDungeonBookScale = 1.3

var KinkyDungeonMysticSeals = 0 // Mystic seals are used to unlock a spell from one of 3 books:
// 0 Ars Pyrotecnica - Elemental magic such as fireballs, ice, wind, etc
// 1 Codex Imaginus - Conjuring things such as weapons and restraints, and also enchanting (and disenchanting)
// 2 Clavicula Romantica - Illusory magic, disorientation and affecting enemy AI

// Magic book image source: https://www.pinterest.es/pin/54324739242326557/

// Note that you have these 3 books in your inventory at the start; you select the page open in each of them but you need to have hands free or else you can only turn to a random page at a time. If you are blind, you also can't see any page after you turn the page

var KinkyDungeonCurrentBook = "Elements" 
var KinkyDungeonCurrentPage = 0
var KinkyDungeonBooks = ["Elements", "Conjure", "Illusion"]

var KinkyDungeonSpells = [
	{name: "Firebolt", exhaustion: 1, components: ["Arms"], level:1, type:"bolt", power: 3, delay: 0, range: 50, damage: "fire"}, // Throws a fireball in a direction that moves 1 square each turn
	{name: "Snare", exhaustion: 3, components: ["Legs"], level:1, type:"trap", time: 10, delay: 1, range: 3, damage: "stun", playerEvent: {name: "MagicRope", time: 10}}, // Creates a magic rope trap that creates magic ropes for 10 seconds on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
	{name: "Flash", exhaustion: 2, components: ["Verbal"], level:1, type:"aoe", time: 10, range: 4, power: 3, size: 1, damage: "blind"}, // Start with flash, an explosion with a 1 turn delay and a 3 tile radius. If you are caught in the radius, you also get blinded temporarily!
]

var KinkyDungeonSpellChoices = [0, 1, 2]
var KinkyDungeonSpellChoiceCount = 3
var KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from. 
	"Elements": [],
	"Conjure": [],
	"Illusion": [],
}

function KinkyDungeonGetCost(Level) {
	var cost = KinkyDungeonManaCost
	for (L = 1; L < Level; L++) {
		cost += (100 - cost) * (KinkyDungeonManaCost / 100)
	}
	return cost
}

function KinkyDungeonHandleMagic() {
	if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
		if (KinkyDungeonCurrentPage > 0 && MouseIn(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
			KinkyDungeonCurrentPage -= 1
		}
		if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1 && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
			KinkyDungeonCurrentPage += 1
		}
	} else if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY + 483*KinkyDungeonBookScale, 500, 60)) {
		KinkyDungeonCurrentPage = Math.floor(Math.random(KinkyDungeonSpells.length))
	}
}

// https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function KinkyDungeonWordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
    while (str.length > maxWidth) {                 
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (KinkyDungeonTestWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

    }

    return res + str;
}

function KinkyDungeonTestWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

function KinkyDungeonDrawMagic() {
	DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX, canvasOffsetY, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false)
	
	if (KinkyDungeonSpells[KinkyDungeonCurrentPage]) {
		var spell = KinkyDungeonSpells[KinkyDungeonCurrentPage]
		
		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5, "black", "silver")
		DrawText(TextGet("KinkyDungeonMagicLevel") + spell.level, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2, "black", "silver")
		DrawText(TextGet("KinkyDungeonMagicCost") + KinkyDungeonGetCost(spell.level), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 105, "black", "silver")
		DrawText(TextGet("KinkyDungeonMagicExhaustion").replace("TimeTaken", spell.exhaustion), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 150, "black", "silver")
		DrawText(TextGet("KinkyDungeonMagicExhaustion2").replace("TimeTaken", spell.exhaustion), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195, "black", "silver")
		var textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonSpellDescription"+ spell.name).replace("DamageDealt", spell.power).replace("Duration", spell.time), 15).split('\n')
		var i = 0;
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/5 + i * 40, "black", "silver"); i++;}
		
		i = 0
		if (spell.components.includes("Verbal")) {DrawText(TextGet("KinkyDungeonComponentsVerbal"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Arms")) {DrawText(TextGet("KinkyDungeonComponentsArms"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195  - 40*i, "black", "silver"); i++;}
		if (spell.components.includes("Legs")) {DrawText(TextGet("KinkyDungeonComponentsLegs"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i++;}
		DrawText(TextGet("KinkyDungeonComponents"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver"); i = 1;
		
	
		for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
			if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]]) {
				DrawText(TextGet("KinkyDungeonSpellChoice" + I), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 50 + I*200, "white", "silver");
				DrawText(TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].name), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 95 + I*200, "white", "silver");
			}
			if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage))
				DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 150 + I*200, 225, 60, TextGet("KinkyDungeonSpell" + I), "White", "", "");
		}
		
	}
	
	if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
		if (KinkyDungeonCurrentPage > 0) {
			DrawButton(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
		}
		if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1) {
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
		}
	} else {
		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale/2 - 250, canvasOffsetY + 483*KinkyDungeonBookScale, 500, 60, TextGet("KinkyDungeonBookRandomPage"), "White", "", "");
	}
}

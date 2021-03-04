var KinkyDungeonManaCost = 10 // The base mana cost of a spell, multiplied by the spell's level
var KinkyDungeonRunes = 0 // The number of runes the player possesses

var KinkyDungeonBullets = [] // Bullets on the game board

var KinkyDungeonMysticSeals = 0 // Mystic seals are used to unlock a spell from one of 3 books:
// 0 Ars Pyrotecnica - Elemental magic such as fireballs, ice, wind, etc
// 1 Codex Imaginus - Conjuring things such as weapons and restraints, and also enchanting (and disenchanting)
// 2 Clavicula Romantica - Illusory magic, disorientation and affecting enemy AI

// Note that you have these 3 books in your inventory at the start; you select the page open in each of them but you need to have hands free or else you can only turn to a random page at a time. If you are blind, you also can't see any page after you turn the page

var KinkyDungeonCurrentBook = 0 

var KinkyDungeonSpells = {
	"elements": [{name: "Firebolt", level:1, type:"bolt", power: 3, delay: 0, range: 50, damage: "fire"}], // Throws a fireball in a direction that moves 1 square each turn
	"conjure": [{name: "Snare", level:1, type:"trap", power: 10, delay: 1, range: 3, damage: "stun", playerEvent: {name: "MagicRope", time: 10}}], // Creates a magic rope trap that creates magic ropes for 10 seconds on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
	"illusion": [{name: "Flash", level:1, type:"aoe", power: 10, range: 4, power: 3, size: 1, damage: "blind"}], // Start with flash, an explosion with a 1 turn delay and a 3 tile radius. If you are caught in the radius, you also get blinded temporarily!
} 

var KinkyDungeonSpellChoices = []
var KinkyDungeonSpellChoiceCount = 3
var KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. When you plan to use a mystic seal, you get 3 spells to choose from. 
	"elements": [],
	"conjure": [],
	"illusion": [],
}

function KinkyDungeonHandleMagic() {
	
}

function KinkyDungeonDrawMagic() {
	
}
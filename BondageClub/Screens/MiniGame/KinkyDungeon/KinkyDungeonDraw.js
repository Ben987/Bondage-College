var KinkyDungeonStruggleGroups = []
var KinkyDungeonStruggleGroupsBase = [
		"ItemHead",
		"ItemHood",
		"ItemM",
		"ItemEars",
		"ItemArms",
		"ItemNeck",
		"ItemHands",
		"ItemBreast",
		"ItemNipples",
		"ItemNipplesPiercings",
		"ItemPelvis",
		"ItemTorso",
		"ItemLegs",
		"ItemButt",
		"ItemVulva",
		"ItemVulvaPiercings",
		"ItemFeet",
		"ItemBoots",
	]
var KinkyDungeonDrawStruggle = true
var KinkyDungeonDrawState = "Game"

// Draw function for the game portion
function KinkyDungeonDrawGame() {
		
	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750, 42, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "silver");
	
	if (KinkyDungeonTextMessageTime > 0)
		DrawText(KinkyDungeonTextMessage, 1150, 82, KinkyDungeonTextMessageColor, "silver");
	if (KinkyDungeonActionMessageTime > 0)
		DrawText(KinkyDungeonActionMessage, 1150, 132, KinkyDungeonActionMessageColor, "silver");
	
	// Draw the stats
		KinkyDungeonDrawStats(canvasOffsetX + KinkyDungeonCanvas.width+10, canvasOffsetY, 1975 - (canvasOffsetX + KinkyDungeonCanvas.width+5), 100)
		
	if (KinkyDungeonDrawState == "Game") {
		var CamX = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2)))
		var CamY = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2)))

		KinkyDungeonMoveDirection = KinkyDungeonGetDirection(
			(MouseX - ((KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay + canvasOffsetX + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay,
			(MouseY - ((KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay + canvasOffsetY + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay)
		

		if (KinkyDungeonCanvas) {
			
			if (KinkyDungeonGrid_Last != KinkyDungeonGrid) {
				
				
				KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
				KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
				KinkyDungeonContext.fill()
				// Draw the grid
				var rows = KinkyDungeonGrid.split('\n')
				for (let R = 0; R < KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = 0; X < KinkyDungeonGridWidthDisplay; X++)  {
						var sprite = "Floor"
						if (rows[R+CamY][X+CamX] == "1") sprite = "Wall"
						else if (rows[R+CamY][X+CamX] == "X") sprite = "Doodad"
						else if (rows[R+CamY][X+CamX] == "C") sprite = "Chest"
						else if (rows[R+CamY][X+CamX] == "c") sprite = "ChestOpen"
						else if (rows[R+CamY][X+CamX] == "D") sprite = "Door"
						else if (rows[R+CamY][X+CamX] == "d") sprite = "DoorOpen"
						else if (rows[R+CamY][X+CamX] == "R") sprite = "Rubble"
						else if (rows[R+CamY][X+CamX] == "r") sprite = "RubbleLooted"
						else if (rows[R+CamY][X+CamX] == "S") sprite = "StairsUp"
						else if (rows[R+CamY][X+CamX] == "s") sprite = "StairsDown"
							
						DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Floor" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, X*KinkyDungeonGridSizeDisplay, R*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false)
					}
				}
				
				//KinkyDungeonGrid_Last = KinkyDungeonGrid
			}
			
			// Get lighting grid
			if (KinkyDungeonUpdateLightGrid) {
				KinkyDungeonUpdateLightGrid = false
				KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }])
			}
				
			KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay)
			KinkyDungeonContext.drawImage(KinkyDungeonCanvasPlayer,  (KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay); 
			KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay)
			KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay)
			
			// Draw fog of war
			var rows = KinkyDungeonLightGrid.split('\n')
			for (let R = 0; R < KinkyDungeonGridHeightDisplay; R++)  {
				for (let X = 0; X < KinkyDungeonGridWidthDisplay; X++)  {
					KinkyDungeonContext.beginPath();
					KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-Number(rows[R+CamY][X+CamX])/3) + ")";
					
					KinkyDungeonContext.fillRect(X*KinkyDungeonGridSizeDisplay, R*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
					KinkyDungeonContext.fill()
				}
			}
					
			// Draw targeting reticule
			if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height) && (KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
				KinkyDungeonContext.beginPath();
				KinkyDungeonContext.rect((KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
				KinkyDungeonContext.lineWidth = 3;
				KinkyDungeonContext.strokeStyle = "#ff4444";
				KinkyDungeonContext.stroke()
			}
			MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);
					
			
		}
		
		
		CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);
		
		// Draw the player no matter what
		KinkyDungeonContextPlayer.fillStyle = "rgba(0,0,0,1.0)";
		KinkyDungeonContextPlayer.fillRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
		KinkyDungeonContextPlayer.fill()
		DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, 0, KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer)
		
		// Draw the struggle buttons if applicable
		if (KinkyDungeonDrawStruggle && KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				var sg = KinkyDungeonStruggleGroups[S]
				var ButtonWidth = 60
				var x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0)
				var y = 42 + sg.y * (ButtonWidth + 46)
				
				if (sg.left) {
					MainCanvas.textAlign = "left";
				} else {
					MainCanvas.textAlign = "right";
				}
				
				var color = "white"
				var locktext = ""
				if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLock");}
				if (sg.lock == "Yellow") {color = "#ffff88"; locktext = TextGet("KinkyYellowLock");}
				if (sg.lock == "Green") {color = "#88FF88"; locktext = TextGet("KinkyGreenLock");}
				if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLock");}
				
				DrawText(TextGet("KinkyDungeonGroup"+ sg.group) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "silver")
				MainCanvas.textAlign = "center";
				
				var i = 1
				DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", "Screens/Minigame/KinkyDungeon/Struggle.png", "");
				if (!sg.blocked) {
					var toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle"
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", "Screens/Minigame/KinkyDungeon/" + toolSprite + ".png", ""); i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", "Screens/Minigame/KinkyDungeon/UseTool.png", ""); i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0) {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", "Screens/Minigame/KinkyDungeon/Cut.png", ""); i++;}
				}
			}

		if (KinkyDungeonStruggleGroups.length > 0) {
			if (KinkyDungeonDrawStruggle) DrawButton(510, 925, 120, 60, "", "White", "Screens/Minigame/KinkyDungeon/HideTrue.png", "");
			else DrawButton(510, 925, 120, 60, "", "White", "Screens/Minigame/KinkyDungeon/HideFalse.png", "");
		}
		
		//DrawButton(650, 925, 325, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
		DrawButton(1000, 925, 325, 60, TextGet("KinkyDungeonMagic"), "White", "", "");
		
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]]) {
			var spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[0]]
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1450, 835, color, "silver")
			DrawText("(" + KinkyDungeonGetCost(spell.level) + ")", 1450, 870, color, "silver")
			DrawButton(1405, 895, 90, 90, "", "White", "Screens/Minigame/KinkyDungeon/Spell1.png", "");
		}
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]]) {
			var spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]]
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1650, 835, color, "silver")
			DrawText("(" + KinkyDungeonGetCost(spell.level) + ")", 1650, 870, color, "silver")
			DrawButton(1605, 895, 90, 90, "", "White", "Screens/Minigame/KinkyDungeon/Spell2.png", "");
		}
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]]) {
			var spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]]
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1850, 835, color, "silver")
			DrawText("(" + KinkyDungeonGetCost(spell.level) + ")", 1850, 870, color, "silver")
			DrawButton(1805, 895, 90, 90, "", "White", "Screens/Minigame/KinkyDungeon/Spell3.png", "");
		}
	} else if (KinkyDungeonDrawState == "Magic") {
		DrawButton(1000, 925, 325, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagic()
	} else if (KinkyDungeonDrawState == "Inventory") {
		DrawButton(650, 925, 325, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawInventory()
	}
	

}


function KinkyDungeonHandleHUD() {
	if (KinkyDungeonDrawState == "Game") {
		//if (MouseIn(650, 925, 325, 60)) { KinkyDungeonDrawState = "Inventory"}
		//else 
		if (MouseIn(1000, 925, 325, 60)) { KinkyDungeonDrawState = "Magic"}
		else if (MouseIn(510, 925, 120, 60)) { KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle; return false;}
		
		if (!KinkyDungeonTargetingSpell) {
			var spell = null
			if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]] && MouseIn(1405, 895, 90, 90)) {
				spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[0]]
			}
			if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && MouseIn(1605, 895, 90, 90)) {
				spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]]
			}
			if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && MouseIn(1805, 895, 90, 90)) {
				spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]]
			}
			if (spell) {
				// Handle spell activation
				KinkyDungeonTargetingSpell = spell
				
				if (KinkyDungeonActionMessagePriority <= 1) {
					KinkyDungeonActionMessageTime = 1
					KinkyDungeonActionMessage = TextGet("KinkyDungeonSpellTarget" + spell.name)
					KinkyDungeonActionMessageColor = "white"
					KinkyDungeonActionMessagePriority = 2
				}
			}
		}
		
		if (KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				var sg = KinkyDungeonStruggleGroups[S]
				var ButtonWidth = 60
				var x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0)
				var y = 42 + sg.y * (ButtonWidth + 46)
				
				var i = 0
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Struggle"); return true;} i++;
				if (!sg.blocked) {
					var toolSprite = (sg.lock != "") ? "Key" : "Buckle"
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove"); return true;} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
						{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Pick"); return true;} i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0)
						{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Cut"); return true;} i++;}
				}

			}
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(1000, 925, 325, 60)) { KinkyDungeonDrawState = "Game"}
		else KinkyDungeonHandleMagic()
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 325, 60)) { KinkyDungeonDrawState = "Game"}
		else KinkyDungeonHandleInventory()
	}
		
	return false
}

function KinkyDungeonUpdateStruggleGroups() {
	var struggleGroups = KinkyDungeonStruggleGroupsBase
	KinkyDungeonStruggleGroups = []
	
	for (let S = 0; S < struggleGroups.length; S++) {
		var sg = struggleGroups[S]
		var Group = sg
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3"
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2"
			else Group = "ItemMouth"
		}
		
		var restraint = KinkyDungeonGetRestraintItem(Group)
		
		if (restraint) {
			KinkyDungeonStruggleGroups.push({group:Group, left: S % 2 == 0, y: Math.floor(S/2), icon:sg, lock:restraint.lock, blocked: InventoryGroupIsBlocked(KinkyDungeonPlayer, Group)})
		}
	}
}
"use strict";
var KinkyDungeonStruggleGroups = [];
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
	];
var KinkyDungeonDrawStruggle = true;
var KinkyDungeonDrawState = "Game";
var KinkyDungeonSpellValid = false;
var KinkyDungeonCamX = 0;
var KinkyDungeonCamY = 0;
var KinkyDungeonTargetX = 0;
var KinkyDungeonTargetY = 0;

function KinkyDungeonGetSprite(code) {
	let sprite = "Floor";
	if (code == "1") sprite = "Wall";
	if (code == "2") sprite = "Brickwork";
	else if (code == "X") sprite = "Doodad";
	else if (code == "C") sprite = "Chest";
	else if (code == "c") sprite = "ChestOpen";
	else if (code == "D") sprite = "Door";
	else if (code == "d") sprite = "DoorOpen";
	else if (code == "R") sprite = "Rubble";
	else if (code == "r") sprite = "RubbleLooted";
	else if (code == "S") sprite = "StairsUp";
	else if (code == "s") sprite = "StairsDown";
	else if (code == "A") sprite = "Shrine";
	else if (code == "a") sprite = "ShrineBroken";
	return sprite;
}

const KinkyDungeonLastChatTimeout = 10000;

// Draw function for the game portion
function KinkyDungeonDrawGame() {
	
	if (ChatRoomChatLog.length > 0) {
		let LastChatObject = ChatRoomChatLog[ChatRoomChatLog.length - 1];
		let LastChat = LastChatObject.Garbled;
		let LastChatTime = LastChatObject.Time;
		let LastChatSender = (LastChatObject.SenderName) ? LastChatObject.SenderName + ": " : ">";
		let LastChatMaxLength = 60;
		
		if (LastChat)  {
			LastChat = (LastChatSender + LastChat).substr(0, LastChatMaxLength);
			if (LastChat.length == LastChatMaxLength) LastChat = LastChat + "...";
			if (LastChatTime && CommonTime() < LastChatTime + KinkyDungeonLastChatTimeout) 
				if (!KinkyDungeonSendTextMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonActionMessage) 
					if (!KinkyDungeonSendActionMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonTextMessage)
						KinkyDungeonSendTextMessage(1, LastChat, "white", 1)
		}
		
		
	}
	
	
	

	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750, 42, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "silver");

	if (KinkyDungeonTextMessageTime > 0)
		DrawText(KinkyDungeonTextMessage, 1150, 82, KinkyDungeonTextMessageColor, "silver");
	if (KinkyDungeonActionMessageTime > 0)
		DrawText(KinkyDungeonActionMessage, 1150, 132, KinkyDungeonActionMessageColor, "silver");

	// Draw the stats
		KinkyDungeonDrawStats(canvasOffsetX + KinkyDungeonCanvas.width+10, canvasOffsetY, 1975 - (canvasOffsetX + KinkyDungeonCanvas.width+5), 100);

	if (KinkyDungeonDrawState == "Game") {
		let CamX = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2)));
		let CamY = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2)));

		KinkyDungeonCamX = CamX;
		KinkyDungeonCamY = CamY;

		KinkyDungeonSetMoveDirection();


		if (KinkyDungeonCanvas) {

			if (KinkyDungeonGrid_Last != KinkyDungeonGrid) {


				KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
				KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
				KinkyDungeonContext.fill();
				// Draw the grid
				let rows = KinkyDungeonGrid.split('\n');
				for (let R = 0; R < KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = 0; X < KinkyDungeonGridWidthDisplay; X++)  {
						let sprite = KinkyDungeonGetSprite(rows[R+CamY][X+CamX]);

						DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Floor" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, X*KinkyDungeonGridSizeDisplay, R*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					}
				}

				//KinkyDungeonGrid_Last = KinkyDungeonGrid
			}

			// Get lighting grid
			if (KinkyDungeonUpdateLightGrid) {
				KinkyDungeonUpdateLightGrid = false;
				KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }]);
			}

			KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay);
			KinkyDungeonContext.drawImage(KinkyDungeonCanvasPlayer,  (KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay);
			KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay);
			KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay);
			KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY, KinkyDungeonGridSizeDisplay);

			// Draw fog of war
			let rows = KinkyDungeonLightGrid.split('\n');
			for (let R = 0; R < KinkyDungeonGridHeightDisplay; R++)  {
				for (let X = 0; X < KinkyDungeonGridWidthDisplay; X++)  {
					KinkyDungeonContext.beginPath();
					KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-Number(rows[R+CamY][X+CamX])/3) + ")";

					KinkyDungeonContext.fillRect(X*KinkyDungeonGridSizeDisplay, R*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
					KinkyDungeonContext.fill();
				}
			}

			// Draw targeting reticule

			if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
				if (KinkyDungeonTargetingSpell) {
					KinkyDungeonSetTargetLocation();

					KinkyDungeonContext.beginPath();
					KinkyDungeonContext.rect((KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
					KinkyDungeonContext.lineWidth = 3;
					KinkyDungeonContext.strokeStyle = "#88AAFF";
					KinkyDungeonContext.stroke();

					KinkyDungeonSpellValid = (KinkyDungeonTargetingSpell.projectile || KinkyDungeonTargetingSpell.range >= Math.sqrt((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) *(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) + (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y) * (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y))) &&
						(KinkyDungeonTargetingSpell.projectile || KinkyDungeonTargetingSpell.CastInWalls || KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY))) &&
						(!KinkyDungeonTargetingSpell.WallsOnly || !KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY)));

					if (KinkyDungeonSpellValid)
						if (KinkyDungeonTargetingSpell.projectile)
							DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
								KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								(KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay,
								KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
						else
							DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
								KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								(KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay,
								KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				} else if ((KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
					KinkyDungeonContext.beginPath();
					KinkyDungeonContext.rect((KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
					KinkyDungeonContext.lineWidth = 3;
					KinkyDungeonContext.strokeStyle = "#ff4444";
					KinkyDungeonContext.stroke();
				}
			}
			MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);


		}


		CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);

		// Draw the player no matter what
		//KinkyDungeonContextPlayer.fillStyle = "rgba(0,0,0,1.0)";
		//KinkyDungeonContextPlayer.fillRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
		//KinkyDungeonContextPlayer.fill()
		KinkyDungeonContextPlayer.clearRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
		DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, 0, KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer);

		// Draw the struggle buttons if applicable
		if (KinkyDungeonDrawStruggle && KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				let sg = KinkyDungeonStruggleGroups[S];
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				if (sg.left) {
					MainCanvas.textAlign = "left";
				} else {
					MainCanvas.textAlign = "right";
				}

				let color = "white";
				let locktext = "";
				if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
				if (sg.lock == "Yellow") {color = "#ffff88"; locktext = TextGet("KinkyYellowLockAbr");}
				if (sg.lock == "Green") {color = "#88FF88"; locktext = TextGet("KinkyGreenLockAbr");}
				if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}

				let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.
				

				DrawText(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "black");
				MainCanvas.textAlign = "center";

				let i = 1;
				DrawButton(x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", "");
				if (!sg.blocked) {
					let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
					DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "") {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0) {DrawButton(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Cut.png", ""); i++;}
				}
			}

		if (KinkyDungeonStruggleGroups.length > 0) {
			if (KinkyDungeonDrawStruggle) DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideTrue.png", "");
			else DrawButton(510, 925, 120, 60, "", "White", KinkyDungeonRootDirectory + "HideFalse.png", "");
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type == "Lock") {
				let action = false;
				if (KinkyDungeonLockpicks > 0) {
					DrawButton(963, 825, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
					action = true;
				}

				if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Green") && KinkyDungeonGreenKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) ) ) {
					DrawButton(825, 825, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
					action = true;
				}

				if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 850, "white", "silver");

				if (KinkyDungeonTargetTile.Lock.includes("Red"))
					DrawText(TextGet("KinkyRedLock"), 675, 850, "white", "silver");
				else if (KinkyDungeonTargetTile.Lock.includes("Yellow"))
					DrawText(TextGet("KinkyYellowLock"), 675, 850, "white", "silver");
				else if (KinkyDungeonTargetTile.Lock.includes("Green"))
					DrawText(TextGet("KinkyGreenLock"), 675, 850, "white", "silver");
				else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
					DrawText(TextGet("KinkyBlueLock"), 675, 850, "white", "silver");
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				let cost = 0;
				let type = KinkyDungeonTargetTile.Name;

				if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);


				if (cost == 0) DrawText(TextGet("KinkyDungeonLockedShrine"), 850, 850, "white", "silver");
				else {
					DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", cost), "White", "", "");
				}
			} else if (KinkyDungeonTargetTile.Type == "Door") {
				DrawButton(675, 825, 350, 60, TextGet("KinkyDungeonCloseDoor"));
			}
		}
		//DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
		DrawButton(925, 925, 250, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]]) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[0]];
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1275, 835, "white", "silver");
			DrawText("(" + Math.ceil(KinkyDungeonGetCost(spell.level)) + ")", 1275, 870, "white", "silver");
			DrawButton(1230, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell1.png", "");
		}
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]]) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[1]];
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1525, 835, "white", "silver");
			DrawText("(" + Math.ceil(KinkyDungeonGetCost(spell.level)) + ")", 1525, 870, "white", "silver");
			DrawButton(1480, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell2.png", "");
		}
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]]) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[2]];
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1775, 835, "white", "silver");
			DrawText("(" + Math.ceil(KinkyDungeonGetCost(spell.level)) + ")", 1775, 870, "white", "silver");
			DrawButton(1730, 895, 90, 90, "", "White", KinkyDungeonRootDirectory + "Spell3.png", "");
		}
	} else if (KinkyDungeonDrawState == "Magic") {
		DrawButton(925, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagic();
	} else if (KinkyDungeonDrawState == "Inventory") {
		DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawInventory();
	}


}


function KinkyDungeonSetTargetLocation() {
	KinkyDungeonTargetX = Math.round((MouseX - KinkyDungeonGridSizeDisplay/2 - canvasOffsetX)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamX;
	KinkyDungeonTargetY = Math.round((MouseY - KinkyDungeonGridSizeDisplay/2 - canvasOffsetY)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamY;
}

function KinkyDungeonSetMoveDirection() {
	KinkyDungeonMoveDirection = KinkyDungeonGetDirection(
			(MouseX - ((KinkyDungeonPlayerEntity.x - KinkyDungeonCamX)*KinkyDungeonGridSizeDisplay + canvasOffsetX + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay,
			(MouseY - ((KinkyDungeonPlayerEntity.y - KinkyDungeonCamY)*KinkyDungeonGridSizeDisplay + canvasOffsetY + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay);
}

function KinkyDungeonHandleHUD() {
	if (KinkyDungeonDrawState == "Game") {
		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();

		//if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Inventory"}
		//else
		if (MouseIn(925, 925, 250, 60)) { KinkyDungeonDrawState = "Magic"; return true;}
		else if (MouseIn(510, 925, 120, 60)) { KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle; return true;}

		if (!KinkyDungeonTargetingSpell) {
			if (KinkyDungeonHandleSpell()) return true;
			KinkyDungeonSpellPress = 0;
		} else {
			KinkyDungeonSpellPress = 0;
		}

		if (KinkyDungeonTargetTile) {
			if (KinkyDungeonTargetTile.Type && KinkyDungeonTargetTile.Type == "Lock") {
				if (KinkyDungeonLockpicks > 0 && MouseIn(963, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1);
					if (KinkyDungeonPickAttempt()) {
						KinkyDungeonTargetTile = null;
						delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
					}
					return true;
				}

				if (((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Yellow") && (KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0)
					|| (KinkyDungeonTargetTile.Lock.includes("Green") && KinkyDungeonGreenKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0) )) && MouseIn(825, 825, 112, 60)) {
					KinkyDungeonAdvanceTime(1);
					if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
						KinkyDungeonTargetTile = null;
						delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
					}
					return true;
				}
			} else if (KinkyDungeonTargetTile.Type == "Shrine") {
				let cost = 0;
				let type = KinkyDungeonTargetTile.Name;

				if (KinkyDungeonShrineAvailable(type)) cost = KinkyDungeonShrineCost(type);


				if (cost > 0 && MouseIn(675, 825, 350, 60)) {
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonTargetTile = null;
					if (KinkyDungeonGold > cost) {
						KinkyDungeonPayShrine(type)
						delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation]
						let x = KinkyDungeonTargetTileLocation.split(',')[0]
						let y = KinkyDungeonTargetTileLocation.split(',')[1]
						KinkyDungeonMapSet(parseInt(x), parseInt(y), "a")
						KinkyDungeonUpdateStats(0)
					} else if (1 >= KinkyDungeonActionMessagePriority) {
						KinkyDungeonActionMessageTime = 1
								
						KinkyDungeonActionMessage = TextGet("KinkyDungeonPayShrineFail")
						KinkyDungeonActionMessagePriority = 1
						KinkyDungeonActionMessageColor = "red"
					}
					
				}

			} else if (KinkyDungeonTargetTile.Type == "Door") {
				if (MouseIn(675, 825, 350, 60)) {
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonTargetTile = null;
					let x = KinkyDungeonTargetTileLocation.split(',')[0]
					let y = KinkyDungeonTargetTileLocation.split(',')[1]
					KinkyDungeonMapSet(parseInt(x), parseInt(y), "D")
					KinkyDungeonSendActionMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 1);
				}
			}
		}

		if (KinkyDungeonStruggleGroups)
			for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
				let sg = KinkyDungeonStruggleGroups[S];
				let ButtonWidth = 60;
				let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
				let y = 42 + sg.y * (ButtonWidth + 46);

				let i = 0;
				if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Struggle"); return true;} i++;
				if (!sg.blocked) {
					let toolSprite = (sg.lock != "") ? "Key" : "Buckle";
					if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth) && sg.lock != "Jammed") {KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove"); return true;} i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "")
						{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Pick"); return true;} i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0)
						{if (MouseIn(x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth)) {KinkyDungeonStruggle(sg, "Cut"); return true;} i++;}
				}

			}
	} else if (KinkyDungeonDrawState == "Magic") {
		if (MouseIn(925, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "Inventory") {
		if (MouseIn(650, 925, 250, 60)) { KinkyDungeonDrawState = "Game"; return true;}
		else return KinkyDungeonHandleInventory();
	}

	return false;
}

function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	for (let S = 0; S < struggleGroups.length; S++) {
		let sg = struggleGroups[S];
		let Group = sg;
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3";
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2";
			else Group = "ItemMouth";
		}

		let restraint = KinkyDungeonGetRestraintItem(Group);

		if (restraint) {
			KinkyDungeonStruggleGroups.push({group:Group, left: S % 2 == 0, y: Math.floor(S/2), icon:sg, name:(restraint.restraint) ? restraint.restraint.name : "", lock:restraint.lock, blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}

'use strict'

var LocationPlayer = function(Player){
	console.log("building character " + Player.id + " " + Object.keys(Player));
	for(var key in Player)
		this[key] = Player[key];
	
	this.activePose = Player.activePose ? Player.activePose : F3dcgAssets.POSE_NONE; 
	
	console.log(MainController.playerData.permissions.themes);
	
	this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.activePose, MainController.playerData.permissions.themes);
	this.renderPortrait = F3dcgAssetsRender.BuildPortraitRender(this.appearance);

	if(this.wardrobe)
		this.wardrobe.forEach(suit => suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance));
	
	this.GetUpdateDelegate = function(){
		this.update = new LocationPlayerUpdate(this, LocationController.GetPlayer());
		return this.update;
	}
	
	this.IsMainPlayer = function(){
		return this.id == MainController.playerData.id;
	}
	
	this.UpdateAppearanceAndRender = function(appearanceUpdate){
		if(appearanceUpdate) F3dcgAssets.UpdateAppearance(appearanceUpdate, this);
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.activePose, MainController.playerData.permissions.themes);
	}
	
	this.CanChangePose = function () { 
		var error = F3dcgAssets.ValidateCanChangePose(F3dcgAssets.BuildPosesEffectsBlocks(this.appearance));
		return ! error;
	}
	
	this.CanChangeBondageToys = function(){
		var error = F3dcgAssets.ValidateCanChangeBondageToys(F3dcgAssets.BuildEffects(this.appearance));
		return ! error;
	}
	
	this.CanChangeClothes = function(){
		var error = F3dcgAssets.ValidateCanChangeClothes(F3dcgAssets.BuildEffects(this.appearance));
		return ! error;
	}
	
	
		//CanWalk: function () { return ((this.Effect.indexOf("Freeze") < 0) && (this.Effect.indexOf("Tethered") < 0) && ((this.Pose == null) || (this.Pose.indexOf("Kneel") < 0) || (this.Effect.indexOf("KneelFreeze") < 0))) },
		//CanKneel: function () { return ((this.Effect.indexOf("Freeze") < 0) && (this.Effect.indexOf("ForceKneel") < 0) && ((this.Pose == null) || ((this.Pose.indexOf("LegsClosed") < 0) && (this.Pose.indexOf("Supension") < 0) && (this.Pose.indexOf("Hogtied") < 0)))) },
	
}

//Update type is a either group type name, or 'suit'
var LocationPlayerUpdate = function(playerTarget, playerOrigin){
	this.playerTarget = playerTarget;
	this.playerOrigin = playerOrigin;
	
	this.appearance = Util.CloneRecursive(playerTarget.appearance);
	this.render = Util.CloneRecursive(playerTarget.render);
	
	this.items = F3dcgAssetsInventory.BuildPlayerApplicableItems(playerTarget, playerOrigin);
	
	this.updateStack = [];
	
	this.GetApplicableItems = function(){
		return this.items;
	}
	
	
	this.AddSuit = function(appearanceSuit){
		var update = {type:"suit", appearance:{}};
		this.updateStack.push(update);		
		
		update.appearance.frame = appearanceSuit.frame;
		this.appearance.frame = appearanceSuit.frame;
		for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
			update.appearance[groupType] = Util.CloneRecursive(appearanceSuit[groupType]);
			this.appearance[groupType] = Util.CloneRecursive(appearanceSuit[groupType])
		}
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.activePose, MainController.playerData.permissions.themes);
		
		return [];
	}
	
	
	this.SetColor = function(groupName, color){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		return this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:color ? color.ToHexString() : null, variant:currentItem.variant, lock:currentItem.lock, vibeLevel:currentItem.vibeLevel});
	}
	
	
	this.UpdateLock = function(groupName, lockPropertyName, lockPropertyValue, code){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		var lock = Util.CloneRecursive(currentItem.lock);
		
		if(lock.name == "CombinationPadlock" && lock.code != code) return ["InvalidCombination"];
		
		switch(lockPropertyName){
			case "showTimer":
			case "removeItem":
			case "enableInput":
				lock[lockPropertyName] = ! lock[lockPropertyName];
			break;
			case "setTime":
				lock.timer.time = Date.now() + 1000*60 * lockPropertyValue;
			break;
			case "setCode":
				lock.code = code;
			break;
			default:
				lock[lockPropertyName] = lockPropertyValue;
			break;
		}
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, lock, vibeLevel:currentItem.vibeLevel});
		
		return [];
	}
	
	
	this.RemoveLock = function(groupName, code){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		if(currentItem.lock.name == "CombinationPadlock" && currentItem.lock.code != code) return ["InvalidCombination"];
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, vibeLevel:currentItem.vibeLevel});
		
		return [];
	}
	
	
	this.AddLock = function(groupName, lockName){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		var lock = {name:lockName, originPlayerId:this.originPlayer.id};
		if(lockName.includes("Timer"))
			lock.timer = {time:Date.now() + 1000*60*5, showTimer:true, removeItem:false, enableActions:false};
		
		if(lockName == "CombinationPadlock")
			lock.code = "1234";
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, lock:lock, vibeLevel:currentItem.vibeLevel});
		
		return [];
	}
	
	
	this.SetVariant = function(groupName, itemName, variantName){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		if(currentItem.name != itemName) return ["CanOnlySetVariantOnAppliedItem"];
		if(currentItem.variant == variantName) return ["SameVariant"];
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem?.color, variant:variantName, lock:currentItem?.lock, vibeLevel:currentItem?.vibeLevel});
		
		return [];
	}
	
	
	this.SetItem = function(groupName, itemName){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		var colorHexString = currentItem?.color;
		
		if(AssetGroup.type == F3dcgAssets.BONDAGE_TOY){
			var mostRecent = this.GetMostRecentTypeUpdate(F3dcgAssets.BONDAGE_TOY);
			if(mostRecent && mostRecent.groupName != groupName) return ["OnlyOneBondageToyAtTime"];
		}
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:itemName, color:colorHexString});
		
		return [];
	}
	
	this.SetVibeLevel = function(groupName, level){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[F3dcgAssets.BONDAGE_TOY][groupName];
		var AssetItem = AssetGroup.Items[currentItem.name];
		
		if(! AssetItem.VibeCommon) return ["NotCommonVibe"];
		if(currentItem.vibeLevel == level) return ["SameLevel"]
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, lock:currentItem.lock, vibeLevel:level});
		
		return [];
	}
	
	
	//Validation has been taken care of elsewhere
	//this.Add = function(groupTypeName, groupName, itemName, colorHexString, variant){
	this.Add = function(itemData){
		var AssetGroup = F3dcgAssets.AssetGroups[itemData.groupName];
		var AssetItem = AssetGroup.Items[itemData.itemName];
		
		var newItem;
		
		switch(itemData.groupTypeName){
			case F3dcgAssets.CLOTH:
				newItem = itemData.itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildClothAppearanceItem(itemData.itemName, itemData.color);
			break;
			case F3dcgAssets.ACCESSORY:
				newItem = itemData.itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildAccessoryAppearanceItem(itemData.itemName, itemData.color);
			break;
			case F3dcgAssets.EXPRESSION:
				newItem = F3dcgAssets.BuildExpressionAppearanceItem(itemData.itemName);
			break;
			case F3dcgAssets.BONDAGE_TOY:
				newItem = itemData.itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildBondageToyAppearanceItem(itemData.itemName, itemData.color);
			break;
			default:
				return [AssetGroup.type + " not supported"];
		}
		
		if(itemData.lock) newItem.lock = itemData.lock;
		if(itemData.variant) newItem.variant = itemData.variant;
		if(AssetItem && AssetItem.VibeCommon) newItem.vibeLevel = itemData.vibeLevel ? itemData.vibeLevel : 0;
		this.appearance[itemData.groupTypeName][itemData.groupName] = newItem;
		this.updateStack.push({type:itemData.groupTypeName, groupName:itemData.groupName, item:newItem});
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.playerTarget.activePose, MainController.playerData.permissions.themes);	
		this.items = F3dcgAssetsInventory.BuildPlayerApplicableItems(this.playerOrigin, this.playerTarget);
	}
	
	
	this.Undo = function(){
		if(0 == this.updateStack.length) return ["UpdateStackEmpty"];
		
		var updateToUndo = this.updateStack.pop();
		
		switch(updateToUndo.type){
			case F3dcgAssets.BONDAGE_TOY:
			case F3dcgAssets.CLOTH:
			case F3dcgAssets.ACCESSORY:
				var itemPrev = this.GetMostRecentUpdatedItemForGroup(updateToUndo.groupName);			
				var item = itemPrev ? itemPrev : this.player.appearance[updateToUndo.type][updateToUndo.groupName];
				this.appearance[updateToUndo.type][updateToUndo.groupName] = item;				
			case F3dcgAssets.EXPRESSION:				
				var itemPrev = this.GetMostRecentUpdatedItemForGroup(updateToUndo.groupName);
				var item = itemPrev ? itemPrev : this.player.appearance[updateToUndo.type][updateToUndo.groupName];
				this.appearance[updateToUndo.type][updateToUndo.groupName] = item;						
			break;
			case "suit":
				var framePrev = this.GetMostRecentFrameUpdate();
				this.appearance.frame = framePrev ? framePrev : this.player.appearance.frame;
				
				for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
					F3dcgAssets.SuitSelfTypeGroups[groupType].forEach(groupName => {
						var itemPrev = this.GetMostRecentUpdatedItemForGroup(groupName);
						var item = itemPrev ? itemPrev : this.player.appearance[groupType][groupName];
						this.appearance[groupType][groupName] = item;						
					})
				}
			break;
			
			default:console.error(updateToUndo.type);
		}
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.activePose, MainController.playerData.permissions.themes);
		return [];
	}
	
	
	this.Invalidate = function(){
		this.playerTarget.update = null;
		this.playerTarget = null;
		this.playerOrigin = null;
	}
	this.IsValid = function(){
		return this.playerTarget?.update == this;//an update is invalidated when the player gets a new update objet;
	}
	
	
	this.HasChanges = function(){
		return this.updateStack.length > 0;
	}
	
	
	this.GetFinalAppItemList = function(){
		var updatedGroups = {};//get rid of duplicates, filter only top item for each gorup
		this.updateStack.forEach(update => {
			switch(update.type){
				case F3dcgAssets.CLOTH:
				case F3dcgAssets.ACCESSORY:
				case F3dcgAssets.EXPRESSION:
				case F3dcgAssets.BONDAGE_TOY:
					updatedGroups[update.groupName] = update.item;
				break;
				case "suit":
					console.log(update.appearance);
					for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
						F3dcgAssets.SuitSelfTypeGroups[groupType].forEach(groupName => {
							updatedGroups[groupName] = update.appearance[groupType][groupName]
						});
					}
				break;
				default: console.log(update.type);
			}
		});
		
		return updatedGroups;
	}
	
	
	this.BuildSuitFromCurrentAppearance = function(){
		var suit = {frame:{}};
		
		suit.frame = Util.CloneRecursive(this.appearance.frame);
		for(var groupType in F3dcgAssets.SuitSelfTypeGroups)
			suit[groupType] = Util.CloneRecursive(this.appearance[groupType]);
		
		return suit;
	}
	
	
	this.GetMostRecentTypeUpdate = function(type){
		var mostRecentUpdate;
		this.updateStack.forEach(update => {
			if(update.type == type){
				mostRecentUpdate = update
			}
		});
		return mostRecentUpdate;	
	}
	
	
	this.GetMostRecentFrameUpdate = function(){
		var mostRecentSuitFrame;
		this.updateStack.forEach(update => {
			if(update.type == "suit"){
				mostRecentSuitFrame = update.appearance.frame;
			}
		});
		return mostRecentSuitFrame;	
	}
	
	
	this.GetMostRecentUpdatedItemForGroup = function(groupName){
		var mostRecent;
		this.updateStack.forEach(update => {
			if(update.type != "suit"){
				if(update.groupName == groupName)
					mostRecent = update.item;
			}else{
				for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
					F3dcgAssets.SuitSelfTypeGroups[groupType].forEach(suitGroupName => {
						if(groupName == suitGroupName){
							mostRecent = update.appearance[groupType][groupName];
						}
					});
				}
			}
		});
		return mostRecent;
	}
}



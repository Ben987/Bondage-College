'use strict'

var LocationPlayer = function(Player){
	console.log("building character " + Player.id + " " + Object.keys(Player));
	for(var key in Player)
		this[key] = Player[key];
	
	this.activePose = Player.activePose ? Player.activePose : F3dcgAssets.POSE_NONE; 
		
	this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.activePose);
	
	this.GetUpdateDelegate = function(){
		this.update = new LocationPlayerUpdate(this);
		return this.update;
	}
	
	this.IsMainPlayer = function(){
		return this.id == MainController.playerAccount.id;
	}
	
	this.UpdateAppearanceAndRender = function(appearanceUpdate){
		if(appearanceUpdate) F3dcgAssets.UpdateAppearance(appearanceUpdate, this);
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.activePose);
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
		
	
	/*
	this.interval = setInterval(function(){
		this.Appearance.forEach(AppearanceItem => {
			if(AppearanceItem.Property?.RemoveTimer && AppearanceItem.Property?.RemoveTimer - new Date().getTime() < 0){
				if(AppearanceItem.Property.RemoveItem){
					this.Appearance = this.Appearance.filter(el => el != AppearanceItem);
					this.appearance = F3dcgAssets.BuildPlayerAppearance(MainController.playerAccount, this, this.Appearance);
					this.inventory = F3dcgAssets.BuildPlayerInventory(MainController.playerAccount, this, this.Inventory, this.appearance);					
					this.update?.OnItemUpdate();
				}else{
					delete AppearanceItem.Property.RemoveTimer;
					delete AppearanceItem.Property.RemoveItem;
					delete AppearanceItem.Property.LockedBy;
					delete AppearanceItem.Property.LockMemberNumber;
				}
			}
		});
	}.bind(this), 1000);*/
	
}

//Update type is a either group type name, or 'suit'
var LocationPlayerUpdate = function(player){
	this.player = player;
	
	this.appearance = Util.CloneRecursive(player.appearance);
	this.render = Util.CloneRecursive(player.render);
	
	//this.inventory = Util.CloneRecursive(player.inventory);
	this.items = F3dcgAssetsInventory.BuildPlayerApplicableItems(MainController.playerAccount, player);
	
	//this.clothOrAccessoryUpdateLimit = 3;
	//this.clothOrAccessoryUpdateLimit = 100;//unlimited
	this.updateStack = [];
	
	/*
	this.GetInventoryItem = function(groupName, itemName){
		var item = this.items[F3dcgAssets.AssetGroups[groupName].type][groupName].items.find(inventoryItem => inventoryItem.itemName == itemName);
		return item;
	}*/
	
	this.GetApplicableItems = function(){
		return this.items;
	}
	
	this.GetCurrentWornItem = function(groupName){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var item = this.appearance[AssetGroup.type][groupName];
		return item;
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
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.activePose);
		
		return [];
	}
	
	
	this.AddColor = function(itemName, color){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		//var mostRecentItemName = this.HasChanges() ? this.updateStack[this.updateStack.length - 1].item.name : currentItem.name;
		
		return this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:color ? color.ToHexString() : null, variant:currentItem.variant, lock:currentItem.lock});
	}
	
	
	this.UpdateLock = function(itemName, lockPropertyName, lockPropertyValue){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		var lock = suit.frame = Util.CloneRecursive(currentItem.lock);
		switch(lockPropertyName){
			case "showTimer":
			case "removeItem":
			case "enableInput":
				lock[lockPropertyName] = ! lock[lockPropertyName];
			break;
			default:
				lock[lockPropertyName] = lockPropertyValue;
			break;
		}
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, lock});
		
		return [];
	}
	
	
	this.RemoveLock = function(itemName, lockName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant});
		
		return [];
	}
	
	this.AddLock = function(itemName, lockName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.appearance[AssetGroup.type][groupName];
		
		var lock = {name:lockName, originPlayerId:MainController.playerAccount.id};
		switch(lockName){
			case "TimerPadlock":
				lock.timer = {time:Date.now() + 1000*60*60*5, showTimer:true, removeItem:false, enableActions:false};
			break;
			default: break;
		}
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:currentItem.name, color:currentItem.color, variant:currentItem.variant, lock:lock});
		
		return [];
	}
	
	
	this.AddVariant = function(itemName, variantName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		var currentItem = this.player.appearance[AssetGroup.type][groupName];
		
		if(currentItem.name != itemName) return ["CanOnlySetVariantOnAppliedItem"]
		
		this.Add({groupTypeName:AssetGroup.type, groupName:groupName, itemName:itemName, color:currentItem?.color, variant:variantName, lock:currentItem.lock});
		
		return [];
	}
	
	
	this.AddItem = function(groupName, itemName){
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
	
	
	//Validation has been taken care of elsewhere
	//this.Add = function(groupTypeName, groupName, itemName, colorHexString, variant){
	this.Add = function(itemData){
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
		this.appearance[itemData.groupTypeName][itemData.groupName] = newItem;
		this.updateStack.push({type:itemData.groupTypeName, groupName:itemData.groupName, item:newItem});
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.activePose);	
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
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.activePose);
		return [];
	}
	
	
	this.Invalidate = function(){
		this.player.update = null;
		this.player = null;
	}
	this.IsValid = function(){
		return this.player?.update == this;//an update is invalidated when the player gets a new update objet;
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



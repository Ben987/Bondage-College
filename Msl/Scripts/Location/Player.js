'use strict'

var LocationPlayer = function(Account){
	console.log("building character " + Account.id + " " + Object.keys(Account));
	for(var key in Account)
		this[key] = Account[key];
	
	this.currentPose = F3dcgAssets.POSE_NONE;
	this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.currentPose);
	
	this.GetUpdateDelegate = function(){
		this.update = new LocationPlayerUpdate(this);
		return this.update;
	}
	
	this.UpdateAppearanceAndRender = function(appearanceUpdate){
		F3dcgAssets.UpdateAppearance(appearanceUpdate, this);
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, this.currentPose);
	}
	
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
	this.clothOrAccessoryUpdateLimit = 100;//unlimited
	this.updateStack = [];
	
	this.updateRestraint = null;
	
	
	this.GetCurrentWornItem = function(itemGroupName){
		var AssetGroup = F3dcgAssets.AssetGroups[itemGroupName]
		switch(AssetGroup.type){
			case F3dcgAssets.CLOTH:
			case F3dcgAssets.ACCESSORY:
			case F3dcgAssets.EXPRESSION:
			case F3dcgAssets.BODY:
			case F3dcgAssets.BONDAGE_TOY:
				return this.appearance[AssetGroup.type][itemGroupName];
			default:
				throw "ItemGroupNotDefined " + itemGroupName;
		}
	}
	
	
	this.AddSuit = function(appearanceSuit){
		var update = {type:"suit", appearance:{}};
		this.updateStack.push(update);		
		
		update.appearance.frame = this.appearance.frame;
		this.appearance.frame = appearanceSuit.frame;
		for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
			update.appearance[groupType] = appearanceSuit[groupType];
			this.appearance[groupType] = appearanceSuit[groupType];
		}
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.currentPose);
		
		return [];
	}
	
	
	this.Add = function(itemGroupTypeName, itemGroupName, itemName, variantName){
		switch(itemGroupTypeName){
			case F3dcgAssets.CLOTH:
				var oldItem = this.appearance[itemGroupTypeName][itemGroupName];
				var newItem = itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildClothAppearanceItem(itemName, oldItem?.color);
				this.appearance[itemGroupTypeName][itemGroupName] = newItem;
				this.updateStack.push({type:itemGroupTypeName, itemGroupName: itemGroupName, item:newItem});
			break;
			case F3dcgAssets.ACCESSORY:
				var oldItem = this.appearance[itemGroupTypeName][itemGroupName];
				var newItem = itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildAccessoryAppearanceItem(itemName, oldItem?.color);
				this.appearance[itemGroupTypeName][itemGroupName] = newItem;
				this.updateStack.push({type:itemGroupTypeName, itemGroupName: itemGroupName, item:newItem});			
			break;
			case F3dcgAssets.EXPRESSION:
				var oldItem = this.appearance[itemGroupTypeName][itemGroupName];
				var newItem = F3dcgAssets.BuildExpressionAppearanceItem(itemName);
				this.appearance[itemGroupTypeName][itemGroupName] = newItem;
				this.updateStack.push({type:itemGroupTypeName, itemGroupName:itemGroupName, item:newItem});
			break;
			case F3dcgAssets.BONDAGE_TOY:
				var oldItem = this.appearance[itemGroupTypeName][itemGroupName];
				//if(oldItem == 
				if(this.updateRestraint) return ["OnlyOneBondageToyAtTime"];
				this.updateRestraint = true;
				var newItem = itemName == F3dcgAssetsInventory.NONE ? null : F3dcgAssets.BuildBondageToyAppearanceItem(itemName, oldItem?.color, variantName);
				this.appearance[itemGroupTypeName][itemGroupName] = newItem;
				this.updateStack.push({type:itemGroupTypeName, itemGroupName: itemGroupName, item:newItem});				
			break;
			default:
				return [itemGroupTypeName + " not supported"];
		}
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.currentPose);
		
		return [];
	}
	
	
	this.Undo = function(){
		if(0 == this.updateStack.length) return ["UpdateStackEmpty"];
		
		var updateToUndo = this.updateStack.pop();
		
		switch(updateToUndo.type){
			case F3dcgAssets.BONDAGE_TOY:
				this.updateRestraint = false; //no break
			case F3dcgAssets.CLOTH:
			case F3dcgAssets.ACCESSORY:
				var itemPrev = this.GetMostRecentUpdateForGroup(updateToUndo.itemGroupName);			
				var item = itemPrev ? itemPrev.item : this.player.appearance[updateToUndo.type][updateToUndo.itemGroupName];
				this.appearance[updateToUndo.type][updateToUndo.itemGroupName] = item;				
			case F3dcgAssets.EXPRESSION:				
				var itemPrev = this.GetMostRecentUpdateForGroup(updateToUndo.itemGroupName);
				var item = itemPrev ? itemPrev.item : this.player.appearance[updateToUndo.type][updateToUndo.itemGroupName];
				this.appearance[updateToUndo.type][updateToUndo.itemGroupName] = item;						
			break;
			case "suit":
				for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
					F3dcgAssets.SuitSelfTypeGroups[groupType].forEach(groupName => {
						var itemPrev = this.GetMostRecentUpdateForGroup(groupName);
						var item = itemPrev ? itemPrev.item : this.player.appearance[groupType][groupName];
						this.appearance[groupType][groupName] = item;						
					})
				}
			break;
			
			default:console.log(updateToUndo.type);
		}
		
		this.render = F3dcgAssetsRender.BuildPlayerRender(this.appearance, player.currentPose);
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
					updatedGroups[update.itemGroupName] = update.item;
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
	
	
	this.GetMostRecentUpdateForGroup = function(itemGroupName){
		var mostRecent;
		this.updateStack.forEach(update => {
			if(update.type != "suit"){
				if(update.itemGroupName == itemGroupName)
					mostRecent = update;
			}else{
				for(var groupType in F3dcgAssets.SuitSelfTypeGroups){
					F3dcgAssets.SuitSelfTypeGroups[groupType].forEach(groupName => {
						if(itemGroupName == groupName){
							mostRecent = update.appearance[groupType][groupName];
						}
					});
				}
			}
		});
		return mostRecent;
	}
}



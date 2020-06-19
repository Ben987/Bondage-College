//can not use strict because needs to be evaled by server code

var F3dcgAssetsInventory = {
	
	NONE:"None"
	,BuildPlayerApplicableItems(mainPlayerAccount, locationPlayer){
		var ownableTypes = [F3dcgAssets.ACCESSORY, F3dcgAssets.BONDAGE_TOY, F3dcgAssets.CLOTHES];  //everything else is enabled by default
		
		/*
		var locks = {};
		Inventory.filter(InvItem => InvItem.Group == "ItemMisc" && InvItem.Name.endsWith("adlock")).forEach(InvItem => {
			var AssetItem = F3dcgAssets.Padlocks[InvItem.Name];
			locks[InvItem.Name] = {itemName : InvItem.Name, iconUrl: this.F3DCG_ASSET_BASE + AssetItem.iconUrl};
		});
		
		var keys = {};
		Inventory.filter(InvItem => InvItem.Group == "ItemMisc" && InvItem.Name.endsWith("adlockKey")).forEach(InvItem => {
			var name = InvItem.Name.substring(0, InvItem.Name.length-3);
			var AssetItem = F3dcgAssets.Padlocks[name];
			keys[AssetItem.Name] = {name: AssetItem.Key.Name, iconUrl: this.F3DCG_ASSET_BASE + AssetItem.Key.iconUrl};
			if(AssetItem.Name.includes("Mistress")) keys["MistressTimerPadlock"] = keys[AssetItem.Name];
			if(AssetItem.Name.includes("Owner"))	keys["OwnerTimerPadlock"] = keys[AssetItem.Name];
		});*/
		
		var posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(locationPlayer.appearance);
		var applicableItems = {[F3dcgAssets.CLOTH]:{}, [F3dcgAssets.ACCESSORY]:{}, [F3dcgAssets.BONDAGE_TOY]:{}, [F3dcgAssets.EXPRESSION]:{}};
		F3dcgAssets.ClothesGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableClothesGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks)});
		F3dcgAssets.AccessoriesGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableAccessoryGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks)});
		F3dcgAssets.BondageToyGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableBondageToyGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks)});
		
		F3dcgAssets.ExpressionGroups.forEach(groupName => {
			applicableItems[F3dcgAssets.EXPRESSION][groupName] = {items:[], currentItem:null, blocked:false};//The none case is handled unlike all other groups
			for(var itemName in F3dcgAssets.AssetGroups[groupName].Items){
				var iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + (itemName != groupName ? groupName + "/" + itemName + "/Icon.png" : groupName + "/Icon.png");
				applicableItems[F3dcgAssets.EXPRESSION][groupName].items.push({itemName:itemName, iconUrl:iconUrl});
			};
		});
		
		if(Environment.allItemsInInventory){
			F3dcgAssets.ClothesGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddClothItem(applicableItems, itemName, posesEffectsBlocks);
			});
			
			F3dcgAssets.AccessoriesGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddAccessoryItem(applicableItems, itemName);
			});
			
			F3dcgAssets.BondageToyGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddBondageToyItem(applicableItems, itemName, locationPlayer.appearance, posesEffectsBlocks);
			});
		}else{
			F3dcgAssets.ClothesFree.forEach(itemName => this.AddClothItem(applicableItems, itemName));
			locationPlayer.inventory[F3dcgAssets.CLOTH].forEach(itemName => {this.AddClothItem(applicableItems, itemName, posesEffectsBlocks);});
			locationPlayer.inventory[F3dcgAssets.ACCESSORY].forEach(itemName => this.AddAccessoryItem(applicableItems, itemName));
			locationPlayer.inventory[F3dcgAssets.BONDAGE_TOY].forEach(itemName => this.AddBondageToyItem(applicableItems, itemName, locationPlayer.appearance, posesEffectsBlocks));
		}
		
		return applicableItems;
	}
	
	
	,InitApplicableAccessoryGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks){
		return F3dcgAssetsInventory.InitApplicableGroup(locationPlayer, applicableItems, groupName, F3dcgAssets.ACCESSORY);
	}
	,InitApplicableClothesGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks){
		var group = F3dcgAssetsInventory.InitApplicableGroup(locationPlayer, applicableItems, groupName, F3dcgAssets.CLOTH);
		if(! F3dcgAssets.CanChangeClothes(posesEffectsBlocks.effects)) group.blocked = true;
		if(posesEffectsBlocks.blocks.includes(groupName)) group.blocked = true; 
		return group;
	}
	,InitApplicableBondageToyGroup(locationPlayer, applicableItems, groupName, posesEffectsBlocks){
		var group = F3dcgAssetsInventory.InitApplicableGroup(locationPlayer, applicableItems, groupName, F3dcgAssets.BONDAGE_TOY);
		if( ! F3dcgAssets.CanChangeBondageToys(posesEffectsBlocks.effects)) group.blocked = true;
		if(posesEffectsBlocks.blocks.includes(groupName)) group.blocked = true; 
		return group;		
	}
	,InitApplicableGroup(locationPlayer, applicableItems, groupName, groupTypeName){
		var applicableGroup = {items:[], current: null, blocked:false};
		applicableItems[groupTypeName][groupName] = applicableGroup;
		
		var currentAppearanceItem = locationPlayer.appearance[groupTypeName][groupName];
		if(currentAppearanceItem){
			applicableGroup.currentItem = Util.CloneRecursive(currentAppearanceItem);
			applicableGroup.currentItem.itemName = applicableGroup.currentItem.name;
			applicableGroup.currentItem.iconUrl = F3dcgAssetsInventory.GetIconUrlForItem(currentAppearanceItem.name);
			
			applicableGroup.items.push({itemName:F3dcgAssetsInventory.NONE});
		}
		
		return applicableGroup;
	}
	
	
	,AddBondageToyItem(applicableItems, itemName, appearance, posesEffectsBlocks){
		if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(itemName)) return;
		
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		if(F3dcgAssets.IgnoreGroups.includes(groupName)) return;
		var AssetItem = F3dcgAssets.AssetGroups[groupName].Items[itemName];
		var namePart = AssetItem.Name.includes("_") ?  AssetItem.Name.split("_")[0] :  AssetItem.Name;
		
		var validation = [];
		var inventoryItem = {itemName:AssetItem.Name, iconUrl:F3dcgAssetsInventory.GetIconUrlForItem(itemName), validation:validation, colorize:true}
		
		if(AssetItem.Prerequisite){
			for(var i = 0; i < AssetItem.Prerequisite.length; i++){
				var errorReason = F3dcgAssets.ValidatePrerequisite(AssetItem.Prerequisite[i], appearance, posesEffectsBlocks);
				if(errorReason.length > 0) validation.push(errorReason);
			}
		}
		
		//Subject to validation
		if(AssetItem.Variant){
			inventoryItem.variants = {};
			
			for(var variantName in AssetItem.Variant){
				var Variant = AssetItem.Variant[variantName];
				var variant = {name: Variant.Name, iconUrl : Variant.iconUrl, validation:[]};
				
				var variantNamePart =  Variant.Name.includes("_") ?  Variant.Name.split("_")[0] :  Variant.Name;
				variant.iconUrl = F3dcgAssets.F3DCG_TYPE_ICON_BASE + groupName + "/" + namePart + "/" + variantNamePart + ".png";
				if(groupName == "ItemNeckAccessories") variant.iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + groupName + "/" + namePart +  variantNamePart + ".png";
				
				if(AssetItem.Name == "BondageBench"){
					if(Variant.Name == "Base")
						variant.iconUrl = inventoryItem.iconUrl;
					else
						variant.iconUrl = F3dcgAssets.F3DCG_TYPE_ICON_BASE + "ItemAddon" + "/" + "BondageBenchStraps" + "/" + variantNamePart + ".png";
				}else if(AssetItem.Name == "LeatherArmbinder" && Variant.Name == "Base"){
					variant.iconUrl = inventoryItem.iconUrl;
				}
				
				if(Variant.Prerequisite){
					for(var i = 0; i < Variant.Prerequisite.length; i++){
						var errorReason = F3dcgAssets.ValidatePrerequisite(Variant.Prerequisite[i], appearance, posesEffectsBlocks);
						if(errorReason.length > 0) variant.validation.push(errorReason);
					}
				}
				
				inventoryItem.variants[variantName] = variant;
			}
		}
		
		//if(! applicableItems[F3dcgAssets.BONDAGE_TOY][groupName]) applicableItems[F3dcgAssets.BONDAGE_TOY][groupName] = [{itemName:F3dcgAssetsInventory.NONE}];
		applicableItems[F3dcgAssets.BONDAGE_TOY][groupName].items.push(inventoryItem); 
	}
	
	
	,AddAccessoryItem(applicableItems, itemName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var iconUrl = F3dcgAssetsInventory.GetIconUrlForItem(itemName);
		applicableItems[F3dcgAssets.ACCESSORY][groupName].items.push({itemName:itemName, iconUrl: iconUrl, colorize:true});
	}
	
	,AddClothItem(applicableItems, itemName, posesEffectsBlocks){		
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup =  F3dcgAssets.AssetGroups[groupName];
		var AssetItem = AssetGroup.Items[itemName];
		
		if(! AssetItem || ! AssetGroup) console.error(itemName + " " + groupName);
		
		var validation = [];
		if(! F3dcgAssets.CanChangeClothes(posesEffectsBlocks.effects)) validation.push("CanNotChangeClothes");
		
		//if(! applicableItems[F3dcgAssets.CLOTH][groupName]) applicableItems[F3dcgAssets.CLOTH][groupName] = [{itemName:F3dcgAssetsInventory.NONE}];
		applicableItems[F3dcgAssets.CLOTH][groupName].items.push({itemName:AssetItem.Name, iconUrl:F3dcgAssetsInventory.GetIconUrlForItem(itemName), colorize:true, validation:validation});
	}
	
	,GetIconUrlForItem (itemName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup =  F3dcgAssets.AssetGroups[groupName];
		var AssetItem = AssetGroup.Items[itemName];
		
		var namePart = AssetItem.Name.includes("_") ?  AssetItem.Name.split("_")[0] :  AssetItem.Name;
		var iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + AssetItem.Group + "/Preview/" + namePart + ".png";
		
		if(AssetGroup.type == F3dcgAssets.CLOTH){
			if(F3dcgAssets.ClothesQuest.includes(itemName) || F3dcgAssets.ClothesFree.includes(itemName)){
				var layerPart = AssetItem.Layer ? "_" + AssetItem.Layer[0].Name : "";
				var parentPart = AssetGroup.ParentGroup && ! AssetItem.IgnoreParentGroup ? "_Normal" : "";
				iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + AssetItem.Group + "/" + AssetItem.Name + parentPart + layerPart + ".png";
			}
		}
		
		return iconUrl;
	}
}	
	/*
	,InitAppearanceItem(AppItem, AssetItem, AssetItemGroup){
		var appearanceItem = {
			itemName:AppItem.Name
			,itemGroupName:AppItem.Group
			,itemGroupTypeName:AssetItemGroup.type
			,priority : AssetItem.Priority ? AssetItem.Priority : AssetItemGroup.Priority
			,left : (AssetItem.Left ? AssetItem.Left : AssetItemGroup.Left) || 0
			,top : (AssetItem.Top ? AssetItem.Top : AssetItemGroup.Top) || 0
			,color:null
			,fullAlpha:AssetItemGroup.FullAlpha === false ? false : true
			,layers:[]//url and allow colorize
		}
		
		if(AppItem.Property?.Type)	appearanceItem.itemVariantName = AppItem.Property.Type;
		if(AppItem.Property?.Restrain)	appearanceItem.itemVariantName = AppItem.Property.Restrain;
		if(AssetItem.Variants && ! appearanceItem.itemVariantName) appearanceItem.itemVariantName = Object.keys(AssetItem.Variants)[0];
		
		return appearanceItem;
	}*/
	
	/*
	,InitAppearanceItemLock(itemNameLock, playerId){
		var lock = {itemName:itemNameLock,originPlayerId:playerId};
		if(itemNameLock.includes("Timer"))
			lock.timer = {showTimer:true, removeItem:false, time:Date.now() + 1000*60*5}
		return lock;
	}*/
	
	/*
	,TranslateAppearanceItem(appearanceItem, translation){
		if(!translation) return;
		appearanceItem.left += translation.left;
		appearanceItem.top += translation.top;
	}*/
	

	/*
	,LockAppearanceItem(appearanceItem, AppItem, AssetItem, mainPlayerAccount, locationPlayer){
		if(AppItem.Property?.LockedBy){
			var AssetItemLock = F3dcgAssets.Padlocks[AppItem.Property.LockedBy];
			
			appearanceItem.lock = {itemName:AppItem.Property.LockedBy,originPlayerId:AppItem.Property.LockMemberNumber, unlockable:false}
			var l = appearanceItem.lock;
			
			if(l.itemName != "TimerPadlock"){//Not even owner can unlock the timer padlocks		
				var InventoryItemKey = mainPlayerAccount.Inventory.find(InventoryItem => InventoryItem.Group == "ItemMisc" && InventoryItem.Name == l.itemName.replace("Timer", "") + "Key");
				if(InventoryItemKey){
					if(mainPlayerAccount.id == locationPlayer.ownerId) l.unlockable = true;//lover and owner are equal
					if(mainPlayerAccount.id == locationPlayer.loverId) l.unlockable = true;
					if(mainPlayerAccount.IsMistress() && !l.itemName.includes("Owner") && !l.itemName.includes("Lover")) l.unlockable = true;
					if(!l.itemName.includes("Mistress") && !l.itemName.includes("Owner") && !l.itemName.includes("Lover")) l.unlockable = true;
				}
			}
			
			if(AppItem.Property.RemoveTimer){
				l.timer = {
					time:AppItem.Property.RemoveTimer
					,showTimer: l.itemName == "TimerPadlock" || AppItem.Property.ShowTimer
					,maxTime:AssetItemLock.MaxTimer
					,removeItem:AppItem.Property.RemoveItem
					,enableActions:AppItem.Property.EnableRandomInput
					,actions: l.unlockable ? AssetItemLock.KeyHolderActions : AppItem.Property.EnableRandomInput ? AssetItemLock.KeylessActions : []
					,management: l.unlockable ? {showTimer:AppItem.Property.ShowTimer, removeItem:AppItem.Property.RemoveItem, enableActions:AppItem.Property.EnableRandomInput} : {}
				}
			}
		}
		else if(AssetItem.AllowLock){
			appearanceItem.allowedLocks = [];
			
			["MetalPadlock", "IntricatePadlock", "TimerPadlock"].forEach(lockItemName => {
				if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
					appearanceItem.allowedLocks.push(lockItemName);
			});
				
			if(mainPlayerAccount.id == locationPlayer.ownerId){
				["OwnerPadlock", "OwnerTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
			
			if(mainPlayerAccount.id == locationPlayer.loverId){
				["LoversPadlock", "LoversTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
			
			if(mainPlayerAccount.IsMistress()){
				["MistressPadlock", "MistressTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
		}
	}*/
	
	
/*
	,DeconvertItem(appearanceItem){
		var AppItem = {Group:appearanceItem.itemGroupName};
		
		if(appearanceItem.itemGroupTypeName == F3dcgAssets.EXPRESSION){
			AppItem.Name = appearanceItem.itemGroupName;
			AppItem.Property = {Expression:appearanceItem.itemName};
			return AppItem;
		}
		
		AppItem.Name = appearanceItem.itemName;
		
		if(appearanceItem.color) AppItem.Color = appearanceItem.color.ToHexString();
		
		if(appearanceItem.lock){
			if(!AppItem.Property) AppItem.Property = {};
			AppItem.Property.LockedBy = appearanceItem.lock.itemName;
			AppItem.Property.Effect = ["Lock"]; 
			AppItem.Property.LockMemberNumber = appearanceItem.lock.originPlayerId;
			
			if(appearanceItem.lock.timer){
				AppItem.Property.RemoveTimer = appearanceItem.lock.timer.time;
				AppItem.Property.RemoveItem = appearanceItem.lock.timer.removeItem;
				AppItem.Property.ShowTimer = appearanceItem.lock.timer.showTimer;
				AppItem.Property.EnableRandomInput = appearanceItem.lock.timer.enableActions;
			}
		}
		
		var AssetItem = F3dcgAssets.ItemGroups[appearanceItem.itemGroupName].Items[appearanceItem.itemName];
		if(appearanceItem.itemVariantName && appearanceItem.itemVariantName != "None"){
			if(!AppItem.Property) AppItem.Property = {};
			
			var AssetItemVariant = AssetItem.Variants[appearanceItem.itemVariantName];
			AppItem.Property.Type = appearanceItem.itemVariantName;
		}
		
		return AppItem;	
	}*/







//can not use strict because needs to be evaled by server code

var F3dcgAssetsInventory = {
	
	NONE:"None"
	,BuildPlayerApplicableItems(playerOrigin, playerTarget){
		var validationFlagsCache = {
			playerOrigin:playerOrigin
			,playerTarget:playerTarget
			,posesEffectsBlocksOrigin:F3dcgAssets.BuildPosesEffectsBlocks(playerOrigin.appearance)
			,posesEffectsBlocksTarget:F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance)
			,permissions:{
				[F3dcgAssets.CLOTH]:F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.CLOTH, playerTarget, playerOrigin) 
				,[F3dcgAssets.ACCESSORY]:F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.ACCESSORY, playerTarget, playerOrigin)
				,[F3dcgAssets.BONDAGE_TOY]:F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.BONDAGE_TOY, playerTarget, playerOrigin)
			}
		}
		
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
		
		//Initializing top level arrays
		var applicableItems = {[F3dcgAssets.CLOTH]:{}, [F3dcgAssets.ACCESSORY]:{}, [F3dcgAssets.BONDAGE_TOY]:{}, [F3dcgAssets.EXPRESSION]:{}};
		
		//Initializing groups, validating group and group type levels
		F3dcgAssets.ClothesGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableClothesGroup(applicableItems, groupName, validationFlagsCache)});
		F3dcgAssets.AccessoriesGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableAccessoryGroup(applicableItems, groupName, validationFlagsCache)});
		F3dcgAssets.BondageToyGroups.forEach(groupName => {F3dcgAssetsInventory.InitApplicableBondageToyGroup(applicableItems, groupName, validationFlagsCache)});
		
		//Initializing items and variants, validating items and variants
		F3dcgAssets.ExpressionGroups.forEach(groupName => {
			applicableItems[F3dcgAssets.EXPRESSION][groupName] = {items:[], currentItem:null, blocked:false};//The none case is handled unlike all other group types
			for(var itemName in F3dcgAssets.AssetGroups[groupName].Items){
				var iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + (itemName != groupName ? groupName + "/" + itemName + "/Icon.png" : groupName + "/Icon.png");
				applicableItems[F3dcgAssets.EXPRESSION][groupName].items.push({itemName:itemName, iconUrl:iconUrl});
			};
		});
		
		if(Environment.allItemsInInventory){
			F3dcgAssets.ClothesGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddClothItem(applicableItems, itemName);
			});
			
			F3dcgAssets.AccessoriesGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddAccessoryItem(applicableItems, itemName);
			});
			
			F3dcgAssets.BondageToyGroups.forEach(groupName => {
				for(var itemName in F3dcgAssets.AssetGroups[groupName].Items)
					this.AddBondageToyItem(applicableItems, itemName, playerTarget.appearance, validationFlagsCache.posesEffectsBlocksTarget);
			});
		}else{
			F3dcgAssets.ClothesFree.forEach(itemName => this.AddClothItem(applicableItems, itemName));
			playerTarget.inventory[F3dcgAssets.CLOTH].forEach(itemName => {this.AddClothItem(applicableItems, itemName);});
			playerTarget.inventory[F3dcgAssets.ACCESSORY].forEach(itemName => this.AddAccessoryItem(applicableItems, itemName));
			playerTarget.inventory[F3dcgAssets.BONDAGE_TOY].forEach(itemName => this.AddBondageToyItem(applicableItems, itemName, playerTarget.appearance, validationFlagsCache.posesEffectsBlocksTarget));
		}
		//Done with items
		
		return applicableItems;
	}

	//currentItem
	
	//group
		//validation (inaccessible, no permissions, no item access)
		//clearable
	
		//item
			//struggleable	
			//color
			//lock
				//unlockable
				//lock actions
				//lock and management
			
			//color
			
			
	
	//locked
	//lock actions and management
	//inaccessible
	//removable
	//strugglable
	//colorizable
	//has variants
	
	//Not items currently block the accessory groups
	,InitApplicableAccessoryGroup(applicableItems, groupName, validationFlagsCache){
		var applicableGroup = F3dcgAssetsInventory.InitApplicableGroup(validationFlagsCache.playerTarget, F3dcgAssets.ACCESSORY, groupName);
		applicableItems[F3dcgAssets.ACCESSORY][groupName] = applicableGroup;
		
		if(! validationFlagsCache.permissions[F3dcgAssets.ACCESSORY]) applicableGroup.validation.push("PermissionDenied");
	}
	
	
	,InitApplicableClothesGroup(applicableItems, groupName, validationFlagsCache){
		var applicableGroup = F3dcgAssetsInventory.InitApplicableGroup(validationFlagsCache.playerTarget, F3dcgAssets.CLOTH, groupName);
		applicableItems[F3dcgAssets.CLOTH][groupName] = applicableGroup;
		
		if( ! F3dcgAssets.CanChangeClothes(validationFlagsCache.posesEffectsBlocksOrigin.effects)) applicableGroup.validation.push("NoItemAccess");
		if(validationFlagsCache.posesEffectsBlocksTarget.blocks.includes(groupName)) applicableGroup.validation.push("BlockedByEffect") = true; 
		if(! validationFlagsCache.permissions[F3dcgAssets.CLOTH]) applicableGroup.validation.push("PermissionDenied");
	}
	
	
	,InitApplicableBondageToyGroup(applicableItems, groupName, validationFlagsCache){
		var applicableGroup = F3dcgAssetsInventory.InitApplicableGroup(validationFlagsCache.playerTarget, F3dcgAssets.BONDAGE_TOY, groupName);
		applicableItems[F3dcgAssets.BONDAGE_TOY][groupName] = applicableGroup;				
		
		if(validationFlagsCache.posesEffectsBlocksTarget.blocks.includes(groupName)) applicableGroup.validation.push("BlockedByEffect"); 
		if(! validationFlagsCache.permissions[F3dcgAssets.BONDAGE_TOY]) applicableGroup.validation.push("PermissionDenied");
		
		//Current item is a copy of the original -- adding icon urls and other properties for front end.
		if(applicableGroup.currentItem){
			if( ! F3dcgAssets.CanChangeBondageToys(validationFlagsCache.posesEffectsBlocksOrigin.effects)){
				applicableGroup.validation.push("NoItemAccess");
				applicableGroup.struggleable = true;
				applicableGroup.removable = false;
			}
			
			var AssetItem = F3dcgAssets.AssetGroups[groupName].Items[applicableGroup.currentItem.name];
			
			if(applicableGroup.currentItem.lock){
				applicableGroup.currentItem.lock.iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + "ItemMisc/Preview/" + applicableGroup.currentItem.lock.name + ".png"
				F3dcgAssetsInventory.InitLockActions(applicableGroup, validationFlagsCache);
			}else if(AssetItem.AllowLock){
				applicableGroup.currentItem.allowedLocks = [];
				validationFlagsCache.playerOrigin.inventory.locksKeys.forEach(itemName => {					
					if(! itemName.includes("Key")){
						applicableGroup.currentItem.allowedLocks.push({name:itemName, iconUrl:F3dcgAssets.F3DCG_ASSET_BASE + "ItemMisc/Preview/" + itemName + ".png"});
					}
				});
			}
			
			if(AssetItem.Variant){
				applicableGroup.currentItem.variants = {};
				
				for(var variantName in AssetItem.Variant){
					var Variant = AssetItem.Variant[variantName];
					var variant = {name: Variant.Name, iconUrl : Variant.iconUrl, validation:[]};
					
					var namePart = AssetItem.Name.includes("_") ?  AssetItem.Name.split("_")[0] :  AssetItem.Name;
					var variantNamePart =  Variant.Name.includes("_") ?  Variant.Name.split("_")[0] :  Variant.Name;
					variant.iconUrl = F3dcgAssets.F3DCG_TYPE_ICON_BASE + groupName + "/" + namePart + "/" + variantNamePart + ".png";
					if(groupName == "ItemNeckAccessories") variant.iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + groupName + "/" + namePart + variantNamePart + ".png";
					
					if(AssetItem.Name == "BondageBench"){
						if(Variant.Name == "Base")
							variant.iconUrl = applicableItem.iconUrl;
						else
							variant.iconUrl = F3dcgAssets.F3DCG_TYPE_ICON_BASE + "ItemAddon" + "/" + "BondageBenchStraps" + "/" + variantNamePart + ".png";
					}else if(AssetItem.Name == "LeatherArmbinder" && Variant.Name == "Base"){
						variant.iconUrl = applicableItem.iconUrl;
					}
					
					if(Variant.Prerequisite){
						for(var i = 0; i < Variant.Prerequisite.length; i++){
							var errorReason = F3dcgAssets.ValidatePrerequisite(Variant.Prerequisite[i], appearance, posesEffectsBlocks);
							if(errorReason.length > 0) variant.validation.push(errorReason);
						}
					}
					
					applicableGroup.currentItem.variants[variantName] = variant;		
				}
			}
		}
	}
	
	
	,InitApplicableGroup(playerTarget, groupTypeName, groupName){
		var applicableGroup = {items:[], currentItem: null, validation:[], changeable:true};
		
		var currentAppearanceItem = (playerTarget.update ?  playerTarget.update : playerTarget)["appearance"][groupTypeName][groupName];
		
		if(currentAppearanceItem){
			applicableGroup.currentItem = Util.CloneRecursive(currentAppearanceItem);
			applicableGroup.currentItem.name = applicableGroup.currentItem.name;
			applicableGroup.currentItem.iconUrl = F3dcgAssetsInventory.GetIconUrlForItem(currentAppearanceItem.name);
			applicableGroup.currentItem.colorable = true;
			
			applicableGroup.removable = true;
			//items.push({itemName:F3dcgAssetsInventory.NONE});
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
		var applicableItem = {itemName:AssetItem.Name, iconUrl:F3dcgAssetsInventory.GetIconUrlForItem(itemName), validation:validation, lockable:AssetItem.AllowLock}
		
		if(AssetItem.Prerequisite){
			for(var i = 0; i < AssetItem.Prerequisite.length; i++){
				var errorReason = F3dcgAssets.ValidatePrerequisite(AssetItem.Prerequisite[i], appearance, posesEffectsBlocks);
				if(errorReason.length > 0) validation.push(errorReason);
			}
		}
		
		applicableItems[F3dcgAssets.BONDAGE_TOY][groupName].items.push(applicableItem); 
	}
	
	
	,AddAccessoryItem(applicableItems, itemName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var iconUrl = F3dcgAssetsInventory.GetIconUrlForItem(itemName);
		applicableItems[F3dcgAssets.ACCESSORY][groupName].items.push({itemName:itemName, iconUrl:iconUrl});
	}
	
	,AddClothItem(applicableItems, itemName){		
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup =  F3dcgAssets.AssetGroups[groupName];
		var AssetItem = AssetGroup.Items[itemName];
		
		if(! AssetItem || ! AssetGroup) console.error(itemName + " " + groupName);
		
		applicableItems[F3dcgAssets.CLOTH][groupName].items.push({itemName:AssetItem.Name, iconUrl:F3dcgAssetsInventory.GetIconUrlForItem(itemName), validation:[]});
	}
	
	
	,GetIconUrlForItem (itemName){
		var groupName = F3dcgAssets.ItemNameToGroupNameMap[itemName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
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
	
	,InitLockActions(applicableGroup, validationFlagsCache){
		var lock = applicableGroup.currentItem.lock;
		
		if(F3dcgAssets.CanUnlockItem(validationFlagsCache.playerTarget, validationFlagsCache.playerOrigin, applicableGroup.currentItem)){
			lock.key = {name:lock.name + "Key"};
			var keyItemName = "MetalPadlockKey";
			if(["IntricatePadlock",	"OwnerPadlock",	"LoverPadlock",	"MistressPadlock"].includes(lock.name))
				keyItemName = lock.name  + "Key";
			
			if(lock.name == "OwnerTimerPadlock") keyItemName = "OwnerPadlockKey";
			if(lock.name == "MistressTimerPadlock") keyItemName = "MistressPadlockKey";
			
			lock.key.iconUrl = F3dcgAssets.F3DCG_ASSET_BASE + "ItemMisc/Preview/" + keyItemName + ".png"
		}else{
			applicableGroup.validation.push("Locked");
		}
		
		var lockOwner = lock.originPlayerId == MainController.playerAccount.id;
		switch(lock.name){
			case "CombinationPadlock":
				//lock.actions = lockOwner ? {comboChange
			break;
			case "TimerPadlock":
				lock.actions = {plus:5};
			break;
			case "LoverTimerPadlock":
				if(lockOwner)
					lock.actions = {
						flags:{removeItem:lock.removeItem, showTimer:lock.showTimer, enableInput:lock.enableInput}
						,timeIncrease:[60, 120, 240, 480, 960, 1440, 2880, 4320, 5760, 7200, 8640, 10080, -8640, -4320, -2880, -1440, -480, -240]
					}; 
				else if(lock.timer.enableInput)
					lock.actions = {random:240, plus:120, minus:120};	
			break;
			case "OwnerTimerPadlock":
				if(lockOwner)
					lock.actions = {
						flags:{removeItem:lock.removeItem, showTimer:lock.showTimer, enableInput:lock.enableInput}
						,timeIncrease:[60, 120, 240, 480, 960, 1440, 2880, 4320, 5760, 7200, 8640, 10080, -8640, -4320, -2880, -1440, -480, -240]
					};
				else if(lock.timer.enableInput)
					lock.actions = {random:240, plus:120, minus:120};	
			break;
			case "MistressTimerPadlock":
				if(lockOwner)
					lock.actions = {
						flags:{removeItem:lock.removeItem, showTimer:lock.showTimer, enableInput:lock.enableInput}
						,timeIncrease:[5, 10, 15, 30, 60, 120, 180, 240, -180, -120, -60, -30, -15]
					} ;
				else if(lock.timer.enableInput)
					lock.actions = {random:20, plus:10, minus:10};		
			break;
			//no actions on the below locks
			case "ExclusivePadlock":
			case "MetalPadlock": 
			case "IntricatePadlock":
			case "OwnerPadlock":
			case "LoverPadlock":
			case "MistressPadlock":  break;
			default: console.error("Unimplemented lock type " + lock.name);	break;
		}
	}
}







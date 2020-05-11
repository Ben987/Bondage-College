//can not use strict because needs to be evaled by server code

var F3dcgAssetsInventory = {

	
	BuildPlayerInventory(mainPlayerAccount, locationPlayer, Inventory, appearance){
		var inventory = {[F3dcgAssets.BODY]:{},[F3dcgAssets.EXPRESSION]:{},[F3dcgAssets.CLOTHING]:{},[F3dcgAssets.ACCESSORY]:{},[F3dcgAssets.RESTRAINT]:{},[F3dcgAssets.TOY]:{}};
		
		var ownableTypes = [F3dcgAssets.ACCESSORY, F3dcgAssets.TOY, F3dcgAssets.RESTRAINT, F3dcgAssets.CLOTHING];
		
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
		});
		
		for(var itemGroupName in F3dcgAssets.AssetGroups){
			var AssetItemGroup = F3dcgAssets.AssetGroups[itemGroupName];
			if(itemGroupName == "Hands") continue;
			
			if(!AssetItemGroup.type) continue;
			
			inventory[AssetItemGroup.type][AssetItemGroup.Group] = {};
			
			for(var itemName in AssetItemGroup.Items){
				var AssetItem = AssetItemGroup.Items[itemName];
				
				var inventoryItem = {
					owned:(AssetItemGroup.type == F3dcgAssets.BODY || AssetItemGroup.type == F3dcgAssets.EXPRESSION)
					,validation:[]
					,variants: AssetItem.Variants
					,iconUrl: this.F3DCG_ASSET_BASE + AssetItem.iconUrl
				}
				inventory[AssetItemGroup.type][AssetItemGroup.Group][itemName] = inventoryItem;
				
				if(ownableTypes.includes(AssetItemGroup.type))
					if((typeof(AssetItem.Value) == "undefined") || AssetItem.Value === 0)
						inventoryItem.owned = true
				
				if(AssetItem.AllowLock)
					inventoryItem.lockable = true;
			}
			
			if(AssetItemGroup.type != F3dcgAssets.BODY && AssetItemGroup.type != F3dcgAssets.EXPRESSION )
				inventory[AssetItemGroup.type][AssetItemGroup.Group]["None"] = {owned:true, validation:[], iconUrl:this.F3DCG_ASSET_BASE + "Icons/Items.png"};
		}
		
		Inventory.forEach(InventoryItem => {
			if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(InventoryItem.Name)) return;
			if(InventoryItem.Name.includes("Padlock")) return;
			if(InventoryItem.Name == "MetalCuffsKey") return;
			var AssetItemGroup = F3dcgAssets.AssetGroups[InventoryItem.Group];
			if(!AssetItemGroup.type || !inventory[AssetItemGroup.type][InventoryItem.Group]) return;
			inventory[AssetItemGroup.type][InventoryItem.Group][InventoryItem.Name].owned = true;
		});
		
		this.FillInventoryValidation(mainPlayerAccount, locationPlayer, inventory, appearance);
		
		return {items:inventory, locks:locks, keys:keys};
	}


	,FillInventoryValidation(mainPlayerAccount, locationPlayer, inventory, appearance){
		//var [poses, effects, blocks] = F3dcgAssets.GetPosesAndEffects(appearance);
		
		for(var igtN in inventory){
			for(var igN in inventory[igtN]){
				for(var iN in inventory[igtN][igN]){
					var inventoryItem = inventory[igtN][igN][iN];
					inventoryItem.validation = [];
					if(appearance.blocks.includes(igN)) inventoryItem.validation.push("Blocked");
					
					var AssetGroup = F3dcgAssets.AssetGroups[igN];
					if(! AssetGroup) continue;
					var AssetItem = AssetGroup.Items[iN];
					if(! AssetItem) continue;
					if(AssetItem.Prerequisite){
						var prereqs = AssetItem.Prerequisite.forEach ? AssetItem.Prerequisite : [AssetItem.Prerequisite];
						
						prereqs.forEach(prereq => {
							var errorReason = F3dcgAssets.ValidatePrerequisite(prereq, appearance);
							if(errorReason.length > 0) inventoryItem.validation.push(errorReason);
						});
					}
					
					for(var variantName in AssetItem.Variants){
						inventoryItem.variants[variantName].validation = [];
						
						if(AssetItem.Variants[variantName].Prerequisite){
							AssetItem.Variants[variantName].Prerequisite.forEach(prereq =>{
								var errorReason = F3dcgAssets.ValidatePrerequisite(prereq, appearance);	
								if(errorReason.length > 0) inventoryItem.variants[variantName].validation.push(errorReason);
							});
						}
					}
				}
			}
		}
	}
	
	
	,ValidatePrerequisite(prerequisite, appearance) {
		// Basic prerequisites that can apply to many items
		var g = appearance.items;
		
		
		switch(prerequisite){
			//Item group must be empty
			case "NoItemFeet":  	return g.ItemFeet ? "MustFreeFeetFirst" : "";
			case "NoItemLegs":  	return g.ItemLegs ? "MustFreeLegsFirst" : "";
			case "NoItemHands":	  	return g.ItemHands ? "MustFreeHandsFirst" : "";
			case "NakedClothLower":	return g.ClothLower ? "RemoveClothesForItem" : "";
			case "NakedFeet":	  	return g.ItemBoots || g.Socks || g.Shoes ? "RemoveClothesForItem" : "";
			case "NakedHands":	  	return g.ItemHands || g.Gloves ? "RemoveClothesForItem" : "";
			case "DisplayFrame":	
				if(g.ItemArms || g.ItemLegs || g.ItemFeet || g.ItemBoots) return "RemoveRestraintsFirst";
				if(g.Cloth || g.ClothLower || g.Shoes) return "RemoveClothesForItem";
				return "";
			
			//specific item must be absent 
			case "NotChained":		return g.ItemNeckRestraints && g.ItemNeckRestraints.itemName == "CollarChainLong" ? "RemoveChainForItem" : "";
			case "NoFeetSpreader":	return g.ItemFeet && g.ItemFeet.itemName == "SpreaderMetal" ? "CannotBeUsedWithFeetSpreader" : "";
			case "CannotHaveWand":	return g.ItemArms && g.ItemArms.itemName == "FullLatexSuit" ? "CannotHaveWand" : "";
			case "CannotBeSuited":	return g.ItemVulva && g.ItemVulva.itemName == "WandBelt" ? "CannotHaveWand" : "";
			
			case "ToeTied":
				return g.ItemFeet && g.ItemFeet.itemName == "SpreaderMetal" 
						|| g.ItemLegs && g.ItemLegs.itemName == "WoodenHorse" 
						|| g.ItemDevices && g.ItemDevices.itemName == "OneBarPrison" 
						|| g.ItemDevices && g.ItemDevices.itemName == "SaddleStand"
					? "LegsCannotClose" : "";
			
			//an item group must be filled
			case "Collared":		return g.ItemNeck ? "" : "MustCollaredFirst";
			
			//a pose shouldn't be in the list
			case "LegsOpen":			return appearance.poses.includes("LegsClosed")		? "LegsCannotOpen" : "";
			case "NotKneeling":			return appearance.poses.includes("Kneel")			? "MustStandUpFirst" : "";
			case "NotHorse":			return appearance.poses.includes("Horse")			? "CannotBeUsedWhenMounted" : "";
			case "NotHogtied":			return appearance.poses.includes("Hogtied")			? "ReleaseHogtieForItem" : "";
			case "NotYoked":			return appearance.poses.includes("Yoked")			? "CannotBeUsedWhenYoked" : "";
			case "NotKneelingSpread":	return appearance.poses.includes("KneelingSpread")	? "MustStandUpFirst" : "";
			case "NotSuspended":		return appearance.poses.includes("Suspension")		? "RemoveSuspensionForItem" : "";
			case "AllFours":			return appearance.poses.includes("AllFours") 		? "StraitDressOpen" : "";
			case "StraitDressOpen":		return appearance.poses.includes("StraitDressOpen")	? "StraitDressOpen" : "";
			
			//effect shouldn't be in the list
			case "CanKneel":	return appearance.effects.includes("BlockKneel")? "MustBeAbleToKneel" : "";
			case "NotMounted":	return appearance.effects.includes("Mounted")	? "CannotBeUsedWhenMounted" : "";
			case "NotChaste":	return appearance.effects.includes("Chaste")	? "RemoveChastityFirst" : "";
			case "NotShackled":	return appearance.effects.includes("Shackled")	? "RemoveShacklesFirst" : "";
			
			//Clothes may block
			case "AccessTorso":	return this.AppItemsExpose(g, ["Cloth"], "ItemTorso") ? "" : "RemoveClothesForItem";
			case "AccessBreast": this.AppItemsExpose(g, ["Cloth", "Bra"], "ItemBreast") ? "" : "RemoveClothesForItem";
			case "AccessBreastSuitZip": return this.AppItemsExpose(g, ["Cloth", "Suit"], "ItemNipplesPiercings") ? "" : "UnZipSuitForItem";
			case "AccessVulva": 
				var exposed = this.AppItemsExpose(g, ["ClothLower", "SuitLower", "Panties", "Socks"], "ItemVulva");
				var blocked = this.AppItemsBlock(g, ["Socks"], "ItemVulva");
				return (blocked || ! exposed) ? "RemoveClothesForItem" : "";
			
			case "GagUnique":
				var appliedGag = g.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth.Items[g.ItemMouth.itemName] : null;
				if(appliedGag && appliedGag.Prerequisite == "GagFlat") return "CannotBeUsedOverFlatGag"
				if(appliedGag && appliedGag.Prerequisite == "GagCorset") return "CannotBeUsedOverFlatGag"
				
				var appliedGag2 = g.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth2.Items[g.ItemMouth.itemName] : null;
				if(appliedGag2 && appliedGag2.Prerequisite == "GagFlat") return "CannotBeUsedOverFlatGag"
				if(appliedGag2 && appliedGag2.Prerequisite == "GagCorset") return "CannotBeUsedOverFlatGag"
				
				return "";
		}
		
		//if (Prerequisite == "CannotBeHogtiedWithAlphaHood") return ((InventoryGet(C, "ItemHead") != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite.indexOf("NotHogtied") >= 0)) ? "CannotBeHogtiedWithAlphaHood" : "";
		return "";
	}
	
	,AppItemsExpose(appearanceItems, groups, exposition){	
		for(var i = 0; i < groups.length; i++){
			if(! appearanceItems[groups[i]]) continue;			
			var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
			if(assetItem && assetItem.Expose && !assetItem.Expose.includes(exposition)) return false;
		}
		return true;
	}
	,AppItemsBlock(appearanceItems, groups, expositiion){
		for(var i = 0; i < groups.length; i++){
			if(! appearanceItems[groups[i]]) continue;			
			var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
			if(assetItem && assetItem.Block && !assetItem.Block.includes(exposition)) return false;
		}
		return false;
	}
	
	
	,ValidateChangePoseSelf(player){
		var [poses, effects] = F3dcgAssets.GetPosesAndEffects(player);	
		var intersectionEffects = ["Freeze", "ForceKneel"].filter(el => effects.includes(el));
		var intersectionPoses = ["LegsClosed", "Supension", "Hogtied"].filter(el => poses.includes(el));
		
		return intersectionEffects.length == 0 && intersectionPoses.length == 0;
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







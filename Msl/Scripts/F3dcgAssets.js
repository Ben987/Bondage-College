'use strict'

var F3dcgAssets = {
	BODY:"body"//this category has to have a selection, and is determined by AllowNone === false
	,EXPRESSION:"expression"//different structure in asset items
	,CLOTHING:"clothing"//difference between clothing, accessory and toy is arbitrary
	,ACCESSORY:"accessory"
	,RESTRAINT:"restraint"//determined by IsRestraint == true
	,TOY:"toy"
	,PADLOCK:"padlock"
	
	,UNIMPLEMENTED_ITEMS:["SpankingToys", "DildoPlugGag", "PlugGag"
			,"CollarNameTag", "CollarNameTagLivestock", "CollarNameTagLover"
			,"CollarNameTagOval", "CollarNameTagPet", "CollarShockUnit"]
	
	,POSE_None:"None"
	,POSE_KNEELEING:"Kneel"
	
	,F3DCG_ASSET_BASE:"../BondageClub/Assets/Female3DCG/"//
	,F3DCG_TYPE_ICON_BASE:"../BondageClub/Screens/Inventory/"//ItemArms/OrnateCuffs/Elbow.png None.png
	
	,Padlocks:{}
	,ItemGroups:{}
	,Poses:{}
	,Init(){
		F3dcgAssetsAdd.Init();
		F3dcgAssetVariants.Init();
	}
	
	//returns the sorted item array
	,BuildPlayerAppearance(mainPlayerAccount, locationPlayer, Appearance){
		//array of items to return
		var appearance = F3dcgAssetsAdd.InitAppearance();
		
		//other local variables
		var height, groupedAppItems = {}, itemGroupsToTranslateByPose = {}, 
				itemGroupsToHideByPose = [], itemGroupsToHideByItem = [], itemsToHideByItems = [];
		
		//convert array to hash map, take care of non assets and globals such as height and poses
		Appearance.forEach(AppItem => {
			if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(AppItem.Name)) return;
			
			//assign item to slot (group)
			groupedAppItems[AppItem.Group] = AppItem;
			
			if(F3dcgAssets.ItemGroups[AppItem.Group].type == this.EXPRESSION) return;
			//record the current pose from player appearance
			AppItem.Property?.SetPose?.forEach(pose => appearance.poses.push(pose));
			
			//record the current pose from asset Item
			var AssetItem = F3dcgAssets.ItemGroups[AppItem.Group].Items[AppItem.Name];
			if(! AssetItem) console.log(AppItem);
			
			if(AssetItem.Height) appearance.top -= AssetItem.Height;
			if(AppItem.Group == "Height")	appearance.scale = AssetItem.Zoom;
			
			var variantName = AppItem.Property?.Type;
			if(! variantName) variantName = AppItem.Property?.Restraint;
			if(! variantName && AssetItem.Variants) variantName = Object.keys(AssetItem.Variants)[0];			
			if(variantName){
				if(!  AssetItem.Variants) {console.log("Variants not defined for " + AppItem.Name + " " + AppItem.Group);return;}
				var AssetVariant = AssetItem.Variants[variantName];
				
				if(AssetVariant.Property?.SetPose)
					AssetVariant.Property.SetPose.forEach(poseName => appearance.poses.push(poseName));
				else
					AssetItem.SetPose?.forEach(poseName => appearance.poses.push(poseName));
				
				if(AssetVariant.Property?.Effect)
					AssetVariant.Property.Effect.forEach(effectName => appearance.effects.push(effectName));
				else
					AssetItem.Effect?.forEach(effectName => appearance.effects.push(effectName));					
				
				if(AssetVariant.Property?.Block)
					AssetVariant.Property.Block.forEach(blockName => appearance.blocks.push(blockName));
				else
					AssetItem.Block?.forEach(blockName => appearance.blocks.push(blockName));
				
				//if(AssetVariant.HideItem)
					//AssetVariant.HideItem.forEach(blockName => itemsToHideByItems.push(blockName));
				//else
					AssetItem.HideItem?.forEach(blockName => itemsToHideByItems.push(blockName));
				
				if(AssetVariant.Property?.Hide)
					AssetVariant.Property.Hide.forEach(itemGroupName => itemGroupsToHideByItem.push(itemGroupName));
				else
					AssetItem.Hide?.forEach(itemGroupName => itemGroupsToHideByItem.push(itemGroupName));	
			}else{
				AssetItem.SetPose?.forEach(poseName => appearance.poses.push(poseName));
				AssetItem.Effect?.forEach(effectName => appearance.effects.push(effectName));
				AssetItem.Block?.forEach(blockName => appearance.blocks.push(blockName));
				AssetItem.HideItem?.forEach(blockName => itemsToHideByItems.push(blockName));
				AssetItem.Hide?.forEach(itemGroupName => itemGroupsToHideByItem.push(itemGroupName));				
			}
		});
		
		if(locationPlayer.activePose == this.POSE_KNEELEING) appearance.poses.push("Kneel");
		appearance.poses.sort((poseName1, poseName2) => {F3dcgAssets.Poses[poseName1]?.priority - F3dcgAssets.Poses[poseName2]?.priority});
		
		//pose effects
		appearance.poses.forEach(poseName => {
			if(poseName == "Suspension") appearance.rotate = 180;
			
			if(F3dcgAssets.Poses[poseName]){
				var assetPose = F3dcgAssets.Poses[poseName];
				if(typeof(assetPose.OverrideHeight) !== "undefined") appearance.top = -assetPose.OverrideHeight;
				assetPose.Hide?.forEach(groupToHide => itemGroupsToHideByPose.push(groupToHide));
				assetPose.MovePosition?.forEach(move => itemGroupsToTranslateByPose[move.Group] = {left:move.X, top:move.Y});
			}
		});
		
		//fill the item array
		var appearanceItemList = [];
		for(var group in groupedAppItems){
			var AppItem = groupedAppItems[group];
			var AssetItemGroup = F3dcgAssets.ItemGroups[group];
			var AssetItem = AssetItemGroup.Items[ AssetItemGroup.type == this.EXPRESSION ? "None" : AppItem.Name ];//because expressions are special
			var AssetItemGroupParent = AssetItemGroup.ParentGroup ? F3dcgAssets.ItemGroups[AssetItemGroup.ParentGroup] : null;
			
			if(! AssetItem ) console.log(AssetItemGroup.Items);
			
			var appearanceItem = F3dcgAssetsAdd.InitAppearanceItem(AppItem, AssetItem, AssetItemGroup);//TODO separate item presentation from logic
			appearanceItemList.push(appearanceItem);
			
			F3dcgAssetsAdd.TranslateAppearanceItem(appearanceItem, itemGroupsToTranslateByPose[group]);
			F3dcgAssetsAdd.ColorizeApearanceItem(appearanceItem, AppItem, AssetItemGroup);
			F3dcgAssetsAdd.LockAppearanceItem(appearanceItem, AppItem, AssetItem, mainPlayerAccount, locationPlayer);
			
			//skip items hidden due to poses and other items.  Skip invisible 
			if(itemGroupsToHideByPose.includes(group)) continue;
			if(itemGroupsToHideByItem.includes(group)) continue;
			if(itemsToHideByItems.includes(AppItem.Name)) continue;
			
			//Items such as headphones are not rendered, the layer array is empty
			if(! AssetItemGroup.Wear && (AssetItem.Visible === false || AssetItemGroup.Visible === false)) continue;
			
			//compose the url of the item based on pose, body color, etc
			var urlPartPose = "";
			var allowedPoses = [];
			if(AssetItemGroup.AllowPose) AssetItemGroup.AllowPose.forEach(poseName => allowedPoses.push(poseName));
			if(AssetItem.AllowPose) AssetItem.AllowPose.forEach(poseName => allowedPoses.push(poseName));
			appearance.poses.forEach(poseName => {if(allowedPoses.includes(poseName)) urlPartPose = poseName + "/";});
			
			var urlPartGroup = AppItem.Group +"/", urlPartItemName = AppItem.Name, urlPartVariant = appearanceItem.itemVariantName ? appearanceItem.itemVariantName : "";
			if(AssetItem.Layer) {
				var urlPartParentAsset = AssetItemGroupParent && ! (AssetItem.IgnoreParentGroup === true) ? "_" + groupedAppItems[AssetItemGroupParent.Group].Name  :"";				
				AssetItem.Layer.forEach(AssetItemLayer => {					
					if(AssetItem.Variants){
						console.log(AssetItemLayer.Name  + " " + appearanceItem.itemVariantName);
					
						var isDefaultVariant = appearanceItem.itemVariantName == Object.keys(AssetItem.Variants)[0];
						var isDefaultLayer = !AssetItemLayer.AllowTypes;
						
						if(isDefaultVariant && AssetItemLayer.AllowTypes?.includes(""))
							urlPartVariant = "";
						else if(AssetItemLayer.AllowTypes && !AssetItemLayer.AllowTypes.includes(appearanceItem.itemVariantName)) 
							return;
						else if(AssetItemLayer.AllowTypes && !AssetItemLayer.AllowTypes.includes(appearanceItem.itemVariantName))
							urlPartVariant = AssetItemLayer.Name;
						else
							urlPartVariant = "";
						
					}
					
					if(urlPartPose) urlPartVariant = ""; //ornate cuffs
					
					var urlPartLayerName = "_" + AssetItemLayer.Name;
					appearanceItem.layers.push({colorize:AssetItemLayer.AllowColorize ? true : false
						,url:this.F3DCG_ASSET_BASE + urlPartGroup + urlPartPose + urlPartItemName + urlPartParentAsset + urlPartLayerName + urlPartVariant + ".png"
					});
				});
				//if(AppItem.lock) item.urlLock = urlPartGroup + urlPartPose + urlPartItemName + "_Lock.png";  Looks like layered items never have locks rendered
			} else {
				var urlPartParentAsset = AssetItemGroupParent && ! (AssetItem.IgnoreParentGroup === true) ? "_" + groupedAppItems[AssetItemGroupParent.Group].Name : "";
				var urlPartExpression = AssetItemGroup.AllowExpression && AppItem.Property?.Expression ? AppItem.Property.Expression + "/" : "";
				var urlPartBodyColor = ["BodyUpper", "BodyLower", "Hands"].includes(AppItem.Group) ? "_" + AppItem.Color : "";
				
				if(AssetItem.Variants)
					urlPartVariant = urlPartVariant == Object.keys(AssetItem.Variants)[0] ? "" : urlPartVariant;
				
				if(urlPartPose) urlPartVariant = ""; //Leather cuffs				
				
				var url = this.F3DCG_ASSET_BASE + urlPartGroup + urlPartPose + urlPartExpression + urlPartItemName + urlPartBodyColor + urlPartParentAsset + urlPartVariant + ".png";
				appearanceItem.layers.push({url:url, colorize: true});
				
				if(appearanceItem.lock) appearanceItem.layers.push({url:this.F3DCG_ASSET_BASE + urlPartGroup + urlPartPose + urlPartItemName + "_Lock.png", colorize:false});
			}
			

		}
		
		//sort the item array in order of rendring
		appearanceItemList.sort((item1, item2) => {return item1.priority - item2.priority;});
		appearanceItemList.forEach(appearanceItem => appearance.items[appearanceItem.itemGroupName] = appearanceItem);		
		
		F3dcgAssetsAdd.AdjustEyes(appearance.items.Eyes);
		
		return appearance;
	}
	
	
	,BuildPlayerInventory(mainPlayerAccount, locationPlayer, Inventory, appearance){
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
		
		for(var itemGroupName in F3dcgAssets.ItemGroups){
			var AssetItemGroup = F3dcgAssets.ItemGroups[itemGroupName];
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
			var AssetItemGroup = F3dcgAssets.ItemGroups[InventoryItem.Group];
			if(!AssetItemGroup.type || !inventory[AssetItemGroup.type][InventoryItem.Group]) return;
			inventory[AssetItemGroup.type][InventoryItem.Group][InventoryItem.Name].owned = true;
		});
		
		this.FillInventoryValidation(mainPlayerAccount, locationPlayer, inventory, appearance);
		
		return {items:inventory, locks:locks, keys:keys};
	}
	
	
	,DeconvertItemAndUpdateAppearance(Appearance, appearanceItem){
		if(appearanceItem.itemName == "None"){
			for(var i = 0; i < Appearance.length; i++)
				if(Appearance[i].Group == appearanceItem.itemGroupName)
					Appearance.splice(i, 1);
		}else{
			var AppItem = this.DeconvertItem(appearanceItem);
			var AppItemExisting = Appearance.find(el => el.Group == appearanceItem.itemGroupName);
			if(AppItemExisting){
				Util.ReplaceInPlace(AppItemExisting, AppItem);
			}else{
				Appearance.push(AppItem)
			}
		}
	}
	
	
	,DeconvertItem(appearanceItem){
		return F3dcgAssetsAdd.DeconvertItem(appearanceItem);
	}
	
 	,InitAppearanceItem(itemGroupTypeName, itemGroupName, itemName){
		var assetItemGroup = F3dcgAssets.ItemGroups[itemGroupName];
		var assetItem = assetItemGroup.Items[itemGroupTypeName == this.EXPRESSION ? "None" : itemName];//because expressions are special
		return itemName == "None" ? {itemGroupName:itemGroupName,itemName:itemName,itemGroupTypeName:assetItemGroup.type} 
				: F3dcgAssetsAdd.InitAppearanceItem({Group:itemGroupName,Name:itemName}, assetItem, assetItemGroup);
	}
	
	,InitAppearanceItemLock(itemNameLock, playerId){
		return F3dcgAssetsAdd.InitAppearanceItemLock(itemNameLock, playerId);
	}
	
/*	
	,PlayerIsRestrained(player){
		var itemNoRestrainWhenNullPose = ["OrnateAnkleCuffs", "OrnateLegCuffs", "OrnateCuffs", "LeatherAnkleCuffs", "LeatherLegCuffs", "LeatherCuffs"];
		
		for(var i = 0; i < player.Appearance.length; i++){
			var AppearanceItem = player.Appearance[i];
			var itemGroup = F3dcgAssets.ItemGroups[AppearanceItem.Group];
			
			if(itemGroup.type == F3dcgAssets.RESTRAINT){
				if(F3dcgAssets.itemNoRestrainWhenNullPose.includes(AppearanceItem.Name)){
					if(AppearanceItem.Property && AppearanceItem.Property.SetPose && AppearanceItem.Property.SetPose.length > 0){
						return false;
					}//else continue
				}else{
					return false;
				}
			}
		};
		
		return true;
	}*/
	
	
	,FillInventoryValidation(mainPlayerAccount, locationPlayer, inventory, appearance){
		//var [poses, effects, blocks] = F3dcgAssets.GetPosesAndEffects(appearance);
		
		for(var igtN in inventory){
			for(var igN in inventory[igtN]){
				for(var iN in inventory[igtN][igN]){
					var inventoryItem = inventory[igtN][igN][iN];
					inventoryItem.validation = [];
					if(appearance.blocks.includes(igN)) inventoryItem.validation.push("Blocked");
					
					var AssetItem = F3dcgAssets.ItemGroups[igN]?.Items[iN];
					if(AssetItem?.Prerequisite){
						var prereqs = AssetItem.Prerequisite.forEach ? AssetItem.Prerequisite : [AssetItem.Prerequisite];
						
						prereqs.forEach(prereq => {
							var errorReason = F3dcgAssets.ValidatePrerequisite(prereq, appearance);
							if(errorReason.length > 0) inventoryItem.validation.push(errorReason);
						});
					}
					
					for(var variantName in AssetItem?.Variants){
						inventoryItem.variants[variantName].validation = [];
						
						AssetItem.Variants[variantName].Prerequisite?.forEach(prereq =>{
							var errorReason = F3dcgAssets.ValidatePrerequisite(prereq, appearance);	
							if(errorReason.length > 0) inventoryItem.variants[variantName].validation.push(errorReason);
						});
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
			case "NotChained":		return g.ItemNeckRestraints?.itemName == "CollarChainLong" ? "RemoveChainForItem" : "";
			case "NoFeetSpreader":	return g.ItemFeet?.itemName == "SpreaderMetal" ? "CannotBeUsedWithFeetSpreader" : "";
			case "CannotHaveWand":	return g.ItemArms?.itemName == "FullLatexSuit" ? "CannotHaveWand" : "";
			case "CannotBeSuited":	return g.ItemVulva?.itemName == "WandBelt" ? "CannotHaveWand" : "";
			
			case "ToeTied":
				return g.ItemFeet?.itemName == "SpreaderMetal" || g.ItemLegs?.itemName == "WoodenHorse" 
						|| g.ItemDevices?.itemName == "OneBarPrison" || g.ItemDevices?.itemName == "SaddleStand"
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
				if(F3dcgAssets.ItemGroups.ItemMouth.Items[g.ItemMouth?.itemName]?.Prerequisite == "GagFlat") return "CannotBeUsedOverFlatGag";
				if(F3dcgAssets.ItemGroups.ItemMouth.Items[g.ItemMouth2?.itemName]?.Prerequisite == "GagFlat") return "CannotBeUsedOverFlatGag";
				if(F3dcgAssets.ItemGroups.ItemMouth.Items[g.ItemMouth?.itemName]?.Prerequisite == "GagCorset") return "CannotBeUsedOverFlatGag";
				if(F3dcgAssets.ItemGroups.ItemMouth.Items[g.ItemMouth2?.itemName]?.Prerequisite == "GagCorset") return "CannotBeUsedOverFlatGag";
				return "";
		}
		
		//if (Prerequisite == "CannotBeHogtiedWithAlphaHood") return ((InventoryGet(C, "ItemHead") != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite.indexOf("NotHogtied") >= 0)) ? "CannotBeHogtiedWithAlphaHood" : "";
		return "";
	}
	
	,AppItemsExpose(appearanceItems, groupList, exposition){	
		for(var i = 0; i < groupList.length; i++){
			var assetItem = F3dcgAssets.ItemGroups.Cloth.Items[appearanceItems[groupList[i]]?.itemName];
			if(assetItem && !assetItem.Expose?.includes(exposition)) return false;
		}
		return true;
	}
	,AppItemsBlock(appearanceItems, groupList, expositiion){
		for(var i = 0; i < groupList.length; i++){
			var assetItem = F3dcgAssets.ItemGroups.Cloth.Items[appearanceItems[groupList[i]]?.itemName];
			if(assetItem && !assetItem.Block?.includes(exposition)) return false;
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
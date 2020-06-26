
F3dcgAssets.BuildEffects = function(playerAppearance){
	var result = [];
	
	var groupTypes = [F3dcgAssets.BONDAGE_TOY];
	for(var i = 0; i < groupTypes.length; i++){
		for(var groupName in playerAppearance[groupTypes[i]]){
			var item = playerAppearance[groupTypes[i]][groupName];
			if(! item) continue;
			var AssetGroup = F3dcgAssets.AssetGroups[groupName], AssetItem = AssetGroup.Items[item.name], AssetVariant = AssetItem.Variant ? AssetItem.Variant[item.variant] : null;			
			
			if(item.variant)
				if(! AssetItem.Variants) {console.log("Variants not defined for " + AssetItem.Name + " " + AssetItem.Group);continue;}
			
			if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Effect)
				result.push(...AssetVariant.Property.Effect)
			else if(AssetItem.Effect)
				result.push(...AssetItem.Effect)
		}
	}
	return result;;
}

F3dcgAssets.BuildPosesEffectsBlocks = function(playerAppearance){
	var result = {poses:[],effects:[],blocks:[]}
	
	var groupTypes = [F3dcgAssets.BONDAGE_TOY, F3dcgAssets.CLOTH];
	for(var i = 0; i < groupTypes.length; i++){
		for(var groupName in playerAppearance[groupTypes[i]]){
			var item = playerAppearance[groupTypes[i]][groupName];
			if(! item) continue;
			var AssetGroup = F3dcgAssets.AssetGroups[groupName], AssetItem = AssetGroup.Items[item.name], AssetVariant = AssetItem.Variant ? AssetItem.Variant[item.variant] : null;			
			
			//if(AssetItem.Height) result.top -= AssetItem.Height;
			
			if(item.variant && ! AssetItem.Variant) {console.log("Variants not defined for " + AssetItem.Name + " " + AssetItem.Group);continue;}
			
			if(AssetVariant && AssetVariant.Property && AssetVariant.Property.SetPose)
				result.poses.push(...AssetVariant.Property.SetPose);
			else if(AssetItem.SetPose)
				result.poses.push(...AssetItem.SetPose);
			
			if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Effect)
				result.effects.push(...AssetVariant.Property.Effect)
			else if(AssetItem.Effect)
				result.effects.push(...AssetItem.Effect)				
			
			if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Block)
				result.blocks.push(...AssetVariant.Property.Block);
			else if(AssetItem.Block)
				result.blocks.push(...AssetItem.Block)
		}
	}
	
	return result;;
}

//Server side validation, also executed by client for ease of debugging
//Null PlayerOrigin means self aplication
//All validation checks should have been performed before we arrive here -- redo to throw exception immediately
//A single validaton error invalidates the whole batch.
//1.  Check that the asset item exists
//2.  if self, allow Body, Accessory, Expression, otherwise do not permit.
//3.  for all item group types other than Expression and Body, check that item is owned by either player.
//4.  Check that the origin player can change the item group type ("block" effect prevents Bondage toys);
//5.  if not self, check a. player not blacklisted or ghostlisted, b. origin player either whitelisted or meets the permission setting requirement for the item group type
//6.  clothes and bondage toys are subject to additional validation rules.
//7.  TODO sanitize input.
//8.  TODO: revise lock management
F3dcgAssets.ValidateUpdateAppearanceOrThrow = function(appearanceUpdate, playerTarget, playerOrigin){
	var bondageToyUpdated = false;
	
	//Individual item checks
	for(var groupName in appearanceUpdate){
		//Check that the asset item exists
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		if(! AssetGroup) throw "GroupNotFound " + groupName;
		
		var AssetItem;
		var playerOriginEffects = playerOrigin ? F3dcgAssets.BuildEffects(playerOrigin.appearance) : [];
		var posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance);
		var item = appearanceUpdate[groupName];
		var previousItem = playerTarget.appearance[AssetGroup.type][groupName];
		
		if(appearanceUpdate[groupName]){
			AssetItem = AssetGroup.Items[item.name];
			if(! AssetItem) throw "ItemNotFound " + item.name;
		}
		
		//Check that item is owned and not blacklisted
		if(! F3dcgAssets.IsItemOwned(item, AssetGroup, playerTarget, playerOrigin)) throw "ItemNotOwned " + item.name;
		if(F3dcgAssets.IsItemBlacklisted(item, playerTarget)) throw "ItemBlacklisted " + item.name
		
		if(posesEffectsBlocks.blocks.includes(groupName)) throw "ItemGroupBlocked " + groupName;
		
		switch(AssetGroup.type){//the suit type is never propagated here
			case F3dcgAssets.EXPRESSION:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			case F3dcgAssets.BODY:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			case F3dcgAssets.ACCESSORY:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			
			case F3dcgAssets.CLOTH:
				//The applying player must not be tied			
				if(playerOrigin){
					if(! F3dcgAssets.CanChangeClothes(playerOriginEffects)) throw "PlayerUnableChangeClothes " + groupName
				}else{
					if(! F3dcgAssets.CanChangeClothes(posesEffectsBlocks.effects)) throw "PlayerUnableChangeClothes " + groupName	
				}
				
				//TODO:  cache the result and do not call each iteration
				if(! F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.CLOTH, playerTarget, playerOrigin)) throw "PermissionDenied " + playerOrigin.id;
			break;
			
			//BondageToy items are subject to other items validation
			case F3dcgAssets.BONDAGE_TOY: 
				if(bondageToyUpdated) throw "BondageToyLimitExceeded";
				bondageToyUpdated = true;
				
				//A newly applied bondage toy item has to be in the default variant.
				if(item && item.variant){
					var prevItem = playerTarget.appearance[F3dcgAssets.BONDAGE_TOY][groupName];
					if(item.variant != Object.values(AssetItem.Variant)[0].Name)
						if(! prevItem ||  prevItem.name != item.name) 
							throw "NonDefaultVariantOnNewItem " + groupName;
				}
				
				if(previousItem && previousItem.lock && ! F3dcgAssets.CanUnlockItem(playerTarget, playerOrigin, previousItem)) throw "CanNotUnlock " + groupName + " " + previousItem.lock.name;
				if(item.lock) F3dcgAssets.ValidateLockOrThrow(playerTarget, playerOrigin, item.lock);
				
				//The applying player must not be tied
				if(playerOrigin){
					if(! F3dcgAssets.CanChangeBondageToys(playerOriginEffects)) throw "PlayerUnableChangeBondageToys " + groupName
				}else{
					if(! F3dcgAssets.CanChangeBondageToys(posesEffectsBlocks.effects)) throw "PlayerUnableChangeBondageToys " + groupName
				}
				
				if(! F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.BONDAGE_TOY, playerTarget, playerOrigin)) throw "PermissionDenied " + playerOrigin.id;			
				
				if(AssetItem && AssetItem.Variant && ! AssetItem.Variant[item.variant]) throw "VariantNotFound " + item.variant;
				
				if(item){
					var Prerequisite = item.variant && AssetItem.Variant[item.variant].Prerequisite ?  AssetItem.Variant[item.variant].Prerequisite : AssetItem.Prerequisite;
					if(Prerequisite){
						for(var i = 0; i < Prerequisite.length; i++){
							var errorReason = F3dcgAssets.ValidatePrerequisite(Prerequisite[i], playerTarget.appearance, posesEffectsBlocks);
							if(errorReason.length > 0) throw errorReason;
						}
					}
				}
			break;
			default:
				throw "UnhandledGroupType " + AssetGroup.type;
		}
	}
	return [];
}

F3dcgAssets.ValidateLockOrThrow = function(playerTarget, playerOrigin, lock){
	//TODO:  revise update of timer lock properties and combo locks
}



F3dcgAssets.IsPlayerFriendListed = function(playerTarget, playerOrigin){return playerTarget.profile.ghosts.includes(playerOrigin.id);}
F3dcgAssets.IsPlayerGhostListed = function(playerTarget, playerOrigin){return  playerTarget.profile.friends.includes(playerOrigin.id);}
F3dcgAssets.IsPlayerBlackListed = function(playerTarget, playerOrigin){return playerTarget.permissions.players.black.includes(playerOrigin.id);}
F3dcgAssets.IsPlayerWhiteListed = function(playerTarget, playerOrigin){return playerTarget.permissions.players.white.includes(playerOrigin.id);}
F3dcgAssets.IsPlayerOwner = function(playerTarget, playerOrigin){return playerTarget.profile.owner && playerTarget.profile.owner.id == playerOrigin.id;}

F3dcgAssets.IsPlayerLover = function(playerTarget, playerOrigin){return playerTarget.club.lover && playerTarget.club.lover.id == playerOrigin.id;}
F3dcgAssets.IsPlayerDomEnough = function(playerTarget, playerOrigin){return playerOrigin.club.reputation.Dominant - playerTarget.club.reputation.Dominant >= -25;}
F3dcgAssets.IsPlayerClubMistress = function(player){return player.club.jobs.mistress && player.club.jobs.mistress.active;}
	
F3dcgAssets.DoesPlayerHavePermission = function(permissionActionType, pT, pO){
	if(! pO || pT.id == pO.id) return true; //self application
	//console.log("Checking " + permissionActionType + " level " + pT.permissions.actions[permissionActionType]);
	
	//console.log("black " + this.IsPlayerBlackListed(pT, pO));
	//console.log("domEnough " + this.IsPlayerDomEnough(pT, pO));
	//console.log("white " + this.IsPlayerWhiteListed(pT, pO));
	
	switch(pT.permissions.actions[permissionActionType]){
		case "0": case 0: return ! this.IsPlayerGhostListed(pT, pO); //everyone but ghostlist
		case "1": case 1: return ! this.IsPlayerGhostListed(pT, pO) && ! this.IsPlayerBlackListed(pT, pO); //everyone but blacklist
		case "2": case 2: //Any Dom and whitelist
			return this.IsPlayerWhiteListed(pT, pO) 
					|| (! ! this.IsPlayerGhostListed(pT, pO) && ! this.IsPlayerBlackListed(pT, pO) && this.IsPlayerDomEnough(pT, pO));
		case "3": case 3: return this.IsPlayerOwner(pT, pO) || this.IsPlayerLover(pT, pO) || this.IsPlayerWhiteListed(pT, pO); //Owner, lover, whitelist
		case "4": case 4: return this.IsPlayerOwner(pT, pO) || this.IsPlayerLover(pT, pO);  //Owner, lover
		case "5": case 5: return this.IsPlayerOwner(pT, pO); //Owner only		
		default: throw "Unimplemented permission type " + pT.permissions.actions[permissionActionType];
	}
}


F3dcgAssets.IsItemBlacklisted = function(item, playerTarget) {
	if(!item) return false;
	if(playerTarget.permissions.items.black.includes(item.name)) return true;
	return false;
}

F3dcgAssets.IsItemOwned = function(item, AssetGroup, playerTarget, playerOrigin) {
	if(null == item) return true;
	if(AssetGroup.type == F3dcgAssets.BODY || AssetGroup.type == F3dcgAssets.EXPRESSION) return true;
	if(AssetGroup.type == F3dcgAssets.CLOTH && F3dcgAssets.ClothesFree.includes(item.name)) return true;
	
	var currentItem = playerTarget.appearance[AssetGroup.type][AssetGroup.Group];
	if(currentItem && currentItem.name == item.name) return true;
	
	if(playerTarget.inventory[AssetGroup.type].includes(item.name) || (playerOrigin && playerOrigin.inventory[AssetGroup.type].includes(item.name)))
		return true;
	
	return false;
}


F3dcgAssets.CanUnlockItem = function(playerTarget, playerOrigin, appearanceItem){
	if(! appearanceItem.lock) throw "Lock not on item " + appearanceItem.name;
	
	if(appearanceItem.lock.name == "TimerPadlock") return false;
	if(appearanceItem.lock.name == "CombinationPadlock") return false;
	
	var locksKeys = playerOrigin ? playerOrigin.inventory.locksKeys : playerTarget.locksKeys;
	
	if(appearanceItem.lock.name == "MetalPadlock") 
		return locksKeys.includes("MetalPadlockKey");
	
	if(appearanceItem.lock.name == "IntricatePadlock") 
		return locksKeys.includes("IntricatePadlockKey");
	
	if(appearanceItem.lock.name == "MistressPadlock" || appearanceItem.lock.name == "MistressTimerPadlock"){ 
		var player = playerOrigin ? playerOrigin : playerTarget; //mistress may lock oneself
		return this.IsPlayerClubMistress(player) && locksKeys.includes("MistressPadlockKey");
	}
	
	if(appearanceItem.lock.name == "OwnerPadlock" || appearanceItem.lock.name == "OwnerTimerPadlock"){
		if(! playerOrigin) return false;//no self locking by owner lock
		return playerOrigin && this.IsPlayerOwner(playerTarget, playerOrigin) && locksKeys.includes("OwnerPadlockKey");	
	}
	
	if(appearanceItem.lock.name == "ExclusivePadlock")
		return playerOrigin && playerOrigin.id != playerTarget.id
	
	throw appearanceItem.lock.name;
}


F3dcgAssets.CanChangeClothes = function(effects){
	if(effects.includes("Block")) return false;
	if(effects.includes("Freeze")) return false; 
	if(effects.includes("Prone")) return false;	
	return true;
}


F3dcgAssets.CanChangeBondageToys = function(effects){
	if(effects.includes("Block")) return false;
	return true;
}


F3dcgAssets.ValidateCanChangePose = function(posesEffectsBlocks){
	//var posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(player.appearance);
	if(posesEffectsBlocks.effects.includes("Freeze")) return "CanNotChangePose " + "Freeeze";
	if(posesEffectsBlocks.effects.includes("ForceKneel")) return "CanNotChangePose " + "ForceKneel";
	if(posesEffectsBlocks.poses.includes("LegsClosed")) return "CanNotChangePose " + "LegsClosed";
	if(posesEffectsBlocks.poses.includes("Supension")) return "CanNotChangePose " + "Supension";
	if(posesEffectsBlocks.poses.includes("Hogtied")) return "CanNotChangePose " + "Hogtied";
}


F3dcgAssets.ValidatePrerequisite = function(prerequisite, appearance, posesEffectsBlocks) {
	// Basic prerequisites that can apply to many items
	var c = appearance[F3dcgAssets.CLOTH];
	var b = appearance[F3dcgAssets.BONDAGE_TOY];
	
	var poses = posesEffectsBlocks.poses;
	var blocks = posesEffectsBlocks.blocks;
	var effects = posesEffectsBlocks.effects;
	
	switch(prerequisite){
		//Item group must be empty
		case "NoItemFeet":  	return b.ItemFeet ? "MustFreeFeetFirst" : "";
		case "NoItemLegs":  	return b.ItemLegs ? "MustFreeLegsFirst" : "";
		case "NoItemHands":	  	return b.ItemHands ? "MustFreeHandsFirst" : "";
		case "NakedCloth":		return c.Cloth ? "RemoveClothesForItem" : "";
		case "NakedClothLower":	return c.ClothLower ? "RemoveClothesForItem" : "";
		case "NakedFeet":	  	return b.ItemBoots || c.Socks || c.Shoes ? "RemoveClothesForItem" : "";
		case "NakedHands":	  	return b.ItemHands || c.Gloves ? "RemoveClothesForItem" : "";
		case "DisplayFrame":	
			if(b.ItemArms || b.ItemLegs || b.ItemFeet || b.ItemBoots) return "RemoveRestraintsFirst";
			if(c.Cloth || c.ClothLower || c.Shoes) return "RemoveClothesForItem";
			return "";
		
		//specific item must be absent 
		case "NotChained":		return b.ItemNeckRestraints && b.ItemNeckRestraints.itemName == "CollarChainLong" ? "RemoveChainForItem" : "";
		case "NoFeetSpreader":	return b.ItemFeet && b.ItemFeet.itemName == "SpreaderMetal" ? "CannotBeUsedWithFeetSpreader" : "";
		case "CannotHaveWand":	return b.ItemArms && b.ItemArms.itemName == "FullLatexSuit" ? "CannotHaveWand" : "";
		case "CannotBeSuited":	return b.ItemVulva && b.ItemVulva.itemName == "WandBelt" ? "CannotHaveWand" : "";
		
		case "ToeTied":
			return b.ItemFeet && b.ItemFeet.itemName == "SpreaderMetal" 
					|| b.ItemLegs && b.ItemLegs.itemName == "WoodenHorse" 
					|| b.ItemDevices && b.ItemDevices.itemName == "OneBarPrison" 
					|| b.ItemDevices && b.ItemDevices.itemName == "SaddleStand"
				? "LegsCannotClose" : "";
		
		//an item group must be filled
		case "Collared":		return b.ItemNeck ? "" : "MustCollaredFirst";
		
		//a pose shouldn't be in the list
		case "LegsOpen":			return poses.includes("LegsClosed")		? "LegsCannotOpen" : "";
		case "NotKneeling":			return poses.includes("Kneel")			? "MustStandUpFirst" : "";
		case "NotHorse":			return poses.includes("Horse")			? "CannotBeUsedWhenMounted" : "";
		case "NotHogtied":			return poses.includes("Hogtied")		? "ReleaseHogtieForItem" : "";
		case "NotYoked":			return poses.includes("Yoked")			? "CannotBeUsedWhenYoked" : "";
		case "NotKneelingSpread":	return poses.includes("KneelingSpread")	? "MustStandUpFirst" : "";
		case "NotSuspended":		return poses.includes("Suspension")		? "RemoveSuspensionForItem" : "";
		case "AllFours":			return poses.includes("AllFours") 		? "StraitDressOpen" : "";
		case "StraitDressOpen":		return poses.includes("StraitDressOpen")? "StraitDressOpen" : "";
		
		//effect shouldn't be in the list
		case "CanKneel":	return effects.includes("BlockKneel")? "MustBeAbleToKneel" : "";
		case "NotMounted":	return effects.includes("Mounted")	? "CannotBeUsedWhenMounted" : "";
		case "NotChaste":	return effects.includes("Chaste")	? "RemoveChastityFirst" : "";
		case "NotShackled":	return effects.includes("Shackled")	? "RemoveShacklesFirst" : "";
		
		//Clothes may block
		case "AccessTorso":	return this.AppItemsExpose(c, ["Cloth"], "ItemTorso") ? "" : "RemoveClothesForItem";
		case "AccessBreast": this.AppItemsExpose(c, ["Cloth", "Bra"], "ItemBreast") ? "" : "RemoveClothesForItem";
		case "AccessBreastSuitZip": return this.AppItemsExpose(c, ["Cloth", "Suit"], "ItemNipplesPiercings") ? "" : "UnZipSuitForItem";
		case "AccessVulva": 
			var exposed = this.AppItemsExpose(c, ["ClothLower", "SuitLower", "Panties", "Socks"], "ItemVulva");
			var blocked = this.AppItemsBlock(c, ["Socks"], "ItemVulva");
			return (blocked || ! exposed) ? "RemoveClothesForItem" : "";
		
		case "GagUnique":
			var appliedGag = b.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth.Items[b.ItemMouth.itemName] : null;
			if(appliedGag && appliedGag.Prerequisite.includes("GagFlat")) return "CannotBeUsedOverFlatGag"
			if(appliedGag && appliedGag.Prerequisite.includes("GagCorset")) return "CannotBeUsedOverFlatGag"
			
			var appliedGag2 = b.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth2.Items[b.ItemMouth.itemName] : null;
			if(appliedGag2 && appliedGag2.Prerequisite.includes("GagFlat")) return "CannotBeUsedOverFlatGag"
			if(appliedGag2 && appliedGag2.Prerequisite.includes("GagCorset")) return "CannotBeUsedOverFlatGag"
			
			return "";
		
		case "AccessVulvaSuitZip":
		case "GagFlat":
		case "GagCorset":
		case "NoItemArms":
		case "NoHorse":
		case "NotMasked":
		case "OnBed":
		case "RemotesAllowed":
		case "GasMask":
			return "";//TODO
		
		default: 
			throw "UnhandledCase " + prerequisite;
	}
	
	//if (Prerequisite == "CannotBeHogtiedWithAlphaHood") return ((InventoryGet(C, "ItemHead") != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite.indexOf("NotHogtied") >= 0)) ? "CannotBeHogtiedWithAlphaHood" : "";
	return "";
}


F3dcgAssets.AppItemsExpose = function(appearanceItems, groups, exposition){
	for(var i = 0; i < groups.length; i++){
		if(! appearanceItems[groups[i]]) continue;
		var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
		if(assetItem && assetItem.Expose && !assetItem.Expose.includes(exposition)) return false;
	}
	return true;
}
	
F3dcgAssets.AppItemsBlock = function(appearanceItems, groups, expositiion){
	for(var i = 0; i < groups.length; i++){
		if(! appearanceItems[groups[i]]) continue;			
		var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
		if(assetItem && assetItem.Block && !assetItem.Block.includes(exposition)) return false;
	}
	return false;
}



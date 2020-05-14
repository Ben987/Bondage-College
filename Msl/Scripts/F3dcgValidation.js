var F3dcgValidation = {
	FillInventoryValidation(mainPlayerAccount, locationPlayer, inventory, appearance){
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
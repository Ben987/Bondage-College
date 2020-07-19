'use strict'

var F3dcgAssetsRender = {
	BuildAppearanceItemsEffects(appearance, activePose, playerThemeSettings){
		var result = {
			itemGroupsToTranslateByPose:{}
			,itemGroupsToHideByItem:[]
			,itemGroupsToHideByPose:[]
			,itemsToHideByItems:[]
			,itemsToDisableByThemes:[]
			,poses:[]
			,effects:[]
			,blocks:[]
			,top:0
			,rotate:0
			,scale:1.0
		};
		
		if(playerThemeSettings)
			for(var theme in playerThemeSettings)
				if(playerThemeSettings[theme] > 1)
					F3dcgAssets.ThemedItems[theme].forEach(itemName => result.itemsToDisableByThemes.push(itemName));		
		
		[appearance.bondageToys, appearance.clothes].forEach(appearanceItems => {
			for(var groupName in appearanceItems){
				var item = appearanceItems[groupName];
				
				if(! item) continue;
				if(result.itemsToDisableByThemes.includes(item.name)) continue;
				var AssetGroup = F3dcgAssets.AssetGroups[groupName], AssetItem = AssetGroup.Items[item.name];
				if(!AssetItem) console.log(item, Object.keys(AssetGroup.Items));
				var AssetVariant = AssetItem.Variant ? AssetItem.Variant[item.variant] : null;			
				
				if(AssetItem.Height) result.top -= AssetItem.Height;				
				
				if(item.variant)
					if(!  AssetItem.Variant) {console.log("Variants not defined for " + AssetItem.Name + " " + AssetItem.Group);continue;}
					
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
					
				//if(AssetVariant.HideItem)
					//AssetVariant.HideItem.forEach(blockName => itemsToHideByItems.push(blockName));
				//else
				if(AssetItem.HideItem)
					result.itemsToHideByItems.push(...AssetItem.HideItem);
					
				if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Hide)
					result.itemGroupsToHideByItem.push(...AssetVariant.Property.Hide);
				else if(AssetItem.Hide)
					result.itemGroupsToHideByItem.push(...AssetItem.Hide)
			}
		});
	
		if(activePose === F3dcgAssets.POSE_KNEEL) result.poses.push("Kneel");
		result.poses.sort((poseName1, poseName2) => {
			var p1 = F3dcgAssets.Poses[poseName1] ? F3dcgAssets.Poses[poseName1].priority : 0;
			var p2 = F3dcgAssets.Poses[poseName2] ? F3dcgAssets.Poses[poseName2].priority : 0;
			return p1 - p2;
		});
		
		//pose effects
		result.poses.forEach(poseName => {
			if(poseName == "Suspension") result.rotate = 180;
			
			if(F3dcgAssets.Poses[poseName]){
				var AssetPose = F3dcgAssets.Poses[poseName];
				if(typeof(AssetPose.OverrideHeight) !== "undefined") result.top = -AssetPose.OverrideHeight;
				if(AssetPose.Hide) AssetPose.Hide.forEach(groupToHide => result.itemGroupsToHideByItem.push(groupToHide));
				if(AssetPose.MovePosition) AssetPose.MovePosition.forEach(move => result.itemGroupsToTranslateByPose[move.Group] = {left:move.X, top:move.Y});
			}
		});
		
		result.scale = F3dcgAssets.AssetGroups.Height.Items[appearance.frame.height].Zoom;
		
		return result;
	}

	,InitRenderItem(AssetItemGroup, AssetItem){//AssetItem may be null
		var renderItem = {
			priority : AssetItem?.Priority ? AssetItem.Priority : AssetItemGroup.Priority
			,left : (AssetItem?.Left || AssetItem?.Left === 0 ? AssetItem.Left : AssetItemGroup.Left) || 0
			,top : (AssetItem?.Top || AssetItem?.Top === 0 ? AssetItem.Top : AssetItemGroup.Top) || 0
			,color:null
			,fullAlpha:AssetItemGroup.FullAlpha === false ? false : true
			,layers:[]//url and allow colorize
		}
		
		return renderItem;
	}
	
	,TranslateRenderItem(renderItem, translation){
		if(!translation) return;
		renderItem.left += translation.left;
		renderItem.top += translation.top;
	}
	
	
	,BuildRenderItem(AssetItemGroup, body, appearanceItemEffects, appearanceItem){
		var AssetItem = AssetItemGroup.Items[appearanceItem.name];
		
		var renderItem = this.InitRenderItem(AssetItemGroup, AssetItem);
		
		this.TranslateRenderItem(renderItem, appearanceItemEffects.itemGroupsToTranslateByPose[AssetItemGroup.Group]);
		
		var posePart = this.GetPoseUrlPart(AssetItemGroup, AssetItem, appearanceItemEffects.poses);
		var variantPart = appearanceItem.variant && appearanceItem.variant != "None" ?  appearanceItem.variant : "";
		var sizePart = AssetItemGroup.useBodySize  && ! (AssetItem.IgnoreParentGroup === true) ? "_" + body[AssetItemGroup.useBodySize] : "";
		
		var groupPart = AssetItemGroup.Group +"/";
		var itemPart =  AssetItem.Name.includes("_") ?  AssetItem.Name.split("_")[0] :  AssetItem.Name;
		
		if(AssetItem.Layer) {
			AssetItem.Layer.forEach(AssetItemLayer => {//multi laeyered multi variant items that reuse layers
				var renderItemLayer = {colorize:AssetItemLayer.AllowColorize ? true : false}
				renderItem.layers.push(renderItemLayer);
				
				var urlPartLayerName = AssetItemLayer.urlPart ? AssetItemLayer.urlPart : "_" + AssetItemLayer.Name;
				
				if(AssetItem.Variant && AssetItem.Variant[appearanceItem.variant].Layer){
					if(AssetItem.Variant[appearanceItem.variant].Layer.includes(AssetItemLayer.Name))
						variantPart = "";
					else{
						renderItem.layers.pop();
						return;
					}
					
					if(AssetItem.Name == "BondageBench"){
						if(	AssetItemLayer.Name == "Base") {
							urlPartLayerName = "";
						}else{
							groupPart = "ItemAddon/";
							itemPart = "BondageBenchStraps";
							sizePart = "";
							urlPartLayerName = AssetItemLayer.Name;
							renderItemLayer.priority = AssetItemLayer.Priority;
						}
					}else if(AssetItem.Name == "LeatherArmbinder"){
						if(	AssetItemLayer.Name == "Base") {
							urlPartLayerName = "";
						}else{
							groupPart = "ItemHidden/";
							sizePart = "";
							urlPartLayerName = AssetItemLayer.Name;
							renderItemLayer.priority = AssetItemLayer.Priority;	
							renderItemLayer.left = renderItemLayer.top = 1;
						}
					}
				}
				
				//if(posePart) variantPart = ""; //ornate cuffs
				if(posePart && AssetItem.AllowLock) variantPart = "";
				
				renderItemLayer.url = F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + sizePart + urlPartLayerName + variantPart + ".png";
			});
			
			if(appearanceItem.lock) renderItem.layers.push({colorize:false, priority:AssetItem.Priority, url:F3dcgAssets.F3DCG_ASSET_BASE + groupPart +  posePart + itemPart + "_Lock.png"});
			//item.urlLock = groupPart + posePart + itemPart + "_Lock.png";
		} else {
			if(AssetItem.Variant && appearanceItem.name != "SlaveCollar")
				variantPart = variantPart == Object.keys(AssetItem.Variant)[0] ? "" : variantPart;
			
			//if(posePart) variantPart = ""; //Leather cuffs
			if(posePart && AssetItem.AllowLock) variantPart = "";
			
			var url = F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + sizePart + variantPart + ".png";
			renderItem.layers.push({url:url, colorize: true});
			
			//if(appearanceItem.lock) appearanceItem.layers.push({url:F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + "_Lock.png", colorize:false});
			if(appearanceItem.lock) renderItem.layers.push({colorize:false, priority:AssetItem.Priority, url:F3dcgAssets.F3DCG_ASSET_BASE + groupPart +  posePart + itemPart + "_Lock.png"});
		}
		
		if(AssetItemGroup.AllowColorize !== false){
			renderItem.colorize = true;
			if(appearanceItem.color && appearanceItem.color != "Default"){
				renderItem.color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, appearanceItem.color);
				//if(AssetItemGroup.Group == "Eyes") appearanceItem.color.lightness = 100;
			}
		}
		
		return renderItem;
	}
	
	
	,BuildRenderItems(appearanceItems, body, appearanceItemEffects){
		var renderItemList = [];
		for(var groupName in appearanceItems){
			var appearanceItem = appearanceItems[groupName];
			if(! appearanceItem) continue;
			
			if(appearanceItemEffects.itemGroupsToHideByPose.includes(groupName)) continue;
			if(appearanceItemEffects.itemGroupsToHideByItem.includes(groupName)) continue;
			if(appearanceItemEffects.itemsToHideByItems.includes(appearanceItem.name)) continue;
			if(appearanceItemEffects.itemsToDisableByThemes.includes(appearanceItem.name)) continue;
			
			//Items such as headphones are not rendered, the layer array is empty
			var AssetItemGroup = F3dcgAssets.AssetGroups[groupName];
			var AssetItem = AssetItemGroup.Items[appearanceItem.name];
			
			if(! AssetItemGroup.Wear && (AssetItem.Visible === false || AssetItemGroup.Visible === false)) continue;
			
			renderItemList.push(this.BuildRenderItem(AssetItemGroup, body, appearanceItemEffects, appearanceItem));
			
			if(groupName == "Eyes"){
				var renderItemEyes = renderItemList[renderItemList.length - 1];
				var layer = renderItemEyes.layers[0];
				renderItemEyes.layers[0].blinking = true;
				renderItemEyes.layers.unshift({url:renderItemEyes.layers[0].url.replace("Eyes/", "Eyes/Closed/"), colorize:false});
			}
		}
		
		return renderItemList;
	}
	
	
	,GetPoseUrlPart(AssetItemGroup, AssetItem, currentPoses){
		var urlPartPose = "";
		var allowedPoses = [];
		if(AssetItemGroup?.AllowPose) AssetItemGroup.AllowPose.forEach(poseName => allowedPoses.push(poseName));
		if(AssetItem?.AllowPose) AssetItem.AllowPose.forEach(poseName => allowedPoses.push(poseName));
		currentPoses.forEach(poseName => {if(allowedPoses.includes(poseName)) urlPartPose = poseName + "/";});	
		return urlPartPose;
	}
	
	
	,BuildExpressionRenderItems(expressionItems, appearanceItemEffects){
		var renderItems = [];
		
		for(var groupName in expressionItems){
			var AssetGroup = F3dcgAssets.AssetGroups[groupName];
			var renderItem = this.InitRenderItem(AssetGroup);
			var exp = expressionItems[groupName] && expressionItems[groupName].name != "None" ? expressionItems[groupName].name : groupName ;
			
			var imageUrl = exp == groupName ? groupName + "/" + AssetGroup.Asset[0] : groupName + "/" + exp + "/" + AssetGroup.Asset[0];
			renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + imageUrl + ".png"});
			renderItems.push(renderItem);
		}
		
		return renderItems;
	}
	
	
	,BuildFrameRenderItems(frame, appearanceItemEffects){
		var renderItems = [];
		
		if(frame.upperSize && ! appearanceItemEffects.itemGroupsToHideByItem.includes("BodyUpper")){
			var renderItem = this.InitRenderItem(F3dcgAssets.AssetGroups.BodyUpper);
			var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.BodyUpper, null, appearanceItemEffects.poses);
			renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "BodyUpper/" + poseUrlPart + frame.upperSize + "_" + frame.color + ".png"});
			renderItems.push(renderItem);
		}
		
		if(frame.lowerSize && ! appearanceItemEffects.itemGroupsToHideByItem.includes("BodyLower")){
			var renderItem = this.InitRenderItem(F3dcgAssets.AssetGroups.BodyLower);
			var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.BodyLower, null, appearanceItemEffects.poses);
			renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "BodyLower/" + poseUrlPart + frame.lowerSize + "_" + frame.color + ".png"});
			renderItems.push(renderItem);
		}
		
		if(! appearanceItemEffects.itemGroupsToHideByItem.includes("Hands")){
			var renderItem = this.InitRenderItem(F3dcgAssets.AssetGroups.Hands);
			var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.Hands, null, appearanceItemEffects.poses);
			renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "Hands/" + poseUrlPart + "Default_" + frame.color + ".png"});
			renderItems.push(renderItem);
		}
		
		return renderItems;
	}
	
	
	,BuildRender(appearance, pose, playerThemeSettings){
		var appearanceItemEffects = this.BuildAppearanceItemsEffects(appearance, pose, playerThemeSettings);
		
		var renderItemList = [];
		renderItemList.push(...this.BuildFrameRenderItems(appearance.frame, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.body, appearance.frame, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.clothes, appearance.frame, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.accessories, appearance.frame, appearanceItemEffects));
		if(appearance.bondageToys) renderItemList.push(...this.BuildRenderItems(appearance.bondageToys, appearance.frame, appearanceItemEffects));
		if(appearance.expressions) renderItemList.push(...this.BuildExpressionRenderItems(appearance.expressions, appearance.frame, appearanceItemEffects));
		
		//to implement layer level properties
		var renderItemLayerList = [];
		renderItemList.forEach( renderItem =>{
			renderItem.layers.forEach( renderItemLayer =>{
				renderItemLayerList.push(renderItemLayer);
				renderItemLayer.top = renderItem.top;
				renderItemLayer.left = renderItem.left;
				renderItemLayer.priority = renderItemLayer.priority ? renderItemLayer.priority : renderItem.priority ;
				renderItemLayer.color = renderItem.color;
				renderItemLayer.fullAlpha = renderItem.fullAlpha ;
			});
		});
		
		renderItemLayerList.sort((item1, item2) => {return item1.priority - item2.priority;});
		
		return {
			top:appearanceItemEffects.top
			,rotate:appearanceItemEffects.rotate
			,scale:appearanceItemEffects.scale
			,items:renderItemLayerList
		};
	}
	
	,BuildSuitRender(appearance){
		return this.BuildRender(appearance);
	}	
	
	,BuildPlayerRender(appearance, pose, themeSettings){
		return this.BuildRender(appearance, pose, themeSettings);
	}
	
	
	,BuildPortraitRender(appearance){
		var a = {frame:{height:"H1000", upperSize:appearance.frame.upperSize, color:appearance.frame.color}};
		var portraitGroups = {
			[F3dcgAssets.BODY]:["Eyes", "Mouth", "HairFront", "HairBack"]
			,[F3dcgAssets.EXPRESSION]:["Eyebrows", "Blush", "Fluids", "Emoticon"]
			,[F3dcgAssets.ACCESSORY]:["HairAccessory1", "HairAccessory2"]
			,[F3dcgAssets.CLOTH]:["Hat", "Glasses", "Mask", "Cloth", "Bra"]
			,[F3dcgAssets.BONDAGE_TOY]:["ItemHead", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraint", "ItemBreast"]
		}
		
		for(var groupType in portraitGroups){
			portraitGroups[groupType].forEach(groupName =>{
				if(! a[groupType]) a[groupType] = {};
				a[groupType][groupName] = appearance[groupType][groupName];
			});
		}
		
		return this.BuildRender(a, F3dcgAssets.POSE_NONE);
	}
	
}
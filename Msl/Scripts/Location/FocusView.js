'use strict'

var LocationFocusView = {
	playerUpdateDelegate:null

	,mainContainer:null
	,wardrobeContainer:null
	,figureContainer:null
	,itemSelectionContainer:null
	,itemActionButtonsContainer:null
	,itemGroupSelectionContainer:null
	
	,selectedItemGroupTypeName:F3dcgAssets.CLOTHING
	,selectedItemGroupName:"Cloth"
	,selectedItemName:null
	
	,itemActionViews:{"Color":null, "Variant":null, "Lock":null, "Remote":null, "Direct":null, "Arousal":null}
	,selectedAction:"Color"

	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		this.playerUpdateDelegate?.Invalidate();
		this.playerUpdateDelegate = this.undefined;
		this.mainContainer?.parentNode?.removeChild(this.mainContainer);
		this.mainContainer = null;
		this.wardrobeContainer = null;
	}
	,UnInit(){}
	
	,Commit(){
		if(this.playerUpdateDelegate.HasChanges()){
			LocationController.UpdatePlayer(this.playerUpdateDelegate);
			this.Interrupt();
		}else
			this.ShowErrors(["No changes"]);
	}
	,Undo(){
		this.ShowErrorsOrPlayer(this.playerUpdateDelegate.Undo());
	}
	
	,Cancel(){LocationFocusView.Interrupt();}
	
	,PreSetSelections(itemGroupTypeName, itemGroupName){
		if(itemGroupTypeName) LocationFocusview.selectedItemGroupTypeName = itemGroupTypeName;
		if(itemGroupName) LocationFocusview.selectedItemGroupName = itemGroupName;
	}
	
	,Focus(player){
		this.Interrupt();
		this.playerUpdateDelegate = player.GetUpdateDelegate();
		this.mainContainer = Util.CreateElement({parent:LocationController.inputContainer, template:"FocusSelfTemplate"});
		
		this.figureContainer = Util.GetFirstChildNodeByName(this.mainContainer, "figureContainer");
		this.itemSelectionContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemSelection");
		this.itemActionButtonsContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemActionButtons");
		this.itemGroupSelectionContainer = Util.GetFirstChildNodeByName(this.figureContainer, "itemGroupSelection");
		/*
		if(MainController.playerAccount.profileSettings.focusTransparentBackground){
			this.mainContainer.classList.add("transparent");
			this.mainContainer.style.backgroundImage  = "";
		}else{
			this.mainContainer.classList.remove("transparent");
			this.mainContainer.style.backgroundImage = "url('" + LocationController.backgroundContainer.src + "')";
		}*/
		
		for(var actionName in this.itemActionViews){
			var containerElement = Util.GetFirstChildNodeByName(this.mainContainer, "item"+actionName+"Actions");
			var constructorFunction = window[actionName + "ActionView"];
			if(constructorFunction && containerElement)
				this.itemActionViews[actionName] = new constructorFunction(containerElement, this["ItemActionCallback" + actionName]);
			else
				console.log("invalid conf for " + actionName + " " + containerElement + " " + constructorFunction);
		}
		
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrorsOrPlayer(validationErrors){
		if(validationErrors?.length === 0){
			this.ShowPlayer();
		}else{
			this.ShowErrors(validationErrors);
		}
		
		this.UpdateControlAndActionButtons();
	}
	
	,ShowPlayer(){
		this.figureContainer.removeChild(this.figureContainer.figure);
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrors(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	,BuildPlayerFigureAndIconsAndEvents(){
		LocationController.delegates.view.BuildPlayerFigure(this.figureContainer, this.playerUpdateDelegate.render);
		
		Util.MoveNodeToEndOfList(this.itemGroupSelectionContainer);
		
		var itemGroupSelectionIconContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection");
		for(let itemGroupTypeName in this.playerUpdateDelegate.inventory.items){
			var icon = Util.GetFirstChildNodeByName(itemGroupSelectionIconContainer, itemGroupTypeName);
			icon.addEventListener("click", (e) => this.OnItemGroupTypeClick(itemGroupTypeName));
			
			if(itemGroupTypeName == this.selectedItemGroupTypeName){
				this.OnItemGroupTypeClick(itemGroupTypeName);
			}
		}
		
		var icon = Util.GetFirstChildNodeByName(itemGroupSelectionIconContainer, "wardrobe");
		icon.addEventListener("click", (e) => this.OnWardrobeIconClick(e));
	}
	
	
	,OnWardrobeIconClick(){
		var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection"), "wardrobe");
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		Util.ClearNodeContent(this.itemSelectionContainer);
		Util.HideAllChildNodes(this.itemGroupSelectionContainer);
		Util.ClearNodeContent(this.itemSelectionContainer);
		this.HidControlAndActionButtons();
		
		if(null == this.wardrobeContainer){
			this.wardrobeContainer = Util.CreateElement({parent:this.mainContainer, className:"focus-wardrobe-container"});
			
			MainController.playerAccount.wardrobe.forEach((wardrobeInstance, index) => {
				if(! wardrobeInstance) return;
				var figureContainer = Util.CreateElement({parent:this.wardrobeContainer});
				var figure = Util.CreateElement({parent:figureContainer});
				
				var text = Util.CreateElement({
					parent:figureContainer, tag:"input", 
					attributes:{name:"wardrobeName-"+index,value:wardrobeInstance.name}
				});
				
				var buttonSave = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Save"}
					,cssStyles:{float:"left"},events: {click: (e) => {this.WardrobeSave(index);}}
				});
				
				var buttonLoad = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Load"}
					,cssStyles:{float:"right"}, events:{click:(e) => {this.WardrobeLoad(index);}}
				});
				
				setTimeout(function(){
					LocationController.delegates.view.BuildPlayerFigure(figure, wardrobeInstance.appearance);
				}, (index+1)*100);
				
			});
			
		}else
			this.wardrobeContainer.style.display = "block";
	}
	
	,WardrobeLoad(index){
		var validationErrors = this.playerUpdateDelegate.AddWardrobe(MainController.playerAccount.wardrobe[index].appearance.items);
		this.ShowErrorsOrPlayer(validationErrors);	
	}
	
	,WardrobeSave(index){
		MainController.playerAccount.wardrobe[index] = this.playerUpdateDelegate.GetWardrobe();
		console.log(MainController.playerAccount.wardrobe[index]);
	}
	
	,OnItemGroupTypeClick(itemGroupTypeName){
		LocationFocusView.selectedItemGroupTypeName = itemGroupTypeName;
		var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection"), itemGroupTypeName)
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		Util.ClearNodeContent(this.itemSelectionContainer);
		Util.HideAllChildNodes(this.itemGroupSelectionContainer);
		Util.ClearNodeContent(this.itemSelectionContainer);		
		if(this.wardrobeContainer) this.wardrobeContainer.style.display = "none";
		
		for(let itemGroupName in this.playerUpdateDelegate.inventory.items[itemGroupTypeName]){
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", (e) => this.OnItemGroupClick(itemGroupName));
			
			this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, itemGroupName);
			
			if(itemGroupName == this.selectedItemGroupName)
				this.OnItemGroupClick(itemGroupName);
		}
	}
	
	
	,OnItemGroupClick(itemGroupName){
		LocationFocusView.selectedItemGroupName = itemGroupName;
		Util.ClearNodeContent(this.itemSelectionContainer);
		
		var icon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		for(let itemName in this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][itemGroupName]){
			let itemData = this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][itemGroupName][itemName];
			
			var iconContainer = Util.CreateElement({parent:this.itemSelectionContainer});
			var events = {};
			
			if(itemData.validation.length == 0)
				events.click = (e) => this.OnItemClick(itemName);
			else
				for(var i = 0; i < itemData.validation.length; i++)
					Util.CreateElement({parent:iconContainer,innerHTML:itemData.validation[i],cssStyles:{color:"#fcc",top:(i+1)+"em",fontSize:"1em"}});
			
			Util.CreateElement({parent:iconContainer, tag:"img", events:events, attributes:{src:itemData.iconUrl, alt:itemName}});
			if(! itemData.owned) Util.CreateElement({parent:iconContainer,innerHTML:"NOT OWNED",cssStyles:{color:"#f88",top:7+"em",fontSize:".8em"}});
			Util.CreateElement({parent:iconContainer,innerHTML:itemName,cssStyles:{fontSize:".8em"}});
		}
		
		this.UpdateControlAndActionButtons();
	}
	
	
	,OnItemClick(itemName){
		this.selectedItemName = itemName;
		var appearanceItem = F3dcgAssets.InitAppearanceItem(this.selectedItemGroupTypeName, this.selectedItemGroupName, this.selectedItemName);
		var validationErrors = this.playerUpdateDelegate.Add(appearanceItem);
		this.ShowErrorsOrPlayer(validationErrors);		
		if(! validationErrors.length) this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, this.selectedItemGroupName);
	}
	
	
	,UpdateItemGroupIconImage(itemGroupTypeName, itemGroupName){
		var wornItem = this.playerUpdateDelegate.appearance.items[itemGroupName];
		if(wornItem){
			//current item will be displayed elsewhere
			//var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);		
			//var inventoryItem = this.playerUpdateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			//itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}
	
	
	,UpdateControlAndActionButtons(){
		var wornItem = this.playerUpdateDelegate.appearance.items[this.selectedItemGroupName];
		
		var buttonsToShow = [];
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", action).style.display="none";
		
		if(wornItem){
			var inventoryItem = this.playerUpdateDelegate.inventory.items[this.selectedItemGroupTypeName][this.selectedItemGroupName][wornItem.itemName];
			
			if(! inventoryItem) inventoryItem = {};//to avoid null reference
			
			if(wornItem.colorize){
				buttonsToShow.push("Color");
				if(wornItem.color) this.itemActionViews.Color.SetColor(wornItem.color);	
			}
			
			if(wornItem.lock || wornItem.allowedLocks?.length > 0){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(wornItem, inventoryItem, this.playerUpdateDelegate.inventory.locks, this.playerUpdateDelegate.inventory.keys);
			}
			
			if(inventoryItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(wornItem, inventoryItem);
			}
		}
		
		buttonsToShow.forEach(altValue => Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", altValue).style.display="block");
		
		if(! buttonsToShow.includes(this.selectedAction)) 
			this.itemActionViews[this.selectedAction].Hide();
		else
			this.itemActionViews[this.selectedAction].Show();
	}
	
	,HidControlAndActionButtons(){
		for(var action in this.itemActionViews){
			Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", action).style.display="none";
			this.itemActionViews[this.selectedAction].Hide();
		}
	}
	
	
	,ShowOrHideActions(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}
	
	
	,ItemActionCallbackColor(color){
		if(!color || ! LocationFocusView.selectedItemGroupName || ! LocationFocusView.figureContainer) return;
		
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		appearanceItemCopy.color = color;
		LocationFocusView.ShowErrorsOrPlayer(LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy));
	}
	
	
	,ItemActionCallbackLock(action){
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		var updateCharacter = false, updateTime = false;
		
		switch(action.actionType){
			case "lock":
				appearanceItemCopy.lock = F3dcgAssets.InitAppearanceItemLock(action.value, MainController.playerAccount.id);
				updateCharacter = true;
			break;
			case "unlock":
				delete appearanceItemCopy.lock;
				updateCharacter = true;
			break;
			//timer adjustment,
			case "selection":		
			case "plus":		
				updateTime = action.value*1000*60;
			break;
			case "minus":		
				updateTime =-action.value*1000*60;
			break;
			case "random":
				var value = Math.random() > .5 ? 1 * action.value : -1 * action.value;
				updateTime = value*1000*60;
			break;
			//timer management
			case "showTimer":
				updateTime = true;//no break is intentional
			case "removeItem":
			case "enableActions":	
				appearanceItemCopy.lock.timer[action.actionType] = action.value;			
			break;
			default: throw "Unrecognized action " + action.actionType;
		}
		
		if(updateTime){
			var maxTime = Date.now() + appearanceItemCopy.lock.timer.maxTime * 1000;
			appearanceItemCopy.lock.timer.time = Math.min(maxTime, appearanceItemCopy.lock.timer.time+updateTime);
		}
		
		var validationErrors = LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy);
		if(validationErrors.length > 0)
			LocationFocusView.ShowErrors(validationErrors);
		else if(updateCharacter) 
			LocationFocusView.ShowErrorsOrPlayer(validationErrors)
		else if(updateTime !== false)
			LocationFocusView.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
		
	}
	
	,ItemActionCallbackVariant(itemVariantName){
		var appearanceItemWorn = LocationFocusView.playerUpdateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		if(itemVariantName == appearanceItemWorn.itemVariantName) return;
		
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		appearanceItemCopy.itemVariantName = itemVariantName;
		
		var validationErrors = LocationFocusView.playerUpdateDelegate.Add(appearanceItemCopy);
		LocationFocusView.ShowErrorsOrPlayer(validationErrors)
	}
	
	
	,ItemActionCallbackRemote(){}
	,ItemActionCallbackDirect(){}
	,ItemActionCallbackArousal(){}
}

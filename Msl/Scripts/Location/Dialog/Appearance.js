'use strict'


var LocationDialogAppearanceView = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.containerElements = {};
	
	this.selectedItemGroupTypeName = "cloth";
	this.selectedItemGroupName = "ClothLower";
	
	//initializing containers that will be used throughoug
	this.containerElements.main = containerElement;
	this.containerElements.itemGroupTypeSelection = Util.GetFirstChildNodeByName(this.containerElements.main, "itemGroupTypeSelection");
	this.containerElements.figure = Util.GetFirstChildNodeByName(this.containerElements.main, "figureContainer");
	this.containerElements.itemGroupSelection = Util.GetFirstChildNodeByName(this.containerElements.figure, "itemGroupSelection");
	this.containerElements.updateStackButtons = Util.GetFirstChildNodeByName(this.containerElements.main, "updateStackButtons");
	this.containerElements.groupDetailsAndWardrobe = Util.GetFirstChildNodeByName(this.containerElements.main, "groupDetailsAndWardrobe");
	this.containerElements.groupDetails = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsAndWardrobe, "groupDetailsContainer");
	this.containerElements.groupDetailsButtons = Util.GetFirstChildNodeByName(this.containerElements.groupDetails, "buttons");
	this.containerElements.itemsAndCurrentActions = Util.GetFirstChildNodeByName(this.containerElements.groupDetails, "itemsAndCurrentActions");
	
	this.containerElements.wardrobe = null;//Lazily initialized
	
	//Eye candy for menu
	Util.InitSelectableMenu(this.containerElements.itemGroupTypeSelection);
	Util.InitSelectableMenu(this.containerElements.itemGroupSelection,);
	Util.InitSelectableMenu(this.containerElements.groupDetailsButtons);
	
	//set events on the group type
	for(let itemGroupTypeName in this.mainDialog.updateDelegate.GetApplicableItems()){
		var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName);
		
		if(! icon) console.log(itemGroupTypeName);
		icon.addEventListener("click", function(e){this.SelectItemGroupType(itemGroupTypeName);}.bind(this));
		
		if(itemGroupTypeName == this.selectedItemGroupTypeName){
			this.SelectItemGroupType(itemGroupTypeName);
		}
	}
	
	//buttons for the update/undo stack
	Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, "wardrobe").addEventListener("click", function(event){this.ShowWardrobe();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "commit").addEventListener("click", function(event){this.Commit();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "cancel").addEventListener("click", function(event){this.Cancel();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "undo").addEventListener("click", function(event){this.Undo();}.bind(this));
	
	
	//Right pane group and current item management and actions -- display refactored into separate classses
	this.groupItemActions = {};
	this.selectedGroupItemAction = "items";
	["items", "color", "lock", "variants", "struggle"].forEach(groupItemAction =>{
		var button = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsButtons, groupItemAction);
		var containerElement = Util.GetFirstChildNodeByName(this.containerElements.itemsAndCurrentActions, groupItemAction);
		var constructorFunctionName = Util.Capitalize(groupItemAction) + "DialogAppearanceGroupActionView"; 
		
		if(!window[constructorFunctionName])
			console.error(constructorFunctionName);
		else{
			var callback = function(data){this["GroupItemActionCallback_" + groupItemAction](data);}.bind(this);
			this.groupItemActions[groupItemAction] = {button:button, container:containerElement, controller: new window[constructorFunctionName](containerElement, callback)};
			
			button.addEventListener("click", function(event){this.HideOthersAndShowGroupActionView(groupItemAction);}.bind(this));
		}
	});

	//Render appearance relies on view delegate in main controller to render the figure
	this.RenderAppearance = function(){
		if(this.containerElements.figure.figure) this.containerElements.figure.removeChild(this.containerElements.figure.figure);		
		LocationController.delegates.view.BuildPlayerFigure(this.containerElements.figure, this.mainDialog.updateDelegate.render)
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
	}
	setTimeout(this.RenderAppearance.bind(this), 50);
	
	
	this.HideOthersAndShowGroupActionButton = function(buttonsToShow){
		for(var action in this.groupItemActions){
			this.groupItemActions[action].button.style.display = "none";
			
			if(buttonsToShow?.includes(action))
				this.groupItemActions[action].button.style.display = "block";
		}
	}
	
	
	this.HideOthersAndShowGroupActionView = function(groupItemAction){
		this.selectedGroupItemAction = groupItemAction;
		for(var action in this.groupItemActions)
			this.groupItemActions[action].controller.Hide();
		
		if(groupItemAction)
			this.groupItemActions[groupItemAction].controller.Show();
		
		this.selectedGroupAction = groupItemAction;
	}
	this.HideOthersAndShowGroupActionView("items");//.items.button.click();//display items by default
	
	
	
	this.Struggle = function(){
		if(this.mainDialog.updateDelegate.HasChanges())
			this.DisplayErrors(["ClearChanges"]);
		else
			LocationController.StartPlayerStruggle(this.selectedItemGroupName);
	}
	
	this.Commit = function(){
		if(!this.mainDialog.updateDelegate.HasChanges() )
			this.DisplayErrors(["NoChanges"]);
		else
			LocationController.UpdatePlayerAppearance(this.mainDialog.updateDelegate);
	}
	
	this.Undo = function(){
		this.RenderAppearanceOrShowErrors(this.mainDialog.updateDelegate.Undo());
	}
	
	this.Cancel = function(){
		this.mainDialog.updateDelegate.Invalidate();
		this.mainDialog.updateDelegate = this.mainDialog.player.GetUpdateDelegate();
		this.DisplayErrors(["Reset"]);		
		this.RenderAppearance();
	}
	
	this.DisplayErrors = function(errors){
		errors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
				,removeAfter:4000
			});
		});
	}
	
	
	this.RenderAppearanceOrShowErrors = function(validationErrors){
		if(! validationErrors?.length)
			this.RenderAppearance();
		else
			this.DisplayErrors(validationErrors);
	}
	
	
	this.DisplayErrors = function(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.containerElements.figure
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	
	this.ShowWardrobe = function(){
		//Util.ClearNodeContent(this.containerElements.itemSelection);
		//Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		//Util.ClearNodeContent(this.containerElements.itemSelection);
		//this.HideControlAndActionButtons();
		
		
		if(null == this.containerElements.wardrobe){
			this.containerElements.wardrobe = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsAndWardrobe, "wardrobe");
			
			MainController.playerAccount.wardrobe.forEach((suit, index) => {
				if(! suit) return;
				var figureContainer = Util.CreateElement({parent:this.containerElements.wardrobe});
				var figure = Util.CreateElement({parent:figureContainer});
				
				var text = Util.CreateElement({
					parent:figureContainer, tag:"input", 
					attributes:{name:"wardrobeName-"+index,value:suit.name}
				});
				
				var buttonSave = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Save"}
					,cssStyles:{float:"left"}, events:{click:function(event){this.SaveSuit(index);}.bind(this)}
				});
				
				var buttonLoad = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Load"}
					,cssStyles:{float:"right"}, events:{click:function(event){this.LoadSuit(index);}.bind(this)}
				});
				
				setTimeout(function(){
					LocationController.delegates.view.BuildPlayerFigure(figure, suit.render);
				}, (index+1)*100);
			});
		}
		
		this.containerElements.wardrobe.style.display = "block";
		this.containerElements.groupDetails.style.display = "none";
	}
	
	this.LoadSuit = function(index){
		var validationErrors = this.mainDialog.updateDelegate.AddSuit(MainController.playerAccount.wardrobe[index].appearance);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	this.SaveSuit = function(index){
		var suit = MainController.playerAccount.wardrobe[index];
		suit.appearance = this.mainDialog.updateDelegate.BuildSuitFromCurrentAppearance();
		suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance)
		var figureDiv = this.containerElements.wardrobe.childNodes[index].childNodes[0];
		Util.ClearNodeContent(figureDiv);
		LocationController.delegates.view.BuildPlayerFigure(figureDiv, suit.render);
	}
	
	this.SelectItemGroupType = function(itemGroupTypeName){
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";
		this.containerElements.groupDetails.style.display = "block";
		
		Util.SelectElementAndDeselectSiblings(Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName));
		
		this.selectedItemGroupTypeName = itemGroupTypeName;
		this.selectedItemGroupName = null;
		this.selectedItem = null;
		
		//Redraw item groups above the figure
		Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";	
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
		
		for(let itemGroupName in this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName]){		
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", function(event){this.SelectItemGroup(itemGroupName);}.bind(this));
			
			var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName][itemGroupName];
			if(applicableGroup.currentItem) itemGroupIcon.classList.add("filled"); else itemGroupIcon.classList.remove("filled");			
			if(applicableGroup.validation?.length) itemGroupIcon.classList.add("blocked"); else itemGroupIcon.classList.remove("blocked");
		}
		
		//hide the item group action buttons, pending item selection
		this.HideOthersAndShowGroupActionView();
		this.HideOthersAndShowGroupActionButton();
	}
	
	
	this.SelectItemGroup = function(itemGroupName){
		this.selectedItemGroupName = itemGroupName;
		
		var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[this.selectedItemGroupTypeName][itemGroupName];
		
		var buttonsToShow = ["items"];
		
		if(! applicableGroup.currentItem){
			this.groupItemActions.items.button.childNodes[0].src = "./Images/Icons/Variants.png";
		}else{
			this.groupItemActions.items.button.childNodes[0].src = applicableGroup.currentItem.iconUrl;
			
			if(applicableGroup.currentItem.colorable) 
				buttonsToShow.push("color");
			
			if(applicableGroup.currentItem.variants){
				buttonsToShow.push("variants");				
				var variantData = applicableGroup.currentItem.variants[applicableGroup.currentItem.variant];
				this.groupItemActions.variants.button.childNodes[0].src = variantData.iconUrl;
				this.groupItemActions.variants.controller.SetItem(applicableGroup.currentItem);
			}
			
		}
		
		if(applicableGroup.changeable)
			this.groupItemActions.items.controller.SetItems(applicableGroup.items, applicableGroup.removable);		
		
		if(! applicableGroup.validation || applicableGroup.validation.length == 0){
			/*if(applicableGroup.removable){
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection, events:{
					click:function(event){this.SelectItem("None");}.bind(this)
				}});
				Util.CreateElement({parent:iconContainer, tag:"img", attributes:{src:"../BondageClub/Icons/Remove.png", alt:"Remove"}});				
			}*/	
		}else{
			applicableGroup.validation.forEach(validationError => {
				var iconContainer = Util.CreateElement({parent:this.containerElements.itemSelection,innerHTML:validationError,cssClass:"invalid"});
			});
			
			//this.HideControlAndActionButtons();
		}
		
		//Show the actions for the group and current item
		this.HideOthersAndShowGroupActionButton(buttonsToShow);
		//Select the first one (items)
		this.groupItemActions.items.button.click();
	}
	
	
	/*
	this.UpdateItemGroupIconImage = function(itemGroupTypeName, itemGroupName){
		var wornItem; //= this.mainDialog.updateDelegate.GetCurrentWornItem(itemGroupName);
		if(wornItem){
			//current item will be displayed elsewhere
			//var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);		
			//var inventoryItem = this.mainDialog.updateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			//itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}*/
	/*
	this.UpdateControlAndActionButtons = function(){
		this.HideControlAndActionButtons();
		var buttonsToShow = [];
		
		var appliedItem = this.mainDialog.updateDelegate.GetApplicableItems()[this.selectedItemGroupTypeName][this.selectedItemGroupName].currentItem;
		this.selectedItemName = appliedItem?.name;
		
		//hide the buttons, views will be hidden later
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="none";
		
		if(appliedItem){
			if(appliedItem.colorable){
				buttonsToShow.push("Color");
				if(appliedItem.color) this.itemActionViews.Color.SetHexValue(appliedItem.color);	
			}
			
			if(appliedItem.lock || appliedItem.allowedLocks?.length){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(appliedItem);
			}
			
			if(appliedItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(appliedItem);
			}
		}
		
		buttonsToShow.forEach(action => {Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="block"});
		
		//TODO:  select the first available action
		if(! buttonsToShow.includes(this.selectedAction)){
			this.itemActionViews[this.selectedAction].Hide();
		}else{
			this.itemActionViews[this.selectedAction].Show();
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, this.selectedAction.toLowerCase()).click();
		}
	}
	
	this.HideControlAndActionButtons = function(){
		for(var action in this.itemActionViews){
			Util.GetFirstChildNodeByName(this.containerElements.itemActionButtons, action.toLowerCase()).style.display="none";
			this.itemActionViews[action].Hide();
		}
	}*/
	
	/*
	this.ShowOrHideActions = function(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}*/
	
	this.GroupItemActionCallback_items = function(itemName){
		var validationErrors = this.mainDialog.updateDelegate.AddItem(this.selectedItemGroupName, itemName);
		this.RenderAppearanceOrShowErrors(validationErrors);
		this.SelectItemGroup(this.selectedItemGroupName);
	}
	
	this.GroupItemActionCallback_color = function(color){
		if(! this.selectedItemGroupName) return;
		
		var validationErrors = this.mainDialog.updateDelegate.AddColor(this.selectedItemGroupName, color);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	
	this.GroupItemActionCallback_lock = function(action){
		if(! this.selectedItemGroupName) return;
		
		var updateCharacter = false, updateTime = false, validationErrors;
		switch(action.actionType){
			case "lock":
				validationErrors = this.mainDialog.updateDelegate.AddLock(this.selectedItemName, action.value, MainController.playerAccount.id);
				updateCharacter = true;
			break;
			case "unlock":
				validationErrors = this.mainDialog.updateDelegate.RemoveLock(this.selectedItemName);
				updateCharacter = true;
			break;
			case "updateProperty":
				validationErrors = this.mainDialog.updateDelegate.UpdateLock(this.selectedItemName, action.value);
				updateTime = true;
			break;
			
			//timer adjustment,
			/*case "selection":		
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
			break;*/
			default: throw "Unrecognized action " + action.actionType;
		}
		
		/*
		if(updateTime){
			var maxTime = Date.now() + appearanceItemCopy.lock.timer.maxTime * 1000;
			appearanceItemCopy.lock.timer.time = Math.min(maxTime, appearanceItemCopy.lock.timer.time+updateTime);
		}*/
		
		if(validationErrors.length > 0)
			this.RenderAppearanceOrShowErrors(validationErrors);
		else if(updateCharacter) 
			this.RenderAppearanceOrShowErrors(validationErrors);
		//else if(updateTime !== false)
			//this.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
	}
	
	this.GroupItemActionCallback_variants = function(data){
		var validationErrors = this.mainDialog.updateDelegate.AddVariant(this.selectedItemGroupName, data.itemName, data.variantName);
		
		if(! validationErrors.length){
			this.RenderAppearance();
		}else this.DisplayErrors(validationErrors);
	}
	
	
	
	this.GroupItemActionCallback_Remote = function(){}
	this.GroupItemActionCallback_Direct = function(){}
	this.GroupItemActionCallback_Arousal = function(){}
}

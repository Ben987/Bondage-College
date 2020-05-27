'use strict'

var LocationDialog = {
	figureContainer:null
	,topLevelActionsContainer:null
	,currentAction:"profile"
	,updateDelegate:null
	
	,views:{}
	,viewsContainerElements:{}

	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		this.updateDelegate?.Invalidate();
		this.updateDelegate = this.undefined;
		this.mainContainer?.parentNode?.removeChild(this.mainContainer);
		this.mainContainer = null;
	}
	,UnInit(){}
	
	,Start(player){
		this.Interrupt();
		this.player = player;
		this.updateDelegate = player.GetUpdateDelegate();
		this.mainContainer = Util.CreateElement({parent:LocationController.inputContainer, template:"DialogSelfTemplate"});
		this.topLevelMenuContainer = Util.GetFirstChildNodeByName(this.mainContainer, "topLevelMenuContainer");
		this.viewContainer = Util.GetFirstChildNodeByName(this.mainContainer, "viewContainer");
		Util.InitSelectableMenu(this.topLevelMenuContainer);
		
		Util.GetFirstChildNodeByName(this.topLevelMenuContainer, "cancel").addEventListener("click", function(event){
			this.Interrupt();
		}.bind(this));
		
		["Profile", "Social", "Appearance", "Settings"].forEach(actionName => { 
			let a = actionName.toLowerCase();
			Util.GetFirstChildNodeByName(this.topLevelMenuContainer, a).addEventListener("click", function(event){this.ShowView(a);}.bind(this));
			this.viewsContainerElements[a] = Util.GetFirstChildNodeByName(this.viewContainer, a);
			this.views[a] = new window["LocationDialog" + actionName + "View"](this, this.viewsContainerElements[a]);
		});
		
		var backgroundImageElement = Util.GetFirstChildNodeWithAttribute(this.mainContainer, "alt", "backgroundImage")
		Util.GetFirstChildNodeWithAttribute(this.mainContainer, "alt", "backgroundImage").src = LocationController.backgroundContainer.src;
		
		LocationDialog.ShowView(this.currentAction);
		

	}
	
	,ShowView(viewName){
		for(var name in this.views){
			var viewContainerElement = this.viewsContainerElements[name];
			if(! viewContainerElement) continue;
			//if(viewContainerElement.style.opacity == 0) continue;
			viewContainerElement.style.opacity = "0";	
			viewContainerElement.style.transition = "opacity 250ms";// .2s cubic-bezier(.42, 0, .34, 1.01)"
			viewContainerElement.style.pointerEvents = "none"
		}
		
		var viewContainerElement = this.viewsContainerElements[viewName];
		if(! viewContainerElement) return;
		viewContainerElement.style.opacity = "1";
		viewContainerElement.style.transition = "500ms";
		viewContainerElement.style.transitionDelay = "250ms";
		viewContainerElement.style.pointerEvents = "auto";

	}
}


var LocationDialogAccountView  = function(mainDialog){
	this.Show = function(){}
	this.Hide = function(){}
}

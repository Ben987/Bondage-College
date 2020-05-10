'use strict'

var LocationActions = {
	actionIcons:[]

	,spotClickDivs:{}
	,figureClickDivs:{}

	,Init(){this.OnScreenChange();}
	,Interrupt(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);
	}
	
	,UnInit(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);
		Util.DetachElementsAndClear(LocationActions.spotClickDivs);
	}
	
	,OnScreenChange(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);	
		Util.DetachElementsAndClear(LocationActions.spotClickDivs);
		
		var currentSpot = LocationController.GetSpot();
		var currentScreen = LocationController.location.screens[currentSpot.screens.Default];
		
		for(let spotName in currentScreen.spotPositions){
			var spotPos = currentScreen.spotPositions[spotName];
			var left = spotPos.left + "%", top = spotPos.top + "%",width = spotPos.scale + "%", height = spotPos.scale*2/LocationView.aspectRatio + "%";
			
			var spotClickDiv = Util.CreateElement({parent:LocationController.inputContainer, className:"location-spot-event-listener", insertFirst:true
				,cssStyles:{left:left, top:top, width:width, height:height}
				,events:{
					click:(event) => {
						event.stopPropagation();
						LocationController.ShowMoveActions();
					}
				}
			});
			this.spotClickDivs[spotName] = spotClickDiv;
			
			var figureClickDiv = Util.CreateElement({parent:spotClickDiv, className:"location-spot-figure-listener"
				,cssStyles:{border:DevTools.locationSpotBorder}
				,events:{
					click:(event) => {
						var player = LocationController.GetPlayer(spotName);
						if(! player) return;
						
						console.log("click on " + spotName + " " + player.id);
						event.stopPropagation();
						LocationController.StartPlayerFocus(player);
					}
				}
			});
			
			this.figureClickDivs[spotName] = figureClickDiv;
		}
	}
	
	,ShowActionsMove(){
		this.Interrupt();
		
		var currentSpot = LocationController.GetSpot();
		var currentScreen = LocationController.location.screens[currentSpot.screens.Default];
		
		for(let spotName in currentScreen.spotPositions){
			var spot = LocationController.location.spots[spotName];
			var playerInSpot = LocationController.GetPlayer(spotName);
			var connection = Object.keys(currentSpot.connections).find(conn => conn == spotName);
			
			var className = "spot-base ", free = false;
			if(spotName == currentSpot.name) 
				className += "spot-base-self";
			else if(playerInSpot && ! connection) 
				className += "spot-base-far-occupied";
			else if(playerInSpot) 
				className += "spot-base-occupied";
			else if(! connection) 
				className += "spot-base-far";
			else{
				className += "spot-base-free";
				free = true;
			}
			
			var spotPos = currentScreen.spotPositions[spotName];
			var iconDiv = Util.CreateElement({parent:LocationController.inputContainer, className:className
				,cssStyles:{
					left:(spotPos.left) + "%"
					,top:(spotPos.top+(spotPos.scale)*2/LocationView.aspectRatio - spotPos.scale/LocationView.aspectRatio/5) + "%"
					,width:spotPos.scale + "%"
					,height:spotPos.scale/5/LocationView.aspectRatio + "%"
				}
				,events: !free ? null : {
					click:(event)=>{
						event.stopPropagation();
						LocationController.MoveToSpot(spotName);
						Util.DetachElementsAndClear(LocationActions.actionIcons);					
					}
				}
			});
			
			LocationActions.actionIcons.push(iconDiv);
		};
	}	
}


var ProfileManagement ={
	profileContainer:null
	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		ProfileManagement.profileContainer?.parentNode?.removeChild(ProfileManagement.profileContainer);	
	}
	,UnInit(){
		ProfileManagement.profileContainer?.parentNode?.removeChild(ProfileManagement.profileContainer);
	}
	,UpdatePlayerProfile(){
		var f = document.forms["profileSettings"];
		
		var profileSettings = {
			permissionRestraints:f.elements["permissionRestraints"].value
			,permissionClothes:f.elements["permissionClothes"].value
			,permissionArousal:f.elements["permissionArousal"].value
			,focusTransparentBackground:!!f.elements["focusTransparentBackground"].checked
		}
		
		LocationController.UpdatePlayerProfile(profileSettings);
	}
	
	,ShowProfile(player){
		ProfileManagement.profileContainer = Util.CreateElement({parent:LocationController.hudContainer
			,className:"full-block"
			,events:{click:(event) => ProfileManagement.Interrupt()}
		});
		
		Util.CreateElement({parent:ProfileManagement.profileContainer, template:"PlayerProfileTemplate", events:{
			click:(event) => event.stopPropagation()
		}});
		
		var f = document.forms["profileSettings"];
		var settings = MainController.playerAccount.profileSettings;
		
		for(var key in settings){
			var value = settings[key];
			if(value === true || value === false)
				f.elements[key].checked = value;
			else
				f.elements[key].value = value;
		}
	}
}

var ClassicHud = {
	timerId:null
	,sizes : [0, 18, 40]
	,currentSizeIndex : 0
	,RollForward(){ClassicHud.Roll(1);}
	,RollBack(){ClassicHud.Roll(-1);}
	,Roll(direction){
		if(ClassicHud.timerId) return;
		var sizePrev = ClassicHud.sizes[ClassicHud.currentSizeIndex];
		ClassicHud.currentSizeIndex += direction;
		if(ClassicHud.currentSizeIndex == ClassicHud.sizes.length) ClassicHud.currentSizeIndex--;
		if(ClassicHud.currentSizeIndex < 0) ClassicHud.currentSizeIndex++;
		var sizeNext = ClassicHud.sizes[ClassicHud.currentSizeIndex];
		
		if(sizePrev == sizeNext) return;
		var transitTime = 750;
		
		ClassicHud.timerId = true;
		setTimeout(function(){ClassicHud.timerId = false}, transitTime); 
		
		var steps = 150, step = 0;
		//var sizePerStep = (sizeNext - sizePrev) / steps;
		
		var loc = LocationController.canvasContainer;
		var hud = document.getElementById("ClassicRoomHud");
		
		var size = sizeNext;
		
		hud.style.width = size + "%";
		loc.style.top = size/2 + "%";
		size = 100-size;
		hud.style.left = size + "%";
		loc.style.width = size + "%";
		loc.style.height = size + "%";
		
		hud.style.transition = "750ms";
		loc.style.transition = "750ms";

		var actionIcons = document.getElementById("HudClassicChatRoomActionIcons").childNodes;
		for(var i = 0, y = 0; i < actionIcons.length; i++){
			var actionIcon = actionIcons[i];
			if(actionIcon.nodeType != 1) continue;
			y++;
			if(ClassicHud.currentSizeIndex == 1){
				actionIcon.classList.add("spread")
				if(y > 2 && y != 6) 
					actionIcon.style.display = "none";
			}
			else{
				actionIcon.classList.remove("spread");
				actionIcon.style.display = "block";
			}
			
			if(y == 6){
				if(ClassicHud.currentSizeIndex == 2){
					actionIcon.onclick = function(){ClassicHud.RollBack();}
					actionIcon.childNodes[0].style.transform = "rotate(180deg)";
				}else{
					actionIcon.onclick = function(){ClassicHud.RollForward();}
					actionIcon.childNodes[0].style.transform = "";
				}
				
			}
		}
		
		var textIcons = document.getElementById("HudClassicChatContainer").childNodes;
		for(var i = 0, y = 0; i < textIcons.length; i++){
			var textIcon = textIcons[i];
			if(textIcon.nodeType != 1) continue;
			if(ClassicHud.currentSizeIndex == 1)
				textIcon.classList.add("spread")
			else
				textIcon.classList.remove("spread");				
		}
		
		/*
		function frame() {
			if (++step == steps) {
				clearInterval(ClassicHud.timerId);
				ClassicHud.timerId = null;
			} else {
				var size = sizePrev + sizePerStep*step;
				
				hud.style.width = size + "%";
				loc.style.top = size/2 + "%";
				size = 100-size;
				hud.style.left = size + "%";
				loc.style.width = size + "%";
				loc.style.height = size + "%";
			}
		}
		
		ClassicHud.timerId = setInterval(frame, 5);*/
	}
}




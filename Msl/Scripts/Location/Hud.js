
var ClassicHud = {
	timerId:null
	,sizes : [0, 18, 40]
	,currentSizeIndex : 1
	,RollForward(){ClassicHud.Roll(1);}
	,RollBack(){ClassicHud.Roll(-1);}
	,Roll(direction){
		//if(ClassicHud.timerId) return;
		var sizePrev = ClassicHud.sizes[ClassicHud.currentSizeIndex];
		ClassicHud.currentSizeIndex += direction;
		if(ClassicHud.currentSizeIndex == ClassicHud.sizes.length) ClassicHud.currentSizeIndex--;
		if(ClassicHud.currentSizeIndex < 0) ClassicHud.currentSizeIndex++;
		var sizeNext = ClassicHud.sizes[ClassicHud.currentSizeIndex];
		
		if(sizePrev == sizeNext) return;
		//var transitTime = 750;
		
		//ClassicHud.timerId = true;
		//setTimeout(function(){ClassicHud.timerId = false}, transitTime); 
		
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
		
		//Update font size in the resized container, as relative to the global container which is resized by the window size.
		var fontSize = window.getComputedStyle(document.getElementById("MainContainer"), null).getPropertyValue("font-size");
		//document.getElementById("LocationViewCanvas").style.fontSize = parseFloat(fontSize) * size / 100 + "px";
		document.getElementById("LocationViewCanvas").style.fontSize = size + "%";
		
		//Update the action buttons -- size, display
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
	}
}

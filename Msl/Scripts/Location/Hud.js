
var ClassicHud = {
	timerId:null
	,sizes : [0, 18, 40]
	,currentSizeIndex : 1
	,RollForward(){this.Roll(1);}
	,RollBack(){this.Roll(-1);}
	
	,Init(){
		this.topStripContainer = document.getElementById("LocationHudStripTop");
		Util.ClearNodeContent(this.topStripContainer);
		LocationController.GetPlayers().forEach(player => {
			this.topStripContainer.classList.add("large");
			var div = Util.CreateElement({parent:this.topStripContainer, events:{
				click:function(e){LocationController.StartPlayerDialogProfile(player);}.bind(this)
			}});
			LocationController.delegates.view.BuildPlayerFigure(div, player.renderPortrait);
		});
	}
	
	,UnInit(){}
	,Interrupt(){}
	
	,playerPortraits:{}
	
	,OnPlayerEnter(player){
		console.log("Enter ", player);
	}
	
	,OnPlayerExit(player){
		console.log("Exit ", player);
	}
	
	,OnPlayerDisconnect(player){
		console.log("Disconnect ", player);
	}
	
	,OnPlayerReconnect(player){
		console.log("Reconnect ", player);
	}
	
	
	,Roll(direction){
		var sizePrev = this.sizes[this.currentSizeIndex];
		this.currentSizeIndex += direction;
		if(this.currentSizeIndex == this.sizes.length) this.currentSizeIndex--;
		if(this.currentSizeIndex < 0) this.currentSizeIndex++;
		var sizeNext = this.sizes[this.currentSizeIndex];
		
		if(sizePrev == sizeNext) return;
		
		var loc = LocationController.canvasContainer;
		var hudStripTop = document.getElementById("LocationHudStripTop");
		var hudClassic = document.getElementById("LocationHudClassic");
		hudClassic.classList.remove("size-" + sizePrev);
		hudClassic.classList.add("size-" + sizeNext);
		
		var size = sizeNext;
		
		hudClassic.style.width = size + "%";
		loc.style.top = size/2 + "%";
		hudStripTop.style.height = size/2+"%";
		
		size = 100-size;
		hudClassic.style.left = size + "%";
		loc.style.width = size + "%";
		loc.style.height = size + "%";
		hudStripTop.style.width = size+"%";
		
		hudStripTop.style.transition = hudClassic.style.transition = loc.style.transition = "750ms";
		
		//Update font size in the resized container, as relative to the global container which is resized by the window size.
		var fontSize = window.getComputedStyle(document.getElementById("MainContainer"), null).getPropertyValue("font-size");
		//document.getElementById("LocationViewCanvas").style.fontSize = parseFloat(fontSize) * size / 100 + "px";
		document.getElementById("LocationViewCanvas").style.fontSize = size + "%";
		
		//update the icon strip size
		if(this.currentSizeIndex == 2){
			this.topStripContainer.classList.add("large");
			this.topStripContainer.classList.remove("small");
		}else if(this.currentSizeIndex == 1){
			this.topStripContainer.classList.add("small");
			this.topStripContainer.classList.remove("large");
		}
		
		//Update the action buttons -- size, display
		var actionIcons = document.getElementById("HudClassicChatRoomActionIcons").childNodes;
		for(var i = 0, y = 0; i < actionIcons.length; i++){
			var actionIcon = actionIcons[i];
			if(actionIcon.nodeType != 1) continue;
			y++;
			if(this.currentSizeIndex == 1){
				actionIcon.classList.add("spread")
				if(y > 2 && y != 6) 
					actionIcon.style.display = "none";
			}
			else{
				actionIcon.classList.remove("spread");
				actionIcon.style.display = "block";
			}
			
			if(y == 6){
				if(this.currentSizeIndex == 2){
					actionIcon.onclick = function(){this.RollBack();}.bind(this)
					actionIcon.childNodes[0].style.transform = "rotate(180deg)";
				}else{
					actionIcon.onclick = function(){this.RollForward();}.bind(this)
					actionIcon.childNodes[0].style.transform = "";
				}
				
			}
		}
		
		var textIcons = document.getElementById("HudClassicChatContainer").childNodes;
		for(var i = 0, y = 0; i < textIcons.length; i++){
			var textIcon = textIcons[i];
			if(textIcon.nodeType != 1) continue;
			if(this.currentSizeIndex == 1)
				textIcon.classList.add("spread")
			else
				textIcon.classList.remove("spread");				
		}
	}
}

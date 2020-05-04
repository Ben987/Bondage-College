'use strict'

var SideInput = {
	currentRollState:"ROLL_STATE_SMALL"
	,ROLL_STATE_OUT:"ROLL_STATE_OUT"
	,ROLL_STATE_SMALL:"ROLL_STATE_SMALL"
	,ROLL_STATE_FULL:"ROLL_STATE_FULL"
	
	,Roll(){
		Util.DetachElementsAndClear(LocationView.actionIcons);
		if(SideInput.currentRollState == SideInput.ROLL_STATE_SMALL)
			SideInput.RollFull();
		else if(SideInput.currentRollState == SideInput.ROLL_STATE_OUT || SideInput.currentRollState == SideInput.ROLL_STATE_FULL)
			SideInput.RollSmall();
	}
	
	,RollSmall(){
		var leftRoll = document.getElementById("LocationViewSideInputLeft");
		leftRoll.setAttribute("class", "");	leftRoll.classList.add("roll-left"); leftRoll.classList.add("roll-left-small");
		SideInput.currentRollState = SideInput.ROLL_STATE_SMALL;
	}
	
	,RollFull(){
		var leftRoll = document.getElementById("LocationViewSideInputLeft");
		leftRoll.setAttribute("class", "");	leftRoll.classList.add("roll-left"); leftRoll.classList.add("roll-left-full");
		SideInput.currentRollState = SideInput.ROLL_STATE_FULL;
	}
	
	,RollOut(){
		var leftRoll = document.getElementById("LocationViewSideInputLeft");
		leftRoll.setAttribute("class", "");	leftRoll.classList.add("roll-left"); leftRoll.classList.add("roll-left-out");
		SideInput.currentRollState = SideInput.ROLL_STATE_OUT;
	}
	
	,Poses(){LocationController.PoseChangeSelf();}
	,Examine(){SideInput.LocationViewActionAndRollSmall("Examine");}
	,Move(){SideInput.LocationViewActionAndRollSmall("Move");}
	
	
	,Item(){
		if(SideInput.currentRollState != SideInput.ROLL_STATE_FULL)
			return SideInput.RollFull();
		
		LocationFocusView.Show(LocationController.GetPlayer());
		
		SideInput.RollSmall();
	}
	
	
	,Settings(){SideInput.LocationViewActionAndRollSmall("Settings");}
	,LocationViewActionAndRollSmall(actionName){
		if(SideInput.currentRollState != SideInput.ROLL_STATE_FULL)
			return SideInput.RollFull();
		
		LocationView["ShowActions" + actionName]();
		SideInput.RollSmall();
	}
}



var BottomChat = {
	currentRollOutState:1
	,rollOutStates:[0, 8, 16, 95]

	,messageLog:[]
	
	,AddChatMessageToLog(playerId, type, content){
		BottomChat.messageLog.push({playerId:playerId, type:type, content:content});
		BottomChat.ClearAndDisplayLog();
		
		var fadeOutTime = 6000 + content.length*80;
		var spotDiv = LocationView.spotDivs[LocationController.GetSpotWithPlayer(playerId).name];
		var hoverDiv = Util.CreateElement({parent:spotDiv, innerHTML:content, className:"chat-hover-item"});
		
		setTimeout(() => {hoverDiv.style.animation = "fadeOut ease " + fadeOutTime +"ms"}, 6000);
		setTimeout(() => {hoverDiv.parentNode.removeChild(hoverDiv);}, 6000  + fadeOutTime);
	}
	
	,ClearAndDisplayLog(){
		var chatLogDiv = document.getElementById("LocationViewChatLog");
		var scrollToBot = Math.ceil(chatLogDiv.scrollHeight - chatLogDiv.scrollTop) === chatLogDiv.clientHeight;
		
		var html = "";
		BottomChat.messageLog.forEach(message => {html += "<div class='chat-log-item'>" + message.content + "</div>";});
		chatLogDiv.innerHTML = html;
		
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
	}
	
	,Touch(event){BottomChat.ClickOrTouch(event);}
	,Click(event){BottomChat.ClickOrTouch(event);}
	,ClickOrTouch(event){
		
	}
	
	,KeyPress(event){
		if(event.code == "Enter" || event.code == "NumpadEnter"){
			BottomChat.SendMessage();
			event.preventDefault();
			//BottomChat.RollMedIfSmall();
		}
	}
	
	,SendMessage(){
		var content = document.getElementById("LocationViewChatInput").value;
		document.getElementById("LocationViewChatInput").value = "";
		LocationController.SendChatMessage(content);		
	}
	
	,RollNext(direction){
		var b = BottomChat.currentRollOutState + direction;
		if(b >= BottomChat.rollOutStates.length) b = BottomChat.rollOutStates.length - 1; else if(b < 0) b = 0;
		
		var chatLogDiv = document.getElementById("LocationViewChatLog");
		var scrollToBot = Math.ceil(chatLogDiv.scrollHeight - chatLogDiv.scrollTop) === chatLogDiv.clientHeight;
		
		document.getElementById("LocationViewChat").style.height = BottomChat.rollOutStates[b] + "%";
		
		var height = b == 0 ? 0 : BottomChat.rollOutStates[1] * 100 / BottomChat.rollOutStates[b];
		var top = 100 - height;
		
		chatLogDiv.style.height = top + "%";
		
		["LocationViewChatButtonLeft", "LocationViewChatButtonRight", "LocationViewChatInput"].forEach(elementId => {
			document.getElementById(elementId).style.height = height + "%";
			document.getElementById(elementId).style.top = top + "%";
		});
		
		BottomChat.currentRollOutState = b;
		
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;		
	}
	
	,RollMedIfSmall(){
		if(BottomChat.currentRollOutState <= 1) BottomChat.RollNext(1);	
	}
	,RollSmallIfHidden(){
		if(BottomChat.currentRollOutState == 0) BottomChat.RollNext(1);
	}
	,RollHide(){
		BottomChat.currentRollOutState == 1; 
		BottomChat.RollNext(-1);
	}
}
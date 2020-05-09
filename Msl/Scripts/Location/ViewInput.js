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



var LocationViewChat = {
	CHAT_LOG_ELEMENT_ID:"LocationViewChatLog"
	,CHAT_INPUT_ELEMENT_ID:"LocationViewChatInput"
	,displayMessagesOnCharacter:true
	,currentRollOutState:1
	,rollOutStates:[0, 8, 16, 95]

	,messageLog:[]
	
	,Init(){}
	,UnInit(){
		LocationViewChat.messageLog = [];
		Util.ClearNodeContent(document.getElementById(LocationViewChat.CHAT_LOG_ELEMENT_ID));
	}
	,Interrupt(){}
	,OnScreenChange(){}
	
	,AddChatMessageToLog(playerId, type, content){
		var data = {playerId:playerId, type:type, content:content};
		LocationViewChat.messageLog.push(data);
		
		var chatLogDiv = document.getElementById(LocationViewChat.CHAT_LOG_ELEMENT_ID);
		var scrollToBot = Util.ScrollableElementIsAtBottom(chatLogDiv);	
		LocationViewChat.CreateAndAddChatLogElement(data);
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
		
		LocationViewChat.AddChatMessageToFigureBox(data);
	}
	
	,AddChatMessageToFigureBox(messageData){
		var fadeOutTime = 6000 + messageData.content.length*80;
		var spotDiv = LocationController.delegates.view.spotDivs[LocationController.GetSpotWithPlayer(messageData.playerId).name];
		var hoverDiv = Util.CreateElement({parent:spotDiv, textContent:messageData.content, className:"chat-hover-item"});
		
		setTimeout(() => {hoverDiv.style.animation = "fadeOut ease " + fadeOutTime +"ms"}, 6000);
		setTimeout(() => {hoverDiv.parentNode.removeChild(hoverDiv);}, 6000  + fadeOutTime);
	}
	
	
	,ClearAndDisplayLog(messageDataList){
		var chatLogDiv = document.getElementById(LocationViewChat.CHAT_LOG_ELEMENT_ID);
		var scrollToBot = Util.ScrollableElementIsAtBottom(chatLogDiv);		
		Util.ClearNodeContent(chatLogDiv);
		messageDataList.forEach(messageData => LocationViewChat.CreateAndAddChatLogElement(messageData));
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
	}
	
	
	,CreateAndAddChatLogElement(messageData){
		Util.CreateElement({parent:LocationViewChat.CHAT_LOG_ELEMENT_ID,className:"chat-log-item", textContent:messageData.content});
	}
	
	
	,TypeMessage(event){
		if(event.code == "Enter" || event.code == "NumpadEnter"){
			LocationViewChat.SendMessage(event.target);
			event.preventDefault();
			//LocationViewChat.RollMedIfSmall();
		}
	}
	
	,SendMessage(){
		var content = document.getElementById(LocationViewChat.CHAT_INPUT_ELEMENT_ID).value;
		document.getElementById(LocationViewChat.CHAT_INPUT_ELEMENT_ID).value = "";
		LocationController.SendChatMessage(content);		
	}
	
	/*,RollNext(direction){
		var b = LocationViewChat.currentRollOutState + direction;
		if(b >= LocationViewChat.rollOutStates.length) b = LocationViewChat.rollOutStates.length - 1; else if(b < 0) b = 0;
		
		var chatLogDiv = document.getElementById("LocationViewChatLog");
		var scrollToBot = Math.ceil(chatLogDiv.scrollHeight - chatLogDiv.scrollTop) === chatLogDiv.clientHeight;
		
		document.getElementById("LocationViewChat").style.height = LocationViewChat.rollOutStates[b] + "%";
		
		var height = b == 0 ? 0 : LocationViewChat.rollOutStates[1] * 100 / LocationViewChat.rollOutStates[b];
		var top = 100 - height;
		
		chatLogDiv.style.height = top + "%";
		
		["LocationViewChatButtonLeft", "LocationViewChatButtonRight", "LocationViewChatInput"].forEach(elementId => {
			document.getElementById(elementId).style.height = height + "%";
			document.getElementById(elementId).style.top = top + "%";
		});
		
		LocationViewChat.currentRollOutState = b;
		
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;		
	}
	
	,RollMedIfSmall(){
		if(LocationViewChat.currentRollOutState <= 1) LocationViewChat.RollNext(1);	
	}
	,RollSmallIfHidden(){
		if(LocationViewChat.currentRollOutState == 0) LocationViewChat.RollNext(1);
	}
	,RollHide(){
		LocationViewChat.currentRollOutState == 1; 
		LocationViewChat.RollNext(-1);
	}*/
}
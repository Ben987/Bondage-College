'use strict'

var LocationViewChat = {
	displayMessagesOnCharacter:true
	//,currentRollOutState:1
	//,rollOutStates:[0, 8, 16, 95]

	,messageLog:[]
	
	,logContainer:null
	,inputTextarea:null
	
	,Init(){
		LocationViewChat.logContainer = document.getElementById("LocationViewChatLog");
		LocationViewChat.inputTextarea = document.getElementById("LocationViewChatInput");
	}
	,UnInit(){
		LocationViewChat.messageLog = [];
		Util.ClearNodeContent(LocationViewChat.logContainer);
	}
	,Interrupt(){}
	,OnScreenChange(){}
	
	,OnPlayerExit(player){
		var spotName = LocationController.GetSpotWithPlayer(player.id).name;	
		var content = "*" + player.character.name + " left the location (from " + spotName + ")";
		var color = player.settings.gui.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});	
	}
	,OnPlayerEnter(player){
		var spotName = LocationController.GetSpotWithPlayer(player.id).name;	
		var content = "*" + player.character.name + " entered (>> " + spotName + ")";
		var color = player.settings.gui.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});			
	}
	,OnPlayerReconnect(player){
		var content = "*" + player.character.name + " reconnected";
		var color = player.settings.gui.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});		
	}
	,OnPlayerDisconnect(player, time){
		var content = "*" + player.character.name + " is reconnecting (waiting for " + time + ")";
		var color = player.settings.gui.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});		
	}
	,OnAction(action){
		var scrollToBot = Util.ScrollableElementIsAtBottom(LocationViewChat.logContainer);	
		
		var originPlayer = LocationController.GetPlayer(action.originPlayerId);
		var targetPlayer = LocationController.GetPlayer(action.targetPlayerId);
		var color = originPlayer.settings.gui.chat.labelColor;
		switch(action.type){
			case "ChatMessage":
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", name:originPlayer.character.name, content:action.result.content});
				LocationViewChat.AddChatMessageToFigureBox(action.originPlayerId, action.result.content);
			break;
			case "MoveToSpot":
				var content = "*" + originPlayer.character.name + " " + (action.finished ? ">>" : ">") + " " + action.targetSpotName + "*";
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", content:content, narration:true});				
			break;
			case "AppearanceUpdateOther":
				var content = "*" + originPlayer.character.name + " " + (action.finished ? "completed" : "started") + " updating appearance of " + targetPlayer.name + "*";
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", content:content, narration:true});					
			break;
			case "AppearanceUpdateSelf":
				//no message
			break;
			case "PlayerExit":
				var content = "*" + originPlayer.character.name + " left the location (from " + targetPlayer.name + "*";
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", content:content, narration:true});	
			break;
			case "PlayerDisconnect":
			case "PlayerReconnect":
				//handled in OnPlayerDisconnect
			break;
			default:
				console.log("Chat unhandled " + action.type);
		}
		
		if(scrollToBot) LocationViewChat.logContainer.scrollTop = LocationViewChat.logContainer.scrollHeight;
	}
	
	/*
	,OnAction_MoveToSpot(action){
	
	}
	
	
	,OnAction_ChatMessage(action){
		var origniPlayer = LocationController.GetPlayer(action.originPlayerId);
		var color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, origniPlayer.settings.gui.chat.labelColor)	
		//var messageDiv = Util.CreateElement({parent:LocationViewChat.logContainer, cssClass:"chat-log-message", cssStyles:{backgroundColor:color.ToCssColor(0.1)}});
		var messageDiv = Util.CreateElement({parent:LocationViewChat.logContainer, cssClass:"chat-log-message"});
		
		var messageDataDiv = Util.CreateElement({parent:messageDiv, cssClass:"chat-log-message-data"});
		var timeDiv = Util.CreateElement({parent:messageDataDiv, textContent:"10:20", cssClass:"chat-log-message-data-time"});
		var originIdDiv = Util.CreateElement({parent:messageDataDiv, textContent:"334", cssClass:"chat-log-message-data-id"});

		var nameSpan = Util.CreateElement({tag:"span", parent:messageDiv, textContent:origniPlayer.name +": ", cssClass:"chat-log-message-name", cssStyles:{color:color.ToCssColor()}});
		var contentSpan = Util.CreateElement({tag:"span", parent:messageDiv, textContent:action.result.content, cssClass:"chat-log-message-content"});
		AddChatMessageToLog
		LocationViewChat.AddChatMessageToFigureBox(action.originPlayerId, action.result.content);
	}*/
	
	,AddChatMessageToLog(messageData){
		var color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING,  messageData.color ? messageData.color : "#ffffff");
		
		var cssStyles = messageData.narration ? {backgroundColor:color.ToCssColor(0.1), fontStyle:"italic", color:"gray"} : {color:"black"};
		var messageDiv = Util.CreateElement({cssClass:"chat-log-message", cssStyles:cssStyles});
		
		if(messageData.id || messageData.time){
			var messageDataDiv =	Util.CreateElement({parent:messageDiv, cssClass:"chat-log-message-data"});
			if(messageData.time)	Util.CreateElement({parent:messageDataDiv, textContent:messageData.time, cssClass:"chat-log-message-data-time"});
			if(messageData.id) 		Util.CreateElement({parent:messageDataDiv, textContent:messageData.id, cssClass:"chat-log-message-data-id"});
		}
		
		if(messageData.name){
			Util.CreateElement({tag:"span", parent:messageDiv, textContent:messageData.name +": ", cssClass:"chat-log-message-name", cssStyles:{color:color.ToCssColor()}});
			Util.CreateElement({tag:"span", parent:messageDiv, textContent:messageData.name.substring(0, 1) +".: ", cssClass:"chat-log-message-initial", cssStyles:{color:color.ToCssColor()}});
		}
		
		var contentSpan = Util.CreateElement({tag:"span", parent:messageDiv, textContent:messageData.content, cssClass:"chat-log-message-content"});
		
		setTimeout(function(){LocationViewChat.logContainer.appendChild(messageDiv);}, 20);
	}
	
	,AddChatMessageToFigureBox(playerId, content){
		var fadeOutTime = 6000 + content.length*80;
		var spotDiv = LocationController.delegates.view.spotDivs[LocationController.GetSpotWithPlayer(playerId).name];
		var hoverDiv = Util.CreateElement({parent:spotDiv, textContent:content, className:"chat-hover-item"});
		
		//TODO replace animation with transition
		setTimeout(() => {hoverDiv.style.animation = "fadeOut ease " + fadeOutTime +"ms"}, 6000);
		setTimeout(() => {hoverDiv.parentNode.removeChild(hoverDiv);}, 6000  + fadeOutTime);
	}
	
	/*
	,ClearAndDisplayLog(messageDataList){
		var chatLogDiv = document.getElementById(LocationViewChat.CHAT_LOG_ELEMENT_ID);
		var scrollToBot = Util.ScrollableElementIsAtBottom(chatLogDiv);		
		Util.ClearNodeContent(chatLogDiv);
		messageDataList.forEach(messageData => LocationViewChat.CreateAndAddChatLogElement(messageData));
		if(scrollToBot) chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
	}*/
	
	
	,TypeMessage(event){
		if(event.code == "Enter" || event.code == "NumpadEnter"){
			LocationViewChat.SendMessage(event.target);
			event.preventDefault();
			//LocationViewChat.RollMedIfSmall();
		}
	}
	
	
	,SendMessage(){
		var content = LocationViewChat.inputTextarea.value;
		LocationViewChat.inputTextarea.value = "";
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

/*

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

*/
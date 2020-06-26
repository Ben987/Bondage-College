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
	
	
	,OnFriendMessage(data){
		var content = "*" + data.originPlayerName + " sent message: " + data.message;
		if(data.locationId) content += " from location " + data.locationName + " (" + data.locationType + "-" + data.locationId + ")";
		this.AddChatMessageToLog({id:data.originPlayerId, time:"12:20", content:content, narration:true});	
	}
	,OnPlayerExit(player){
		var spotName = LocationController.GetSpotWithPlayer(player.id).name;	
		var content = "*" + player.profile.name + " left the location (from " + spotName + ")";
		var color = player.settings.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});	
	}
	,OnPlayerEnter(player){
		var spotName = LocationController.GetSpotWithPlayer(player.id).name;	
		var content = "*" + player.profile.name + " entered (>> " + spotName + ")";
		var color = player.settings.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});			
	}
	,OnPlayerReconnect(player){
		var content = "*" + player.profile.name + " reconnected";
		var color = player.settings.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});		
	}
	,OnPlayerDisconnect(player, time){
		var content = "*" + player.profile.name + " is reconnecting (waiting for " + time + ")";
		var color = player.settings.chat.labelColor;
		this.AddChatMessageToLog({color:color, id:player.id, time:"12:20", content:content, narration:true});		
	}
	,OnAction(action){
		var scrollToBot = Util.ScrollableElementIsAtBottom(LocationViewChat.logContainer);	
		
		var originPlayer = LocationController.GetPlayer(action.originPlayerId);
		var targetPlayer = LocationController.GetPlayer(action.targetPlayerId);
		var color = originPlayer.settings.chat.labelColor;
		switch(action.type){
			case "ChatMessage":
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", name:originPlayer.character.name, content:action.result.content});
				LocationViewChat.AddChatMessageToFigureBox(action.originPlayerId, action.result.content);
			break;
			case "MoveToSpot":
				var content = "*" + originPlayer.profile.name + " " + (action.finished ? ">>" : ">") + " " + action.targetSpotName + "*";
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", content:content, narration:true});				
			break;
			case "AppearanceUpdateOther":
				var content = "*" + originPlayer.profile.name + " " + (action.finished ? "completed" : "started") + " updating appearance of " + targetPlayer.name + "*";
				this.AddChatMessageToLog({color:color, id:originPlayer.id, time:"12:20", content:content, narration:true});					
			break;
			case "AppearanceUpdateSelf":
				//no message
			break;
			case "PlayerExit":
				var content = "*" + originPlayer.profile.name + " left the location (from " + targetPlayer.name + "*";
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
}

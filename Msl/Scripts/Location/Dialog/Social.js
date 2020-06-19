'use strict'

var LocationDialogSocialView  = function(mainDialog, containerElement){
	this.AddPlayerIdRow = function(tbodyElement, playerId, listPropertyName){
		var tr = Util.CreateElement({tag:"tr", parent:tbodyElement});
		var td = Util.CreateElement({tag:"td", parent:tr, textContent:playerId});
		var td = Util.CreateElement({tag:"td", parent:tr});
		var removeButton = Util.CreateElement({tag:"a", parent:td, textContent:"Remove"});
		removeButton.addEventListener("click", function(){this.RemovePlayerFromList(tr, playerId, listPropertyName);}.bind(this));
		return tr;
	}
	
	this.FillPlayerList = function(tBodyElement, playerIdList, listPropertyName){
		playerIdList.forEach(playerId => this.AddPlayerIdRow(tBodyElement, playerId, listPropertyName));
		
		var addInput = tBodyElement.parentNode.tFoot.rows[0].cells[0].childNodes[0];//relies on there being no whitespaces in the html
		var addButton = tBodyElement.parentNode.tFoot.rows[0].cells[1].childNodes[0];
		addButton.addEventListener("click", function(){this.AddPlayerToList(tBodyElement, addInput.value, listPropertyName);}.bind(this));		
	}
	
	
	this.mainDialog = mainDialog;
	//this.mainContainer = Util.GetFirstChildNodeByName(mainDialog.viewContainer, "social");
	this.mainContainer = containerElement;
	this.tbodies = {};
	["online", "friend", "white", "black", "ghost"].forEach(listName => {
		this.tbodies[listName] = Util.GetFirstChildNodeByName(this.mainContainer, listName).tBodies[0]
	});
	
	this.FillPlayerList(this.tbodies.friend, mainDialog.player.profile.friends, "character.friends");
	this.FillPlayerList(this.tbodies.ghost, mainDialog.player.profile.ghosts, "character.ghosts");
	this.FillPlayerList(this.tbodies.black, mainDialog.player.permissions.players.black, "permissions.players.black");
	this.FillPlayerList(this.tbodies.white, mainDialog.player.permissions.players.white, "permissions.players.white");
	
	
	
	Util.GetFirstChildNodeByName(this.mainContainer, "refresh").addEventListener("click", function(event){
		this.RefreshOnlineFriendList();
	}.bind(this));
	
	
	this.RefreshOnlineFriendList = function(){
		MslServer.Send("GetOnlineFriendList", {}, (function(data){
			console.log("From Server: GetOnlineFriendList", data);
			
			Util.ClearNodeContent(this.tbodies.online);
			data.friends.forEach(friend => {	
				var rowHTML = "<td>" + friend.id + "</td><td>" + friend.name + "</td><td>" + friend.locationId + " " + friend.locationType + "</td><td>";
				var tr = Util.CreateElement({tag:"tr", parent:this.tbodies.online, innerHTML:rowHTML});
				
				var selectionOptionsHTML = "<option value='1'>Plain Beep</option><option value='2'>Fancy Beep</option>"
				var tdSelection = Util.CreateElement({tag:"td", parent:tr});
				
				var selectionElement = Util.CreateElement({tag:"select", parent:tdSelection, innerHTML:selectionOptionsHTML});
				
				var tdButton = Util.CreateElement({tag:"td", parent:tr});
				var button = Util.CreateElement({tag:"button", parent:tdButton, textContent:"Send", events:{
					click:function(){
						MslServer.Send("SendMessageToFriend", {targetPlayerId:friend.id*1, message:1*selectionElement.value}, function(){
							//message sent
						}.bind(this));
					}.bind(this)
				}});
			});
		}.bind(this)));
	}
	this.RefreshOnlineFriendList();
	
	
	this.AddPlayerToList = function(tableBodyElement, playerId, listPropertyName){
		playerId = parseInt(playerId);
		if(playerId){
			MslServer.Send("UpdatePlayerProperty", {property:listPropertyName, value:playerId*1, operation:"add"}, function(){
				this.AddPlayerIdRow(tableBodyElement, playerId, listPropertyName);
			}.bind(this));
		}
	}
	
	
	this.RemovePlayerFromList = function(tableRowElement, playerId, listPropertyName){
		playerId = parseInt(playerId);
		if(playerId){
			MslServer.Send("UpdatePlayerProperty", {property:listPropertyName, value:playerId*1, operation:"remove"}, function(){
				tableRowElement.parentNode.removeChild(tableRowElement);
			}.bind(this));
		}
	}
}
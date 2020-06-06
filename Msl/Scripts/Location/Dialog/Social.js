'use strict'

var LocationDialogSocialView  = function(mainDialog, containerElement){
	this.AddPlayerIdRow = function(tbodyElement, listName, playerId){
		var tr = Util.CreateElement({tag:"tr", parent:tbodyElement});
		var td = Util.CreateElement({tag:"td", parent:tr, textContent:playerId});
		var td = Util.CreateElement({tag:"td", parent:tr});
		var removeButton = Util.CreateElement({tag:"a", parent:td, textContent:"Remove"});
		removeButton.addEventListener("click", function(){this.RemovePlayerFromList(listName, playerId, tr);}.bind(this));
		return tr;
	}
	
	
	this.mainDialog = mainDialog;
	//this.mainContainer = Util.GetFirstChildNodeByName(mainDialog.viewContainer, "social");
	this.mainContainer = containerElement;
	this.tbodies = {};
	["online", "friend", "white", "black", "ghost"].forEach(listName => {
		this.tbodies[listName] = Util.GetFirstChildNodeByName(this.mainContainer, listName).tBodies[0]
	});
	
	
	for(let listName in mainDialog.player.character.playerLists){
		let playerIdList = mainDialog.player.character.playerLists[listName];
		let tbody = this.tbodies[listName];
		
		playerIdList.forEach(playerId => this.AddPlayerIdRow(tbody, listName, playerId));
		
		let addInput = tbody.parentNode.tFoot.rows[0].cells[0].childNodes[0];//relies on there being no whitespaces in the html
		let addButton = tbody.parentNode.tFoot.rows[0].cells[1].childNodes[0];
		addButton.addEventListener("click", function(){this.AddPlayerToList(listName, addInput.value, tbody);}.bind(this));
	}
	
	
	Util.GetFirstChildNodeByName(this.mainContainer, "refresh").addEventListener("click", function(event){
		this.RefreshOnlineFriendList();
	}.bind(this));
	
	
	this.RefreshOnlineFriendList = function(){
		MslServer.Send("GetOnlineFriendList", {}, (function(data){
			console.log("GetOnlineFriendList");
			console.log(data);
			
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
	
	
	this.AddPlayerToList = function(listName, playerId, tableBodyElement){
		playerId = parseInt(playerId);
		if(playerId){
			MslServer.Send("UpdatePlayerProperty", {property:"character.playerLists." + listName, value:playerId*1, operation:"add"}, function(){
				this.AddPlayerIdRow(tableBodyElement, listName, playerId);
			}.bind(this));
		}
	}
	
	
	this.RemovePlayerFromList = function(listName, playerId, tableRowElement){
		playerId = parseInt(playerId);
		if(playerId){
			MslServer.Send("UpdatePlayerProperty", {property:"character.playerLists." + listName, value:playerId*1, operation:"remove"}, function(){
				tableRowElement.parentNode.removeChild(tableRowElement);
			}.bind(this));
		}
	}
}
"use strict";
var ServerSocket = null;
var ServerURL = "http://localhost:4288";

// Loads the server events
function ServerInit() {
	ServerSocket = io(ServerURL);
	ServerSocket.on("ServerMessage", function (data) { console.log(data) });
	ServerSocket.on("ServerInfo", function (data) { ServerInfo(data) });
	ServerSocket.on("CreationResponse", function (data) { CreationResponse(data) });
	ServerSocket.on("LoginResponse", function (data) { LoginResponse(data) });
	ServerSocket.on("disconnect", function (data) { ServerDisconnect() } );
	ServerSocket.on("ForceDisconnect", function (data) { ServerDisconnect(data) } );
}

// When the server sends some information to the client, we keep it in variables
function ServerInfo(data) {
	if (data.OnlinePlayers != null) CurrentOnlinePlayers = data.OnlinePlayers;
	if (data.Time != null) CurrentTime = data.Time;
}

// When the server disconnects, we go back to the login screen
function ServerDisconnect(data) {
	if (Player.Name != "" ) {
		if (CurrentCharacter != null) 
			DialogLeave(); 
		CommonSetScreen("Character", "Login"); 
		LoginMessage = TextGet((data != null) ? data : "ErrorDisconnectedFromServer");
	}
}

// Sends a message to the server
function ServerSend(Message, Data) {
	ServerSocket.emit(Message, Data);
}

// Syncs some player information to the server
function ServerPlayerSync() {
	ServerSend("AccountUpdate", {Money: Player.Money, Owner: Player.Owner, Lover: Player.Lover});
}

// Syncs the full player inventory to the server
function ServerPlayerInventorySync() {
	var D = {};
	D.Inventory = [];
	for(var I = 0; I < Player.Inventory.length; I++)
		if (Player.Inventory[I].Asset != null)
			D.Inventory.push({ Name: Player.Inventory[I].Asset.Name, Group: Player.Inventory[I].Asset.Group.Name });
	ServerSend("AccountUpdate", D);
}

// Syncs the full player log to the server
function ServerPlayerLogSync() {
	var D = {};
	D.Log = Log;
	ServerSend("AccountUpdate", D);
}

// Syncs the full player reputation to the server
function ServerPlayerReputationSync() {
	var D = {};
	D.Reputation = Player.Reputation;
	ServerSend("AccountUpdate", D);
}

// Syncs the full player reputation to the server
function ServerPlayerSkillSync() {
	var D = {};
	D.Skill = Player.Skill;
	ServerSend("AccountUpdate", D);
}

// Prepares an appearance bundle that we can push to the server (removes the assets, only keep the main information)
function ServerAppearanceBundle(Appearance) {
	var Bundle = [];
	for (var A = 0; A < Appearance.length; A++) {
		var N = {};
		N.Group = Appearance[A].Asset.Group.Name;
		N.Name = Appearance[A].Asset.Name;
		if ((Appearance[A].Color != null) && (Appearance[A].Color != "Default")) N.Color = Appearance[A].Color;
		if ((Appearance[A].Difficulty != null) && (Appearance[A].Difficulty != 0)) N.Difficulty = Appearance[A].Difficulty;
		Bundle.push(N);
	}
	return Bundle;
}

// Loads the appearance assets from a server bundle that only contains the main info (no assets)
function ServerAppearanceLoadFromBundle(AssetFamily, Bundle) {

	// For each appearance item to load
	var Appearance = [];
	for (var A = 0; A < Bundle.length; A++) {

		// Cycles in all the assets to find the correct item to add and colorize it
		var I;
		for (I = 0; I < Asset.length; I++)
			if ((Asset[I].Name == Bundle[A].Name) && (Asset[I].Group.Name == Bundle[A].Group) && (Asset[I].Group.Family == AssetFamily)) {
				var NA = {
					Asset: Asset[I],
					Difficulty: parseInt((Bundle[A].Difficulty == null) ? 0 : Bundle[A].Difficulty),
					Color: (Bundle[A].Color == null) ? "Default" : Bundle[A].Color
				}
				Appearance.push(NA);
				break;
			}

	}	
	return Appearance;

}

// Syncs the player appearance with the server
function ServerPlayerAppearanceSync() {
	
	// Creates a big parameter string of every appearance items and sends it to the server
	if (Player.AccountName != "") {
		var D = {};
		D.AssetFamily = Player.AssetFamily;
		D.Appearance = ServerAppearanceBundle(Player.Appearance);
		ServerSend("AccountUpdate", D);
	}	

}

// Syncs the player wardrobe with the server (12 wardrobe positions)
function ServerPlayerWardrobeSync() {
	var D = {};
	D.Wardrobe = [];
	for(var W = 0; W < WardrobeCharacter.length; W++) {
		D.Wardrobe[W] = [];
		for(var A = 0; A < WardrobeCharacter[W].Appearance.length; A++)
			if (WardrobeCharacter[W].Appearance[A].Asset.Group.Category == "Appearance")
				D.Wardrobe[W].push({ Name: WardrobeCharacter[W].Appearance[A].Asset.Name, Group: WardrobeCharacter[W].Appearance[A].Asset.Group.Name, Color: WardrobeCharacter[W].Appearance[A].Color });
	}
	ServerSend("AccountUpdate", D);
}

// Syncs the private character with the server
function ServerPrivateCharacterSync() {
	var D = {};
	D.PrivateCharacter = [];
	for(var ID = 1; ID < PrivateCharacter.length; ID++) {
		var C = {
			Name: PrivateCharacter[ID].Name,
			Love: PrivateCharacter[ID].Love,
			Title: PrivateCharacter[ID].Title,
			Trait: PrivateCharacter[ID].Trait,
			Cage: PrivateCharacter[ID].Cage,
			Owner: PrivateCharacter[ID].Owner,
			Lover: PrivateCharacter[ID].Lover,
			AssetFamily: PrivateCharacter[ID].AssetFamily,
			Appearance: ServerAppearanceBundle(PrivateCharacter[ID].Appearance),
			AppearanceFull: ServerAppearanceBundle(PrivateCharacter[ID].AppearanceFull),
			Event: PrivateCharacter[ID].Event
		};
		D.PrivateCharacter.push(C);
	}
	ServerSend("AccountUpdate", D);
};
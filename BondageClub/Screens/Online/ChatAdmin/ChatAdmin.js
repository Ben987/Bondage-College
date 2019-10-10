"use strict";
var ChatAdminBackground = "Sheet";
var ChatAdminMessage = "";
var ChatAdminPrivate = false;
var ChatBackground = ChatRoomData.Background;
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "";
var ChatCreateBackgroundList = null; 
var ChatAdminList = "";
var ChatBanList = "";

// When the chat admin screens loads
function ChatAdminLoad() {
	ChatAdminList = "";
	ChatBanList = "";
	ChatRoomData.Admin.forEach( (x,index) => {
		if(index == 0) {ChatAdminList += x}
		else{ChatAdminList +=  "," + x}
	});
	ChatRoomData.Ban.forEach( (x,index) => {
		if(index == 0) {ChatBanList += x}
		else{ChatBanList +=  "," + x}	
	});
	ChatBackground = ChatRoomData.Background;
	//If the current background isn't valid, we pick the first one
	if (ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect) < 0) {
		ChatCreateBackgroundIndex = 0;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[0];
		ChatBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// Prepares the controls to edit a room

	ElementCreateInput("InputName", "text", ChatRoomData.Name, "20");
	ElementCreateTextArea("InputDescription"); 
	document.getElementById("InputDescription").setAttribute("maxLength", 100);
	document.getElementById("InputDescription").setAttribute("autocomplete", "off");
	ElementCreateTextArea("InputAdminList"); 
	document.getElementById("InputAdminList").setAttribute("maxLength", 250);
	document.getElementById("InputAdminList").setAttribute("autocomplete", "off");
	ElementValue("InputAdminList", ChatAdminList);
	ElementCreateTextArea("InputBanList"); 
	document.getElementById("InputBanList").setAttribute("maxLength", 250);
	document.getElementById("InputBanList").setAttribute("autocomplete", "off");
	ElementValue("InputBanList", ChatBanList);
	ElementValue("InputDescription", ChatRoomData.Description);
	ElementCreateInput("InputSize", "text", "10", "2");
	ElementValue("InputSize", ChatRoomData.Limit);
	ChatAdminMessage = "";
	if( !ChatRoomPlayerIsAdmin()){		//If player is not admin disable inputs
		document.getElementById("InputName").setAttribute("disabled", "disabled");
		document.getElementById("InputDescription").setAttribute("disabled", "disabled");
		document.getElementById("InputAdminList").setAttribute("disabled", "disabled");
		document.getElementById("InputBanList").setAttribute("disabled", "disabled");
		document.getElementById("InputSize").setAttribute("disabled", "disabled");
	}
	
}

// When the chat Admin screen runs
function ChatAdminRun() {

	// Draw the controls
	if (ChatAdminMessage == "") ChatAdminMessage = "EnterRoomInfo";
	//Name
	DrawText(TextGet(ChatAdminMessage), 1000, 60, "Black", "Gray");
	DrawText(TextGet("RoomName"), 320, 150, "Black", "Gray");
	ElementPosition("InputName", 320, 210, 450);

	//Background
	DrawImageResize("Backgrounds/"+ChatBackground+".jpg", 1450, 100, 450, 300);
	DrawText(TextGet("RoomBackground"), 1650, 420, "Black", "Gray");
	DrawBackNextButton(1500, 450, 350, 65, ChatCreateBackgroundSelect, "White	", null,
		() => (ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1],
		() => (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]);

	//Description
	DrawText(TextGet("RoomDescription"), 320, 320, "Black", "Gray");
	ElementPosition("InputDescription", 320, 480, 450, 250);

	// Lists
	DrawText(TextGet("RoomBanList"), 1000, 150, "Black", "Gray");
	ElementPosition("InputBanList", 1000, 310, 450, 250);

	DrawText(TextGet("RoomAdminList"), 1000, 500, "Black", "Gray");
	ElementPosition("InputAdminList", 1000, 660, 450, 250);

	//Private
	DrawText(TextGet("RoomPrivate"), 1710, 640, "Black", "Gray");
	DrawButton(1810, 590, 86, 86, "", "White", ChatRoomData.Private ? "Icons/Private.png" : "Icons/Public.png", ChatRoomData.Private  ? "Private" : "Public");
	//Lock
	if(Player.CanChange()){
		DrawText(TextGet("RoomLocked"), 1710, 750, "Black", "Gray");
		DrawButton(1810, 700, 86, 86, "", "White", ChatRoomData.Locked ?  "Icons/Lock.png" : "Icons/Unlock.png" ,  ChatRoomData.Locked ? "Locked" : "Unlocked");
	}else{
		DrawText(TextGet("PlayerBound"), 1650, 750, "Black", "Gray");
	}
	//Room Size
	DrawText(TextGet("RoomSize"), 220, 700, "Black", "Gray");
	ElementPosition("InputSize", 470, 700, 150);

	//Save Cancel buttons
	if (ChatRoomPlayerIsAdmin()) DrawButton(200, 840, 300, 65, TextGet("Save"), "White");
	DrawButton(1600, 840, 300, 65, TextGet("Cancel"), "White");	
	DrawText(TextGet("ListDesciption"), 1000, 840, "Black", "Gray");
	DrawText(TextGet("ListExample"), 1000, 900, "Black", "Gray");
}

// When the player clicks in the chat Admin screen
function ChatAdminClick() {

	// When we select a new background
	if ((MouseX >= 1500) && (MouseX < 1850) && (MouseY >= 450) && (MouseY < 515) && ChatRoomPlayerIsAdmin()) {
		ChatCreateBackgroundIndex += ((MouseX < 1675 && !CommonIsMobile) ? -1 : 1);
		if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
		if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
		ChatBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// If the user wants to turn room Private
	if ((MouseX >= 1810) && (MouseX < 1896) && (MouseY >= 590) && (MouseY < 676) && ChatRoomPlayerIsAdmin()) {
		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Action: "Private" });
		ChatAdminExit();
	}

	// If the user wants to lock the room
	if ((MouseX >= 1810) && (MouseX < 1896) && (MouseY >= 700) && (MouseY < 786) && Player.CanChange() && ChatRoomPlayerIsAdmin()) {
		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Action: "Lock" });
		ChatAdminExit();
	}

	// If the user wants to Save changes a room
	if ((MouseX >= 200) && (MouseX < 500) && (MouseY >= 840) && (MouseY < 905) && ChatRoomPlayerIsAdmin()) {
		ChatAdminRoom()
	}

	// When the user cancels
	if ((MouseX >= 1600) && (MouseX < 1900) && (MouseY >= 840) && (MouseY < 905)) {
		ChatAdminExit();
	}

}
function ConvertListToArray(s){
	var arr = []
	if(s != ""){
		arr = s.split(',').map(Number).reduce((list,curr)=>{	//Convert to array with map and Remove all NaN or undefined elements with reduce
			if((curr === false) || Number.isNaN(curr) ){
			} else {list.push(curr);}
			return list;
		},[]) 
	}
	return arr
}

// When the user press "enter", we create the room
function ChatAdminKeyDown() {
	var regex = /^[0-9.,\b]/;
	if(event.target.id == "InputBanList" || event.target.id == "InputAdminList"){		//Prevent all except numbers and ',' on Lits
		if(KeyPress == 188 ){
			return;
		 }else{
			if (!regex.test(String.fromCharCode(KeyPress))) {
			   event.returnValue = false;                
			   if (event.preventDefault) event.preventDefault();
			}
		  } 
	}
	if (KeyPress == 13) ChatAdminRoom();
}

// When the user exit from this screen
function ChatAdminExit() {
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	CommonSetScreen("Online", "ChatRoom");
}

// When the server sends a response
function ChatAdminResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatAdminMessage = "Response" + data;
	if (data === "Updated") ChatAdminExit();
}

// Creates the chat room
function ChatAdminRoom() {
	var banlist = ConvertListToArray(ElementValue("InputBanList").trim());
	var adminlist = ConvertListToArray(ElementValue("InputAdminList").trim());
	var UpdatedRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatCreateBackgroundSelect,
		Limit: ElementValue("InputSize").trim(),
		Admin: adminlist,
		Ban: banlist
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room : UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}
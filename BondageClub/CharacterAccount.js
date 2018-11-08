var CharacterAccountAddress = "http://www.bondageprojects.com/accounts/manage.php";
var CharacterAccountURL = [];
var CharacterAccountReady = true;

// Puts the URL to call in a buffer
function CharacterAccountRequest(Command, Params) {
	if ((Character[0].AccountName != "") && (Character[0].AccountPassword != ""))
		CharacterAccountURL.push(CharacterAccountAddress + "?command=" + Command + "&account=" + Character[0].AccountName + "&password=" + Character[0].AccountPassword + Params.replace(/#/g, "|"));
}

// When the queue is ready to process, we launch a new http request
function CharacterAccountProcess() {
	if (CharacterAccountReady && (CharacterAccountURL.length > 0)) {
		CharacterAccountReady = false;
		var xmlhttp = new XMLHttpRequest();
		var URL = CharacterAccountURL[0];
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				CharacterAccountURL.splice(0, 1);
				CharacterAccountReady = true;
			}
		};
		//console.log(URL);
		xmlhttp.open("GET", URL, true);
		xmlhttp.send();		
	}	
}
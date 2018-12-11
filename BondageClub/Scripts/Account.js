var AccountAddress = "http://www.bondageprojects.com/accounts/manage.php";
var AccountURL = [];
var AccountReady = true;

// Puts the URL to call in a buffer
function AccountRequest(Command, Params) {
	if ((Player != null) && (Player.AccountName != "") && (Player.AccountPassword != ""))
		AccountURL.push(AccountAddress + "?command=" + Command + "&account=" + Player.AccountName + "&password=" + Player.AccountPassword + Params.replace(/#/g, "|"));
}

// When the queue is ready to process, we launch a new http request
function AccountProcess() {
	if (AccountReady && (AccountURL.length > 0)) {
		
		// Launches the http request and waits for the result to send another one
		AccountReady = false;
		var xmlhttp = new XMLHttpRequest();
		var URL = AccountURL[0];
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				AccountURL.splice(0, 1);
				AccountReady = true;
			}
		};
		//console.log(URL);
		xmlhttp.open("GET", URL, true);
		xmlhttp.send();
		
	}
}

// Returns TRUE if the account queue is empty and everything is done
function AccountQueueIsEmpty() {
	return (AccountURL.length <= 1);
}

// Sync the player data with the account server
function AccountSync() {
	AccountRequest("update_character", "&money=" + Player.Money.toString() + "&owner=" + Player.Owner + "&lover=" + Player.Lover);
}
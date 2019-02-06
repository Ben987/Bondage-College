var RunTimer = false;
var RunInterval = 20;
var CurrentTimer;
var CurrentTime = 0;
var LimitTimer = 0;
var LimitChapter = "";
var LimitScreen = "";

// Convert milliseconds to written time
function msToTime(s) {

  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  // Returns the formatted value
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  
}

// Runs the regular timer
function ProcessTimer() {
	
	// Ticks the timer every for the screen refresh and events
	clearInterval(CurrentTimer);
	CurrentTimer = setInterval("MainRun()", RunInterval);
	if (PlayerSkillShowLevelUp > 0) PlayerSkillShowLevelUp--;

	// If the timer must run
	if (RunTimer) {

		// Add the interval in milliseconds
		CurrentTime = CurrentTime + RunInterval;	
		
		// If the time limit is reached, we jump to a limit screen
		if (CurrentTime >= LimitTimer) {
			
			// Jump to the next chapter
			CurrentTime = LimitTimer;		
			SetScene(LimitChapter, LimitScreen);
			
		}
	
	}
		
}

// Starts the timer and sets the limits
function StartTimer(LTimer, LChapter, LScreen) {
	RunTimer = true;
	LimitTimer = LTimer;
	LimitChapter = LChapter;
	LimitScreen = LScreen;
	LeaveIcon = "Wait";
	TextPhase = 0;
}

// Stops the timer at a fixed time
function StopTimer(FixedTime) {
	RunTimer = false;
	CurrentTime = FixedTime;
	TextPhase = 0;
	LoadText();
}
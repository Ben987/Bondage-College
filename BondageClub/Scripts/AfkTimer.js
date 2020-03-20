"use strict"

var AfkTimerIncrementMs = 1000 * 60; // 1 minutes
var AfkTimerTimout = 5; // AfkTimerIncrementMs * 5  ==> 5 minutes
var AfkTimerIdle = 0;
var AfkTimerIsSet = false;
var AfkTimerIsEnabled = null;

var AfkTimerEventsList = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
var AfkTimerID = null;

function AfkTimerReset() {
    AfkTimerIdle = 0;
    if (AfkTimerIsSet) {
        AfkTimerIsSet = false;
        CharacterSetFacialExpression(Player, "Emoticon", null);
    }
}

function AfkTimerIncrement() {
    if (++AfkTimerIdle >= AfkTimerTimout) {
        AfkTimerSetIsAfk();
    }
}

function AfkTimerStart() {
    AfkTimerEventsList.forEach(e => document.addEventListener(e, AfkTimerReset, true));
    AfkTimerID = setInterval(AfkTimerIncrement, AfkTimerIncrementMs);
}

function AfkTimerStop() {
    AfkTimerEventsList.forEach(e => document.removeEventListener(e, AfkTimerReset, true));
    if (AfkTimerID != null) clearInterval(AfkTimerID);
    AfkTimerID = null;
}

function AfkTimerSetEnabled(Enabled) {
    if (typeof Enabled !== 'boolean') return;
    if (AfkTimerIsEnabled == Enabled) return;
    AfkTimerIsEnabled = Enabled;

    if (AfkTimerIsEnabled)
        AfkTimerStart();
    else
        AfkTimerStop();
}

function AfkTimerSetIsAfk() {
    if (CurrentScreen != "ChatRoom") return;
    CharacterSetFacialExpression(Player, "Emoticon", "Afk");
    AfkTimerIsSet = true;
}

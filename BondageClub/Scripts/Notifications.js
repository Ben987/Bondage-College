"use strict";
var Notifications = {};

/**
 * Increase the reported number of a notifications by one and updates the header
 * @param {string} Type - The type of notification
 * @returns {void}
 */
function NotificationsIncrement(Type) {
	Notifications[Type] = (Notifications[Type] || 0) + 1;
	NotificationsUpdate();
}

/**
 * Sets the number of notifications for a type back to zero and updates the header
 * @param {any} Type - The type of notification
 * @returns {void}
 */
function NotificationsReset(Type) {
	if (Notifications[Type] != null && Notifications[Type] != 0) {
		Notifications[Type] = 0;
		NotificationsUpdate();
	}
}

/**
 * Sets the number of notifications to zero
 * @returns {void}
 */
function NotificationsResetAll() {
	Notifications = {};
	NotificationsUpdate();
}

/**
 * Sets or clears notifications in the tab header
 * @returns {void} - Nothing
 */
function NotificationsUpdate() {
	let total = 0;
	for (let key in Notifications) total += Notifications[key];
	const prefix = total == 0 ? "" : "(" + total.toString() + ") ";
	document.title = prefix + "Bondage Club";
}

/**
 * Increase the number of unread messages in the notifications
 * @returns {void} - Nothing
 */
function NotificationsChatRoomIncrement() {
	if (!NotificationsChatRoomNewMessageVisible()) {
		ChatRoomUnreadMessages = true;
		NotificationsIncrement("Chat");
	}
}

/**
 * Remove the notifications if there are new messages that have been seen
 * @returns {void} - Nothing
 */
function NotificationsChatRoomReset() {
	// If there were new messages that are now read
	if (ChatRoomUnreadMessages && NotificationsChatRoomNewMessageVisible()) {
		ChatRoomUnreadMessages = false;
		NotificationsReset("Chat");
	}

	// If someone joined the room earlier
	NotificationsReset("ChatJoin");
}

/**
 * Returns whether the most recent chat message is on screen
 * @returns {boolean} - TRUE if the screen has focus and the chat log is scrolled to the bottom
 */
function NotificationsChatRoomNewMessageVisible() {
	if (!document.hasFocus()) return false;
	else return ElementIsScrolledToEnd("TextAreaChatLog");
}

/**
 * Raise a notification when particular people enter the room the player is in
 * @param {Character} C - The player that joined the room
 * @returns {void} - Nothing
 */
function NotificationsChatRoomJoin(C) {
	if (!document.hasFocus()) {
		const settings = Player.NotificationSettings.ChatJoin;
		if (settings.Enabled) {
			let notify = false;

			if (!settings.Owner && !settings.Lovers && !settings.FriendList) notify = true;
			else if (settings.Owner && C.IsOwner()) notify = true;
			else if (settings.Lovers && C.IsLoverOfPlayer()) notify = true;
			else if (settings.FriendList && Player.FriendList.contains(C.MemberNumber)) notify = true;

			if (notify) NotificationsIncrement("ChatJoin");
		}
	}
}

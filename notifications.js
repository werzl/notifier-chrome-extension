const notificationCallback = (notificationId) => {
    console.log(`callback triggered with notification id: ${notificationId}`);
    console.info(chrome.runtime.lastError);
};

function sendNotification(title, message) {
    var opt = {
        type: "basic",
        title: title,
        message: message,
        iconUrl: "icon.png",
    };

    var notificationId = Math.random();

    chrome.notifications.create(notificationId.toString(), opt, notificationCallback);
}

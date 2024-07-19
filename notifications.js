const icons = Object.freeze({
    inProgress: "assets/inProgress.png",
    success: "assets/success.png",
    failed: "assets/failed.png"
});

const notificationCallback = (notificationId) => {
    if (chrome.runtime.lastError) {
        console.error(`Notification with ID: ${notificationId} errored`);
        console.error(chrome.runtime.lastError);
    }
};

async function sendNotification(title, message, iconUrl) {
    var opt = {
        type: "basic",
        title: title,
        message: message,
        iconUrl: iconUrl,
    };

    var notificationId = Math.random();

    await chrome.notifications.create(
        notificationId.toString(),
        opt,
        notificationCallback
    );
}

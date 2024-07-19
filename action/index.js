// Register events
document
    .getElementById("retrieveWorkflowsButton")
    .addEventListener("click", () => sendPatTokenToExtension('')); // place PAT token here

async function sendPatTokenToExtension(patToken) {
    const response = await chrome.runtime.sendMessage({gitHubToken: patToken});
    console.log(response);
}

// TODO: listen for successful polling start success message
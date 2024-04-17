chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSelectedText") {
        console.log("getSelectedText")
        sendResponse({selectedText: window.getSelection().toString()});
    } else if (request.action === "checkLocalStorage") {
        console.log("checkLocalStorage")
        chrome.storage.local.get("selectedText", function (result) {
            if (result.selectedText) {
                console.log("Stored selectedText:", result.selectedText);
            } else {
                console.log("No selectedText found.");
            }
        });
    }
});

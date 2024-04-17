chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "askQuestion",
        title: "Ask a question",
        contexts: ["selection"]
    });


    chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === "askQuestion") {
                chrome.tabs.sendMessage(tab.id, {action: "getSelectedText"}, response => {
                    if (chrome.runtime.lastError || !response || !response.selectedText) {
                        console.error("Error retrieving selected text:", chrome.runtime.lastError);
                        return;
                    }
                    const selectedText = response.selectedText;
                    console.log("selectedText:", selectedText);
                    chrome.storage.local.set({selectedText: selectedText}, () => {
                        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {action: "checkLocalStorage"});
                        });
                        chrome.windows.create({
                            url: chrome.runtime.getURL("popup.html"),
                            type: "popup",
                            width: 500,
                            height: 500
                        });

                    });


                });
            }
        }
    );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendQuestion") {
        // Send the question and selected text to the server
        fetch("http:localhost:8000/api/prelo/ask/", {
            method: "POST",
            body: JSON.stringify({question: request.question, selectedText: request.selectedText}),
            headers: {"Content-Type": "application/json"}
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({answer: data.answer});
            });
        return true; // Required to use sendResponse asynchronously
    } else if (request.action === "requestReport") {
        // Send the request for a detailed report to the server
        fetch("http:localhost:8000/api/prelo/details/", {
            method: "POST",
            body: JSON.stringify({
                email: request.email,
                question: request.question,
                selectedText: request.selectedText
            }),
            headers: {"Content-Type": "application/json"}
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({success: data.success});
            });
        return true; // Required to use sendResponse asynchronously
    }
});
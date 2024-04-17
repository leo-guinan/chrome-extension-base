import React, {useEffect, useState} from 'react';

export default function Popup() {
    const [selectedText, setSelectedText] = useState('')
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    // get the selected text from local storage
    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.get("selectedText", function (result) {
                if (result.selectedText) {
                    setSelectedText(result.selectedText);
                }
            });
        } else {
            // Fallback if not in Chrome extension context, e.g., during development
            setSelectedText(localStorage.getItem("selectedText") ?? "");
        }
    }, []);

    const handleSendQuestion = async () => {
        console.log("Sending question...")
        console.log(question)
        console.log(selectedText)
        // send question to the backend
        fetch('http://localhost:8000/api/prelo/ask/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                text: selectedText
            })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setAnswer(data.message)
            })
            .catch((error) => {
                console.error('Error:', error);

        })

        // get the answer
        // display the answer
    }


    return (
        <div>
            <textarea id="questionInput" placeholder="Ask a question about the selected text"
                      onChange={(e) => setQuestion(e.target.value)} value={question}></textarea>
            <button id="sendQuestion" onClick={handleSendQuestion}>Send Question</button>
            <div id="answer">
                {answer}
            </div>
            <input type="email" id="emailInput" placeholder="Enter your email"/>
            <button id="requestReport">Request Detailed Report</button>
        </div>
    );
}
document.getElementById("downloadBtn").addEventListener("click", async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    console.error("No active tab found.");
    return;
  }

  // Execute the script in the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});


chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updatePopup") {
    document.getElementById("total").innerText = `(${message.total})`;
  }
});

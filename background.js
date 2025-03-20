chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename
    }, downloadId => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError);
      } else {
        console.log("Download started:", downloadId);
      }
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: countImages, // Calls this function in the content script
  });
});

function countImages() {
  document.querySelector("picture")?.click();
  setTimeout(() => {
    const dialogElement = document.querySelector('div[role="dialog"].NDTw5b');
    const images = dialogElement?.querySelectorAll("img.uXN1L5.lazyload.raRnQV");
    const total = images ? images.length : 0;
    console.log("Total images:", total);

    chrome.runtime.sendMessage({ action: "updateTotal", total });
  }, 1000);
}

// Listen for messages from content script and forward to popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTotal") {
    chrome.runtime.sendMessage({ action: "updatePopup", total: message.total });
  }
});
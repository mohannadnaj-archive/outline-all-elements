chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || !tab.url.startsWith("http")) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (error) {
    console.error("Failed to execute content script:", error);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-outlines") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.startsWith("http")) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"],
          });
        } catch (error) {
          console.error("Failed to execute content script:", error);
        }
      }
    });
  }
});

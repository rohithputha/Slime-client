chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "getSelectedText", // Corrected ID to match the listener check
      title: "Add to Notion",
      contexts: ["all"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getSelectedText" && tab.id) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getSelectedText
      });
    }
  });
  
  function getSelectedText() {
    // This function will be serialized and executed in the context of the webpage
    // const selection = window.getSelection().toString();
    // if (!selection && document.querySelector('embed[type="application/pdf"]')) {
    //     // Specific handling for PDFs
    //     const pdfViewer = document.querySelector('embed[type="application/pdf"]').contentDocument || document.querySelector('embed[type="application/pdf"]').getSVGDocument();
    //     if (pdfViewer) {
    //         const pdfSelection = pdfViewer.getSelection ? pdfViewer.getSelection().toString() : '';
    //         if (pdfSelection) {
    //             chrome.runtime.sendMessage({ "action": "text_selected", selectedText: pdfSelection });
    //         }
    //     }
    // } else {
        chrome.runtime.sendMessage({ "action": "text_selected", selectedText: selection });
    // }
  }
  
  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   console.log("Selected text:", message.selectedText);
  // });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.action === "open_new_tab") {
      chrome.tabs.create({ url: message.url }, function(tab) {
        const tabId = tab.id;
        chrome.tabs.onRemoved.addListener(function closeTabListener(id, removeInfo) {
          if (id === tabId) {
            chrome.storage.local.set({"auth_tab_closed": true});
            // sendResponse({ message: "Tab closed" });
          }
        });
      });
    }
    else if (message.action === "page_selected") {
      chrome.storage.local.set({"selectedPageId": message.page});
    }
    else if (message.action === "text_selected") {
      chrome.storage.local.get("selectedPageId", (data) => {
        const pageId = data.selectedPageId;
        console.log(pageId)
        if (pageId) {

          fetch(`http://localhost:8080`+`/api/notion/note`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "Note": message.selectedText, "PageId": pageId })
          });
        }
      });
    }
  });
  



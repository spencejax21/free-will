let redirect_url = "hello";
let portFromCS;
let currentTab = -1;

chrome.storage.sync.set(
    { recent: "123456789asdfghjwertyucvbnm" },
    function () {}
);
function connected(p) {
    portFromCS = p;
    portFromCS.onMessage.addListener(function (m) {
        //console.log(m.redirect_url);
        redirect_url = m.redirect_url;
        //currentTab = m.current;
    });
}

chrome.tabs.onRemoved.addListener(function (tabId) {
    if (currentTab === tabId) {
        //console.log("tab removed");
        //console.log(tabId);
        chrome.storage.sync.set({ recent: "none" }, function () {});
    }
});

//chrome.tabs.onSelectionChanged.addListener(function () {});

chrome.runtime.onConnect.addListener(connected);

chrome.runtime.onMessage.addListener(function (request, sender) {
    //console.log(request);
    if (request === "tabid") {
        currentTab = sender.tab.id;
    } else {
        chrome.runtime.sendMessage(redirect_url);
    }
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    console.log(tabId);
    console.log(currentTab);
    if (tabId === currentTab) {
        console.log("here");
        window.location.replace(chrome.extension.getURL("blocked.html"));
    }
});

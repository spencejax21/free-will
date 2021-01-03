let url = document.URL;
//console.log(url);
let blacklist;

//grab users blacklist of websites
chrome.storage.sync.get(["blacklist", "recent"], function (result) {
    //console.log("Current blacklist is: " + Object.values(result));
    //console.log(Object.values(result)[0]);
    //console.log(Object.values(result)[1]);
    blacklist = result.blacklist;
    console.log(result.blacklist);
    recent = result.recent;
    console.log(result.recent);

    if (blacklist !== undefined && isBlacklisted(blacklist) && url !== recent) {
        //alert("this page is blocked");
        // chrome.storage.sync.set({ recent: url }, function () {
        let myPort = chrome.runtime.connect({ name: "block-port" });
        myPort.postMessage({ redirect_url: url });
        window.location.replace(chrome.extension.getURL("blocked.html"));
        // });
    } else if (url === recent) {
        chrome.storage.sync.set({ recent: "" }, function () {});
    }
});

function isBlacklisted(blacklist) {
    let site;

    for (site of blacklist) {
        if (url.indexOf(site) !== -1) {
            return true;
        }
    }
    return false;
}

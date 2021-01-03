let json;
let redirect_url;
let clickedOut = false;
let user_timer;

chrome.runtime.sendMessage("tabid");
async function getQuote() {
    try {
        let response = await fetch("https://api.quotable.io/random");
        json = await response.json();
    } catch (error) {
        getQuote();
    }

    document.getElementById("quote").innerHTML =
        '"' + json["content"] + '"' + "<br />" + json["author"];
}
function redirect() {
    window.location.replace(redirect_url);
}
function startTimer(timer) {
    let stop_id = setInterval(function () {
        if (timer <= 0) {
            clearInterval(stop_id);
            chrome.storage.sync.set({ recent: redirect_url }, function () {
                redirect();
            });
        } else if (clickedOut) {
            clearInterval(stop_id);
            document.getElementById("countdown").className =
                "countdown-stopped";
        }
        document.getElementById("countdown").innerHTML = timer.toString();
        timer--;
    }, 1000);
}
getQuote();

chrome.runtime.sendMessage("hello");
chrome.runtime.onMessage.addListener(function (request) {
    console.log(request);
    redirect_url = request;
    document.getElementById("link").innerHTML = redirect_url;
    //document.getElementById("link").href = redirect_url;
    chrome.storage.sync.get("timer", function (result) {
        let timer = parseInt(result.timer);
        console.log(timer);
        document.getElementById("countdown").innerHTML = timer.toString();
        timer--;
        startTimer(timer);
    });
});
chrome.tabs.onSelectionChanged.addListener(function () {
    clickedOut = true;
    chrome.storage.sync.set({ recent: "none" }, function () {});
});

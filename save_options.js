document.getElementById("save").addEventListener("click", saveOptions);

getOptions();

//saves user preferences and adds websites blacklist to chrome storage
function saveOptions() {
    let websitesListString = document.getElementById("websites").value.trim();
    let websitesListArray = websitesListString.split("\n");
    let timer = document.getElementById("delay-time").value;
    if (!timer) {
        timer = 30;
        document.getElementById("delay-time").value = 30;
    }
    chrome.storage.sync.set(
        { blacklist: websitesListArray, timer: timer },
        function () {
            //console.log("Blacklist is set to: " + websitesListArray);
            //console.log("Timer is set to: " + timer);
            alert("Your changes have been saved!");
            console.log(websitesListArray);
            console.log(timer);
        }
    );
}

function getOptions() {
    chrome.storage.sync.get(["blacklist", "timer"], function (result) {
        blacklist = Object.values(result)[0];
        console.log(blacklist);
        timer = result.timer;
        if (!timer) {
            timer = 30;
        }
        if (!blacklist) {
            blacklist = ["example.com", "example2.com"];
        }
        let savedOptions = "";
        for (website of blacklist) {
            if (website !== blacklist[0]) {
                savedOptions += "\n" + website;
            } else {
                savedOptions += website;
            }
        }
        document.getElementById("websites").innerHTML = savedOptions;
        //console.log(timer);
        document.getElementById("delay-time").value = timer;
    });
}

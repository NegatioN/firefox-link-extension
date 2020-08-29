function setPageInfo() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let pageurl = document.getElementById('pageurl');
        let serverurl = document.getElementById('serverurl');
        pageurl.value = tabs[0].url;
        browser.storage.local.get('host').then(item => {
            serverurl.value = item.host || 'localhost:8080';
        })
    })
}

document.addEventListener("DOMContentLoaded", setPageInfo);

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("send").addEventListener("click", (e) => {
    let serverurl = document.getElementById('serverurl');
    let pageurl = document.getElementById('pageurl');

    let url = encodeURI(`${serverurl.value}${pageurl.value}`);
    fetch(url).then(response => response.json())
        .then(data => {
            pageurl.value = "Success";
        })
        .catch(err => {
            pageurl.value = "Fail";
        })
        .then(r => {
            sleep(1500).then(rr => window.close());
        });
});

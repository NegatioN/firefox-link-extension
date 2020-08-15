function setPageInfo() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let pageurl = document.getElementById('pageurl');
        let serverurl = document.getElementById('serverurl');
        pageurl.value = tabs[0].url;
        browser.storage.local.get('server').then(item => {
            serverurl.value = item.server.value;
        })
    })
}

document.addEventListener("DOMContentLoaded", setPageInfo);

document.getElementById('serverurl').addEventListener('change', function (evt) {
    let server = {name: 'server', value: this.value}
    browser.storage.local.set({server}).then(res => console.log("Updated server value"))
});

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

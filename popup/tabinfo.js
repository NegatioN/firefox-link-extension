function setPageInfo() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let pageurl = document.getElementById('pageurl');
        let serverurl = document.getElementById('serverurl');
        pageurl.value = tabs[0].url;
        browser.storage.local.get('host').then(item => {
            serverurl.value = item.host || 'http://localhost:8080';
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

    let url = encodeURI(serverurl.value);
    let sendData = {value: pageurl.value}


    fetch(url, {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sendData)})
        .then(resp => {
            if (resp.status === 200){
                pageurl.value = "Success";
            } else {
                pageurl.value = "Fail";
            }
        })
        .then(r => {
            sleep(1500).then(rr => window.close());
        });
});

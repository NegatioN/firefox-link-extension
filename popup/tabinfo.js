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

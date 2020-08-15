function setPageInfo() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tabsList = document.getElementById('pageurl');
        tabsList.value = tabs[0].url;
    })
}

document.addEventListener("DOMContentLoaded", setPageInfo);

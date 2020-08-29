storageInstance = browser.storage.local; // can be browser.storage.sync for online?

function saveOptions(e) {
    e.preventDefault();
    storageInstance.set({
        host: document.querySelector("#host").value
    });
}


function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#host").value = result.host || "localhost:8080";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = storageInstance.get("host");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
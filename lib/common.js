chrome.contextMenus.create({
    id: "cookie-clear-immediately",
    title: "Clear Now",
    contexts: ['browser_action']
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log('Listened');
    switch (info.menuItemId) {
        case "cookie-clear-immediately":
            clearAllBrowserData();
            break;
        default:
            console.log('Default');
    }
});


function clearAllBrowserData() {
    console.log('Start clear all browser data.')
    var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
    chrome.browsingData.remove({
        "since": oneWeekAgo
    }, {
        "cache": true,
        "cookies": true,
        "downloads": true,
        "history": true,
        "indexedDB": true,
        "localStorage": true
    });
}


chrome.runtime.onMessage.addListener(request => {
    if (request.method === 'request-update') {
        const extensionId = chrome.runtime.getManifest().getExtensionId();
        let time = chrome.storage.local.get(extensionId + '_last_execution');
        if (time === 'undefine')
        {
            time = (new Date()).getTime();
        }
        let clear_browser_data_dd, clear_browser_data_hh, clear_browser_data_mm, clear_browser_data_ss;
        if (time) {
            const period = storage[id].vperiod || toSecond(storage[id]);
            let diff = period - ((new Date()).getTime() - time);
            clear_browser_data_dd = Math.floor(diff / (1000 * 60 * 60) / 24);
            diff -= clear_browser_data_dd * 24 * 60 * 60 * 1000;
            clear_browser_data_hh = Math.floor(diff / (1000 * 60 * 60));
            diff -= clear_browser_data_hh * 60 * 60 * 1000;
            clear_browser_data_mm = Math.floor(diff / (60 * 1000));
            clear_browser_data_ss = Math.floor(diff % (60 * 1000) / 1000);
            toPopup();
        }
    }
});


function toPopup() {
    const obj = storage[id];
    chrome.runtime.sendMessage({
        method: 'updated-info',
        data: {
            status: obj.status,
            current: obj.current,
            cache: obj.cache,
            form: obj.form,
            reload_dd: obj.reload_dd,
            reload_hh: obj.reload_hh,
            reload_mm: obj.reload_mm,
            reload_ss: obj.reload_ss,
            variation: obj.variation,
            msg: obj.msg,
            jobs: obj.jobs
        }
    });
}
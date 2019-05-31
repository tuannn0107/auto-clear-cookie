var prefs = {
    'clear_browser_data_dd': 0,
    'clear_browser_data_hh': 0,
    'clear_browser_data_mm': 10,
    'clear_browser_data_ss': 0,
};


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
    chrome.storage.local.get(extensionId + '_last_execution', (new Date()).getTime());
    var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 365;
    var oneYearAgo = (new Date()).getTime() - millisecondsPerWeek;
    chrome.browsingData.remove({}, {
        cache: true,
        cookies: true,
        downloads: true,
        history: true,
        indexedDB: true,
        localStorage: true
    });
}


chrome.runtime.onMessage.addListener(request => {
    if (request.method === 'request-update') {
        const extensionId = chrome.runtime.id;
        let time = chrome.storage.local.get(extensionId + '_last_execution');
        if (time === undefined)
        {
            time = (new Date()).getTime();
        }
        let clear_browser_data_dd, clear_browser_data_hh, clear_browser_data_mm, clear_browser_data_ss;
        if (time) {
            let diff =  ((new Date()).getTime() - time);
            clear_browser_data_dd = Math.floor(diff / (1000 * 60 * 60) / 24);
            diff -= clear_browser_data_dd * 24 * 60 * 60 * 1000;
            clear_browser_data_hh = Math.floor(diff / (1000 * 60 * 60));
            diff -= clear_browser_data_hh * 60 * 60 * 1000;
            clear_browser_data_mm = Math.floor(diff / (60 * 1000));
            clear_browser_data_ss = Math.floor(diff % (60 * 1000) / 1000);
            toPopup({clear_browser_data_dd, clear_browser_data_hh, clear_browser_data_mm, clear_browser_data_ss});
        }
    }
});

var toSecond = obj => Math.max(
    obj.forced ? 1000 : 10000, // allow reloading up to a second!
    obj.reload_dd * 1000 * 60 * 60 * 24 + obj.reload_hh * 1000 * 60 * 60 + obj.reload_mm * 1000 * 60 + obj.reload_ss * 1000
  );


function toPopup(extensionId) {
    const obj = storage[extensionId + '_last_execution'];
    console.log(obj);
    chrome.runtime.sendMessage({
        method: 'updated-info',
        data: {
            reload_dd: obj.clear_browser_data_dd,
            reload_hh: obj.clear_browser_data_hh,
            reload_mm: obj.clear_browser_data_mm,
            reload_ss: obj.clear_browser_data_ss
        }
    });
}


// Init
chrome.storage.local.get(prefs, ps => {
    window.clearTimeout(chrome.runtime.id);
    console.log(ps);
    const intervalTime = ps.clear_browser_data_dd * (24 * 60 * 60 * 1000) + ps.clear_browser_data_hh * (60 * 60 * 1000) + ps.clear_browser_data_mm * (60 * 1000) + ps.clear_browser_data_ss * (60 * 1000);
    // window.setTimeout(clearAllBrowserData(), intervalTime);
});



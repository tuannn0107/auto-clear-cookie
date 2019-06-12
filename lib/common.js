var prefs = {
    'clear_browser_data_dd': 0,
    'clear_browser_data_hh': 0,
    'clear_browser_data_mm': 20,
    'clear_browser_data_ss': 0,
};


chrome.contextMenus.create({
    id: "cookie-clear-immediately",
    title: "Clear Now",
    contexts: ['browser_action']
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "cookie-clear-immediately":
            clearAllBrowserData();
            break;
        default:
            console.log('Default');
    }
});


function clearAllBrowserData() {
    console.log('Start clear all browser data.' + (new Date()));
    chrome.storage.local.set({"auto-clear-cookie@example.com_last_execution" : (new Date()).getTime()});
     chrome.browsingData.remove({}, {
         'cookies' : true,
         'history' : true,
         'cache' : true,
         'formData' : true,
         'downloads' : true,
         'serviceWorkers' : true
     });
}


chrome.runtime.onMessage.addListener(request => {
    if (request.method === 'request-update') {
        chrome.storage.local.get(lastExcutionKey, ls => {
            let lastExcution = ls[lastExcutionKey];
            chrome.storage.local.get(prefs, ps => {
                let interval = calIntervalTime(ps);
                let clear_browser_data_dd, clear_browser_data_hh, clear_browser_data_mm, clear_browser_data_ss;
                let diff =  ((lastExcution + interval) - (new Date()).getTime());
                clear_browser_data_dd = Math.floor(diff / (1000 * 60 * 60) / 24);
                diff -= clear_browser_data_dd * 24 * 60 * 60 * 1000;
                clear_browser_data_hh = Math.floor(diff / (1000 * 60 * 60));
                diff -= clear_browser_data_hh * 60 * 60 * 1000;
                clear_browser_data_mm = Math.floor(diff / (60 * 1000));
                clear_browser_data_ss = Math.floor(diff % (60 * 1000) / 1000);
                toPopup({clear_browser_data_dd, clear_browser_data_hh, clear_browser_data_mm, clear_browser_data_ss});
            });
        });       
    }
});

var toSecond = obj => Math.max(
    obj.clear_browser_data_dd * 1000 * 60 * 60 * 24 + obj.clear_browser_data_hh * 1000 * 60 * 60 + obj.clear_browser_data_mm * 1000 * 60 + obj.clear_browser_data_ss * 1000
  );


function toPopup(obj) {
    chrome.runtime.sendMessage({
        method: 'updated-info',
        data: {
            clear_browser_data_dd: obj.clear_browser_data_dd,
            clear_browser_data_hh: obj.clear_browser_data_hh,
            clear_browser_data_mm: obj.clear_browser_data_mm,
            clear_browser_data_ss: obj.clear_browser_data_ss
        }
    }); 
}


function calIntervalTime(ps) {
    return ps.clear_browser_data_dd * (24 * 60 * 60 * 1000) + ps.clear_browser_data_hh * (60 * 60 * 1000) + ps.clear_browser_data_mm * (60 * 1000) + ps.clear_browser_data_ss * (60 * 1000);
}


// Init
const lastExcutionKey = 'auto-clear-cookie@example.com_last_execution';
let intervalId = undefined;

chrome.storage.local.get(prefs, ps => {
    const intervalTime = calIntervalTime(ps);
    chrome.storage.local.set({"auto-clear-cookie@example.com_last_execution" : (((new Date()).getTime()) - ((new Date()).getTime())%(ps.clear_browser_data_mm * 60 * 1000))});
    while (((new Date()).getTime())%(ps.clear_browser_data_mm * 60 * 1000) > (1 * 60 * 1000))
    {
        //NOP
    }
    intervalId = window.setInterval(clearAllBrowserData, intervalTime);
});
'use strict';

var config = {
    'clear_browser_data_dd': 0,
    'clear_browser_data_hh': 0,
    'clear_browser_data_mm': 15,
    'clear_browser_data_ss': 0,
};


var restore = () => chrome.storage.local.get(config, prefs => {
    document.getElementById('clear_browser_data_dd').value = prefs.clear_browser_data_dd;
    document.getElementById('clear_browser_data_hh').value = prefs.clear_browser_data_hh;
    document.getElementById('clear_browser_data_mm').value = prefs.clear_browser_data_mm;
    document.getElementById('clear_browser_data_ss').value = prefs.clear_browser_data_ss;
});
restore();


document.getElementById('save').addEventListener('click', () => {
    try {
        chrome.storage.local.set({
            clear_browser_data_dd: Math.max(Number(document.getElementById('clear_browser_data_dd').value), 0),
            clear_browser_data_hh: Math.min(Math.max(Number(document.getElementById('clear_browser_data_hh').value), 0), 23),
            clear_browser_data_mm: Math.min(Math.max(Number(document.getElementById('clear_browser_data_mm').value), 0), 59),
            clear_browser_data_ss: Math.min(Math.max(Number(document.getElementById('clear_browser_data_ss').value), 0), 59)
        }, () => {
            restore();

            /*chrome.browserAction.setBadgeText({
                text: ''
            });*/
        });
    }
    catch (e) {
        console.log(e.message);
    }
});

document.getElementById('reset').addEventListener('click', () => chrome.storage.local.set(config, restore));


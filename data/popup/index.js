// init
chrome.runtime.sendMessage({
    method: 'request-update'
});
check();

function check() {
    window.clearInterval();
    id = window.setInterval(() => chrome.runtime.sendMessage({
        method: 'request-update'
    }), 1000);
}


chrome.runtime.onMessage.addListener(request => {
    const twoDigit = num => ('00' + num).substr(-2);
    if (request.method === 'updated-info') {
        const obj = request.data;
        msg = `${twoDigit(obj.clear_browser_data_dd)} : ${twoDigit(obj.clear_browser_data_hh)} : ${twoDigit(obj.clear_browser_data_mm)} : ${twoDigit(obj.clear_browser_data_ss)}`;
        document.getElementById('message').textContent = msg;
    }
});


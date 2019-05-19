document.getElementById('message').textContent = '52346521'

// init
chrome.runtime.sendMessage({
    method: 'request-update'
});
check();

function check() {
    window.clearInterval(id);
    id = window.setInterval(() => chrome.runtime.sendMessage({
        method: 'request-update'
    }), 1000);
}


chrome.runtime.onMessage.addListener(request => {
    const twoDigit = num => ('00' + num).substr(-2);
    if (request.method === 'updated-info') {
        const obj = request.data;
        const {dd = 0, hh = 0, mm = 5, ss = 0} = obj.msg
        dom.msg = `${twoDigit(dd)} : ${twoDigit(hh)} : ${twoDigit(mm)} : ${twoDigit(ss)}`;
    }
});
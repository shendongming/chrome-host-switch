console.log('run')


chrome.webRequest.onCompleted.addListener(function(details) {
    //data[details.tabId] = details.ip;
    console.log('details:',details,arguments)
}, {
    urls: [ 'http://*/*', 'https://*/*' ],
    types: [ 'main_frame' ]
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    //data[details.tabId] = details.ip;
    console.log('details:',details,arguments)
}, {
    urls: [ 'http://*/*', 'https://*/*' ],
    types: [ 'main_frame' ]
}, ["blocking"]);

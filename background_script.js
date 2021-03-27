let dramaSpyList = {};

// Uses cache to prevent re-fetching
async function notify(message) {
    if(dramaSpyList.length > 0) {
        return dramaSpyList;
    } else {
        const response = await fetch('https://sponge-imminent-text.glitch.me/dramaspy/list');
        const parseResponse = await response.json();
        dramaSpyList = parseResponse.data;
        return parseResponse.data;
    }
}

browser.runtime.onMessage.addListener(notify);
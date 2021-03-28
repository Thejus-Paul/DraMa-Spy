let dramaList = [{name:"Scripting Your Destiny",lastWatched:10 }];

updateList = (list) => (typeof(list.data) === Object) ? list.data : dramaList;

function notify(data) {
    if(JSON.parse(data).command == "update") {
        dramaList = JSON.parse(data).dramaList;
        console.log(dramaList);
        fetch("https://sponge-imminent-text.glitch.me/dramaspy/list", {
            method: 'post',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(dramaList)
        }).then(console.log("Updated Sent!"));
    }
    else if(JSON.parse(data).command == "fetch") {
        return fetch('https://sponge-imminent-text.glitch.me/dramaspy/list')
        .then(response => response.json())
        .then(response => updateList(response));
    }
}

browser.runtime.onMessage.addListener(notify);
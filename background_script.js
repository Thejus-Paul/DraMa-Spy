const updateList = (list) => list.data;

function notify(data) {
	if(JSON.parse(data).command == "update") {
		let dramaList = JSON.parse(data).dramaList;
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
	else if(JSON.parse(data).command == "fetch_dramas") {
		return fetch('https://sponge-imminent-text.glitch.me/dramaspy/drama')
		.then(response => response.json())
		.then(response => response.dramas);
	}
	else if(JSON.parse(data).command == "update_drama") {
		let dramaList = JSON.parse(data).drama;
		fetch("https://sponge-imminent-text.glitch.me/dramaspy/drama", {
			method: 'post',
			mode: 'cors',
			headers: {
					"Content-type": "application/json; charset=UTF-8"
			},
			body: JSON.stringify(dramaList)
		}).then(console.log("Updated Sent!"));
	}
}

browser.runtime.onMessage.addListener(notify);
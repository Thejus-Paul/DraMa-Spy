(function() {
	// To prevent re-injecting of the `content_script` 
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	// To fetch the current drama list
	browser.runtime.sendMessage(JSON.stringify({"command":"fetch"}))
		.then(response => loadDraMaSpy(response))
		.then(list => {
			typeof(list) !== undefined ? 
			browser.runtime.sendMessage(JSON.stringify({"command":"update","dramaList":list})) : 
			console.log(list)
		});

	function loadDraMaSpy(dramaList) {
		var URL = window.location.pathname;
		var URLValues = URL.split('/');
		var drama = URLValues[2].replaceAll('-',' ');

		// On the movie watching page
		if(URL.match(/full|movie/i))
			console.log("Movie: "+drama);

		// On a drama's episode page
		if(Boolean(URL.match(/Episode/i))) {
			let currentEpisode = parseInt(URLValues[3].split('?')[0].split('-')[1]);
			let didFind = Boolean(dramaList.find(item => item.name == drama));
			if(didFind) {
				dramaList.find(item => item.name == drama).lastWatched = currentEpisode;
			} else {
				dramaList.push({name:drama, lastWatched:currentEpisode});
			}	
			return dramaList;
		}

		// On the drama or movie description page
		let contentType = document.getElementsByClassName("dotUnder");
		if((window.location.hostname === "kissasian.sh") && (contentType.length > 0)) {
			let genre = [...contentType];
			let isMovie = Boolean(genre.find(item => item.text === "Movie"));
			let message = isMovie ? ("Movie: " + drama) : ("Drama: " + drama);
			console.log(message);
		}
	}
})();

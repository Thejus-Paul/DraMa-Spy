(function() {
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	browser.runtime.sendMessage("fetch")
		.then(response => loadDraMaSpy(response));

	function loadDraMaSpy(data) {
		let dramaSpyList = data;
		console.log(dramaSpyList);
		var URL = window.location.pathname;
		var URLValues = URL.split('/');
		var drama = URLValues[2].replaceAll('-',' ');

		// On one of the episode or movie watching page
		// On the movie watching page
		if(URL.match(/full|movie/i))
			console.log("Movie: "+drama);

		// On a drama's episode page
		else if(URL.match(/Episode/i)) {
			let currentEpisode = parseInt(URLValues[3].split('?')[0].split('-')[1]);
			console.log("Currently Watching,","'"+drama+"'","episode",currentEpisode);
		}

		// On the drama or movie description page
		let contentType = document.getElementsByClassName("dotUnder");
		if((window.location.hostname === "kissasian.sh") && (contentType.length > 0)) {
			let genre = [...contentType];
			let isMovie = Boolean(genre.find(item => item.text === "Movie"));
			let message = isMovie ? ("Movie: "+drama) : ("Drama: "+drama);
			console.log(message);
		}
	}
})();

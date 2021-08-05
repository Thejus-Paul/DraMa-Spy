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
			if(typeof(list) == "object") {
				console.log(list);
				browser.runtime.sendMessage(JSON.stringify({"command":"update","dramaList":list}));
			} else {
				console.log(typeof(list),JSON.stringify(list))
			}
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
				return dramaList;
			} else {
				dramaList.push({name:drama, lastWatched:currentEpisode});
				return dramaList;
			}	
			return dramaList;
		}

		// On the drama or movie description page
		let contentType = document.getElementsByClassName("dotUnder");
		if((window.location.hostname === "kissasian.li") && (contentType.length > 0)) {
			let genre = [...contentType];
			let isMovie = Boolean(genre.find(item => item.text === "Movie"));
			let message = isMovie ? ("Movie: " + drama) : ("Drama: " + drama);
			let didFind = Boolean(dramaList.find(item => item.name == drama));
			if(didFind) {
				let currentDrama = dramaList.find(item => item.name == drama)
				console.log("You've watched this drama till episode",currentDrama.lastWatched);
				let totalEpisodes = document.getElementsByClassName('episodeSub').length;
				let indexOfLastWatchedEpisode = totalEpisodes - currentDrama.lastWatched;
				document.getElementsByClassName('episodeSub')[indexOfLastWatchedEpisode].children.item(0).text += " 👀";
				for(let i = (totalEpisodes - currentDrama.lastWatched); i <= totalEpisodes; i++) {
					document.getElementsByClassName('episodeSub')[i].children.item(0).style.color = "lightgreen";
				}
			}
		}
	}
})();

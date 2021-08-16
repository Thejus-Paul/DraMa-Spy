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
			}
		});
	// To fetch the current drama info
	browser.runtime.sendMessage(JSON.stringify({"command":"fetch_dramas"}))
	.then(response => getDramaSummary(response));

	// To convert image to Base64 
	const getDataURL = (img) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL('image/jpeg');
	}
	// To get drama details
	const getDramaSummary = (dramas) => {
		const summaryElements = document.querySelector(".bigChar").parentNode.children
		const getData = (item) => summaryElements.item(item).innerText.split(":")[1];
		let drama = {}
		drama.name = summaryElements.item(0).innerText
		drama.otherNames = getData(1).split(";").map(name => name.trim())
		drama.country = getData(2).trim()
		drama.genre = getData(3).split(",").map(genre => genre.trim())
		drama.aired = getData(4).trim()
		const [status,views] = summaryElements.item(5).innerText.split(" ").filter(item => item.split(":")[1])
		drama.status = status.split(":")[1].trim()
		drama.views = views.split(":")[1].trim()
		drama.summary = summaryElements.item(7).innerText
		drama.image = getDataURL(document.querySelectorAll(".barContent img")[2])
		drama.latestEpisode = Number(document.querySelector(".episodeSub").innerText.split(" ").pop())	
		Object.freeze(drama);
		dramas[drama.name] = drama;
		browser.runtime.sendMessage(JSON.stringify({"command":"update_drama","drama":dramas}));
	}

	function loadDraMaSpy(dramaList) {
		// On a drama's episode page
		if(window.location.hostname === "kissorg.net" && window.location.pathname.startsWith("/p/")) {
			const tmp = document.querySelector("#navsubbar").children[0].innerText;
			const drama = tmp.split(" ").slice(1,-1).join(" ");
			const episodeSelector = document.getElementById("selectEpisode");
			const currentEpisode = episodeSelector[episodeSelector.selectedIndex].value;
			currentEpisode = Number(currentEpisode.split("?")[0].split("-")[1]);
			const didFind = Boolean(dramaList.find(item => item.name == drama));
			if(didFind) {
				dramaList.find(item => item.name == drama).lastWatched = currentEpisode;
				return dramaList;
			} else {
				dramaList.push({name:drama, lastWatched:currentEpisode});
				return dramaList;
			}
		}

		// On the drama or movie description page
		if(window.location.pathname.startsWith("/Drama/")) {
			const drama = window.location.pathname.split("/")[2].split("-").join(" ")
			const contentType = document.getElementsByClassName("dotUnder");
			if((window.location.hostname === "kissasian.li") && (contentType.length > 0)) {
				const genre = [...contentType];
				const isMovie = Boolean(genre.find(item => item.text === "Movie"));
				const message = isMovie ? ("Movie: " + drama) : ("Drama: " + drama);
				const didFind = Boolean(dramaList.find(item => item.name == drama));
				if(didFind) {
					const currentDrama = dramaList.find(item => item.name == drama)
					console.log("You've watched this drama till episode",currentDrama.lastWatched);
					const totalEpisodes = document.getElementsByClassName('episodeSub').length;
					const indexOfLastWatchedEpisode = totalEpisodes - currentDrama.lastWatched;
					document.getElementsByClassName('episodeSub')[indexOfLastWatchedEpisode].children.item(0).text += " 👀";
					for(let i = (totalEpisodes - currentDrama.lastWatched); i <= totalEpisodes; i++) {
						document.getElementsByClassName('episodeSub')[i].children.item(0).style.color = "lightgreen";
					}
				}
			}	
		}
	}
})();

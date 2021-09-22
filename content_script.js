/* eslint-disable no-undef */
// eslint-disable-next-line func-names
(function () {
  // To prevent re-injecting of the `content_script`

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // To convert image to Base64
  const getDataURL = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  // To get drama details
  const getDramaSummary = () => {
    const SHA512 = new Hashes.SHA512();
    const summaryElements = document.querySelector('.bigChar').parentNode.children;
    const getData = (item) => summaryElements.item(item).innerText.split(':')[1];
    const drama = {};
    drama.name = summaryElements.item(0).innerText;
    drama.otherNames = getData(1)
      .split(';')
      .map((name) => name.trim());
    drama.country = getData(2).trim();
    drama.genre = getData(3)
      .split(',')
      .map((genre) => genre.trim());
    drama.aired = getData(4).trim();
    const [status] = summaryElements
      .item(5)
      .innerText.split(' ')
      .filter((item) => item.split(':')[1]);
    drama.status = status.split(':')[1].trim();
    // drama.views = views.split(":")[1].trim()
    drama.summary = summaryElements.item(7).innerText;
    drama.image = getDataURL(document.querySelectorAll('.barContent img')[2]);
    drama.latestEpisode = Number(document.querySelector('.episodeSub').innerText.split(' ').pop());
    drama.hash = SHA512.hex(JSON.stringify(drama));
    Object.freeze(drama);
    browser.runtime.sendMessage(JSON.stringify({ command: 'update_drama', drama }));
  };

  function loadDraMaSpy(dramaList) {
    // On a drama's episode page
    if (window.location.hostname === 'kissorg.net' && window.location.pathname.startsWith('/p/')) {
      let drama = document.querySelector('#navsubbar').children[0].innerText;
      drama = drama.split(' ').slice(1, -1).join(' ');
      const episodeSelector = document.getElementById('selectEpisode');
      let currentEpisode = episodeSelector[episodeSelector.selectedIndex].value;
      currentEpisode = Number(currentEpisode.split('?')[0].split('-')[1]);
      let didFind = Boolean(dramaList.find((item) => item.name === drama));
      if (didFind) {
        const foundItem = dramaList.find((item) => item.name === drama);
        foundItem.lastWatched = currentEpisode;
        return dramaList;
      }
      dramaList.push({ name: drama, lastWatched: currentEpisode });
      return dramaList;
    }

    // On the drama or movie description page
    if (window.location.pathname.startsWith('/Drama/')) {
      getDramaSummary();
      drama = window.location.pathname.split('/')[2].split('-').join(' ');
      const contentType = document.getElementsByClassName('dotUnder');
      if (window.location.hostname === 'kissasian.li' && contentType.length > 0) {
        /* const genre = [...contentType];
        const isMovie = Boolean(genre.find((item) => item.text === 'Movie'));
        const message = isMovie ? `Movie: ${drama}` : `Drama: ${drama}`; */
        didFind = Boolean(dramaList.find((item) => item.name === drama));
        if (didFind) {
          const currentDrama = dramaList.find((item) => item.name === drama);
          const totalEpisodes = document.getElementsByClassName('episodeSub').length;
          const indexOfLastWatchedEpisode = totalEpisodes - currentDrama.lastWatched;
          document
            .getElementsByClassName('episodeSub')
            [indexOfLastWatchedEpisode].children.item(0).text += ' 👀';
          for (let i = totalEpisodes - currentDrama.lastWatched; i <= totalEpisodes; i += 1) {
            document.getElementsByClassName('episodeSub')[i].children.item(0).style.color =
              'lightgreen';
          }
        }
      }
    }
    return 0;
  }

  // To fetch the current drama list
  browser.runtime
    .sendMessage(JSON.stringify({ command: 'fetch' }))
    .then((response) => loadDraMaSpy(response))
    .then((list) => {
      if (typeof list === 'object') {
        browser.runtime.sendMessage(JSON.stringify({ command: 'update', dramaList: list }));
      }
    });
})();

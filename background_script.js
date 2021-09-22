const updateList = (list) => list.data;

function notify(data) {
  if (JSON.parse(data).command === 'update') {
    const { dramaList } = JSON.parse(data);
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/list', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(dramaList),
    });
  } else if (JSON.parse(data).command === 'fetch') {
    return fetch('https://sponge-imminent-text.glitch.me/dramaspy/list')
      .then((response) => response.json())
      .then((response) => updateList(response));
  } else if (JSON.parse(data).command === 'fetch_dramas') {
    return fetch('https://sponge-imminent-text.glitch.me/dramaspy/drama')
      .then((response) => response.json())
      .then((response) => response);
  } else if (JSON.parse(data).command === 'update_drama') {
    const dramaList = JSON.parse(data).drama;
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/drama', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(dramaList),
    });
  }
  return 0;
}

// eslint-disable-next-line no-undef
browser.runtime.onMessage.addListener(notify);

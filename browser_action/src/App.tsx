import React, { useState, useEffect, ReactElement } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

interface dramaItems {
  name: string;
  lastWatched: number;
}

interface dramaInfo {
  _id: string;
  name: string;
  otherNames: Array<string>;
  country: string;
  genre: Array<string>;
  aired: string;
  status: string;
  summary: string;
  image: string;
  latestEpisode: number;
  hash: string;
}

function App() {
  const hostname = 'https://kissasian.li';
  const hash = (data: string) => CryptoJS.SHA3(data).toString();
  const verify = (hash1: string, hash2: string) => hash1 === hash2;
  const encrypt = (data: Array<dramaItems>, key: string) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  const decrypt = (cipher: string, key: string) =>
    JSON.parse(CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8));

  const [dramas, setDramas] = useState<Array<dramaInfo>>([]);
  const [watchedList, setWatchedList] = useState<Array<dramaItems>>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<dramaItems>>([]);

  // To fetch current hashes from localStorage
  const watchedListHash = String(localStorage.getItem('watchedListHash'));
  const dramasListHash = String(localStorage.getItem('dramasListHash'));

  useEffect(() => {
    // To set cached version of watched list
    if (localStorage.getItem('watchedList'))
      setWatchedList(
        decrypt(
          String(localStorage.getItem('watchedList')),
          String(process.env.REACT_APP_SECRET_CODE),
        ),
      );
    // To set cached version of dramas
    if (localStorage.getItem('dramasList'))
      setDramas(JSON.parse(String(localStorage.getItem('dramasList'))));
  }, []);

  // To fetch and update dramas
  useEffect(() => {
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/drama')
      .then((response) => response.json())
      .then((response) => {
        const stringifiedResponse = JSON.stringify(response);
        const currentHash = hash(stringifiedResponse);
        if (verify(currentHash, dramasListHash)) console.log('Dramas: No Change');
        else {
          setDramas(response);
          window.localStorage.setItem('dramasList', stringifiedResponse);
          window.localStorage.setItem('dramasListHash', currentHash);
          console.log('Dramas: Cached Data');
        }
      });
  }, [dramasListHash]);

  // To fetch and update watched list
  useEffect(() => {
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/list')
      .then((response) => response.json())
      .then((response) => {
        const currentHash = hash(JSON.stringify(response.data));
        if (verify(currentHash, watchedListHash)) console.log('Watched List: No Change');
        else {
          setWatchedList(response.data);
          window.localStorage.setItem(
            'watchedList',
            encrypt(response.data, String(process.env.REACT_APP_SECRET_CODE)).toString(),
          );
          window.localStorage.setItem('watchedListHash', currentHash);
          console.log('Watched List: Cached Data');
        }
      });
  }, [watchedListHash]);

  const handleInput = (value: string) => {
    setSearchStr(value);
    setSearchResults(
      watchedList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())),
    );
  };

  const fetchDramaImg = (name: string): ReactElement => {
    const drama = dramas.find((item) => item.name === name);
    if (drama) return <img src={drama.image} alt={drama.name} />;
    return <span></span>;
  };

  return (
    <div className="App">
      <div className="main">
        <div className="backdrop">
          <div className="header">
            <input
              type="text"
              id="search"
              placeholder="Enter keyword"
              onChange={(e) => handleInput(e.target.value)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
            />
          </div>
          <div className="body">
            <div className="dramas">
              {searchStr.length > 0
                ? searchResults.map((drama, index) => {
                    return (
                      <div className="drama_item" key={index}>
                        {fetchDramaImg(drama.name)}
                        <div className="details">
                          <strong>{drama.name}</strong>
                          <span>
                            <span>Last Watched: {drama.lastWatched}&nbsp;</span>
                            <a
                              href={`${hostname}/Drama/${drama.name.split(' ').join('-')}/Episode-${
                                drama.lastWatched + 1
                              }`}
                            >
                              <img
                                src="https://img.icons8.com/ios-glyphs/50/000000/circled-play.png"
                                alt="Resume"
                                width="20px"
                              />
                            </a>
                          </span>
                        </div>
                      </div>
                    );
                  })
                : watchedList.map((drama, index) => {
                    return (
                      <div className="drama_item" key={index}>
                        {fetchDramaImg(drama.name)}
                        <div className="details">
                          <strong>{drama.name}</strong>
                          <span>
                            <span>Last Watched: {drama.lastWatched}&nbsp;</span>
                            <a
                              href={`${hostname}/Drama/${drama.name.split(' ').join('-')}/Episode-${
                                drama.lastWatched + 1
                              }`}
                            >
                              <img
                                src="https://img.icons8.com/ios-glyphs/50/000000/circled-play.png"
                                alt="Resume"
                                width="20px"
                              />
                            </a>
                          </span>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

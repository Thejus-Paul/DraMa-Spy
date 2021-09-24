import React, { useState, useEffect, ReactElement, JSXElementConstructor } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';
import SearchBox from './components/SearchBox';
import DramaList from './components/DramaList';

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
  const [currVersion, setCurrVersion] = useState('v1.2');

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

    // To check for extension updates
    const checkForUpdate = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/Thejus-Paul/DraMa-Spy/releases");
        const parsedResponse = await response.json();
        if (parsedResponse[0].tag_name !== currVersion)
          setCurrVersion('New Version Available!');
      } catch (e) {
        console.error('exceeded API limit! Try after an hour.');
      }
    }

    checkForUpdate();
  }, [currVersion]);

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
          localStorage.setItem('dramasList', stringifiedResponse);
          localStorage.setItem('dramasListHash', currentHash);
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
          localStorage.setItem(
            'watchedList',
            encrypt(response.data, String(process.env.REACT_APP_SECRET_CODE)).toString(),
          );
          localStorage.setItem('watchedListHash', currentHash);
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

  const fetchDramaImg = (name: string): ReactElement<JSXElementConstructor<any>> => {
    const drama = dramas.find((item) => item.name === name);
    if (drama) return <img src={drama.image} alt={drama.name} />;
    return <span></span>;
  };


  const refreshCache = () => {
    localStorage.clear();
    window.location.reload();
  }


  return (
    <div className="App">
      <div className="main">
        <div className="backdrop">
          <div className="header">
            <SearchBox handleInput={handleInput} />
          </div>
          <div className="body">
            <DramaList searchStr={searchStr} searchResults={searchResults} fetchDramaImg={fetchDramaImg} dramas={dramas} watchedList={watchedList} />
          </div>
          <div className="footer">
            <button className="refresh-btn" onClick={refreshCache}>Reset Cache</button>
            <label className="version">{currVersion}</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

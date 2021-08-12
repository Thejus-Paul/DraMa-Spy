import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import './App.css';

interface dramaItems {
  name: string,
  lastWatched: number
}

function App() {
  const [watchedList, setWatchedList] = useState<Array<dramaItems>>([]);
  const [searchStr, setSearchStr] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Array<dramaItems>>([]);

  useEffect(() => {
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/list')
		.then(response => response.json())
		.then(response => setWatchedList(response.data));
  },[]);

  const handleInput = (value: string) => {
    setSearchStr(value);
    setSearchResults(watchedList.filter(
      (item) => 
      item['name'].toLowerCase()
      .includes(value.toLowerCase())));
    }
    console.log(searchStr,searchResults)
  return (
    <div className="App"> 
      <div className="main">
        <div className="backdrop">
          <div className="header">
            <input type="text" id="search" placeholder="Enter keyword" onChange={(e) => handleInput(e.target.value)}/>
          </div>
          <div className="body">
            <div className="dramas">
              {
                searchStr.length > 0 ? 
                searchResults.map((drama,index) => {
                  return(<div className="drama_item" key={index}>
                    <div className="details">
                      <span>{drama.name}</span>
                      <span>Episodes: {drama.lastWatched}</span>
                    </div>
                  </div>);
                }) :
                watchedList.map((drama,index) => {
                  return(<div className="drama_item" key={index}>
                    <div className="details">
                      <span>{drama.name}</span>
                      <span>Episodes: {drama.lastWatched}</span>
                    </div>
                  </div>);
                }) 
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;

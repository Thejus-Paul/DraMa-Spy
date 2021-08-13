import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

interface dramaItems {
  name: string,
  lastWatched: number
}

function App() {
  const hash = (data: string) => CryptoJS.SHA3(data).toString();
  const verify = (hash1: string, hash2: string) => (hash1 === hash2) ? true : false;
  const encrypt = (data: Array<dramaItems>,key: string) => CryptoJS.AES.encrypt(JSON.stringify(data),key).toString()
  const decrypt = (cipher: string,key: string) => JSON.parse(CryptoJS.AES.decrypt(cipher,key).toString(CryptoJS.enc.Utf8))
  
  const [watchedList, setWatchedList] = useState<Array<dramaItems>>([])
  const [searchStr, setSearchStr] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Array<dramaItems>>([])
  const localHash: string = String(localStorage.getItem("hashedList"))

  useEffect(() => {
    if(localStorage.getItem("watchedList")) 
      setWatchedList(decrypt(String(localStorage.getItem("watchedList")),"test"))
  },[])

  useEffect(() => {
    fetch('https://sponge-imminent-text.glitch.me/dramaspy/list')
		.then(response => response.json())
    .then(response => {
      let currentHash = hash(JSON.stringify(response.data))
      if(verify(currentHash,localHash)) console.log("Same Data")
      else {
        setWatchedList(response.data)
        window.localStorage.setItem("watchedList",encrypt(response.data, "test").toString())
        window.localStorage.setItem("hashedList",currentHash)
        console.log("Data Set")
      }
    })
  }, [localHash]);

  const handleInput = (value: string) => {
    setSearchStr(value);
    setSearchResults(watchedList.filter(
      (item) => 
      item['name'].toLowerCase()
      .includes(value.toLowerCase())))
  }
  
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

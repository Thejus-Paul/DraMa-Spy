import { ReactElement, JSXElementConstructor } from 'react';
import PlayButton from '../../assets/images/circled-play.png';
import './index.css';

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

interface dramaListProps {
  searchStr:string,
  searchResults: any[],
  fetchDramaImg: (arg0: string) => ReactElement<JSXElementConstructor<any>>,
  dramas: Array<dramaInfo>,
  watchedList:Array<dramaItems>
}

const DramaList = (props: dramaListProps) => {
  const hostname = 'https://kissasian.li';

  return(
    <div className="dramas">
    {(props.searchStr.length > 0) ? props.searchResults.map((drama, index) => {
        return (
          <div className="drama-item" key={index}>
            {props.fetchDramaImg(drama.name)}
            <div className="details">
              <strong>{drama.name}</strong>
              <span>
                <span>Last Watched: {drama.lastWatched}&nbsp;</span>
                <a
                  href={`${hostname}/Drama/${drama.name.split(' ').join('-')}/Episode-${drama.lastWatched + 1}`}>
                  {(props.dramas.find((item) => item.name === drama.name)?.latestEpisode !== drama.lastWatched) ?
                    <img
                    src={PlayButton}
                    alt="Resume"
                    width="20px"
                    /> : ''
                  }
                </a>
              </span>
            </div>
          </div>
        );
      })
    : props.watchedList.map((drama, index) => {
        return (
          <div className="drama-item" key={index}>
            {props.fetchDramaImg(drama.name)}
            <div className="details">
              <strong>{drama.name}</strong>
              <span>
                <span>Last Watched: {drama.lastWatched}&nbsp;</span>
                <a
                  href={`${hostname}/Drama/${drama.name.split(' ').join('-')}/Episode-${drama.lastWatched + 1}`}>
                  {(props.dramas.find((item) => item.name === drama.name)?.latestEpisode !== drama.lastWatched) ?
                    <img
                    src={PlayButton}
                    alt="Resume"
                    width="20px"
                    /> : ''
                  }
                </a>
              </span>
            </div>
          </div>
        );
      })
    }
    </div>
  );
}

export default DramaList;
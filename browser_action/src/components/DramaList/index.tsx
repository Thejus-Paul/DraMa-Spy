import { ReactElement, JSXElementConstructor } from 'react';
import DramaCard from './card';

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

  return(
    <div className="dramas">
    {(props.searchStr.length > 0) ? props.searchResults.map((drama, index) => {
        return (
          <DramaCard key={index} {...drama} fetchDramaImg={props.fetchDramaImg} dramas={props.dramas} />
        );
      })
    : props.watchedList.map((drama, index) => {
        return (
          <DramaCard key={index} {...drama} fetchDramaImg={props.fetchDramaImg} dramas={props.dramas} />
        );
      })
    }
    </div>
  );
}

export default DramaList;
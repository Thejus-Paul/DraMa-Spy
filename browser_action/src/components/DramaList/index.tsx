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
  searchResults: Array<dramaItems>,
  dramas: Array<dramaInfo>,
  watchedList:Array<dramaItems>
}

const DramaList = ({searchStr, searchResults, dramas, watchedList}: dramaListProps) => {

  return(
    <div className="dramas">
    {(searchStr.length > 0) ? searchResults.map((drama, index) => {
        return (
          <DramaCard key={index} {...drama} dramas={dramas} />
        );
      })
    : watchedList.map((drama, index) => {
        return (
          <DramaCard key={index} {...drama} dramas={dramas} />
        );
      })
    }
    </div>
  );
}

export default DramaList;
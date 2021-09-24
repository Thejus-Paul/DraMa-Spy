import { ReactElement } from 'react';
import PlayButton from '../../assets/images/circled-play.png';

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

interface dramaCardProps {
  name: string,
  lastWatched: number,
  dramas: Array<dramaInfo>
}

const DramaCard = ({name, lastWatched, dramas}: dramaCardProps) => {
  const hostname = 'https://kissasian.li';

  const fetchDramaImg = (name: string): ReactElement<HTMLImageElement> => {
    const drama = dramas.find((item) => item.name === name);
    if (drama) return <img src={drama.image} alt={drama.name} />;
    return <img src="#" alt={name} />;
  };

  return(
    <div className="drama-item">
      {fetchDramaImg(name)}
      <div className="details">
        <strong>{name}</strong>
        <span>
          <span>Last Watched: {lastWatched}&nbsp;</span>
          <a
            href={`${hostname}/Drama/${name.split(' ').join('-')}/Episode-${lastWatched + 1}`}>
            {(dramas.find((item) => item.name === name)?.latestEpisode !== lastWatched) ?
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
  )
}

export default DramaCard;
import { ReactElement, JSXElementConstructor } from 'react';
import { TextSpan } from 'typescript';
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

const DramaCard = (props: dramaCardProps) => {
  const hostname = 'https://kissasian.li';

  const fetchDramaImg = (name: string): ReactElement<JSXElementConstructor<any>> => {
    const drama = props.dramas.find((item) => item.name === name);
    if (drama) return <img src={drama.image} alt={drama.name} />;
    return <span></span>;
  };

  return(
    <div className="drama-item">
      {fetchDramaImg(props.name)}
      <div className="details">
        <strong>{props.name}</strong>
        <span>
          <span>Last Watched: {props.lastWatched}&nbsp;</span>
          <a
            href={`${hostname}/Drama/${props.name.split(' ').join('-')}/Episode-${props.lastWatched + 1}`}>
            {(props.dramas.find((item) => item.name === props.name)?.latestEpisode !== props.lastWatched) ?
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
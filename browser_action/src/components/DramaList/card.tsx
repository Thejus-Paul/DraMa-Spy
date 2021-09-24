import { ReactElement, JSXElementConstructor } from 'react';
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
  fetchDramaImg: (arg0: string) => ReactElement<JSXElementConstructor<any>>,
  name: string,
  lastWatched: number,
  dramas: Array<dramaInfo>
}

const DramaCard = (props: dramaCardProps) => {
  const hostname = 'https://kissasian.li';
  return(
    <div className="drama-item">
      {props.fetchDramaImg(props.name)}
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
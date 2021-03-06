import './index.css';

const SearchBox = ({handleInput}: { handleInput: (arg0: string) => void; }) => {
  return(
    <input
    type="text"
    id="search"
    placeholder="Enter keyword"
    onChange={(e) => handleInput(e.target.value)}
    // eslint-disable-next-line jsx-a11y/no-autofocus
    autoFocus={true}
  />
  );
}

export default SearchBox;
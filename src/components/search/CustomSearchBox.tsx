import classes from "./CustomSearchBox.module.css";
import { connectSearchBox } from "react-instantsearch-dom";

function SearchBox({ refine }) {
  return (
    <div className={classes.searchbox}>
      <form action="" role="search">
        <input
          className={classes.searchboxinput}
          type="search"
          placeholder="Chercher un article..."
          onChange={(e) => refine(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}

export default connectSearchBox(SearchBox);

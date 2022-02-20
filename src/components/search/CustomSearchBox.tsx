import classes from "./CustomSearchBox.module.css";
import { connectSearchBox } from "react-instantsearch-dom";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function SearchBox({ refine }) {
  return (
    <div className={classes.searchbox}>
      <form action="" role="search">
        <InputGroup display="flex" alignItems="center" justifyContent="center">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon size="sm" color="gray.300" />}
          />
          <input
            className={classes.searchboxinput}
            type="search"
            placeholder="Chercher un article..."
            onChange={(e) => refine(e.currentTarget.value)}
          />
        </InputGroup>
      </form>
    </div>
  );
}

export default connectSearchBox(SearchBox);
